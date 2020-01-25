'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = propfind;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _prop = require('./prop');

var _prop2 = _interopRequireDefault(_prop);

function propfind(object) {
  return '<d:propfind xmlns:c="urn:ietf:params:xml:ns:caldav"\n              xmlns:card="urn:ietf:params:xml:ns:carddav"\n              xmlns:cs="http://calendarserver.org/ns/"\n              xmlns:ca="http://apple.com/ns/ical/"\n              xmlns:d="DAV:">\n    <d:prop>\n      ' + object.props.map(_prop2['default']) + '\n    </d:prop>\n  </d:propfind>';
}

module.exports = exports['default'];