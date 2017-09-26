/* eslint-disable no-var, strict */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./bin/webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: false,
  historyApiFallback: true,
  https: true,
}).listen(4790, 'localhost', function (err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:4790');
});
