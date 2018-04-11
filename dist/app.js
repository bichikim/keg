!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("vuex-keg",[],e):"object"==typeof exports?exports["vuex-keg"]=e():t["vuex-keg"]=e()}(this,function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:o})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n.w={},n(n.s=2)}([
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/*! exports used: clone, forEach, omit, pick */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,e){t.exports=require("lodash")},
/*!**********************************!*\
  !*** ./src/index.ts + 1 modules ***!
  \**********************************/
/*! exports provided: Keg, sKeg, default, keg */
/*! all exports used */
/*! ModuleConcatenation bailout: Cannot concat with external "lodash" (<- Module is not an ECMAScript module) */function(t,e,n){"use strict";n.r(e);var o=n(0),r=function(){function t(t){void 0===t&&(t={}),this._options=t}return t.prototype.tap=function(t,e){void 0===e&&(e={});var n=this._options,o=e.only,r=void 0===o?n.only:o,i=e.except,u=void 0===i?n.except:i;return c(t,{only:r,except:u})},Object.defineProperty(t.prototype,"options",{get:function(){return Object(o.clone)(this._options)},set:function(t){this._options=t},enumerable:!0,configurable:!0}),t}();n.d(e,"sKeg",function(){return u}),n.d(e,"keg",function(){return c}),n.d(e,"Keg",function(){return r});var i=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t},u=Symbol("keg"),c=(e.default=function(t){void 0===t&&(t={});var e=t.plugins,n=void 0===e?{}:e,r=t.beers,i=void 0===r?{}:r,c={};return Object.assign(c,n,i),function(t){if(void 0===t&&(t={}),!t.state)throw new Error("[vuex-keg] rootStore has no state");t.state[u]=function(t,e){var n={};return Object(o.forEach)(t,function(t,o){n[o]=t(e)}),n}(c,t)}},function(t,e){return void 0===e&&(e={}),function(n,r){var c=n.rootState[u],f=e.only,p=e.except;p&&(c=Object(o.omit)(c,p)),f&&(c=Object(o.pick)(c,f));var s=function(t,e,n){var r={};return Object(o.forEach)(t,function(t,o){r[o]=t(e,n)}),r}(c,n,r);return t(i({},s,n),r)}})},
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,e,n){t.exports=n(/*! ./src/index.ts */1)}])});
//# sourceMappingURL=app.js.map