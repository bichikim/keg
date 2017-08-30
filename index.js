'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Register store
 * @param {object} plugins
 * @param {object} store
 * @return {object}
 */
var agePlugins = function agePlugins(plugins, store) {
  var agedPlugins = {};
  (0, _forEach2.default)(plugins, function (plugin, key) {
    agedPlugins[key] = plugin(store);
  });
  return agedPlugins;
};

/**
 * Register mutation and state
 * @param {object} agedPlugins
 * @param {object} mutation
 * @param {object} state
 * @return {{}}
 */
var openPlugins = function openPlugins(agedPlugins, mutation, state) {
  var openedPlugins = {};
  (0, _forEach2.default)(agedPlugins, function (plugin, key) {
    openedPlugins[key] = plugin(mutation, state);
  });
  return openedPlugins;
};

/**
 * Keg plugin
 * @param {object} data
 * @param {object} data.plugins
 * @param {object|undefined} data.beers
 * @return {function(*=)}
 */

exports.default = function (_ref) {
  var _ref$plugins = _ref.plugins,
      plugins = _ref$plugins === undefined ? {} : _ref$plugins,
      beers = _ref.beers;

  if (plugins.next) {
    throw new Error('Please do not use "next" for a keg plugin name.');
  }
  // Beers just another name of plugins. cheers!
  if ((typeof beers === 'undefined' ? 'undefined' : _typeof(beers)) === 'object') {
    Object.assign(plugins, beers);
  }

  return function (store) {
    var agedPlugins = agePlugins(plugins, store);
    store.subscribe(function (mutation, state) {
      var payload = mutation.payload;

      var openedPlugins = openPlugins(agedPlugins, mutation, state);
      if (!(typeof payload === 'function')) {
        return;
      }
      var type = mutation;
      payload(_extends({}, openedPlugins, {
        next: function next(data) {
          return store.commit(type, data);
        }
      }), state);
    });
  };
};
