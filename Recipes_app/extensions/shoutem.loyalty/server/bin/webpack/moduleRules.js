const ExtractTextPlugin = require('extract-text-webpack-plugin');
const isProduction = require('./env');

function resolveModuleRules() {
  const jsRule = {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
      'babel-loader',
    ],
  };

  const styleProductionRule = {
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
      use: [{
        loader: 'css-loader',
      }, {
        loader: 'postcss-loader',
      }, {
        loader: 'sass-loader',
      }],
      fallback: 'style-loader',
    }),
  };

  const styleDevelopmentRule = {
    test: /\.scss$/,
    use: [
      'style-loader',
      // Using source maps breaks urls in the CSS loader
      // https://github.com/webpack/css-loader/issues/232
      // This comment solves it, but breaks testing from a local network
      // https://github.com/webpack/css-loader/issues/232#issuecomment-240449998
      // 'css-loader?sourceMap',
      'css-loader',
      'postcss-loader',
      'sass-loader?sourceMap',
    ],
  };

  const imgRule = {
    test: /\.(png|gif|jpg|svg)$/,
    use: 'url-loader?limit=8192',
  };

  const fontRules = [
    {
      test: /\.woff(\?.*)?$/,
      use: [
        {
          loader: 'url-loader',
          query: 'prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff',
        },
      ],
    },
    {
      test: /\.woff2(\?.*)?$/,
      use: [
        {
          loader: 'url-loader',
          query:
            'prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff2',
        },
      ],
    },
    {
      test: /\.otf(\?.*)?$/,
      use: [
        {
          loader: 'file-loader',
          query: 'prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=font/opentype',
        },
      ],
    },
    {
      test: /\.ttf(\?.*)?$/,
      use: [
        {
          loader: 'url-loader',
          query: 'prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream',
        },
      ],
    },
    {
      test: /\.eot(\?.*)?$/,
      use: [
        {
          loader: 'file-loader',
          query: 'prefix=fonts/&name=fonts/[name].[ext]',
        },
      ],
    },
  ];

  if (isProduction) {
    return [
      jsRule,
      styleProductionRule,
      ...fontRules,
      imgRule,
    ];
  };

  return [
    jsRule,
    styleDevelopmentRule,
    ...fontRules,
    imgRule,
  ];
}

exports = module.exports = resolveModuleRules;
