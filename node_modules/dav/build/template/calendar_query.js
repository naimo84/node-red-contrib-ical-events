'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = calendarQuery;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _filter = require('./filter');

var _filter2 = _interopRequireDefault(_filter);

var _prop = require('./prop');

var _prop2 = _interopRequireDefault(_prop);

function calendarQuery(object) {
  return '<c:calendar-query xmlns:c="urn:ietf:params:xml:ns:caldav"\n                    xmlns:cs="http://calendarserver.org/ns/"\n                    xmlns:ca="http://apple.com/ns/ical/"\n                    xmlns:d="DAV:">\n    <d:prop>\n      ' + object.props.map(_prop2['default']) + '\n    </d:prop>\n    <c:filter>\n      ' + object.filters.map(_filter2['default']) + '\n    </c:filter>\n    ' + (object.timezone ? '<c:timezone>' + object.timezone + '</c:timezone>' : '') + '\n  </c:calendar-query>';
}

module.exports = exports['default'];