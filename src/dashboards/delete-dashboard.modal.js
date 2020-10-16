import { module } from 'angular';

(function () {
    module('kpis').component('deleteDashboard', {
        template : require('./delete-dashboard.modal.html'),
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: ['preferencesService', DeleteDashboardModalController]
    });

    function DeleteDashboardModalController (preferencesService) {
        const $ctrl = this;

        $ctrl.$onInit = function () {
            $ctrl.name = $ctrl.resolve.name;
        };

        $ctrl.ok = function () {
            preferencesService.deleteDashboard($ctrl.name)
                .then(dashboard => $ctrl.close(dashboard))
                .catch(error => $ctrl.error = error);
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss();
        };
    }
})();
