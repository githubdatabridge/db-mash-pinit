/* global DEFAULT_TO_LOCAL_STORAGE */
import { module } from 'angular';

(function () {
    module('kpis').service('preferencesStorageGatewayService', PreferencesStorageGatewayService);

    PreferencesStorageGatewayService.$inject = [
        '$rootScope', 'preferencesHttpStorageService', 'preferencesLocalStorageService', 'senseAuthService', 'SWITCHED_STORAGE_EVENT'
    ];

    function PreferencesStorageGatewayService(
        $rootScope, preferencesHttpStorageService, preferencesLocalStorageService, senseAuthService, SWITCHED_STORAGE_EVENT) {

        const self = this;
        self.useLocalStorage = DEFAULT_TO_LOCAL_STORAGE;

        return {
            persist: persist,
            fetch: fetch,
            isUsingLocalStorage: isUsingLocalStorage,
            setUsingLocalStorage: setUsingLocalStorage
        };

        function persist(preferences) {
            if (isUsingLocalStorage()) {
                return preferencesLocalStorageService.persist(preferences);
            }
            return getUserId().then(userId => preferencesHttpStorageService.persist(preferences, userId));
        }

        function fetch() {
            if (isUsingLocalStorage()) {
                return preferencesLocalStorageService.fetch();
            }
            return getUserId().then(userId => preferencesHttpStorageService.fetch(userId));
        }

        function isUsingLocalStorage() {
            return self.useLocalStorage;
        }

        function setUsingLocalStorage(useLocalStorage) {
            self.useLocalStorage = useLocalStorage;
            $rootScope.$broadcast(SWITCHED_STORAGE_EVENT);
        }

        function getUserId() {
            return senseAuthService.getAuthenticatedUserInfo().then(authenticatedUserInfo => authenticatedUserInfo.UserId);
        }
    }
})();
