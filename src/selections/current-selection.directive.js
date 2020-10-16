import _ from 'lodash';
import { module } from 'angular';

module('kpis').component('currentSelection', {
    template: require('./current-selection.directive.html'),
    controller: ['senseSelectionsService', '$rootScope', 'SELECTION_CHANGED_EVENT', currentSelectionController]
});

export function currentSelectionController (senseSelectionsService, $rootScope, SELECTION_CHANGED_EVENT) {
    const $ctrl = this;
    $ctrl.selections = [];

    $ctrl.$onInit = function () {
        senseSelectionsService.getAllAppSelectionInfos().then(function (selectionInfos) {
            $ctrl.selections = createSelections(selectionInfos);

            _.forEach(selectionInfos, function (selectionInfo) {
                selectionInfo.selectionState.OnData.bind(function () {
                    $ctrl.selections = createSelections(selectionInfos);
                    $rootScope.$broadcast(SELECTION_CHANGED_EVENT);
                });
            });
        });
    };

    $ctrl.preventDropdownClosing = function (event) {
        event.stopPropagation();
    };

    $ctrl.clearAllSelections = function () {
        senseSelectionsService.clearAllSelections();
    };

    function createSelections (selectionInfos) {
        return _.map(selectionInfos, function (selectionInfo) { return createSelection(selectionInfo); });
    }

    function createSelection (selectionInfo) {
        return {
            appId: selectionInfo.appId,
            appName: selectionInfo.appName,
            fields: createSelectionFields(selectionInfo.selectionState.selections)
        };
    }

    function createSelectionFields (selections) {
        return _.map(selections, function (selection) { return createSelectionField(selection);});
    }

    function createSelectionField (selection) {
        return {
            name: selection.fieldName,
            values: _.map(selection.selectedValues, function (selectedValue) { return selectedValue.qName;}),
            isAllSelected: isAllSelected(selection),
            isMoreThanThreshold: isMoreThanThreshold(selection)
        };
    }

    $ctrl.hasFields = function (selection){
        return !_.isEmpty(selection.fields);
    };

    function isAllSelected(selection) {
        return selection.qSelected === 'ALL';
    }

    function isMoreThanThreshold(selection) {
        return selection.selectedCount > selection.qSelectionThreshold;
    }

    $ctrl.clearField = function (appId, field) {
        senseSelectionsService.clearFieldSelections(appId, field);
    };

    $ctrl.clearApp = function (appId) {
        senseSelectionsService.clearAppSelections(appId);
    };

}
