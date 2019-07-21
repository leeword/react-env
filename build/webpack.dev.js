const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base');

const cwd = process.cwd();

module.exports = merge(baseConfig, {
  // Enables NamedChunksPlugin and NamedModulesPlugin.
  mode: 'development',
  entry: [
    'react-hot-loader/patch',
    './src/main.js',
  ],
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/',
    pathinfo: false,
  },
  resolve: {
    alias: {
      'react-dom$': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|webp|svg)$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
    overlay: {
      errors: true,
    },
    stats: 'errors-only',
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
  plugins: [
    // require dll manifest
    new webpack.DllReferencePlugin({
      manifest: require('../dll/react.manifest.json'),
    }),
    new webpack.DllReferencePlugin({
      manifest: require('../dll/lib.manifest.json'),
    }),
    new HtmlWebpackPlugin({
      title: 'react 模版',
      template: resolve(cwd, 'public/index-dev.html'),
      // https://github.com/jantimon/html-webpack-plugin/issues/870
      chunksSortMode: 'none',
    }),
  ],
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
})
