const webpack = require('webpack');
const cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const isProduction = require('./env');

function resolvePlugins() {
  const commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: (module) => (
      // this assumes your vendor imports exist in the node_modules directory
      module.context && module.context.indexOf('node_modules') !== -1
    ),
    filename: 'vendor.[hash].js',
  });

  const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: './bin/index.html',
    path: './build',
    filename: 'index.html',
  });

  const loaderOptionsPlugin = new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        cssnano({
          autoprefixer: {
            add: true,
            remove: true,
            browsers: ['last 2 versions'],
          },
          discardComments: {
            removeAll: true,
          },
          safe: true,
          sourcemap: true,
        }),
      ],
      context: '/',
    },
  });

  const minimizeLoaderOptionsPlugin = new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  });

  const extractTextPlugin = new ExtractTextPlugin({
    filename: '[name].[hash].css',
    allChunks: true,
  });

  const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
    },
    output: {
      comments: false,
    },
  });

  const dashboardPlugin = new DashboardPlugin();

  const hotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();

  const nodeEnv = new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  });

  if (isProduction) {
    return [
      nodeEnv,
      commonsChunkPlugin,
      htmlWebpackPlugin,
      loaderOptionsPlugin,
      minimizeLoaderOptionsPlugin,
      uglifyJsPlugin,
      extractTextPlugin,
    ];
  }

  return [
    commonsChunkPlugin,
    htmlWebpackPlugin,
    loaderOptionsPlugin,
    hotModuleReplacementPlugin,
    dashboardPlugin,
  ];
}

exports = module.exports = resolvePlugins;
