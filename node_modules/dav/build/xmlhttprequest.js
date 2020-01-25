'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var debug = require('./debug')('dav:xmlhttprequest');

var Native = undefined;
if (typeof self !== 'undefined' && 'XMLHttpRequest' in self) {
  Native = self.XMLHttpRequest;
} else {
  // Trick browserify into not loading XMLHttpRequest polyfill
  // since it is available in the platform (including web workers)
  Native = require(false || 'xmlhttprequest').XMLHttpRequest;
}

/**
 * @fileoverview Promise wrapper around native xhr api.
 */

var XMLHttpRequest = (function () {
  function XMLHttpRequest(options) {
    var _this = this;

    _classCallCheck(this, XMLHttpRequest);

    this.request = new Native(options);
    this.sandbox = null;

    /* readwrite */
    ['response', 'responseText', 'responseType', 'responseXML', 'timeout', 'upload', 'withCredentials'].forEach(function (attribute) {
      Object.defineProperty(_this, attribute, {
        get: function get() {
          return this.request[attribute];
        },
        set: function set(value) {
          this.request[attribute] = value;
        }
      });
    });

    /* readonly */
    ['status', 'statusText'].forEach(function (attribute) {
      Object.defineProperty(_this, attribute, {
        get: function get() {
          return this.request[attribute];
        }
      });
    });
  }

  _createClass(XMLHttpRequest, [{
    key: 'abort',
    value: function abort() {
      return this._callNative('abort', arguments);
    }
  }, {
    key: 'getAllResponseHeaders',
    value: function getAllResponseHeaders() {
      return this._callNative('getAllResponseHeaders', arguments);
    }
  }, {
    key: 'getResponseHeader',
    value: function getResponseHeader() {
      return this._callNative('getResponseHeader', arguments);
    }
  }, {
    key: 'open',
    value: function open() {
      return this._callNative('open', arguments);
    }
  }, {
    key: 'overrideMimeType',
    value: function overrideMimeType() {
      return this._callNative('overrideMimeType', arguments);
    }
  }, {
    key: 'setRequestHeader',
    value: function setRequestHeader() {
      return this._callNative('setRequestHeader', arguments);
    }
  }, {
    key: 'send',
    value: function send(data) {
      debug('Sending request data: ' + data);
      if (this.sandbox) this.sandbox.add(this);
      var request = this.request;
      request.send(data);
      return new Promise(function (resolve, reject) {
        request.onreadystatechange = function () {
          if (request.readyState !== 4 /* done */) {
              return;
            }

          if (request.status < 200 || request.status >= 400) {
            return reject(new Error('Bad status: ' + request.status));
          }

          return resolve(request.responseText);
        };

        request.ontimeout = function () {
          reject(new Error('Request timed out after ' + request.timeout + ' ms'));
        };
      });
    }
  }, {
    key: '_callNative',
    value: function _callNative(method, args) {
      return this.request[method].apply(this.request, args);
    }
  }]);

  return XMLHttpRequest;
})();

exports['default'] = XMLHttpRequest;
module.exports = exports['default'];