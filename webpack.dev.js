/* global module */
const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            'SHOW_STORAGE_SELECT': JSON.stringify(true),
            'DEFAULT_TO_LOCAL_STORAGE': JSON.stringify(true)
        })
    ]
});
