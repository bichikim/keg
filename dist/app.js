!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var o in n)("object"==typeof exports?exports:t)[o]=n[o]}}(global,function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:o})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n.w={},n(n.s=2)}([
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/*! exports used: clone, forEach, omit, pick */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,e){t.exports=require("lodash")},
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: default, keg, Keg */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is referenced from these modules with unsupported syntax: multi ./src/index.ts (referenced with single entry) */function(t,e,n){"use strict";n.r(e),n.d(e,"keg",function(){return u}),n.d(e,"Keg",function(){return c});var o=n(/*! lodash */0),r=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t},i=Symbol("keg");e.default=function(t){void 0===t&&(t={});var e=t.plugins,n=void 0===e?{}:e,r=t.beers,u=void 0===r?{}:r,c={};return Object.assign(c,n,u),function(t){var e=function(t,e){var n={};return Object(o.forEach)(t,function(t,o){n[o]=t(e)}),n}(c,t);t.subscribeAction(function(t,n){t.payload={type:t.type,payload:t.payload},n[i]||(n[i]=e)})}};var u=function(t,e){return void 0===e&&(e={}),function(n,u){var c=n.state[i],f=e.only,p=e.except;p&&(c=Object(o.omit)(c,p)),f&&(c=Object(o.pick)(c,f));var a=function(t,e,n){var r={};return Object(o.forEach)(t,function(t,o){r[o]=t(e,n)}),r}(c,n,u);return t(r({},a,n),u)}},c=function(){function t(t){void 0===t&&(t={}),this._options=t}return t.prototype.tap=function(t,e){void 0===e&&(e={});var n=this._options,o=e.only,r=void 0===o?n.only:o,i=e.except,c=void 0===i?n.except:i;return u(t,{only:r,except:c})},Object.defineProperty(t.prototype,"options",{get:function(){return Object(o.clone)(this._options)},set:function(t){this._options=t},enumerable:!0,configurable:!0}),t}()},
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,e,n){t.exports=n(/*! ./src/index.ts */1)}])});