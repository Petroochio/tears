/* eslint-disable */
var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: './src/index',
  },

  output: {
    path: path.resolve('build'),
    filename: '[name].js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|build)/,
        loader: 'babel-loader',
      },
    ],
  },
};
