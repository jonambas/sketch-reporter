const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const reporterPath = path.resolve(__dirname, '..');
const includePaths = [path.resolve(reporterPath, 'src')];

module.exports = (config, options) => {
  const devServerEntries = options.production
    ? []
    : [`webpack-dev-server/client?http://localhost:${config.port}`, 'webpack/hot/dev-server'];

  const proplyConfig = {
    mode: options.production ? 'production' : 'development',
    entry: [...devServerEntries, path.resolve(reporterPath, 'src/index.js')],
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(process.cwd(), config.outputPath)
    },
    resolve: {
      extensions: ['.wasm', '.ts', '.tsx', '.mjs', '.cjs', '.js', '.json'],
      alias: {
        __DATA__: path.resolve(process.cwd(), '/.sketch/results.json')
      }
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          include: includePaths,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                require.resolve('@babel/preset-env'),
                require.resolve('@babel/preset-react')
              ]
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Sketch Reporter',
        chunksSortMode: 'none',
        chunks: ['main'],
        filename: 'index.html'
      }),
      ...(options.production
        ? []
        : [new webpack.HotModuleReplacementPlugin(), new FriendlyErrorsWebpackPlugin()])
    ]
  };

  return proplyConfig;
};
