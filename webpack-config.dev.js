var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

var EXCLUDE = /\.\/node_modules/;

module.exports = {
    debug: true,
    devServer: {
        contentBase: './src',
        // suppresses errors, so set to false.
        quiet: false,
        // suppresses everything except error, so set to false to see success build.
        noInfo: false,
        stats: {
            // Add asset Information
            assets: false,
            // Sort assets by a field
            assetsSort: 'field',
            // Add information about cached (not built) modules
            cached: false,
            // Add children information
            children: false,
            // Add chunk information (setting this to `false` allows for a less verbose output)
            chunks: false,
            // Add built modules information to chunk information
            chunkModules: false,
            // Add the origins of chunks and chunk merging info
            chunkOrigins: false,
            // Sort the chunks by a field
            chunksSort: 'field',
            // Add errors
            errors: true,
            // Add details to errors (like resolving log)
            errorDetails: true,
            // Add the hash of the compilation
            hash: false,
            // Add built modules information
            modules: false,
            // Sort the modules by a field
            modulesSort: 'field',
            // Add public path information
            publicPath: false,
            // Add information about the reasons why modules are included
            reasons: false,
            // Add the source code of modules
            source: false,
            // Add timing information
            timings: false,
            // Add webpack version information
            version: false,
            // Add warnings
            warnings: true
        }
    },
    devtool: 'source-map',
    entry: [
        './src/main',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server'
    ],
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
        filename: 'main.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            'template': './src/index.html'
        }),
        new ServiceWorkerWebpackPlugin({
            entry: './src/service-worker.js',
            filename: 'service-worker.js'
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
