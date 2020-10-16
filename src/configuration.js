import {module} from 'angular';

(function () {
    module('kpis').config(configuration);

    configuration.$inject = ['$routeProvider', '$translateProvider', 'LANGUAGES'];

    function configuration($routeProvider, $translateProvider, LANGUAGES) {
        configureRouteProvider();
        configureTranslations();

        function configureRouteProvider() {
            $routeProvider.when('/main', {
                template: require('./main/main.html'),
                controller: 'mainCtrl',
                resolve: {
                    fetchPreferences: fetchPreferences,
                    fetchApps: fetchApps
                }
            }).when('/app/:appId/:chartType?', {
                template: require('./app/app.html'),
                controller: 'appCtrl',
                resolve: {
                    fetchPreferences: fetchPreferences,
                    fetchApps: fetchApps
                }
            }).when('/view/:appId/:viewId', {
                template: require('./view/view.html'),
                controller: 'viewCtrl',
                resolve: {
                    fetchPreferences: fetchPreferences,
                    fetchApps: fetchApps
                }
            }).otherwise({
                redirectTo: '/main'
            });
        }

        fetchPreferences.$inject = ['preferencesService'];

        function fetchPreferences(preferencesService) {
            return preferencesService.getFavorites();
        }

        fetchApps.$inject = ['senseService'];

        function fetchApps(senseService) {
            return senseService.getApps();
        }

        function configureTranslations() {
            $translateProvider.useStaticFilesLoader({
                prefix: 'translations/translations_',
                suffix: '.json'
            });

            $translateProvider.useSanitizeValueStrategy('escape');
            $translateProvider.fallbackLanguage(LANGUAGES[0]);
            $translateProvider.preferredLanguage(LANGUAGES[0]);
        }
    }
})();
