const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: './build',
    // if the above line does not work, try `path: __dirname + '/build'`
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Custom template',
      template: './src/index.html'
    })
  ],
  // NOTE 'Setting up Webpack'
  module: {
    loaders: [
      {
        test: /\.js$/, // a regular expression that catches .js files
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loaders:['style-loader','css-loader']
      }
    ]
  },
  devServer: {
    port: 3000, // most common port
    contentBase: './build',
    inline: true
  }
  // NOTE 'Adding babel to Webpack'
}
