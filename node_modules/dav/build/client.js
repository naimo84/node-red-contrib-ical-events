'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _accounts = require('./accounts');

var accounts = _interopRequireWildcard(_accounts);

var _calendars = require('./calendars');

var calendars = _interopRequireWildcard(_calendars);

var _contacts = require('./contacts');

var contacts = _interopRequireWildcard(_contacts);

/**
 * @param {dav.Transport} xhr - request sender.
 *
 * Options:
 *
 *   (String) baseUrl - root url to resolve relative request urls with.
 */

var Client = (function () {
  function Client(xhr) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Client);

    this.xhr = xhr;
    Object.assign(this, options);

    // Expose internal modules for unit testing
    this._accounts = accounts;
    this._calendars = calendars;
    this._contacts = contacts;
  }

  /**
   * @param {dav.Request} req - dav request.
   * @param {String} uri - where to send request.
   * @return {Promise} a promise that will be resolved with an xhr request
   *     after its readyState is 4 or the result of applying an optional
   *     request `transformResponse` function to the xhr object after its
   *     readyState is 4.
   *
   * Options:
   *
   *   (Object) sandbox - optional request sandbox.
   */

  _createClass(Client, [{
    key: 'send',
    value: function send(req, uri, options) {
      if (this.baseUrl) {
        var urlObj = _url2['default'].parse(uri);
        uri = _url2['default'].resolve(this.baseUrl, urlObj.path);
      }

      return this.xhr.send(req, uri, options);
    }
  }, {
    key: 'createAccount',
    value: function createAccount() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      options.xhr = options.xhr || this.xhr;
      return accounts.createAccount(options);
    }
  }, {
    key: 'createCalendarObject',
    value: function createCalendarObject(calendar) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      options.xhr = options.xhr || this.xhr;
      return calendars.createCalendarObject(calendar, options);
    }
  }, {
    key: 'updateCalendarObject',
    value: function updateCalendarObject(calendarObject) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      options.xhr = options.xhr || this.xhr;
      return calendars.updateCalendarObject(calendarObject, options);
    }
  }, {
    key: 'deleteCalendarObject',
    value: function deleteCalendarObject(calendarObject) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      options.xhr = options.xhr || this.xhr;
      return calendars.deleteCalendarObject(calendarObject, options);
    }
  }, {
    key: 'syncCalendar',
    value: function syncCalendar(calendar) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      options.xhr = options.xhr || this.xhr;
      return calendars.syncCalendar(calendar, options);
    }
  }, {
    key: 'syncCaldavAccount',
    value: function syncCaldavAccount(account) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      options.xhr = options.xhr || this.xhr;
      return calendars.syncCaldavAccount(account, options);
    }
  }, {
    key: 'createCard',
    value: function createCard(addressBook) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      options.xhr = options.xhr || this.xhr;
      return contacts.createCard(addressBook, options);
    }
  }, {
    key: 'updateCard',
    value: function updateCard(card) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      options.xhr = options.xhr || this.xhr;
      return contacts.updateCard(card, options);
    }
  }, {
    key: 'deleteCard',
    value: function deleteCard(card) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      options.xhr = options.xhr || this.xhr;
      return contacts.deleteCard(card, options);
    }
  }, {
    key: 'syncAddressBook',
    value: function syncAddressBook(addressBook) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      options.xhr = options.xhr || this.xhr;
      return contacts.syncAddressBook(addressBook, options);
    }
  }, {
    key: 'syncCarddavAccount',
    value: function syncCarddavAccount(account) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      options.xhr = options.xhr || this.xhr;
      return contacts.syncCarddavAccount(account, options);
    }
  }]);

  return Client;
})();

exports.Client = Client;