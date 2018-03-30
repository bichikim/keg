/**
 *
 * @author Bichi Kim [bichi@pjfactory.com]
 * @copyright (c) PJ Factory Co.
 * @license Private
 */
const WebpackBaseConfig = require('./webpack.base.config')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackMerge = require('webpack-merge')
WebpackBaseConfig.output.libraryTarget = 'commonjs2' // module mode
module.exports = WebpackMerge(WebpackBaseConfig, {
  mode: 'production',
  // plugins: [
  //   new UglifyJsPlugin(),
  // ],
})