import { module } from 'angular';

(function() {
    module('kpis').component('storageSelect', {
        template: require('./storage-select.directive.html'),
        controller: ['$scope', 'preferencesStorageGatewayService', StorageSelectController]
    });

    function StorageSelectController ($scope, preferencesStorageGatewayService) {

        $scope.storage = 'local';

        this.$onInit = function () {
            const isLocalStorage = preferencesStorageGatewayService.isUsingLocalStorage();
            $scope.storage = isLocalStorage ? 'local' : 'backend';
        };

        $scope.$watch('storage', value =>
            preferencesStorageGatewayService.setUsingLocalStorage(value === 'local')
        );
    }
})();
