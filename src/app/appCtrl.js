import { module } from 'angular';
import $ from 'jquery';

(function () {
    module('kpis').controller('appCtrl', AppCtrl);

    AppCtrl.$inject = ['$routeParams', 'senseService', 'senseSelectionsService', '$scope', '$sce',
        'SELECTION_CHANGED_EVENT', 'CAROUSEL_CHANGED_EVENT'];

    function AppCtrl ($params, senseService, senseSelectionsService, $scope, $sce,
        SELECTION_CHANGED_EVENT, CAROUSEL_CHANGED_EVENT) {

        $scope.carouselReady = false;

        $scope.onCarouselInit = function () {
            $scope.$broadcast(CAROUSEL_CHANGED_EVENT, 0);
        };

        $scope.onCarouselAfterChange = function (currentSlide) {
            $scope.$broadcast(CAROUSEL_CHANGED_EVENT, currentSlide);
        };

        $scope.hasQlikEntities = function () {
            return $scope.qlikEntities && $scope.qlikEntities.length > 0;
        };

        $scope.toggleSelectionsPanel = function () {
            if ($('.selections-panel').position().left < 0) {
                $('.selections-panel').animate({left: '0px'}, 500);
            } else {
                $('.selections-panel').animate({left: '-100%'}, 500);
            }
        };

        senseService.currentApps = [{id: $params.appId, name: 'dum'}];

        senseService.getAppLayout($params.appId, $params.chartType).then(function (appLayout) {
            $scope.sel = $sce.trustAsResourceUrl('selectbar.html?app=' + appLayout.app.id);
            $scope.qlikEntities = appLayout.objects;
            $scope.app = appLayout.app;
            $scope.updateHasSelection();
        });

        $scope.$on(SELECTION_CHANGED_EVENT, function () {
            $scope.updateHasSelection();
        });

        $scope.updateHasSelection = function () {
            senseSelectionsService.hasSelection($params.appId).then(function (hasSelection) {
                $scope.hasSelection = hasSelection;
            });
        };
    }
})();
