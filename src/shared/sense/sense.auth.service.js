import _ from 'lodash';
import { module } from 'angular';

(function () {
    module('kpis').service('senseAuthService', SenseAuthService);

    SenseAuthService.$inject = ['$q', 'qlik', 'config'];

    function SenseAuthService ($q, qlik, config) {
        this.authenticatedUserInfo = undefined;

        this.getAuthenticatedUserInfo = function () {
            if (self.authenticatedUserInfo) {
                return $q.when(self.authenticatedUserInfo);
            }
            return getAuthInfo().then(function (authenticatedUserInfoString) {
                if (!authenticatedUserInfoString.match('UserId=')) {
                    self.authenticatedUserInfo = {UserId: 'anonymous'};
                } else {
                    self.authenticatedUserInfo = mapStringToObject(authenticatedUserInfoString);
                }
                return self.authenticatedUserInfo;
            });
        };

        function getAuthInfo () {
            const deferred = $q.defer();
            const global = qlik.getGlobal(config);
            global.getAuthenticatedUser(function (reply) {
                deferred.resolve(reply.qReturn);
            });
            return deferred.promise;
        }

        function mapStringToObject (stringToMap) {
            const entries = _.split(stringToMap, ';');
            const pairs = _.map(entries, function (entry) {
                entry = _.trim(entry);
                return entry.split('=');
            });
            return _.fromPairs(pairs);
        }
    }
})();
