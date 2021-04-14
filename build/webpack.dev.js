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
    proxy: {
      '/proxy': {
        // 更改为代理的 url
        target: 'http://xxx.xxxxxx.com',
        pathRewrite: { '^/proxy': '' },
      },
    },
    watchOptions: {
      // 忽略 node_modules 文件夹变动, 如需要调试三方包注释`ignored`字段重启本地服务
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
