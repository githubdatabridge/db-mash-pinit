import { module } from 'angular';

(function () {
    module('kpis').component('dashboardSelection', {
        template: require('./dashboard-selection.directive.html'),
        controller: ['$uibModal', 'preferencesService', '$rootScope', 'DASHBOARD_CHANGED_EVENT', 'SWITCHED_STORAGE_EVENT', DashboardSelectionController]
    });

    function DashboardSelectionController ($uibModal, preferencesService, $rootScope, DASHBOARD_CHANGED_EVENT, SWITCHED_STORAGE_EVENT) {
        const $ctrl = this;
        $ctrl.dashboards = [];

        $ctrl.$onInit = function () {
            refresh();
        };

        function refresh() {
            preferencesService.getDashboards().then(dashboards => $ctrl.dashboards = dashboards);
        }

        $rootScope.$on(SWITCHED_STORAGE_EVENT, () => {
            $ctrl.dashboards = [];
            $ctrl.$onInit();
        });

        $ctrl.saveCurrentDashboard = function () {
            const modalInstance = $uibModal.open({
                component: 'saveDashboard',
            });
            modalInstance.result.then(refresh);
        };

        $ctrl.applyDashboard = function (name) {
            preferencesService.applyDashboard(name).then(() => {
                $rootScope.$broadcast(DASHBOARD_CHANGED_EVENT);
            });
        };

        $ctrl.deleteDashboard = function (name) {
            const modalInstance = $uibModal.open({
                component: 'deleteDashboard',
                resolve: {
                    name: () => name
                }
            });
            modalInstance.result.then(refresh);
        };
    }
})();
