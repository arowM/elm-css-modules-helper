const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");

console.log('Starting webpack process...');

// Consts
const TARGET_ENV = Object.create(null);
TARGET_ENV.PRODUCTION = "production";
TARGET_ENV.DEVELOPMENT = "development";
const ENV = {
  'port': process.env.PORT || 8080,
  'host': process.env.HOST || 'localhost',
  'title': process.env.TITLE || 'sample app',
  'publicPath': process.env.PUBLIC_PATH || '/sample/',
};
const COMMAND = Object.create(null);
COMMAND.BUILD = "build";
COMMAND.START = "start";

const command = process.env.npm_lifecycle_event;
const mode = command === 'build' ? TARGET_ENV.PRODUCTION : TARGET_ENV.DEVELOPMENT;
const styleLoader = ({
  [TARGET_ENV.PRODUCTION]: MiniCssExtractPlugin.loader,
  [TARGET_ENV.DEVELOPMENT]: 'style-loader',
})[mode];

// Common webpack config
const commonConfig = {
  mode,
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'static/[name].js',
    publicPath: ENV.publicPath,
  },
  entry: {
    index: [
      path.join(__dirname, "src/index.js")
    ]
  },
  resolve: {
    extensions: ['.js', '.elm'],
    modules: [
      'node_modules'
    ],
  },
  module: {
    rules: [
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: [/elm-stuff/, /node_modules/],
        loader: "url-loader",
        options: {
          limit: 10000,
          mimetype: "application/font-woff"
        }
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: [/elm-stuff/, /node_modules/],
        loader: "file-loader",
        options: {
          outputPath: 'static/',
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "file-loader",
        options: {
          outputPath: 'static/',
        },
      },
      {
        test: /\.(css|scss)$/,
        include: [/src/],
        exclude: [/elm-stuff/, /node_modules/],
        use: [
          styleLoader,
          {
            'loader': 'css-loader',
            'options': {
              'modules': 'ture',
              'minimize': true,
              'localIdentName': '_elm_css_modules_sample_[name]__[local]',
            },
          },
          {
            'loader': 'sass-loader',
            'options': {
              'includePaths': [
                path.resolve(__dirname, 'styles/'),
              ],
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      filename: 'index.html',
      data: ENV,
      hash: true,
      minify: {
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        html5: true,
        removeComments: true,
      },
    }),

    // Inject variables to JS file.
    new webpack.DefinePlugin({
      'process.env':
      Object.keys(ENV).reduce((o, k) =>
        merge(o, {
          [k]: JSON.stringify(ENV[k]),
        }), {}
      ),
    }),
  ],
}

// Settings for `npm start`
if (command === COMMAND.START) {
  console.log('Serving locally...');

  module.exports = merge(commonConfig, {
    devServer: {
      contentBase: 'src',
      inline: true,
      port: ENV.port,
      host: ENV.host,
    },
    module: {
      rules:
      [{
        test: /\/src\/.*\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: [
          { loader: 'elm-hot-webpack-loader' },
          { loader: 'elm-webpack-loader',
            options: {
              verbose: true,
              // debug: true,
            }
          }
        ],
      }],
    },
  });
}

// Settings for `npm run build`.
if (command === COMMAND.BUILD) {
  console.log('Building for prod...');

  module.exports = merge(commonConfig, {
    module: {
      rules:
      [{
        test: /\/src\/.*\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: [{
          loader: 'elm-webpack-loader',
          options: {
            verbose: true,
            // debug: true,
          }
        }],
      }],
    },
    plugins: [
      new CleanWebpackPlugin(["dist"], {
        root: __dirname,
        exclude: [],
        verbose: true,
        dry: false,
      }),
      new CopyWebpackPlugin([
      ]),
      new MiniCssExtractPlugin({
        filename: "static/[name].css",
      })
    ]
  });
}
