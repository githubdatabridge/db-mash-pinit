import _ from 'lodash';
import { module } from 'angular';

(function () {
    module('kpis').component('toggleFavorite', {
        bindings: {
            item: '<'
        },
        template: require('./toggle-favorite.directive.html'),
        controller: [
            'preferencesService', '$scope', 'DASHBOARD_CHANGED_EVENT', 'DASHBOARD_FULL_EVENT', 'DASHBOARD_NOT_FULL_EVENT', 'NUMBER_OF_TILES', 'SWITCHED_STORAGE_EVENT',
            ToggleFavoriteController]
    });

    function ToggleFavoriteController (
        preferencesService, $scope, DASHBOARD_CHANGED_EVENT, DASHBOARD_FULL_EVENT, DASHBOARD_NOT_FULL_EVENT, NUMBER_OF_TILES, SWITCHED_STORAGE_EVENT) {

        const $ctrl = this;

        $ctrl.isFavorite = false;
        $ctrl.isDashboardFull = false;

        $ctrl.$onInit = () => refresh();
        $scope.$on(DASHBOARD_CHANGED_EVENT, () => refresh());
        $scope.$on(SWITCHED_STORAGE_EVENT, () => refresh());
        $scope.$on(DASHBOARD_FULL_EVENT, () => $ctrl.isDashboardFull = true);
        $scope.$on(DASHBOARD_NOT_FULL_EVENT, () => $ctrl.isDashboardFull = false);

        function refresh() {
            $ctrl.checkIfFavorite();
            $ctrl.checkIfDashboardFull();
        }

        $ctrl.disabled = function () {
            return $ctrl.isDashboardFull && !$ctrl.isFavorite;
        };

        $ctrl.checkIfFavorite = function () {
            if ($ctrl.item) {
                preferencesService.isFavorite($ctrl.item.app, $ctrl.item.id).then(isFavorite =>
                    $ctrl.isFavorite = isFavorite
                );
            }
        };

        $ctrl.toggleFavorite = function () {
            if ($ctrl.item) {
                preferencesService.toggleFavorite($ctrl.item.app, $ctrl.item.id, $ctrl.item.appTitle).then(isFavorite =>
                    $ctrl.isFavorite = isFavorite
                );
            }
        };

        $ctrl.checkIfDashboardFull = function () {
            preferencesService.getFavorites().then(favorites =>
                $ctrl.isDashboardFull = _.size(favorites) === NUMBER_OF_TILES
            );
        };
    }
})();
