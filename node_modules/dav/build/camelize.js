/**
 * @fileoverview Camelcase something.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = camelize;

function camelize(str) {
  var delimiter = arguments.length <= 1 || arguments[1] === undefined ? '_' : arguments[1];

  var words = str.split(delimiter);
  return [words[0]].concat(words.slice(1).map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  })).join('');
}

module.exports = exports['default'];