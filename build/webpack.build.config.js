const WebpackBaseConfig = require('./webpack.base.config')
const WebpackMerge = require('webpack-merge')
module.exports = WebpackMerge(WebpackBaseConfig, {
  output: {
    library: 'vuex-keg',
    libraryTarget: 'umd',
  },
  mode: 'production',
  devtool: 'source-map',
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_',
    }
  }
})