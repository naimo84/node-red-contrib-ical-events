'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

var _namespace = require('./namespace');

var ns = _interopRequireWildcard(_namespace);

var _request = require('./request');

var request = _interopRequireWildcard(_request);

var _transport = require('./transport');

var transport = _interopRequireWildcard(_transport);

var _package = require('../package');

Object.defineProperty(exports, 'version', {
  enumerable: true,
  get: function get() {
    return _package.version;
  }
});

var _accounts = require('./accounts');

Object.defineProperty(exports, 'createAccount', {
  enumerable: true,
  get: function get() {
    return _accounts.createAccount;
  }
});

var _calendars = require('./calendars');

_defaults(exports, _interopExportWildcard(_calendars, _defaults));

var _client = require('./client');

Object.defineProperty(exports, 'Client', {
  enumerable: true,
  get: function get() {
    return _client.Client;
  }
});

var _contacts = require('./contacts');

_defaults(exports, _interopExportWildcard(_contacts, _defaults));

var _model = require('./model');

_defaults(exports, _interopExportWildcard(_model, _defaults));

Object.defineProperty(exports, 'Request', {
  enumerable: true,
  get: function get() {
    return _request.Request;
  }
});

var _sandbox = require('./sandbox');

Object.defineProperty(exports, 'Sandbox', {
  enumerable: true,
  get: function get() {
    return _sandbox.Sandbox;
  }
});
Object.defineProperty(exports, 'createSandbox', {
  enumerable: true,
  get: function get() {
    return _sandbox.createSandbox;
  }
});
exports.debug = _debug2['default'];
exports.ns = ns;
exports.request = request;
exports.transport = transport;