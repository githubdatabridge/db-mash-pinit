import { module } from 'angular';

(function () {
    module('kpis').service('preferencesHttpStorageService', PreferencesHttpStorageService);

    PreferencesHttpStorageService.$inject = ['$http', 'API_PATH', 'API_PORT', 'config'];

    function PreferencesHttpStorageService($http, API_PATH, API_PORT, config) {

        const port = API_PORT ? ':' + API_PORT : '';
        const path = `https://${config.host}${port}${API_PATH}`;

        return {
            persist: persist,
            fetch: fetch
        };

        function persist(preferences, userId) {
            return $http.put(getApiPath(userId), preferences).then(() => preferences);
        }

        function fetch(userId) {
            return $http.get(getApiPath(userId)).then(response => JSON.parse(response.data));
        }

        function getApiPath(userId) {
            return `${path}/users/${userId}/preferences`;
        }
    }
})();
