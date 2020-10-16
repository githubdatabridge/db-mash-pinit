import { module } from 'angular';

(function () {
    module('kpis').controller('viewCtrl', ViewController);

    ViewController.$inject = ['$routeParams', '$location', 'preferencesService', '$scope'];

    function ViewController($params, $location, preferencesService, $scope) {
        $scope.view = {
            app: $params.appId,
            id: $params.viewId
        };

        getAppName();

        function getAppName () {
            preferencesService.getFavorite($scope.view.app, $scope.view.id).then(function(favorite) {
                $scope.appName = favorite ? favorite.appName : '';
            });
        }

        $scope.openMain = function () {
            $location.path('/main/');
        };

        $scope.openApp = function () {
            $location.path('/app/' + $scope.view.app);
        };

        $scope.unpinItem = function () {
            preferencesService.toggleFavorite($scope.view.app, $scope.view.id).then(function () {
                $scope.openMain();
            });
        };
    }
})();
