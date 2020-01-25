'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createCard = createCard;
exports.updateCard = updateCard;
exports.deleteCard = deleteCard;
exports.syncAddressBook = syncAddressBook;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _fuzzy_url_equals = require('./fuzzy_url_equals');

var _fuzzy_url_equals2 = _interopRequireDefault(_fuzzy_url_equals);

var _model = require('./model');

var _namespace = require('./namespace');

var ns = _interopRequireWildcard(_namespace);

var _request = require('./request');

var request = _interopRequireWildcard(_request);

var _webdav = require('./webdav');

var webdav = _interopRequireWildcard(_webdav);

var debug = require('./debug')('dav:contacts');

/**
 * @param {dav.Account} account to fetch address books for.
 */
var listAddressBooks = _co2['default'].wrap(regeneratorRuntime.mark(function callee$0$0(account, options) {
  var req, responses, addressBooks;
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        debug('Fetch address books from home url ' + account.homeUrl);
        req = request.propfind({
          props: [{ name: 'displayname', namespace: ns.DAV }, { name: 'getctag', namespace: ns.CALENDAR_SERVER }, { name: 'resourcetype', namespace: ns.DAV }, { name: 'sync-token', namespace: ns.DAV }],
          depth: 1
        });
        context$1$0.next = 4;
        return options.xhr.send(req, account.homeUrl, {
          sandbox: options.sandbox
        });

      case 4:
        responses = context$1$0.sent;
        addressBooks = responses.filter(function (res) {
          return typeof res.props.displayname === 'string';
        }).map(function (res) {
          debug('Found address book named ' + res.props.displayname + ',\n             props: ' + JSON.stringify(res.props));
          return new _model.AddressBook({
            data: res,
            account: account,
            url: _url2['default'].resolve(account.rootUrl, res.href),
            ctag: res.props.getctag,
            displayName: res.props.displayname,
            resourcetype: res.props.resourcetype,
            syncToken: res.props.syncToken
          });
        });
        context$1$0.next = 8;
        return addressBooks.map(_co2['default'].wrap(regeneratorRuntime.mark(function callee$1$0(addressBook) {
          return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.next = 2;
                return webdav.supportedReportSet(addressBook, options);

              case 2:
                addressBook.reports = context$2$0.sent;

              case 3:
              case 'end':
                return context$2$0.stop();
            }
          }, callee$1$0, this);
        })));

      case 8:
        return context$1$0.abrupt('return', addressBooks);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));

exports.listAddressBooks = listAddressBooks;
/**
 * @param {dav.AddressBook} addressBook the address book to put the object on.
 * @return {Promise} promise will resolve when the card has been created.
 *
 * Options:
 *
 *   (String) data - vcard object.
 *   (String) filename - name for the address book vcf file.
 *   (dav.Sandbox) sandbox - optional request sandbox.
 *   (dav.Transport) xhr - request sender.
 */

function createCard(addressBook, options) {
  var objectUrl = _url2['default'].resolve(addressBook.url, options.filename);
  return webdav.createObject(objectUrl, options.data, options);
}

/**
 * Options:
 *
 *   (dav.Sandbox) sandbox - optional request sandbox.
 */
