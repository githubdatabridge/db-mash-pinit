import { module } from 'angular';

module('kpis').component('languageSelection', {
    template: require('./language-selection.directive.html'),
    controller: ['$translate', 'senseLanguageService', 'LANGUAGES', languageSelectionController]
});

export function languageSelectionController ($translate, senseLanguageService, LANGUAGES) {
    const $ctrl = this;
    $ctrl.languages = LANGUAGES;
    $ctrl.currentLanguage = LANGUAGES[0];

    this.$onInit = function() {
        senseLanguageService.propagateAppsLanguage($ctrl.currentLanguage);
    };

    $ctrl.changeLanguage = function (language) {
        senseLanguageService.propagateAppsLanguage(language);
        $translate.use(language);
        $ctrl.currentLanguage = language;
    };
}
