const webpack = require('webpack');

module.exports = {
  entry: ['react-hot-loader/patch', './src/index.jsx'],
  module: {
    rules: [{ test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader'] }]
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
  output: { path: __dirname + '/dist', publicPath: '/', filename: '[name].[chunkhash].js' },
  plugins: [ new webpack.HotModuleReplacementPlugin(),new HtmlWebpackPlugin({title: 'Caching'}) ],
  devServer: { contentBase: './dist', hot: true }
};
