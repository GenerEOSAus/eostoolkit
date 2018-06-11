const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: ['react-hot-loader/patch', './src/index.jsx'],
  module: {
    rules: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test:/\.css$/, use:['style-loader','css-loader']}
    ],
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
  output: { path: __dirname + '/dist', publicPath: '/', filename: '[name].[hash].js' },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({hash: true, template: 'src/index.html'})
  ],
  devServer: { contentBase: './dist', hot: true }
};
