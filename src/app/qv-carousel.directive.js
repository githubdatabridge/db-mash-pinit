import _ from 'lodash';
import $ from 'jquery';
import { module } from 'angular';

/**
 * @ngdoc directive
 * @name kpis.qv-carousel.directive:qvCarousel
 * @restrict A
 *
 * Loads the qlik view contents of the current active slides and some cached ones of a ui-carousel.
 * Resizes the qlik view content in case of a resize of the window or the slide.
 *
 * @example
 * <pre>
 *  <ui-carousel slides="qlikEntities" slides-to-show="3" slides-to-scroll="3">
 *          <carousel-item>
 *              <div class="preview" qv-carousel="item" current-slide="ctrl.currentSlide" index="$index"></div>
 *          </carousel-item>
 *      </ui-carousel>
 * </pre>
 */
module('kpis').directive('qvCarousel', ['config', 'qlik', '$timeout', 'CAROUSEL_CHANGED_EVENT',  qvCarouselDirective]);

export function qvCarouselDirective (config, qlik, $timeout, CAROUSEL_CHANGED_EVENT) {
    return {
        restrict: 'A',

        scope: {
            qvCarousel: '=',
            index: '='
        },

        link: function (scope, elem) {
            const SLIDES_PER_PAGE = 3;
            let actualCurrentSlide;

            $(elem).on('reload', function () {
                qlik.openApp(scope.qvCarousel.app, config).getObject(elem, scope.qvCarousel.id).then(() => $timeout(qlik.resize, 100));
            });

            scope.$on(CAROUSEL_CHANGED_EVENT,function (event, currentSlide) {
                if (!_.isUndefined(currentSlide)) {
                    actualCurrentSlide = currentSlide;
                }
                if (shouldBeLoaded()) {
                    $(elem).trigger('reload');
                }
            });

            function shouldBeLoaded() {
                const elementNotLoaded = $(elem).children().length === 0;
                const elementShouldBePreloaded = actualCurrentSlide - SLIDES_PER_PAGE <= scope.index && scope.index < actualCurrentSlide + (2 * SLIDES_PER_PAGE);
                return elementNotLoaded && elementShouldBePreloaded;
            }

        }
    };
}
