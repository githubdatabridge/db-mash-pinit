import { module } from 'angular';

const numberOfRows = 3;
const numberOfColumns = 3;

(function () {
    const CHART_TYPE_OTHER = {name: 'other', displayName: 'Other', icon:'library'};
    module('kpis')
        .constant('VERSION', '3.2.1')
        .constant('LANGUAGES', ['en', 'de'])
        .constant('CHART_TYPE_OTHER', CHART_TYPE_OTHER)
        .constant('BACK_COLOR', '#ffffff')
        .constant('FONT_COLOR', '#3B4547')
        // Name of the server THEME (folder name in \Program Files\Qlik\Sense\Client\themes)
        .constant('SERVER_THEME', 'sense')
        .constant('PINIT', {
            // keyword used to promote qlik apps and objects to the PINIT extension
            // - for apps: keyword must be used at the start of the app description
            // - for objects: keyword must be defined as tag on the object
            appKeyWord: 'PinIt',
            // keyword used as tag for the qlik variable which sets the current language
            languageVariableKeyWord: 'PinItVarLang',
            // prefix used as tags for language fields which are used as value to set the current language
            languageFieldPrefix: 'PinItFieldLang',
        })
        .constant('NUMBER_OF_ROWS', numberOfRows)
        .constant('NUMBER_OF_COLUMNS', numberOfColumns)
        .constant('NUMBER_OF_TILES', numberOfRows * numberOfColumns)
        .constant('MOBILE_BREAKPOINT', 667)
        .constant('CHART_TYPES', [
            {name: 'barchart', displayName: 'Bar chart', icon: 'bar-chart'},
            {name: 'boxplot', displayName: 'Box plot', icon: 'boxplot'},
            {name: 'combochart', displayName: 'Combo chart', icon:'combo-chart'},
            {name: 'distributionplot', displayName: 'Distribution plot', icon:'distributionplot'},
            {name: 'filterpane', displayName: 'Filter pane', icon:'filterpane'},
            {name: 'gauge', displayName: 'Gauge', icon:'gauge-chart'},
            {name: 'histogram', displayName: 'Histogram', icon:'histogram'},
            {name: 'kpi', displayName: 'KPI', icon:'kpi'},
            {name: 'linechart', displayName: 'Line chart', icon: 'line-chart'},
            {name: 'map', displayName: 'Map', icon:'map'},
            {name: 'piechart', displayName: 'Pie chart', icon: 'pie-chart'},
            {name: 'pivot-table', displayName: 'Pivot table', icon:'pivot-table'},
            {name: 'scatterplot', displayName: 'Scatter plot', icon:'scatter-chart'},
            {name: 'table', displayName: 'Table', icon:'table'},
            {name: 'text-image', displayName: 'Text & image', icon:'text'},
            {name: 'treemap', displayName: 'Treemap', icon:'treemap'},
            {name: 'waterfall', displayName: 'Waterfall chart', icon:'waterfallchart'},
            CHART_TYPE_OTHER
        ])
        .constant('SWITCHED_STORAGE_EVENT', 'switchedStorageEvent')
        .constant('DASHBOARD_CHANGED_EVENT', 'dashboardChanged')
        .constant('DASHBOARD_FULL_EVENT', 'dashboardFull')
        .constant('DASHBOARD_NOT_FULL_EVENT', 'dashboardNotFull')
        .constant('SELECTION_CHANGED_EVENT', 'selectionChanged')
        .constant('CAROUSEL_CHANGED_EVENT', 'carouselChanged')
        .constant('DASHBOARD_BOOKMARK_QTYPE', 'DashboardBookmark')
        .constant('API_PATH', '/AxPinmeRestApi')
        .constant('API_PORT', '8443')
        .constant('config', {
            host: window.location.hostname,
            prefix: '/',
            port: window.location.port,
            isSecure: 'https:' === window.location.protocol
        });
})();
