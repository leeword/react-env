const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HappyPack = require('happypack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const FriendErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const happyThreadPool = HappyPack.ThreadPool({ size: 5 });
// TODO: css 关键路径渲染 https://github.com/addyosmani/critical-path-css-tools
// TODO: srcset 控制浏览器加载图片类型 resize-image-loader responsive-loader
const config = {
    mode: 'production',
    entry: {
        main: './src/main.js',
    },
    output: {
        // using contenthash after webpack 4.17.0 for javascript
        filename: 'js/[name].[contenthash:8].js',
        path: path.resolve(__dirname, '../dist'),
        chunkFilename: 'js/[name].[contenthash:8].js',
        publicPath: '/',
    },
    resolve: {
        alias: {
            react: path.resolve(__dirname, '../node_modules/react/index.js'),
        },
        mainFields: ['module', 'main'],
        extensions: ['.js', '.json'],
        modules: [path.resolve(__dirname, '../node_modules')]
    },
    module: {
        rules: [
            {
                parser: {
                    // disabled require.ensure in dynamic import case
                    requireEnsure: false,
                }
            },
            {
                test: /\.m?js$/,
                // 
                include: path.resolve(__dirname, '../src'),
                use: {
                    loader: 'happypack/loader?id=babel',
                },
            },
            {
                test:  /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'happypack/loader?id=styles',
                    },
                ],
            },
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
                              quality: 65
                            },
                            optipng: {
                              enabled: false,
                            },
                            pngquant: {
                              quality: '65-90',
                              speed: 4
                            },
                            gifsicle: {
                              interlaced: false,
                            },
                            webp: {
                              quality: 75
                            }
                          },
                    },
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
        new CleanWebpackPlugin(),
        // give dynamic chunk a name instead of id when `webpackChunkName` is not defined
        // if we use auto-increment id by default, and then we hardly to have a stable file signature
        new webpack.NamedChunksPlugin(
            chunk => chunk.name || Array.from(chunk.modulesIterable, m => path.relative(m.context, m.request)).join("_")
        ),
        // help split lodash
        new LodashModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: "react 模版",
            template: path.resolve(__dirname, '../public/index-prod.html'),
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
        new HappyPack({
            id: 'styles',
            threadPool: happyThreadPool,
            loaders: [
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                    },
                },
                'postcss-loader',
                'sass-loader',
            ],
        }),
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
        new PurifyCSSPlugin({
            paths: glob.sync(`${path.join(__dirname, "../src")}/**/*.js`, { nodir: true }),
        }),
        new HappyPack({
            id: 'babel',
            threadPool: happyThreadPool,
            loaders: ['babel-loader?cacheDirectory'],
        }),
        // make the output more clean and friendly in the terminal interface
        new FriendErrorsWebpackPlugin(),
    ],
    optimization: {
        moduleIds: 'hashed',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: -10,
                    minChunks: 1,
                },
                commons: {
                    name: 'commons',
                    chunks: 'initial',
                    minChunks: 2,
                    priority: -9,
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
        runtimeChunk: {
            name: "manifest",
        },
    },
    stats: 'errors-only',
    performance: false,
}

// analysis bundle size
if (process.env.SHOW_REPORT === '1') {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = config;
