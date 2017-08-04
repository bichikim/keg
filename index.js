'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('babel-polyfill');

exports.default = function (_ref) {
    var _ref$plugins = _ref.plugins,
        plugins = _ref$plugins === undefined ? {} : _ref$plugins,
        beers = _ref.beers,
        _ref$options = _ref.options,
        options = _ref$options === undefined ? { isWork: true } : _ref$options;
    var isWork = options.isWork;

    if (plugins.next) {
        throw new Error('Please do not use a name "next" for a keg plugin.');
    }
    // Beers just another name of plugins. cheers!
    if ((typeof beers === 'undefined' ? 'undefined' : _typeof(beers)) === 'object') {
        Object.assign(plugins, beers);
    }
    return function (store) {
        if (!isWork) {
            return;
        }
        store.subscribe(function (mutation, state) {
            var payload = mutation.payload;

            if (!(typeof payload === 'function')) {
                return;
            }
            var type = mutation.type;

            payload(_extends({}, plugins, {
                next: function next(data) {
                    return store.commit(type, data);
                }
            }), state);
        });
    };
};
