const { resolve } = require('path');
const os = require('os');

const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const cpusLength = os.cpus().length;
const cwd = process.cwd();
const isDev = process.env.NODE_ENV === 'development';
const sourceMapOption = isDev ? { sourceMap: true } : {}

module.exports = {
  resolve: {
    alias: {
      '@': resolve(cwd, 'src'),
    },
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.js', '.json'],
    modules: [resolve(cwd, 'node_modules')],
  },
  module: {
    rules: [
      {
        parser: {
          // disable require.ensure
          requireEnsure: false,
        },
      },
      {
        test: /\.m?js$/,
        exclude: resolve(cwd, 'node_modules'),
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: cpusLength,
            },
          },
          'babel-loader?cacheDirectory',
          isDev && 'eslint-loader',
        ].filter(Boolean),
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // thread-loader can't work with MiniCssExtractPlugin.loader
          isDev && {
            loader: 'thread-loader',
            options: {
              workers: cpusLength,
            },
          },
          isDev ? {
            loader: 'style-loader',
            options: {
              ...sourceMapOption,
            },
          } : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              // enable scope css module
              modules: {
                mode: 'global',
                localIdentName: '[local]-[hash:base64:5]',
              },
              ...sourceMapOption,
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              ...sourceMapOption,
            },
          },
        ].filter(Boolean),
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'font/[name].[hash:8].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    // help split lodash
    new LodashModuleReplacementPlugin(),
    // make the output more clean and friendly in the terminal interface
    new FriendErrorsWebpackPlugin(),
    // define compile constance
    new webpack.DefinePlugin({
      'process.env.USE_PROXY': JSON.stringify(process.env.USE_PROXY || ''),
    }),
  ],
  stats: 'errors-only',
  // do not use default performance analysis
  // use webpack-bundle-analyzer instead
  performance: false,
}
