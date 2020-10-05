(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('sparql')) :
typeof define === 'function' && define.amd ? define(['exports', 'sparql'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jassa = {}, global.sparql));
}(this, (function (exports, sparql) { 'use strict';

Object.keys(sparql).forEach(function (k) {
if (k !== 'default') Object.defineProperty(exports, k, {
enumerable: true,
get: function () {
return sparql[k];
}
});
});

Object.defineProperty(exports, '__esModule', { value: true });

})));
