!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("lodash")):"function"==typeof define&&define.amd?define("vuex-keg",["lodash"],t):"object"==typeof exports?exports["vuex-keg"]=t(require("lodash")):e["vuex-keg"]=t(e.lodash)}(this,function(e){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/*! exports used: forEach, omit, pick */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,n){t.exports=e},
/*!**********************************!*\
  !*** ./src/index.ts + 1 modules ***!
  \**********************************/
/*! exports provided: Keg, sKeg, default, kegRunner, keg */
/*! all exports used */
/*! ModuleConcatenation bailout: Cannot concat with external "lodash" (<- Module is not an ECMAScript module) */function(e,t,n){"use strict";n.r(t);var r=n(0),o=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},i=function(){function e(e){void 0===e&&(e={}),this._options=e}return e.prototype.tap=function(e,t){void 0===t&&(t={});var n=this._options,r=t.only,o=void 0===r?n.only:r,i=t.except,u=void 0===i?n.except:i;return p(e,{only:o,except:u})},Object.defineProperty(e.prototype,"options",{get:function(){return o({},this._options)},set:function(e){this._options=e},enumerable:!0,configurable:!0}),e}();n.d(t,"sKeg",function(){return c}),n.d(t,"kegRunner",function(){return f}),n.d(t,"keg",function(){return p}),n.d(t,"Keg",function(){return i});var u=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},c=Symbol("keg"),f=(t.default=function(e){void 0===e&&(e={});var t=e.plugins,n=void 0===t?{}:t,o=e.beers,i=void 0===o?{}:o,u={};return Object.assign(u,n,i),function(e){e[c]=function(e,t){var n={};return Object(r.forEach)(e,function(e,r){n[r]=e(t)}),n}(u,e)}},function(e,t){return void 0===t&&(t={}),function(n,o){var i=this[c];if(!i)throw new Error("[vuex-keg] keg-plugin is undefined in Store");var f=t.only,p=t.except;p&&(i=Object(r.omit)(i,p)),f&&(i=Object(r.pick)(i,f));var s=function(e,t,n){var o={};return Object(r.forEach)(e,function(e,r){o[r]=e(t,n)}),o}(i,n,o);return e(u({},s,n),o)}}),p=function(e,t){if("function"==typeof e)return f(e,t);if(!Array.isArray(e)&&"object"==typeof e){var n={};return Object.keys(e).forEach(function(r){n[r]=f(e[r],t)}),n}throw new Error("[vuex-keg] only support object & function")}},
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){e.exports=n(/*! ./src/index.ts */1)}])});
//# sourceMappingURL=app.js.map