/**
 * @fileoverview Group requests together and then abort as a group.
 *
 * var sandbox = new dav.Sandbox();
 * return Promise.all([
 *   dav.createEvent(event, { sandbox: sandbox }),
 *   dav.deleteEvent(other, { sandbox: sandbox })
 * ])
 * .catch(function() {
 *   // Something went wrong so abort all requests.
 *   sandbox.abort;
 * });
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.createSandbox = createSandbox;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var debug = require('./debug')('dav:sandbox');

var Sandbox = (function () {
  function Sandbox() {
    _classCallCheck(this, Sandbox);

    this.requestList = [];
  }

  _createClass(Sandbox, [{
    key: 'add',
    value: function add(request) {
      debug('Adding request to sandbox.');
      this.requestList.push(request);
    }
  }, {
    key: 'abort',
    value: function abort() {
      debug('Aborting sandboxed requests.');
      this.requestList.forEach(function (request) {
        return request.abort();
      });
    }
  }]);

  return Sandbox;
})();

exports.Sandbox = Sandbox;

function createSandbox() {
  return new Sandbox();
}