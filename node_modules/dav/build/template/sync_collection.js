'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = syncCollection;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _prop = require('./prop');

var _prop2 = _interopRequireDefault(_prop);

function syncCollection(object) {
  return '<d:sync-collection xmlns:c="urn:ietf:params:xml:ns:caldav"\n                     xmlns:card="urn:ietf:params:xml:ns:carddav"\n                     xmlns:d="DAV:">\n    <d:sync-level>' + object.syncLevel + '</d:sync-level>\n    <d:sync-token>' + object.syncToken + '</d:sync-token>\n    <d:prop>\n      ' + object.props.map(_prop2['default']) + '\n    </d:prop>\n  </d:sync-collection>';
}

module.exports = exports['default'];