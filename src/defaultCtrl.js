/* global SHOW_STORAGE_SELECT */
import { module } from 'angular';

(function () {
    module('kpis').controller('DefaultCtrl', DefaultCtrl);

    DefaultCtrl.$inject = ['$scope', '$rootScope', 'senseService', 'senseAuthService', 'senseSelectionsService',
        'helpService', 'preferencesService', '$location', '$http', 'VERSION', 'DASHBOARD_CHANGED_EVENT',
        'CHART_TYPES', 'SERVER_THEME', 'SELECTION_CHANGED_EVENT', 'MOBILE_BREAKPOINT', '$window'];

    function DefaultCtrl($scope, $rootScope, senseService, senseAuthService, senseSelectionsService,
        helpService, preferencesService, $location, $http, VERSION, DASHBOARD_CHANGED_EVENT,
        CHART_TYPES, SERVER_THEME, SELECTION_CHANGED_EVENT, MOBILE_BREAKPOINT, $window) {

        $scope.version = VERSION;
        $scope.loaded = false;
        $scope.logoutEnable = false;
        $scope.chartTypes = CHART_TYPES;

        $scope.hasSelection = false;
        $scope.showStorageSelect = SHOW_STORAGE_SELECT;

        $scope.exit = function () {
            $http.delete('/qps/user');
        };

        if (window.location.port !== '4848') {
            senseAuthService.getAuthenticatedUserInfo().then((userInfo) => {
                if (userInfo.UserId !== 'anonymous') {
                    $scope.logoutEnable = true;
                }
            });
        }

        $scope.$on(SELECTION_CHANGED_EVENT, () => {
            $scope.updateHasSelection();
        });

        $scope.updateHasSelection = function () {
            senseSelectionsService.hasSelection().then((hasSelection) => {
                $scope.hasSelection = hasSelection;
            });
        };

        $scope.isSmallScreen = function () {
            return $window.innerWidth <= MOBILE_BREAKPOINT;
        };

        $scope.$watch(
            () => {
                return senseService.apps;
            },
            (newVal) => {
                if (newVal) {
                    $scope.apps = newVal;
                    fetchAvailableChartTypes();
                }
            },
            true
        );

        $scope.hasTile = function () {
            return senseService.hasTile();
        };

        $scope.isMain = function () {
            return ($location.$$path === '/main');
        };

        $scope.clearCurrentDashboard = function () {
            preferencesService.clearCurrentDashboard().then(() => {
                $rootScope.$broadcast(DASHBOARD_CHANGED_EVENT);
            });
        };

        $scope.help = function () {
            if ($location.$$path === '/main') {
                helpService.getHelp('#/app/' + ($scope.apps[0].id)).restart();
            } else {
                helpService.getHelp(undefined, 'second').start(true);
            }
        };

        $scope.openMain = function () {
            $location.path('/main/');
        };

        $scope.openApp = function(id, chartType) {
            if (chartType) {
                $location.path(`/app/${decodeURI(id)}/${chartType}`);

            } else {
                $location.path(`/app/${decodeURI(id)}/`);
            }
        };

        function fetchAvailableChartTypes() {
            senseService.getApps().then((apps) => {
                $scope.apps = apps;
                apps.forEach((app) => {
                    const appId = decodeURI(app.id);
                    senseService.getAvailableChartTypes(appId).then(function (types) {
                        app.availableChartTypes = types;
                    });
                });
            });
        }
    }
})();
