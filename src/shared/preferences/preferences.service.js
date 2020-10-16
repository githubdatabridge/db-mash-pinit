import { find, findKey, some, size, remove, filter, cloneDeep } from 'lodash';
import { module} from 'angular';
import { gridCoordinates } from '../grid.utils';

(function () {
    module('kpis').service('preferencesService', PreferencesService);

    PreferencesService.$inject = ['$q', 'preferencesStorageGatewayService', '$rootScope', 'senseBookmarksService', 'senseSelectionsService',
        'NUMBER_OF_COLUMNS', 'NUMBER_OF_ROWS', 'NUMBER_OF_TILES', 'DASHBOARD_FULL_EVENT', 'DASHBOARD_NOT_FULL_EVENT', 'SWITCHED_STORAGE_EVENT'
    ];

    function PreferencesService($q, preferencesStorageGatewayService, $rootScope, senseBookmarksService, senseSelectionsService,
        NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, NUMBER_OF_TILES, DASHBOARD_FULL_EVENT, DASHBOARD_NOT_FULL_EVENT, SWITCHED_STORAGE_EVENT) {

        function coordinates() {
            return gridCoordinates(0, NUMBER_OF_COLUMNS - 1, 0, NUMBER_OF_ROWS - 1);
        }

        function emptyDashboard() {
            const positions = {};
            let index = 0;
            for (const coordinate of coordinates()) {
                positions[index++] = coordinate;
            }
            return {
                favorites: [],
                gridPositions: positions
            };
        }

        let cachedPreferences = undefined;

        $rootScope.$on(SWITCHED_STORAGE_EVENT, () => {
            cachedPreferences = undefined;
        });

        return {
            getCurrentDashboard: getCurrentDashboard,
            setCurrentDashboard: setCurrentDashboard,
            getFavorites: getFavorites,
            getFavorite: getFavorite,
            isFavorite: isFavorite,
            toggleFavorite: toggleFavorite,
            getDashboards: getDashboards,
            saveDashboard: saveDashboard,
            deleteDashboard: deleteDashboard,
            applyDashboard: applyDashboard,
            clearCurrentDashboard: clearCurrentDashboard
        };

        function getCurrentDashboard() {
            return getPreferences().then(preferences => preferences.current);
        }

        function setCurrentDashboard(dashboard) {
            return getPreferences().then(preferences =>
                preferences.current = cloneDeep(dashboard)
            ).then(persist);
        }

        function getFavorites() {
            return getPreferences().then(preferences => preferences.current.favorites);
        }

        function getFavorite(appId, objectId) {
            return getFavorites().then(favorites =>
                find(favorites, { appId: appId, objectId: objectId })
            );
        }

        function isFavorite(appId, objectId) {
            return getFavorites().then(favorites =>
                some(favorites, { appId: appId, objectId: objectId })
            );
        }

        function toggleFavorite(appId, objectId, appName) {
            let favorite;
            return isFavorite(appId, objectId).then(isFavorite =>
                getPreferences().then(preferences => {
                    favorite = !isFavorite;
                    if (isFavorite) {
                        removeFavorite(preferences, appId, objectId);
                    } else {
                        addFavorite(preferences, appId, objectId, appName);
                    }
                })
            ).then(persist).then(() => favorite);
        }

        function addFavorite(preferences, appId, objectId, appName) {
            const nextFreeTileId = getNextFreeTileId(preferences.current);
            preferences.current.favorites.push({
                appId: appId,
                objectId: objectId,
                tileId: nextFreeTileId,
                appName: appName
            });
            checkDashboardFull(preferences.current);
        }

        function removeFavorite(preferences, appId, objectId) {
            remove(preferences.current.favorites, { appId: appId, objectId: objectId});
            checkDashboardNotFullAnymore(preferences.current);
        }

        function getNextFreeTileId(dashboard) {
            for (const coordinate of coordinates()) {
                const tileId = +findKey(dashboard.gridPositions, coordinate);
                if (!dashboard.favorites.some(favorite => favorite.tileId === tileId)) {
                    return tileId;
                }
            }
            throw new Error('Dashboard is full');
        }

        function checkDashboardFull(dashboard) {
            if (size(dashboard.favorites) === NUMBER_OF_TILES) {
                $rootScope.$broadcast(DASHBOARD_FULL_EVENT);
            }
        }

        function checkDashboardNotFullAnymore(dashboard) {
            if (size(dashboard.favorites) < NUMBER_OF_TILES) {
                $rootScope.$broadcast(DASHBOARD_NOT_FULL_EVENT);
            }
        }

        function getDashboards() {
            return getPreferences().then(preferences => preferences.dashboards);
        }

        function saveDashboard(name, description) {
            let dashboard;
            return getPreferences()
                .then(preferences => {
                    if (some(preferences.dashboards, { name: name })) {
                        throw 'Dashboard with name "' + name + '" does already exist';
                    }
                    return senseBookmarksService.createBookmarksFromCurrentSelections().then(bookmarks =>
                        dashboard = createNewDashboard(preferences, name, description, bookmarks)
                    );
                })
                .then(persist)
                .then(() => dashboard);
        }

        function createNewDashboard(preferences, name, description, bookmarks) {
            bookmarks = filter(bookmarks, bookmark => !!bookmark);
            const dashboard = {
                name: name,
                creationDate: new Date().toJSON(),
                description: description,
                settings: cloneDeep(preferences.current),
                filterBookmarks: bookmarks
            };
            preferences.dashboards.push(dashboard);
            return dashboard;
        }

        function deleteDashboard(name) {
            return getPreferences().then(preferences => {
                const dashboardToDelete = find(preferences.dashboards, { name: name });
                return deleteBookmarks(dashboardToDelete).then(() => remove(preferences.dashboards, { name: name }));
            }).then(persist);
        }

        function deleteBookmarks(dashboard) {
            const promises = dashboard.filterBookmarks.map(bookmark =>
                senseBookmarksService.removeBookmark(bookmark.appId, bookmark.bookmarkId)
            );
            return $q.all(promises);
        }

        function applyDashboard(name) {
            return getPreferences().then(preferences => {
                const dashboardToApply = find(preferences.dashboards, { name: name });
                preferences.current = cloneDeep(dashboardToApply.settings);
                return updateFilterBookmarks(dashboardToApply);
            }).then(persist);
        }

        function updateFilterBookmarks(dashboard) {
            return senseSelectionsService.clearAllSelections().then(() =>
                dashboard.filterBookmarks.map(bookmark =>
                    senseBookmarksService.applyBookmark(bookmark.appId, bookmark.bookmarkId)
                )
            );
        }

        function clearCurrentDashboard() {
            return getPreferences().then(preferences => {
                preferences.current = emptyDashboard();
                return senseSelectionsService.clearAllSelections();
            }).then(persist);
        }

        function getPreferences() {
            if (cachedPreferences) {
                return $q.when(cachedPreferences);
            }
            return preferencesStorageGatewayService.fetch().then(preferences => {
                if (preferences) {
                    cachedPreferences = preferences;
                    return cachedPreferences;
                }
                cachedPreferences = initPreferences();
                return persist();
            }).catch(error => {
                if (error.status === 404) {
                    cachedPreferences = initPreferences();
                    return persist();
                }
                console.log(error);
            });
        }

        function persist() {
            return preferencesStorageGatewayService.persist(cachedPreferences).then(() => cachedPreferences);
        }

        function initPreferences() {
            return {
                current: emptyDashboard(),
                dashboards: []
            };
        }

    }
}
)();
