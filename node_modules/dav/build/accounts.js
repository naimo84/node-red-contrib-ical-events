'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _calendars = require('./calendars');

var _contacts = require('./contacts');

var _fuzzy_url_equals = require('./fuzzy_url_equals');

var _fuzzy_url_equals2 = _interopRequireDefault(_fuzzy_url_equals);

var _model = require('./model');

var _namespace = require('./namespace');

var ns = _interopRequireWildcard(_namespace);

var _request = require('./request');

var request = _interopRequireWildcard(_request);

var debug = require('./debug')('dav:accounts');

var defaults = {
  accountType: 'caldav',
  loadCollections: true,
  loadObjects: false
};

/**
 * rfc 6764.
 *
 * @param {dav.Account} account to find root url for.
 */
var serviceDiscovery = _co2['default'].wrap(regeneratorRuntime.mark(function callee$0$0(account, options) {
  var endpoint, uri, req, xhr, _location;

  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        debug('Attempt service discovery.');

        endpoint = _url2['default'].parse(account.server);

        endpoint.protocol = endpoint.protocol || 'http'; // TODO(gareth) https?

        uri = _url2['default'].format({
          protocol: endpoint.protocol,
          host: endpoint.host,
          pathname: '/.well-known/' + options.accountType
        });
        req = request.basic({ method: 'GET' });
        context$1$0.prev = 5;
        context$1$0.next = 8;
        return options.xhr.send(req, uri, { sandbox: options.sandbox });

      case 8:
        xhr = context$1$0.sent;

        if (!(xhr.status >= 300 && xhr.status < 400)) {
          context$1$0.next = 14;
          break;
        }

        _location = xhr.getResponseHeader('Location');

        if (!(typeof _location === 'string' && _location.length)) {
          context$1$0.next = 14;
          break;
        }

        debug('Discovery redirected to ' + _location);
        return context$1$0.abrupt('return', _url2['default'].format({
          protocol: endpoint.protocol,
          host: endpoint.host,
          pathname: _location
        }));

      case 14:
        context$1$0.next = 19;
        break;

      case 16:
        context$1$0.prev = 16;
        context$1$0.t0 = context$1$0['catch'](5);

        debug('Discovery failed... failover to the provided url');

      case 19:
        return context$1$0.abrupt('return', endpoint.href);

      case 20:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this, [[5, 16]]);
}));

/**
 * rfc 5397.
 *
 * @param {dav.Account} account to get principal url for.
 */
var principalUrl = _co2['default'].wrap(regeneratorRuntime.mark(function callee$0$0(account, options) {
  var req, res, container;
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        debug('Fetch principal url from context path ' + account.rootUrl + '.');
        req = request.propfind({
          props: [{ name: 'current-user-principal', namespace: ns.DAV }],
          depth: 0,
          mergeResponses: true
        });
        context$1$0.next = 4;
        return options.xhr.send(req, account.rootUrl, {
          sandbox: options.sandbox
        });

      case 4:
        res = context$1$0.sent;
        container = res.props;

        debug('Received principal: ' + container.currentUserPrincipal);
        return context$1$0.abrupt('return', _url2['default'].resolve(account.rootUrl, container.currentUserPrincipal));

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));

/**
 * @param {dav.Account} account to get home url for.
 */
var homeUrl = _co2['default'].wrap(regeneratorRuntime.mark(function callee$0$0(account, options) {
  var prop, req, responses, response, container, href;
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        debug('Fetch home url from principal url ' + account.principalUrl + '.');
        prop = undefined;

        if (options.accountType === 'caldav') {
          prop = { name: 'calendar-home-set', namespace: ns.CALDAV };
        } else if (options.accountType === 'carddav') {
          prop = { name: 'addressbook-home-set', namespace: ns.CARDDAV };
        }

        req = request.propfind({ props: [prop] });
        context$1$0.next = 6;
        return options.xhr.send(req, account.principalUrl, {
          sandbox: options.sandbox
        });

      case 6:
        responses = context$1$0.sent;
        response = responses.find(function (response) {
          return (0, _fuzzy_url_equals2['default'])(account.principalUrl, response.href);
        });
        container = response.props;
        href = undefined;

        if (options.accountType === 'caldav') {
          debug('Received home: ' + container.calendarHomeSet);
          href = container.calendarHomeSet;
        } else if (options.accountType === 'carddav') {
          debug('Received home: ' + container.addressbookHomeSet);
          href = container.addressbookHomeSet;
        }

        return context$1$0.abrupt('return', _url2['default'].resolve(account.rootUrl, href));

      case 12:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));

/**
 * Options:
 *
 *   (String) accountType - one of 'caldav' or 'carddav'. Defaults to 'caldav'.
 *   (Array.<Object>) filters - list of caldav filters to send with request.
 *   (Boolean) loadCollections - whether or not to load dav collections.
 *   (Boolean) loadObjects - whether or not to load dav objects.
 *   (dav.Sandbox) sandbox - optional request sandbox.
 *   (String) server - some url for server (needn't be base url).
 *   (String) timezone - VTIMEZONE calendar object.
 *   (dav.Transport) xhr - request sender.
 *
 * @return {Promise} a promise that will resolve with a dav.Account object.
 */
exports.createAccount = _co2['default'].wrap(regeneratorRuntime.mark(function callee$0$0(options) {
  var account, key, loadCollections, loadObjects, collections;
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        options = Object.assign({}, defaults, options);
        if (typeof options.loadObjects !== 'boolean') {
          options.loadObjects = options.loadCollections;
        }

        account = new _model.Account({
          server: options.server,
          credentials: options.xhr.credentials
        });
        context$1$0.next = 5;
        return serviceDiscovery(account, options);

      case 5:
        account.rootUrl = context$1$0.sent;
        context$1$0.next = 8;
        return principalUrl(account, options);

      case 8:
        account.principalUrl = context$1$0.sent;
        context$1$0.next = 11;
        return homeUrl(account, options);

      case 11:
        account.homeUrl = context$1$0.sent;

        if (options.loadCollections) {
          context$1$0.next = 14;
          break;
        }

        return context$1$0.abrupt('return', account);

      case 14:
        key = undefined, loadCollections = undefined, loadObjects = undefined;

        if (options.accountType === 'caldav') {
          key = 'calendars';
          loadCollections = _calendars.listCalendars;
          loadObjects = _calendars.listCalendarObjects;
        } else if (options.accountType === 'carddav') {
          key = 'addressBooks';
          loadCollections = _contacts.listAddressBooks;
          loadObjects = _contacts.listVCards;
        }

        context$1$0.next = 18;
        return loadCollections(account, options);

      case 18:
        collections = context$1$0.sent;

        account[key] = collections;

        if (options.loadObjects) {
          context$1$0.next = 22;
          break;
        }

        return context$1$0.abrupt('return', account);

      case 22:
        context$1$0.next = 24;
        return collections.map(_co2['default'].wrap(regeneratorRuntime.mark(function callee$1$0(collection) {
          return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.prev = 0;
                context$2$0.next = 3;
                return loadObjects(collection, options);

              case 3:
                collection.objects = context$2$0.sent;
                context$2$0.next = 9;
                break;

              case 6:
                context$2$0.prev = 6;
                context$2$0.t0 = context$2$0['catch'](0);

                collection.error = context$2$0.t0;

              case 9:
              case 'end':
                return context$2$0.stop();
            }
          }, callee$1$0, this, [[0, 6]]);
        })));

      case 24:

        account[key] = account[key].filter(function (collection) {
          return !collection.error;
        });

        return context$1$0.abrupt('return', account);

      case 26:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));

// http redirect.