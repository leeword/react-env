// development mode dll config
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: {
    react: ['react', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'react-router-dom'],
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '_dll_[name]',
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    mainFields: ['module', 'main'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: '_dll_[name]',
      path: path.join(__dirname, '../dll', '[name].manifest.json'),
    }),
  ],
}
