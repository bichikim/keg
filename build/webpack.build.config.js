const WebpackBaseConfig = require('./webpack.base.config')
const WebpackMerge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals');
WebpackBaseConfig.output.libraryTarget = 'umd' // module mode
module.exports = WebpackMerge(WebpackBaseConfig, {
  mode: 'production',
  /**
   * externals see
   * @link https://www.npmjs.com/package/webpack-node-externals
   */
  externals: [nodeExternals()]
})