'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _xmlhttprequest = require('./xmlhttprequest');

var _xmlhttprequest2 = _interopRequireDefault(_xmlhttprequest);

var Transport = (function () {
  /**
   * @param {dav.Credentials} credentials user authorization.
   */

  function Transport(credentials) {
    _classCallCheck(this, Transport);

    this.credentials = credentials || null;
  }

  /**
   * @param {dav.Request} request object with request info.
   * @return {Promise} a promise that will be resolved with an xhr request after
   *     its readyState is 4 or the result of applying an optional request
   *     `transformResponse` function to the xhr object after its readyState is 4.
   *
   * Options:
   *
   *   (Object) sandbox - optional request sandbox.
   */

  _createClass(Transport, [{
    key: 'send',
    value: function send() {}
  }]);

  return Transport;
})();

exports.Transport = Transport;

var Basic = (function (_Transport) {
  _inherits(Basic, _Transport);

  /**
   * @param {dav.Credentials} credentials user authorization.
   */

  function Basic(credentials) {
    _classCallCheck(this, Basic);

    _get(Object.getPrototypeOf(Basic.prototype), 'constructor', this).call(this, credentials);
  }

  /**
   * @param {dav.Credentials} credentials user authorization.
   */

  _createClass(Basic, [{
    key: 'send',
    value: function send(request, url, options) {
      return (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        var sandbox, transformRequest, transformResponse, onerror, xhr, result;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              sandbox = options && options.sandbox;
              transformRequest = request.transformRequest;
              transformResponse = request.transformResponse;
              onerror = request.onerror;
              xhr = new _xmlhttprequest2['default']();

              if (sandbox) sandbox.add(xhr);
              xhr.open(request.method, url, true, /* async */
              this.credentials.username, this.credentials.password);

              if (transformRequest) transformRequest(xhr);

              result = undefined;
              context$3$0.prev = 9;
              context$3$0.next = 12;
              return xhr.send(request.requestData);

            case 12:
              result = transformResponse ? transformResponse(xhr) : xhr;
              context$3$0.next = 19;
              break;

            case 15:
              context$3$0.prev = 15;
              context$3$0.t0 = context$3$0['catch'](9);

              if (onerror) onerror(context$3$0.t0);
              throw context$3$0.t0;

            case 19:
              return context$3$0.abrupt('return', result);

            case 20:
            case 'end':
              return context$3$0.stop();
          }
        }, callee$2$0, this, [[9, 15]]);
      }).bind(this));
    }
  }]);

  return Basic;
})(Transport);

exports.Basic = Basic;

var OAuth2 = (function (_Transport2) {
  _inherits(OAuth2, _Transport2);

  function OAuth2(credentials) {
    _classCallCheck(this, OAuth2);

    _get(Object.getPrototypeOf(OAuth2.prototype), 'constructor', this).call(this, credentials);
  }

  /**
   * @return {Promise} promise that will resolve with access token.
   */

  _createClass(OAuth2, [{
    key: 'send',
    value: function send(request, url) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return (0, _co2['default'])(regeneratorRuntime.mark(function callee$2$0() {
        var sandbox, transformRequest, transformResponse, onerror, result, xhr, token;
        return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              sandbox = options.sandbox;
              transformRequest = request.transformRequest;
              transformResponse = request.transformResponse;
              onerror = request.onerror;

              if (!('retry' in options)) options.retry = true;

              result = undefined, xhr = undefined;
              context$3$0.prev = 6;
              context$3$0.next = 9;
              return access(this.credentials, options);

            case 9:
              token = context$3$0.sent;

              xhr = new _xmlhttprequest2['default']();
              if (sandbox) sandbox.add(xhr);
              xhr.open(request.method, url, true /* async */);
              xhr.setRequestHeader('Authorization', 'Bearer ' + token);
              if (transformRequest) transformRequest(xhr);
              context$3$0.next = 17;
              return xhr.send(request.requestData);

            case 17:
              result = transformResponse ? transformResponse(xhr) : xhr;
              context$3$0.next = 28;
              break;

            case 20:
              context$3$0.prev = 20;
              context$3$0.t0 = context$3$0['catch'](6);

              if (!(options.retry && xhr.status === 401)) {
                context$3$0.next = 26;
                break;
              }

              // Force expiration.
              this.credentials.expiration = 0;
              // Retry once at most.
              options.retry = false;
              return context$3$0.abrupt('return', this.send(request, url, options));

            case 26:

              if (onerror) onerror(context$3$0.t0);
              throw context$3$0.t0;

            case 28:
              return context$3$0.abrupt('return', result);

            case 29:
            case 'end':
              return context$3$0.stop();
          }
        }, callee$2$0, this, [[6, 20]]);
      }).bind(this));
    }
  }]);

  return OAuth2;
})(Transport);

exports.OAuth2 = OAuth2;
function access(credentials, options) {
  if (!credentials.accessToken) {
    return getAccessToken(credentials, options);
  }

  if (credentials.refreshToken && isExpired(credentials)) {
    return refreshAccessToken(credentials, options);
  }

  return Promise.resolve(credentials.accessToken);
}

function isExpired(credentials) {
  return typeof credentials.expiration === 'number' && Date.now() > credentials.expiration;
}

var getAccessToken = _co2['default'].wrap(regeneratorRuntime.mark(function callee$0$0(credentials, options) {
  var sandbox, xhr, data, now, response;
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        sandbox = options.sandbox;
        xhr = new _xmlhttprequest2['default']();

        if (sandbox) sandbox.add(xhr);
        xhr.open('POST', credentials.tokenUrl, true /* async */);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        data = _querystring2['default'].stringify({
          code: credentials.authorizationCode,
          redirect_uri: credentials.redirectUrl,
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          grant_type: 'authorization_code'
        });
        now = Date.now();
        context$1$0.next = 9;
        return xhr.send(data);

      case 9:
        response = JSON.parse(xhr.responseText);

        credentials.accessToken = response.access_token;
        credentials.refreshToken = 'refresh_token' in response ? response.refresh_token : null;
        credentials.expiration = 'expires_in' in response ? now + response.expires_in : null;

        return context$1$0.abrupt('return', response.access_token);

      case 14:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));

var refreshAccessToken = _co2['default'].wrap(regeneratorRuntime.mark(function callee$0$0(credentials, options) {
  var sandbox, xhr, data, now, response;
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        sandbox = options.sandbox;
        xhr = new _xmlhttprequest2['default']();

        if (sandbox) sandbox.add(xhr);
        xhr.open('POST', credentials.tokenUrl, true /* async */);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        data = _querystring2['default'].stringify({
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          refresh_token: credentials.refreshToken,
          grant_type: 'refresh_token'
        });
        now = Date.now();
        context$1$0.next = 9;
        return xhr.send(data);

      case 9:
        response = JSON.parse(xhr.responseText);

        credentials.accessToken = response.access_token;
        credentials.expiration = 'expires_in' in response ? now + response.expires_in : null;

        return context$1$0.abrupt('return', response.access_token);

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));