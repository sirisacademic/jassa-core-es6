(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('src/util'), require('src/rdf'), require('src/vocab'), require('src/sparql'), require('src/service'), require('src/sponate'), require('src/facete')) :
typeof define === 'function' && define.amd ? define(['exports', 'src/util', 'src/rdf', 'src/vocab', 'src/sparql', 'src/service', 'src/sponate', 'src/facete'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jassa = {}, global.util, global.rdf, global.vocab, global.sparql, global.service, global.sponate, global.facete));
}(this, (function (exports, util, rdf, vocab, sparql, service, sponate, facete) { 'use strict';

Object.keys(util).forEach(function (k) {
if (k !== 'default') Object.defineProperty(exports, k, {
enumerable: true,
get: function () {
return util[k];
}
});
});
Object.keys(rdf).forEach(function (k) {
if (k !== 'default') Object.defineProperty(exports, k, {
enumerable: true,
get: function () {
return rdf[k];
}
});
});
Object.keys(vocab).forEach(function (k) {
if (k !== 'default') Object.defineProperty(exports, k, {
enumerable: true,
get: function () {
return vocab[k];
}
});
});
Object.keys(sparql).forEach(function (k) {
if (k !== 'default') Object.defineProperty(exports, k, {
enumerable: true,
get: function () {
return sparql[k];
}
});
});
Object.keys(service).forEach(function (k) {
if (k !== 'default') Object.defineProperty(exports, k, {
enumerable: true,
get: function () {
return service[k];
}
});
});
Object.keys(sponate).forEach(function (k) {
if (k !== 'default') Object.defineProperty(exports, k, {
enumerable: true,
get: function () {
return sponate[k];
}
});
});
Object.keys(facete).forEach(function (k) {
if (k !== 'default') Object.defineProperty(exports, k, {
enumerable: true,
get: function () {
return facete[k];
}
});
});

Object.defineProperty(exports, '__esModule', { value: true });

})));
