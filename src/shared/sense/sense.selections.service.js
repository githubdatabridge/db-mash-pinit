import _ from 'lodash';
import { module } from 'angular';

(function () {
    module('kpis').service('senseSelectionsService', SenseSelectionsService);

    SenseSelectionsService.$inject = ['$q', 'senseService', 'qlik', 'config'];

    function SenseSelectionsService ($q, senseService, qlik, config) {
        const self = this;

        this.getAllAppSelectionInfos = function () {
            return senseService.getApps().then(function(apps) {
                return apps.map(function (app) {
                    return {
                        appName: app.name,
                        appId: app.id,
                        selectionState: qlik.openApp(decodeURI(app.id), config).selectionState()
                    };
                });
            });
        };

        this.hasSelection = function (appId) {
            return this.getAllAppSelectionInfos().then(function(selectionInfos) {
                if (appId) {
                    selectionInfos = _.filter(selectionInfos, {appId: encodeURI(appId)});
                }
                return _.some(selectionInfos, function(selectionInfo) {
                    return !_.isEmpty(selectionInfo.selectionState.selections);
                });
            });
        };

        this.clearAllSelections = function () {
            return senseService.getApps().then(function (apps) {
                return $q.all(apps.map(function (app) {
                    return self.clearAppSelections(app.id);
                }));
            });
        };

        this.clearAppSelections = function (appId) {
            return qlik.openApp(decodeURI(appId), config).clearAll();
        };

        this.clearFieldSelections = function (appId, field) {
            const qlikApp = qlik.openApp(decodeURI(appId), config);
            qlikApp.field(field).clear();
        };
    }
})();
