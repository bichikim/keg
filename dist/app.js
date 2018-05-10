!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("lodash")):"function"==typeof define&&define.amd?define("vuex-keg",["lodash"],t):"object"==typeof exports?exports["vuex-keg"]=t(require("lodash")):e["vuex-keg"]=t(e.lodash)}(this,function(e){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n.w={},n(n.s=2)}([
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/*! exports used: forEach, omit, pick */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,n){t.exports=e},
/*!**********************************!*\
  !*** ./src/index.ts + 1 modules ***!
  \**********************************/
/*! exports provided: Keg, sKeg, default, keg */
/*! all exports used */
/*! ModuleConcatenation bailout: Cannot concat with external "lodash" (<- Module is not an ECMAScript module) */function(e,t,n){"use strict";n.r(t);var o=n(0),r=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},i=function(){function e(e){void 0===e&&(e={}),this._options=e}return e.prototype.tap=function(e,t){void 0===t&&(t={});var n=this._options,o=t.only,r=void 0===o?n.only:o,i=t.except,u=void 0===i?n.except:i;return f(e,{only:r,except:u})},Object.defineProperty(e.prototype,"options",{get:function(){return r({},this._options)},set:function(e){this._options=e},enumerable:!0,configurable:!0}),e}();n.d(t,"sKeg",function(){return c}),n.d(t,"keg",function(){return f}),n.d(t,"Keg",function(){return i});var u=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},c=Symbol("keg"),f=(t.default=function(e){void 0===e&&(e={});var t=e.plugins,n=void 0===t?{}:t,r=e.beers,i=void 0===r?{}:r,u={};return Object.assign(u,n,i),function(e){e[c]=function(e,t){var n={};return Object(o.forEach)(e,function(e,o){n[o]=e(t)}),n}(u,e)}},function(e,t){return void 0===t&&(t={}),function(n,r){var i=this[c];if(!i)throw new Error("[vuex-keg] keg-plugin is undefined in Store");var f=t.only,p=t.except;p&&(i=Object(o.omit)(i,p)),f&&(i=Object(o.pick)(i,f));var s=function(e,t,n){var r={};return Object(o.forEach)(e,function(e,o){r[o]=e(t,n)}),r}(i,n,r);return e(u({},s,n),r)}})},
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){e.exports=n(/*! ./src/index.ts */1)}])});
//# sourceMappingURL=app.js.map