var listVCards = _co2['default'].wrap(regeneratorRuntime.mark(function callee$0$0(addressBook, options) {
  var req, responses;
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        debug('Doing REPORT on address book ' + addressBook.url + ' which belongs to\n        ' + addressBook.account.credentials.username);

        req = request.addressBookQuery({
          depth: 1,
          props: [{ name: 'getetag', namespace: ns.DAV }, { name: 'address-data', namespace: ns.CARDDAV }]
        });
        context$1$0.next = 4;
        return options.xhr.send(req, addressBook.url, {
          sandbox: options.sandbox
        });

      case 4:
        responses = context$1$0.sent;
        return context$1$0.abrupt('return', responses.map(function (res) {
          debug('Found vcard with url ' + res.href);
          return new _model.VCard({
            data: res,
            addressBook: addressBook,
            url: _url2['default'].resolve(addressBook.account.rootUrl, res.href),
            etag: res.props.getetag,
            addressData: res.props.addressData
          });
        }));

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));

exports.listVCards = listVCards;
/**
 * @param {dav.VCard} card updated vcard object.
 * @return {Promise} promise will resolve when the card has been updated.
 *
 * Options:
 *
 *   (dav.Sandbox) sandbox - optional request sandbox.
 *   (dav.Transport) xhr - request sender.
 */

function updateCard(card, options) {
  return webdav.updateObject(card.url, card.addressData, card.etag, options);
}

/**
 * @param {dav.VCard} card target vcard object.
 * @return {Promise} promise will resolve when the calendar has been deleted.
 *
 * Options:
 *
 *   (dav.Sandbox) sandbox - optional request sandbox.
 *   (dav.Transport) xhr - request sender.
 */

function deleteCard(card, options) {
  return webdav.deleteObject(card.url, card.etag, options);
}

/**
 * @param {dav.Calendar} calendar the calendar to fetch updates to.
 * @return {Promise} promise will resolve with updated calendar object.
 *
 * Options:
 *
 *   (dav.Sandbox) sandbox - optional request sandbox.
 *   (String) syncMethod - either 'basic' or 'webdav'. If unspecified, will
 *       try to do webdav sync and failover to basic sync if rfc 6578 is not
 *       supported by the server.
 *   (dav.Transport) xhr - request sender.
 */

function syncAddressBook(addressBook, options) {
  options.basicSync = basicSync;
  options.webdavSync = webdavSync;
  return webdav.syncCollection(addressBook, options);
}

/**
 * @param {dav.Account} account the account to fetch updates for.
 * @return {Promise} promise will resolve with updated account.
 *
 * Options:
 *
 *   (dav.Sandbox) sandbox - optional request sandbox.
 *   (dav.Transport) xhr - request sender.
 */
var syncCarddavAccount = _co2['default'].wrap(regeneratorRuntime.mark(function callee$0$0(account) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var addressBooks;
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        options.loadObjects = false;

        if (!account.addressBooks) {
          account.addressBooks = [];
        }

        context$1$0.next = 4;
        return listAddressBooks(account, options);

      case 4:
        addressBooks = context$1$0.sent;

        addressBooks.filter(function (addressBook) {
          // Filter the address books not previously seen.
          return account.addressBooks.every(function (prev) {
            return !(0, _fuzzy_url_equals2['default'])(prev.url, addressBook.url);
          });
        }).forEach(function (addressBook) {
          return account.addressBooks.push(addressBook);
        });

        options.loadObjects = true;
        context$1$0.next = 9;
        return account.addressBooks.map(_co2['default'].wrap(regeneratorRuntime.mark(function callee$1$0(addressBook, index) {
          return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.prev = 0;
                context$2$0.next = 3;
                return syncAddressBook(addressBook, options);

              case 3:
                context$2$0.next = 9;
                break;

              case 5:
                context$2$0.prev = 5;
                context$2$0.t0 = context$2$0['catch'](0);

                debug('Syncing ' + addressBook.displayName + ' failed with ' + context$2$0.t0);
                account.addressBooks.splice(index, 1);

              case 9:
              case 'end':
                return context$2$0.stop();
            }
          }, callee$1$0, this, [[0, 5]]);
        })));

      case 9:
        return context$1$0.abrupt('return', account);

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));

exports.syncCarddavAccount = syncCarddavAccount;
var basicSync = _co2['default'].wrap(regeneratorRuntime.mark(function callee$0$0(addressBook, options) {
  var sync;
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        sync = webdav.isCollectionDirty(addressBook, options);

        if (sync) {
          context$1$0.next = 4;
          break;
        }

        debug('Local ctag matched remote! No need to sync :).');
        return context$1$0.abrupt('return', addressBook);

      case 4:

        debug('ctag changed so we need to fetch stuffs.');
        context$1$0.next = 7;
        return listVCards(addressBook, options);

      case 7:
        addressBook.objects = context$1$0.sent;
        return context$1$0.abrupt('return', addressBook);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));

var webdavSync = _co2['default'].wrap(regeneratorRuntime.mark(function callee$0$0(addressBook, options) {
  var req, result;
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        req = request.syncCollection({
          props: [{ name: 'getetag', namespace: ns.DAV }, { name: 'address-data', namespace: ns.CARDDAV }],
          syncLevel: 1,
          syncToken: addressBook.syncToken
        });
        context$1$0.next = 3;
        return options.xhr.send(req, addressBook.url, {
          sandbox: options.sandbox
        });

      case 3:
        result = context$1$0.sent;

        // TODO(gareth): Handle creations and deletions.
        result.responses.forEach(function (response) {
          // Find the vcard that this response corresponds with.
          var vcard = addressBook.objects.filter(function (object) {
            return (0, _fuzzy_url_equals2['default'])(object.url, response.href);
          })[0];

          if (!vcard) return;

          vcard.etag = response.props.getetag;
          vcard.addressData = response.props.addressData;
        });

        addressBook.syncToken = result.syncToken;
        return context$1$0.abrupt('return', addressBook);

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));