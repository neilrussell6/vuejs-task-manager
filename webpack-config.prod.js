var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var EXCLUDE = /\.\/node_modules/;

module.exports = {
    bail: true,
    devtool: 'source-map',
    entry: './src/main',
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: EXCLUDE
            },
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                },
                exclude: EXCLUDE
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: EXCLUDE
            },
            {
                test: /\.html$/,
                loader: 'vue-html-loader',
                exclude: EXCLUDE
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&minetype=application/font-woff',
                exclude: EXCLUDE
            },
            {
                test: /\.(ttf|eot|jpe?g|png|gif|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
                exclude: EXCLUDE
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
                exclude: EXCLUDE
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[chunkhash].js',
        pathinfo: false
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'static' }
        ]),
        new ServiceWorkerWebpackPlugin({
            entry: './src/service-worker.js',
            filename: 'service-worker.js'
        }),
        new HtmlWebpackPlugin({
            'template': './src/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],
    resolve: {
        extensions: ['', '.js', '.vue'],
        fallback: [path.join(__dirname, './node_modules')],
        alias: {
            'assets': path.resolve(__dirname, './src/assets'),
            'data': path.resolve(__dirname, './src/data'),
            'state': path.resolve(__dirname, './src/state'),
            'styles': path.resolve(__dirname, './src/styles'),
            'utils': path.resolve(__dirname, './src/utils'),
            'view': path.resolve(__dirname, './src/view'),
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, './node_modules')]
    },
    vue: {
        loaders: {
            css: 'style-loader!css-loader',
            scss: 'vue-style-loader!style-loader!css-loader!postcss-loader!sass-loader'
        }
    }
};
