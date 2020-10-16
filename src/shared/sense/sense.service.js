import _ from 'lodash';
import {module} from 'angular';

(function () {
    module('kpis').service('senseService', SenseService);

    SenseService.$inject = ['$q', 'qlik', 'CHART_TYPE_OTHER', 'CHART_TYPES', 'PINIT', 'config'];

    function SenseService($q, qlik, CHART_TYPE_OTHER, CHART_TYPES, PINIT, config) {

        const self = this;
        self.apps = undefined;
        self.cachedQItems = [];
        this._hasTile = false;
        this.authenticatedUserInfo = undefined;

        this.isPersonalMode = function () {
            return qlik.getGlobal(config).isPersonalMode().then(function (reply) {
                return reply.qReturn;
            });
        };

        this.hasTile = function (bl) {
            if (typeof(bl) === 'undefined')
                return this._hasTile;
            self._hasTile = bl;
        };

        this.getApps = function () {
            if (self.apps) {
                return $q.when(self.apps);
            }
            const deferred = $q.defer();
            qlik.getGlobal(config).getAppList(function (apps) {
                const pinItApps = [];
                apps.forEach(function (app) {
                    if (app.qMeta.description && app.qMeta.description.indexOf(PINIT.appKeyWord) !== -1) {
                        pinItApps.push({
                            id: encodeURI(app.qDocId),
                            name: app.qTitle
                        });
                    }
                });
                self.apps = pinItApps;
                deferred.resolve(pinItApps);
            });
            return deferred.promise;
        };

        this.getAvailableChartTypes = function (appId) {
            return getAppObjectList(appId).then(function (qItems) {
                const availableTypes = CHART_TYPES.filter(function (type) {
                    return qItems.some(function (item) {
                        return item.qData.visualization === type.name;
                    });
                });
                const hasUncategorizedChartType = qItems.some(function (item) {
                    return !CHART_TYPES.some(function (type) {
                        return type.name === item.qData.visualization;
                    });
                });
                if (hasUncategorizedChartType) {
                    availableTypes.push(CHART_TYPE_OTHER);
                }
                return availableTypes;
            });
        };

        function getAppObjectList(appId) {
            const cachedQItems = _.find(self.cachedQItems, function (qItem) {
                return qItem.appId === appId;
            });
            if (cachedQItems) {
                return $q.when(cachedQItems.qItems);
            } else {
                const deferred = $q.defer();
                const qlikApp = qlik.openApp(appId, config);
                qlikApp.getAppObjectList('masterobject', function (appObjectList) {
                    const allQItems = appObjectList.qAppObjectList.qItems;
                    const filteredQItems = _.filter(allQItems, function (item) {
                        return _.some(item.qMeta.tags, function (tag) {
                            return tag === PINIT.appKeyWord;
                        });
                    });

                    self.cachedQItems.push({appId: appId, qItems: filteredQItems});

                    deferred.resolve(filteredQItems);
                });
                return deferred.promise;
            }
        }

        this.getAppLayout = function (appId, chartType) {
            const myApp = qlik.openApp(appId, config);

            return $q.all([myApp.getAppLayout(), getAppObjectList(appId)]).then(function (response) {
                const layout = response[0].layout;
                let qItems = response[1];

                const result = {};
                const pref = appThumbnailPrefix(myApp);
                result.app = {
                    thumb: pref + layout.qThumbnail.qUrl,
                    appTitle: layout.qTitle,
                    appDesc: layout.description,
                    appURL: pref + '/sense/app/' + encodeURIComponent(myApp.id.replace('.qvf', '')),
                    id: myApp.id
                };
                const objects = [];
                if (chartType) {
                    qItems = filterItemsByChartType(qItems, chartType);
                }
                qItems.forEach(function (qItem) {
                    objects.push({
                        id: qItem.qInfo.qId,
                        footnote: qItem.qMeta.description,
                        app: appId,
                        thumb: pref + layout.qThumbnail.qUrl,
                        appTitle: layout.qTitle,
                        appDesc: layout.description,
                        appURL: pref + '/sense/app/' + myApp.id
                    });
                });
                result.currentApp = myApp;
                result.objects = objects;
                return result;
            });
        };

        function filterItemsByChartType(qItems, chartType) {
            return qItems.filter(function (item) {
                return item.qData.visualization &&
                    item.qData.visualization === chartType ||
                    chartType === 'other' &&
                    !_.some(CHART_TYPES, {name: item.qData.visualization});
            });
        }

        function appThumbnailPrefix(myapp) {
            const prefix = myapp.global.session.options.prefix;
            return _.trimEnd(prefix, '/');
        }
    }
})();
