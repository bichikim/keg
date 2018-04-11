const WebpackBaseConfig = require('./webpack.base.config')
const WebpackMerge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals');
module.exports = WebpackMerge(WebpackBaseConfig, {
  output: {
    library: 'vuex-keg',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  devtool: 'source-map',
  mode: 'production',
  externals: [nodeExternals()]
})