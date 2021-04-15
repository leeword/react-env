const { resolve, relative } = require('path');
const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { GenerateSW } = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const PurgeCssPlugin = require('purgecss-webpack-plugin');
const baseConfig = require('./webpack.base');

const cwd = process.cwd();

const config = merge(baseConfig, {
  mode: 'production',
  entry: {
    main: './src/main.js',
  },
  output: {
    // use contenthash after webpack 4.17.0 for javascript long term caching
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|webp|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 10,
              name: 'image/[name].[hash:8].[ext]',
              fallback: 'file-loader',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // give dynamic chunk a name instead of id when `webpackChunkName` is not defined
    // if we use auto-increment id by default, and then we hardly to have a stable file signature
    new webpack.NamedChunksPlugin(
      (chunk) => chunk.name || Array.from(chunk.modulesIterable, (m) => relative(m.context, m.request)).join('_')
    ),
    new HtmlWebpackPlugin({
      title: 'react 模版',
      template: resolve(cwd, 'public/index-prod.html'),
      chunksSortMode: 'none',
      // optimize html template
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    // inject webpack runtime code into html file
    new InlineManifestWebpackPlugin('manifest'),
    // fix css generate extra js file in webpack4
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style/[name].[contenthash:8].css',
      chunkFileName: 'style/[name].[contenthash:8].chunk.css',
    }),
    // minify css
    new OptimizeCssAssetsWebpackPlugin(),
    // remove unused selector from CSS file
    // see https://github.com/webpack-contrib/purifycss-webpack
    new PurgeCssPlugin({
      paths: glob.sync(resolve(cwd, 'src/**/*.js'), { nodir: true }),
    }),
    new GenerateSW({
      swDest: 'sw.js',
      exclude: [/\.(gif|png|jpe?g|webp|svg)$/],
      excludeChunks: ['manifest'],
      ignoreURLParametersMatching: [/./],
      importWorkboxFrom: 'local',
      cacheId: 'fzr:static',
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /\.(gif|png|jpe?g|webp|svg)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'fzr:images',
          },
        },
      ],
    }),
    // throw errors when build error
    function handleErrorBuild() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          console.log('build error'); //eslint-disable-line
          process.exit(1);
        }
      });
    },
  ],
  optimization: {
    moduleIds: 'hashed',
    splitChunks: {
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 100,
        },
        varied: {
          test: /[\\/]node_modules[\\/](lodash|core-js)[\\/]\S*\.js/,
          name: 'varied',
          chunks: 'all',
          priority: 80,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 60,
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          priority: 20,
        },
        // styles: {
        //   name: 'styles',
        //   test: /\.css$/,
        //   chunks: 'all',
        //   enforce: true,
        // },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
  },
});

// analysis bundle size
if (process.env.SHOW_REPORT) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
