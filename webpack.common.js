/* global module */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = {

    entry: {
        main: './src/index.js',
        selectbar: './src/selectbar/index.js',
    },

    output: {
        filename: '[name].[chunkhash].js'
    },

    resolve: {
        extensions: ['.js', '.html', '.css'],
        alias: {
            'head': 'headjs/dist/1.0.0/head.min',
            'punch': 'jquery-ui-touch-punch/jquery.ui.touch-punch',
            'jquery-ui': 'jquery-ui/ui',
            'jquery': 'jquery/src/jquery'
        }
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    failOnError: true,
                    failOnWarning: true
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        removeEmptyAttributes: false,
                        collapseWhitespace: false,
                        collapseBooleanAttributes: false,
                        removeOptionalTags: false
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                use: ['file-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: ['file-loader']
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['dist', 'dist-zip']),
        new HtmlWebpackPlugin({
            template: 'index.html',
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            template: './src/selectbar/index.html',
            chunks: ['selectbar'],
            filename: './selectbar.html'
        }),
        new CopyWebpackPlugin(
            [
                'db-pin-your-business.qext',
                'wbfolder.wbl',
                'translations/*.json',
                'favicon.ico'
            ]
        ),
        new MiniCssExtractPlugin({
            filename: '[chunkhash].css'
        }),
        new ZipPlugin({
            path: '../dist-zip',
            filename: 'db-pin-your-business.zip'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};
