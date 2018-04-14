/**
 * karma settings
 * This test must have packages below
 * karma, karma-chai, karma-sourcemap-loader, karma-spec-reporter, karma-webpack
 * mocha, chai, karma-coverage
 * @author Bichi Kim <bichi@live.co.kr>
 */
const webpack = require('./webpack.test.config.js')
module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS', 'ChromeWithoutSecurity'],
    frameworks: ['mocha', 'chai'],
    reporters: ['spec', 'coverage'],
    files: [
      '../node_modules/babel-polyfill/dist/polyfill.js',
      {pattern: '../src/**/*.spec.js', watched: false},
      {pattern: './test/specs/**/*.spec.js', watched: false},
    ],
    exclude: [
      '../src/**/*.spec.skip.js',
    ],
    preprocessors: {
      '../src/**/*.js': ['webpack', 'sourcemap'],
      '../src/**/*.ts': ['webpack', 'sourcemap'],
      '../test/specs/**/*.js': ['webpack', 'sourcemap'],
      './test/specs/**/*.ts': ['webpack', 'sourcemap'],
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {type: 'html', subdir: 'html'},
        {type: 'lcovonly', subdir: 'lcov'},
        {type: 'cobertura', subdir: 'cobertura'},
        {type: 'text-summary'},
      ],
    },
    webpack,
    webpackMiddleware: {
      noInfo: true,
    },
    logLevel: config.LOG_INFO,
    colors: true,
    customLaunchers: {
      ChromeWithoutSecurity: {
        base: 'Chrome',
        flags: ['--disable-web-security'],
      },
    },
    mime: {
      'text/x-typescript': ['ts'],
    },
  })
}
