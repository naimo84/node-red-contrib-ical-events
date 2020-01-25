'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = addressBookQuery;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _prop = require('./prop');

var _prop2 = _interopRequireDefault(_prop);

function addressBookQuery(object) {
  return '<card:addressbook-query xmlns:card="urn:ietf:params:xml:ns:carddav"\n                          xmlns:d="DAV:">\n    <d:prop>\n      ' + object.props.map(_prop2['default']) + '\n    </d:prop>\n    <!-- According to http://stackoverflow.com/questions/23742568/google-carddav-api-addressbook-multiget-returns-400-bad-request,\n         Google\'s CardDAV server requires a filter element. I don\'t think all addressbook-query calls need a filter in the spec though? -->\n    <card:filter>\n      <card:prop-filter name="FN">\n      </card:prop-filter>\n    </card:filter>\n  </card:addressbook-query>';
}

module.exports = exports['default'];