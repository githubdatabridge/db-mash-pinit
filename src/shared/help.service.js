import Tour from 'bootstrap-tour';
import { module } from 'angular';
import $ from 'jquery';

(function () {
    module('kpis').service('helpService', HelpService);

    HelpService.$inject = ['$translate'];

    function HelpService ($translate) {
        return {
            _link: [],
            getHelp: function (link, from) {
                if (link)
                    this._link = link;
                const plc = function (context, source) {
                    const position = $(source).position();
                    if (position.left > 515) {
                        return 'left';
                    }
                    if (position.left < 515) {
                        return 'right';
                    }
                    if (position.top < 200) {
                        return 'bottom';
                    }
                    return 'top';
                };

                const stps = [
                    {
                        element: '.lib',
                        title: $translate.instant('Navigation'),
                        content: $translate.instant('Select an application to browse objects'),
                        placement: plc,
                        path: ''
                    },
                    {
                        element: '.dm0',
                        title: $translate.instant('Selections'),
                        content: $translate.instant('Apply bookmark across applications'),
                        placement: plc,
                        path: ''
                    },
                    {
                        element: '[data-gs-x=\'0\'][data-gs-y=\'0\']',
                        title: $translate.instant('Tile'),
                        content: $translate.instant('Object pinned will appear in Tile'),
                        placement: plc,
                        path: ''
                    },
                    {
                        element: 'button.btn.btn-link span.fa.fa-2x:first',
                        title: $translate.instant('Set Favorite'),
                        content: $translate.instant('Click to pin object on the Main page'),
                        placement: 'left',
                        path: typeof (link) === 'undefined' ? '' : this._link
                    },
                    {
                        element: '.sidebtnL',
                        title: $translate.instant('Global Selections'),
                        content: $translate.instant('Click to open global selections'),
                        placement: plc,
                        path: ''
                    },
                    {
                        element: '.bx-next',
                        title: $translate.instant('Browse'),
                        content: $translate.instant('Click to switch to the next object'),
                        placement: plc,
                        path: ''
                    },
                    {
                        element: '.appLink',
                        title: $translate.instant('Open the Application'),
                        content: $translate.instant('Click on the link to open the target Qlik Sense Application'),
                        placement: plc,
                        path: ''
                    }

                ];
                const tour = new Tour({
                    backdrop: true,
                    onShown: function () {
                        $('.animated').removeClass('fadeIn');
                        $('.animated-panel').removeClass('zoomIn');

                    },
                    steps: stps,
                    template: function () {
                        return '<div class="popover tour">' + // Yes.
                            '<div class="arrow"></div>' +
                                '<h3 class="popover-title"></h3>' +
                                '<div class="popover-content"></div>' +
                                '<div class="popover-navigation">' +
                                    '<div class="btn-group">' +
                                        '<button class="btn btn-sm btn-default disabled" data-role="prev">' + $translate.instant('Previous') + '</button>' +
                                        '<button class="btn btn-sm btn-default" data-role="next">' + $translate.instant('Next') + '</button>' +
                                    '</div>' +
                                    '<button class="btn btn-sm btn-default" data-role="end" translate>' + $translate.instant('Close') + '</button>' +
                                '</div>' +
                            '</div>';
                    }
                });
                if (from) {
                    tour.setCurrentStep(3);
                    tour.init();
                }
                return tour;
            }
        };
    }
})();
