import { module } from 'angular';

module('kpis').directive('tooltipIfTruncated', [tooltipIfTruncatedDirective]);

export function tooltipIfTruncatedDirective() {
    return {
        restrict: 'A',
        link: function (scope, elements, attrs) {
            const element = elements[0];
            scope.$watch(
                () => element.scrollWidth,
                () => {
                    if (element.offsetWidth < element.scrollWidth) {
                        attrs.tooltipEnable = 'true';
                    } else {
                        attrs.tooltipEnable = 'false';
                    }
                });
        }
    };
}
