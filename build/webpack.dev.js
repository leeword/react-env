const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');
const FriendErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

module.exports = {
    // Enables NamedChunksPlugin and NamedModulesPlugin.
    mode: 'development',
    entry: [
        'react-hot-loader/patch',
        './src/main.js',
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
        chunkFilename: '[name].chunk.js',
        publicPath: '/',
        pathinfo: false,
    },
    resolve: {
        alias: {
            react: path.resolve(__dirname, '../node_modules/react/index.js'),
            'react-dom': '@hot-loader/react-dom',
        },
        mainFields: ['module', 'main'],
        extensions: ['.js', '.json'],
        modules: [path.resolve(__dirname, '../node_modules')]
    },
    module: {
        rules: [
            {
                parser: {
                    requireEnsure: false,
                }
            },
            {
                test: /\.m?js$/,
                include: path.resolve(__dirname, '../src'),
                use: {
                    loader: 'happypack/loader?id=babel',
                },
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: {
                    loader: 'happypack/loader?id=styles',
                },
            },
            {
                test: /\.(gif|png|jpe?g|webp|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                    },
                ],
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    },
                },
            },
        ],
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        hot: true,
        open: true,
        historyApiFallback: true,
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300,
            poll: 1000,
        },
    },
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: require('../dll/react.manifest.json'),
        }),
        new HtmlWebpackPlugin({
            title: "react 模版",
            template: path.resolve(__dirname, '../public/index-dev.html'),
        }),
        new HappyPack({
            id: 'babel',
            threadPool: happyThreadPool,
            loaders: [
                'babel-loader?cacheDirectory',
                'eslint-loader',
            ],
        }),
        new HappyPack({
            id: 'styles',
            threadPool: happyThreadPool,
            loaders: [
                {
                    loader: 'style-loader'
                },
                {
                    loader: "css-loader",
                    options: {
                        importLoaders: 1,
                    },
                },
                "sass-loader",
            ],
        }),
        new FriendErrorsWebpackPlugin(),
    ],
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    },
    stats: 'errors-only',
}
