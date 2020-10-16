import 'babel-polyfill';

require('../css/style.css');
import {bootstrap, element, module} from 'angular';
import 'angular-route';
import 'angular-route';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'angular-translate-loader-static-files';
import 'angular-ui-carousel';
import 'head';
import 'bootstrap';
import 'angular-gridster';

import $ from 'jquery';

const config = {
    host: window.location.hostname,
    prefix: '/',
    port: window.location.port,
    isSecure: 'https:' === window.location.protocol
};

window.require.config({
    baseUrl: (config.isSecure ? 'https://' : 'http://') + config.host + (config.port ? ':' + config.port : '') + config.prefix + 'resources'
});

window.require([
    'js/qlik'
], (qlik) => {
    qlik.setOnError(
        (error) => {
            console.log('Qlik error, code: ' + error.code + ', message: ' + error.message);
        },
        (warning) => {
            console.log('Qlik warning, code: ' + warning.code + ', message: ' + warning.message);
        });

    $.expr[':'].regex = function (elem, index, match) {
        const matchParams = match[3].split(','),
            validLabels = /^(data|css):/,
            attr = {
                method: matchParams[0].match(validLabels) ? matchParams[0].split(':')[0] : 'attr',
                property: matchParams.shift().replace(validLabels, '')
            },
            regexFlags = 'ig',
            regex = new RegExp(matchParams.join('').replace(/^s+|s+$/g, ''), regexFlags);
        return regex.test($(elem)[attr.method](attr.property));
    };

    module('kpis', [
        'ngRoute',
        'ngAnimate',
        'ui.carousel',
        'ui.bootstrap',
        'pascalprecht.translate',
        'gridster'
    ]).constant('qlik', qlik);

    require('./settings');
    require('./main');

    element(document).ready(() => {
        bootstrap(document, ['kpis', 'qlik-angular']);
    });

    console.log('PinIt Qlik Mashup start');
});
