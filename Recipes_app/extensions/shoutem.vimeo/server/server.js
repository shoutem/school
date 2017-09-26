/* eslint-disable no-var, strict */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./bin/webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(4791, 'localhost', function (err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:4791');
});
