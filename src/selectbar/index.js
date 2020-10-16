import './css/filter';
import $ from 'jquery';

const config = { host: window.location.hostname,
    prefix: '/',
    port: window.location.port,
    isSecure: 'https:' === window.location.protocol
};

window.require.config({
    baseUrl: ( config.isSecure ? 'https://' : 'http://' ) + config.host + (config.port ? ':' + config.port: '') + config.prefix + 'resources'
});

window.require([
    'js/qlik'
], function (qlik) {
    const appParameter = getURLParameter('app');
    console.log('initMashups: app parameter: ' + appParameter);
    if (appParameter !== 'undefined') {
        const app = qlik.openApp(decodeURI(getURLParameter('app')), config);
        console.log('initMashups: opened app: ' + app.id);
        restoreObj(app);
    }

    function restoreObj(app) {
        setTimeout(function () {
            app.getObject($('#CurrentSelections'), 'CurrentSelections');
        }, 100);
    }

    function getURLParameter(a) {
        return (new RegExp(a + '=(.+?)(&|$)').exec(location.search) || [null, null])[1];
    }
});
