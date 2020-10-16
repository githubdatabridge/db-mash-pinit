import { module } from 'angular';

module('kpis').component('noVisualizations', {
    template: require('./no-visualizations.directive.html'),
    controller: ['PINIT', noVisualizationsController]
});

export function noVisualizationsController (PINIT) {
    const $ctrl = this;

    $ctrl.keyword = PINIT.appKeyWord;
}
