'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = filter;

function filter(item) {
  if (!item.children || !item.children.length) {
    if (typeof item.value === 'undefined') {
      return '<c:' + item.type + ' ' + formatAttrs(item.attrs) + '/>';
    }
    return '<c:' + item.type + ' ' + formatAttrs(item.attrs) + '>' + item.value + '</c:' + item.type + '>';
  }

  var children = item.children.map(filter);
  return '<c:' + item.type + ' ' + formatAttrs(item.attrs) + '>\n            ' + children + '\n          </c:' + item.type + '>';
}

function formatAttrs(attrs) {
  if (typeof attrs !== 'object') {
    return '';
  }

  return Object.keys(attrs).map(function (attr) {
    return attr + '="' + attrs[attr] + '"';
  }).join(' ');
}
module.exports = exports['default'];