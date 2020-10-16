/* global module */
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'SHOW_STORAGE_SELECT': JSON.stringify(false),
            'DEFAULT_TO_LOCAL_STORAGE': JSON.stringify(true)
        })
    ]

});
