import { module } from 'angular';

(function () {
    module('kpis').service('senseBookmarksService', SenseBookmarksService);

    SenseBookmarksService.$inject = ['$q', 'senseService', 'DASHBOARD_BOOKMARK_QTYPE', 'qlik', 'config'];

    function SenseBookmarksService($q, senseService, DASHBOARD_BOOKMARK_QTYPE, qlik, config) {

        this.applyBookmark = function (appId, bookmarkId) {
            const qlikApp = qlik.openApp(decodeURI(appId), config);
            const enigmaModel = qlikApp.model.enigmaModel;
            enigmaModel.applyBookmark(bookmarkId);
        };

        this.removeBookmark = function (appId, bookmarkId) {
            const qlikApp = qlik.openApp(decodeURI(appId), config);
            const enigmaModel = qlikApp.model.enigmaModel;
            enigmaModel.destroyBookmark(bookmarkId).then(function() {
                doSaveIfDesktop(qlikApp);
            });
        };

        function doSaveIfDesktop(app) {
            senseService.isPersonalMode().then(function(isPersonalMode) {
                if (isPersonalMode) {
                    const enigmaModel = app.model.enigmaModel;
                    enigmaModel.doSave();
                }
            });
        }

        this.createBookmarksFromCurrentSelections = function () {
            const promises = [];
            senseService.apps.forEach(function (app) {
                const qlikApp = qlik.openApp(decodeURI(app.id), config);
                const enigmaModel = qlikApp.model.enigmaModel;
                const selectionState = qlikApp.selectionState();
                if (selectionState.selections.length > 0) {
                    const promise = enigmaModel.createBookmark({qInfo: {qType: DASHBOARD_BOOKMARK_QTYPE}})
                        .then(function (model) {
                            return model.getLayout().then(function (layout) {
                                doSaveIfDesktop(qlikApp);
                                return {appId: app.id, bookmarkId: layout.qInfo.qId};
                            });
                        });
                    promises.push(promise);
                }
            });
            return $q.all(promises);
        };
    }
})();
