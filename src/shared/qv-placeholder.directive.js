import { module } from 'angular';
import $ from 'jquery';

module('kpis').directive('qvPlaceholder', ['senseService', 'preferencesService', 'qlik', 'config', qvPlaceholderDirective]);

export function qvPlaceholderDirective(senseService, preferencesService, qlik, config) {
    return {
        restrict: 'A',

        scope: {
            qvPlaceholder: '='
        },

        link: function (scope, elem) {

            $(elem).on('sizeChanged', function () {
                qlik.resize();
            });

            $(elem).on('qv-activate', function (event) {
                event.stopPropagation();
            });

            $(elem).on('themeChanged', function () {
                $(elem).empty();
                qlik.openApp(scope.qvPlaceholder.app, config).getObject(elem[0], scope.qvPlaceholder.id);
            });

            scope.$watch('qvPlaceholder', function (newValue, oldValue, scope) {
                $(elem).empty();
                if (scope.qvPlaceholder && scope.qvPlaceholder.app) {
                    qlik.openApp(scope.qvPlaceholder.app, config).getObject(elem[0], scope.qvPlaceholder.id).then(function (ob) {
                        senseService.hasTile(true);
                        $(elem).siblings('.foot').text(ob.layout.qMeta.description);
                        $(elem).parent().siblings('.mos').addClass('objectin');
                    }, function () {
                        preferencesService.toggleFavorite(scope.qvPlaceholder.app, scope.qvPlaceholder.id);
                    });
                }
            }, true);
        }
    };
}

module.exports = qvPlaceholderDirective;
