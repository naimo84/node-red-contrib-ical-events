'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createObject = createObject;
exports.updateObject = updateObject;
exports.deleteObject = deleteObject;
exports.syncCollection = syncCollection;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _fuzzy_url_equals = require('./fuzzy_url_equals');

var _fuzzy_url_equals2 = _interopRequireDefault(_fuzzy_url_equals);

var _namespace = require('./namespace');

var ns = _interopRequireWildcard(_namespace);

var _request = require('./request');

var request = _interopRequireWildcard(_request);

var debug = require('./debug')('dav:webdav');

/**
 * @param {String} objectUrl url for webdav object.
 * @param {String} objectData webdav object data.
 */

function createObject(objectUrl, objectData, options) {
  var req = request.basic({ method: 'PUT', data: objectData, contentType: options.contentType });
  return options.xhr.send(req, objectUrl, { sandbox: options.sandbox });
}

function updateObject(objectUrl, objectData, etag, options) {
  var req = request.basic({ method: 'PUT', data: objectData, etag: etag, contentType: options.contentType });
  return options.xhr.send(req, objectUrl, { sandbox: options.sandbox });
}

function deleteObject(objectUrl, etag, options) {
  var req = request.basic({ method: 'DELETE', etag: etag });
  return options.xhr.send(req, objectUrl, { sandbox: options.sandbox });
}

function syncCollection(collection, options) {
  var syncMethod = undefined;
  if ('syncMethod' in options) {
    syncMethod = options.syncMethod;
  } else if (collection.reports && collection.reports.indexOf('syncCollection') !== -1) {
    syncMethod = 'webdav';
  } else {
    syncMethod = 'basic';
  }

  if (syncMethod === 'webdav') {
    debug('rfc 6578 sync.');
    return options.webdavSync(collection, options);
  } else {
    debug('basic sync.');
    return options.basicSync(collection, options);
  }
}

/**
 * @param {dav.DAVCollection} collection to fetch report set for.
 */
var supportedReportSet = _co2['default'].wrap(regeneratorRuntime.mark(function callee$0$0(collection, options) {
  var req, response;
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        debug('Checking supported report set for collection at ' + collection.url);
        req = request.propfind({
          props: [{ name: 'supported-report-set', namespace: ns.DAV }],
          depth: 1,
          mergeResponses: true
        });
        context$1$0.next = 4;
        return options.xhr.send(req, collection.url, {
          sandbox: options.sandbox
        });

      case 4:
        response = context$1$0.sent;
        return context$1$0.abrupt('return', response.props.supportedReportSet);

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));

exports.supportedReportSet = supportedReportSet;
var isCollectionDirty = _co2['default'].wrap(regeneratorRuntime.mark(function callee$0$0(collection, options) {
  var req, responses, response;
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (collection.ctag) {
          context$1$0.next = 3;
          break;
        }

        debug('Missing ctag.');
        return context$1$0.abrupt('return', false);

      case 3:

        debug('Fetch remote getctag prop.');
        req = request.propfind({
          props: [{ name: 'getctag', namespace: ns.CALENDAR_SERVER }],
          depth: 0
        });
        context$1$0.next = 7;
        return options.xhr.send(req, collection.account.homeUrl, {
          sandbox: options.sandbox
        });

      case 7:
        responses = context$1$0.sent;
        response = responses.filter(function (response) {
          // Find the response that corresponds to the parameter collection.
          return (0, _fuzzy_url_equals2['default'])(collection.url, response.href);
        })[0];

        if (response) {
          context$1$0.next = 11;
          break;
        }

        throw new Error('Could not find collection on remote. Was it deleted?');

      case 11:

        debug('Check whether cached ctag matches remote.');
        return context$1$0.abrupt('return', collection.ctag !== response.props.getctag);

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));
exports.isCollectionDirty = isCollectionDirty;