// development mode dll config
const { resolve, join } = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: {
    react: ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'react-router-dom'],
  },
  output: {
    filename: '[name].dll.js',
    path: resolve(__dirname, '../dll'),
    library: '_dll_[name]',
  },
  resolve: {
    alias: {
      'react-dom$': '@hot-loader/react-dom',
    },
    mainFields: ['browser', 'module', 'main'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.DllPlugin({
      name: '_dll_[name]',
      path: join(__dirname, '../dll', '[name].manifest.json'),
    }),
  ],
}
