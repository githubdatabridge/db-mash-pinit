import {find, forEach, range, uniqBy} from 'lodash';
import {element, module} from 'angular';
import {gridCoordinates} from '../shared/grid.utils';

(function () {
    module('kpis').controller('mainCtrl', MainController);

    MainController.$inject = ['$scope', 'senseService', 'preferencesService', '$q', '$timeout', '$location',
        'NUMBER_OF_TILES', 'NUMBER_OF_ROWS', 'NUMBER_OF_COLUMNS', 'FONT_COLOR', 'DASHBOARD_CHANGED_EVENT', 'SWITCHED_STORAGE_EVENT', 'MOBILE_BREAKPOINT', '$window'];

    function MainController($scope, senseService, preferencesService, $q, $timeout, $location,
        NUMBER_OF_TILES, NUMBER_OF_ROWS, NUMBER_OF_COLUMNS, FONT_COLOR, DASHBOARD_CHANGED_EVENT, SWITCHED_STORAGE_EVENT, MOBILE_BREAKPOINT, $window) {

        const GRID_TILE_IDS = range(0, NUMBER_OF_TILES);
        const GRID_TILE_CLASSES = ['avia', 'oil', 'trans', 'health', 'powergas', 'soft', 'globa', 'light', 'wind'];

        $scope.gridLoaded = false;
        $scope.fontColor = FONT_COLOR;

        $scope.gridsterOpts = {
            columns: NUMBER_OF_COLUMNS, // the width of the grid, in columns
            swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
            width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
            colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
            rowHeight: getTileHeight(), // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
            saveGridItemCalculatedHeightInMobile: true,
            margins: [0, 0], // the pixel distance between each widget
            outerMargin: true, // whether margins apply to outer edges of the grid
            minColumns: NUMBER_OF_COLUMNS, // the minimum columns the grid must have
            minRows: NUMBER_OF_ROWS, // the minimum height of the grid, in rows
            maxRows: NUMBER_OF_ROWS,
            defaultSizeX: 1, // the default width of a gridster item, if not specifed
            defaultSizeY: 1, // the default height of a gridster item, if not specified
            isMobile: false, // stacks the grid items if true
            mobileBreakPoint: MOBILE_BREAKPOINT, // if the screen is not wider than this, remove the grid layout and stack the items
            mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
            resizable: {
                enabled: false
            },
            draggable: {
                enabled: true, // whether dragging items is supported
                handle: '.dragger', // optional selector for drag handle
                stop: () => handleGridChange()
            }
        };

        element($window).bind('resize', () =>
            $scope.gridsterOpts.rowHeight = getTileHeight()
        );

        $scope.$on('gridster-loaded', () => $scope.gridLoaded = true);

        function getTileHeight() {
            return ($window.innerHeight - 50) / NUMBER_OF_ROWS;
        }

        $scope.unpinItem = function (tile) {
            preferencesService.toggleFavorite(tile.app, tile.id, tile.appName).then(() => {
                tile.app = undefined;
                tile.id = undefined;
            });
        };

        $scope.openApp = function (tile) {
            $location.path('/app/' + tile.app);
        };

        $scope.openView = function (appId, id) {
            $location.path('/view/' + appId + '/' + id);
        };

        $scope.$on(DASHBOARD_CHANGED_EVENT, () => updateGrid());

        $scope.$on(SWITCHED_STORAGE_EVENT, () => updateGrid());

        updateGrid();

        function updateGrid() {
            preferencesService.getCurrentDashboard().then((dashboard) => {
                loadAppsAndBookmarks(dashboard.favorites).then(() => {
                    createGrid(dashboard);
                });
            });
        }

        function loadAppsAndBookmarks(favorites) {
            console.log('Favorites: ' + JSON.stringify(favorites));
            const uniqueAppKeys = uniqBy(favorites, 'appId').map((favorite) => encodeURI(favorite.appId));
            console.log('Unique app keys: ' + JSON.stringify(uniqueAppKeys));
            return senseService.getApps().then((apps) => {
                senseService.currentApps = apps.filter(app => uniqueAppKeys.includes(app.id));
            });
        }

        function createGrid(dashboard) {
            $scope.tiles = gridstackTiles(dashboard);
            senseService.hasTile(false);
        }

        function gridstackTiles(dashboard) {
            const initTiles = initialGridTiles();
            return GRID_TILE_IDS.map(tileId => {
                const dashboardTile = dashboard.gridPositions[tileId];
                const tile = find(initTiles, { 'tileId': tileId });
                tile.x = dashboardTile.x;
                tile.y = dashboardTile.y;
                const favorite = find(dashboard.favorites, favorite => +favorite.tileId === tileId);
                if (favorite) {
                    tile.app = favorite.appId;
                    tile.appName = favorite.appName;
                    tile.id = favorite.objectId;
                }
                return tile;
            });
        }

        function handleGridChange() {
            preferencesService.getCurrentDashboard().then(dashboard => {
                forEach($scope.tiles, tile => {
                    const position = dashboard.gridPositions[tile.tileId];
                    position.x = tile.x;
                    position.y = tile.y;
                });
                preferencesService.setCurrentDashboard(dashboard);
            });
        }

        function coordinates() {
            return gridCoordinates(0, NUMBER_OF_COLUMNS - 1, 0, NUMBER_OF_ROWS - 1);
        }

        function initialGridTiles() {
            let index = 0;
            const tiles = [];
            for (const coordinate of coordinates()) {
                tiles.push({ ...coordinate, tileId: GRID_TILE_IDS[index], tileClass: GRID_TILE_CLASSES[index++] });
            }
            return tiles;
        }
    }
})();
