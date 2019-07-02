const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'none',
    entry: {
        react: ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'react-router', 'react-router-dom'],
    },
    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, '../dll'),
        library: 'dll_[name]',
    },
    resolve: {
        alias: {
            // fix: 在 entry 中引入，其他包依赖 react-dom 会出现重复的包
            'react-dom': '@hot-loader/react-dom',
        },
        mainFields: ['module', 'main'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DllPlugin({
            name: 'dll_[name]',
            path: path.join(__dirname, '../dll', '[name].manifest.json'),
        })
    ],
}
