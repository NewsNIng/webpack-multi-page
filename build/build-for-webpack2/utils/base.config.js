const ExtractTextPlugin = require('extract-text-webpack-plugin')
const helpers = require('./helpers')
const consts = require('./consts')
const webpack = require('webpack')

const config = {
  entry: helpers.getEntry(consts.PAGES),
  output: {
    path: consts.DIST,
    publicPath: consts.CDN,
    filename: `${consts.SCRIPTS}[name].js`
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        include: [
          consts.SRC
        ],
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                includePaths: [
                  `${consts.SRC}/styles`
                ]
              }
            },
            'postcss-loader'
          ],
          publicPath: '../'
        })
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              interpolate: true,
              minimize: false
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              publicPath: '/',
              outputPath: consts.IMAGES,
              name: '[hash].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [
          require('postcss-font-magician')(),
          require('cssnano')({
            filterPlugins: false,
            sourcemap: true,
            autoprefixer: {
              add: true,
              remove: true,
              browserslist: ['last 2 versions']
            },
            safe: true,
            discardComments: {
              removeAll: true
            }
          }),
          require('postcss-utilities')({
            ie8: true
          })
        ]
      }
    }),
    new ExtractTextPlugin(`${consts.STYLES}[name].css`),
    ...helpers.getPlugins(consts.PAGES)
  ],
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.html', '.scss']
  }
}

module.exports = config
