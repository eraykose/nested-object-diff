(function(a,b){if("function"==typeof define&&define.amd)define(["exports"],b);else if("undefined"!=typeof exports)b(exports);else{var c={exports:{}};b(c.exports),a.index=c.exports}})(this,function(a){"use strict";function b(a){return b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},b(a)}function c(a,c){return c&&("object"===b(c)||"function"==typeof c)?c:d(a)}function d(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function e(a){return e=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},e(a)}function f(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&g(a,b)}function g(a,b){return g=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},g(a,b)}function h(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(a,"__esModule",{value:!0}),a.diff=void 0;var i=function a(b,c){h(this,a),this.type=b,this.path=c?c.toString():""},j=/*#__PURE__*/function(a){function b(a,d,f){var g;return h(this,b),g=c(this,e(b).call(this,"E",a)),g.lhs=d,g.rhs=f,g}return f(b,a),b}(i),k=/*#__PURE__*/function(a){function b(a,d,f,g){var i;return h(this,b),i=c(this,e(b).call(this,"M",a)),i.item=d,i.lhsIndex=f,i.rhsIndex=g,i}return f(b,a),b}(i),l=/*#__PURE__*/function(a){function b(a,d){var f;return h(this,b),f=c(this,e(b).call(this,"D",a)),f.lhs=d,f}return f(b,a),b}(i),m=/*#__PURE__*/function(a){function b(a,d){var f;return h(this,b),f=c(this,e(b).call(this,"A",a)),f.rhs=d,f}return f(b,a),b}(i),n=function(a,b){return a?"".concat(a,".").concat(b):b};a.diff=function diff(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},d=[],e=c.matchKey,f=c.types||["E","A","D","M"],g=function(a,b,c,e){a.forEach(function(a,g){var i=b.findIndex(function(b){return b[e]===a[e]});-1<i?(-1<f.indexOf("M")&&g!==i&&d.push(new k(c,a,g,i)),h(a,b[i],n(c,i))):-1<f.indexOf("D")&&d.push(new l(c,a))}),b.forEach(function(b,g){var h=a.findIndex(function(a){return b[e]===a[e]});-1<f.indexOf("A")&&-1===h&&d.push(new m(n(c,g),b))})},h=function(a,b,c){var i=Object.prototype.toString.call(a),k=Object.prototype.toString.call(b);if(-1<f.indexOf("E")&&i!==k)return d.push(new j(c,a,b)),!1;if("[object Object]"===i)Object.getOwnPropertyNames(a).forEach(function(e){Object.prototype.hasOwnProperty.call(b,e)?h(a[e],b[e],n(c,e)):-1<f.indexOf("D")&&d.push(new l(n(c,e),a[e]))}),Object.getOwnPropertyNames(b).forEach(function(e){-1<f.indexOf("A")&&!Object.prototype.hasOwnProperty.call(a,e)&&d.push(new m(n(c,e),b[e]))});else if("[object Array]"!==i)-1<f.indexOf("E")&&a!==b&&d.push(new j(c,a,b));else if(!e){var o=a.length-1,p=b.length-1;if(-1<f.indexOf("D"))for(;o>p;)d.push(new l(n(c,o),a[o--]));if(-1<f.indexOf("A"))for(;p>o;)d.push(new m(n(c,p),b[p--]));for(;0<=o;--o)h(a[o],b[o],n(c,o))}else g(a,b,c,e)};return h(a,b),d}});