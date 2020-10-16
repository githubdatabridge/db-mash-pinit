import { module } from 'angular';

(function () {
    module('kpis').component('saveDashboard', {
        template : require('./save-dashboard.modal.html'),
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: ['preferencesService', SaveDashboardModalController]
    });

    function SaveDashboardModalController (preferencesService) {
        const $ctrl = this;

        $ctrl.name = '';
        $ctrl.description = '';
        $ctrl.error = '';

        $ctrl.clearError = function () {
            $ctrl.error = '';
        };

        $ctrl.ok = function () {
            preferencesService.saveDashboard($ctrl.name, $ctrl.description)
                .then(dashboard => $ctrl.close(dashboard))
                .catch(error => $ctrl.error = error);
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss();
        };
    }
})();
