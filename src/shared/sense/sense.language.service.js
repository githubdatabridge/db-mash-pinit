import _ from 'lodash';
import { module } from 'angular';

(function () {
    module('kpis').service('senseLanguageService', SenseLanguageService);

    SenseLanguageService.$inject = ['$q', 'qlik', 'senseService', 'config', 'PINIT'];

    function SenseLanguageService($q, qlik, senseService, config, PINIT) {

        const self = this;
        self.appsLanguageInfo = undefined;

        this.propagateAppsLanguage = function (language) {
            getAppsLanguageInfo().then(function (appsLanguageInfo) {
                appsLanguageInfo.forEach(function (appLanguageInfo) {
                    propagateAppLanguage(appLanguageInfo, language);
                });
            });
        };

        function propagateAppLanguage (appLanguageInfo, language) {
            const qlikApp = qlik.openApp(decodeURI(appLanguageInfo.appId), config);
            const languageField = _.find(appLanguageInfo.languageFields, function (field) {
                return field.language.toLowerCase() === language.toLowerCase();
            });
            if (languageField) {
                const variable = appLanguageInfo.languageVariable;
                const field = languageField.prefix + languageField.language;
                qlikApp.variable.setStringValue(variable, field);
            }
        }

        function getAppsLanguageInfo() {
            if (self.appsLanguageInfo) {
                return $q.when(self.appsLanguageInfo);
            }
            return senseService.getApps().then(function (apps) {
                const promises = apps.map(function (app) {
                    return getAppLanguageInfo(app);
                });
                return $q.all(promises).then(function (values) {
                    const result = [];
                    values.forEach(function (value) {
                        if (value) {
                            result.push(value);
                        }
                    });
                    self.appsLanguageInfo = result;
                    return self.appsLanguageInfo;
                });
            });
        }

        function getAppLanguageInfo(app) {
            const qlikApp = qlik.openApp(decodeURI(app.id), config);
            return getLanguageVariable(qlikApp).then(function (languageVariable) {
                if (languageVariable) {
                    return getLanguageFields(qlikApp).then(function (languageFields) {
                        return {
                            appId: qlikApp.id,
                            languageVariable: languageVariable.qName,
                            languageFields: languageFields
                        };
                    });
                }
                return $q.when(undefined);
            });
        }

        function getLanguageVariable(qlikApp) {
            const deferred = $q.defer();
            qlikApp.getList('VariableList', function (reply) {
                const languageVariable = _.find(reply.qVariableList.qItems, function (item) {
                    return _.some(item.qData.tags, function (tag) {
                        return tag === PINIT.languageVariableKeyWord;
                    });
                });
                deferred.resolve(languageVariable);
            });
            return deferred.promise;
        }

        function getLanguageFields(qlikApp) {
            const deferred = $q.defer();
            qlikApp.getList('DimensionList', function (reply) {
                const languageFields = _.filter(reply.qDimensionList.qItems, function (item) {
                    return _.some(item.qData.tags, function (tag) {
                        return _.startsWith(tag, PINIT.languageFieldPrefix);
                    });
                }).map(function (field) {
                    const tag = _.find(field.qData.tags, function (tag) {
                        return _.startsWith(tag, PINIT.languageFieldPrefix);
                    });
                    const language = _.trimStart(tag, PINIT.languageFieldPrefix);
                    const prefix = _.trimEnd(field.qData.title, language);
                    return {
                        language: language,
                        prefix: prefix
                    };
                });
                deferred.resolve(languageFields);
            });
            return deferred.promise;
        }

    }
})();
