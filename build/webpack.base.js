const path = require('path');
const os = require('os');
const HappyPack = require('happypack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const root = path.resolve(__dirname, '../');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
    },
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.js', '.json'],
    modules: [path.resolve(root, 'node_modules')],
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
        include: path.resolve(root, 'src'),
        use: {
          loader: 'happypack/loader?id=babel',
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: path.resolve(root, 'src/js'),
        use: [
          isDev ? {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          } : MiniCssExtractPlugin.loader,
          'happypack/loader?id=styles',
        ],
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
    // compile javascript in parallel
    new HappyPack({
      id: 'babel',
      threadPool: happyThreadPool,
      loaders: ['babel-loader?cacheDirectory'].concat(
        isDev ? 'eslint-loader' : [],
      ),
    }),
    new HappyPack({
      id: 'styles',
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            ...(isDev ? { sourceMap: true } : {}),
          },
        },
        'postcss-loader',
        {
          loader: 'sass-loader',
          options: {
            ...(isDev ? { sourceMap: true } : {}),
          },
        },
      ],
    }),
    // make the output more clean and friendly in the terminal interface
    new FriendErrorsWebpackPlugin(),
  ],
  stats: 'errors-only',
}
