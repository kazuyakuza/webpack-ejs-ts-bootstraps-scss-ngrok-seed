const {
  merge
} = require('webpack-merge');
const common = require('./webpack.common.js');
module.exports = (env) => merge(common(env), {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      minSize: 0,
    },
  },
});
