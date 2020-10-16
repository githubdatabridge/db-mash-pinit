import { module } from 'angular';

(function () {
    module('kpis').service('preferencesLocalStorageService', PreferencesLocalStorageService);

    PreferencesLocalStorageService.$inject = ['$q'];

    function PreferencesLocalStorageService($q) {

        const KEY = 'preferences';

        return {
            persist: persist,
            fetch: fetch
        };

        function persist(preferences) {
            localStorage.setItem(KEY, JSON.stringify(preferences));
            return $q.when(preferences);
        }

        function fetch() {
            const preferences = JSON.parse(localStorage.getItem(KEY));
            return $q.when(preferences);
        }
    }

})();
