'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.addressBookQuery = addressBookQuery;
exports.basic = basic;
exports.calendarQuery = calendarQuery;
exports.collectionQuery = collectionQuery;
exports.propfind = propfind;
exports.syncCollection = syncCollection;
exports.mergeProps = mergeProps;
exports.getProps = getProps;
exports.setRequestHeaders = setRequestHeaders;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _parser = require('./parser');

var _template = require('./template');

var template = _interopRequireWildcard(_template);

/**
 * Options:
 *
 *   (String) depth - optional value for Depth header.
 *   (Array.<Object>) props - list of props to request.
 */

function addressBookQuery(options) {
  return collectionQuery(template.addressBookQuery({ props: options.props || [] }), { depth: options.depth });
}

/**
 * Options:
 *
 *   (String) data - put request body.
 *   (String) method - http method.
 *   (String) etag - cached calendar object etag.
 */

function basic(options) {
  function transformRequest(xhr) {
    setRequestHeaders(xhr, options);
  }

  return new Request({
    method: options.method,
    requestData: options.data,
    transformRequest: transformRequest
  });
}

/**
 * Options:
 *
 *   (String) depth - optional value for Depth header.
 *   (Array.<Object>) filters - list of filters to send with request.
 *   (Array.<Object>) props - list of props to request.
 *   (String) timezone - VTIMEZONE calendar object.
 */

function calendarQuery(options) {
  return collectionQuery(template.calendarQuery({
    props: options.props || [],
    filters: options.filters || [],
    timezone: options.timezone
  }), {
    depth: options.depth
  });
}

function collectionQuery(requestData, options) {
  function transformRequest(xhr) {
    setRequestHeaders(xhr, options);
  }

  function transformResponse(xhr) {
    return (0, _parser.multistatus)(xhr.responseText).response.map(function (res) {
      return { href: res.href, props: getProps(res.propstat) };
    });
  }

  return new Request({
    method: 'REPORT',
    requestData: requestData,
    transformRequest: transformRequest,
    transformResponse: transformResponse
  });
}

/**
 * Options:
 *
 *   (String) depth - optional value for Depth header.
 *   (Array.<Object>) props - list of props to request.
 */

function propfind(options) {
  var requestData = template.propfind({ props: options.props });

  function transformRequest(xhr) {
    setRequestHeaders(xhr, options);
  }

  function transformResponse(xhr) {
    var responses = (0, _parser.multistatus)(xhr.responseText).response.map(function (res) {
      return { href: res.href, props: getProps(res.propstat) };
    });

    if (!options.mergeResponses) {
      return responses;
    }

    // Merge the props.
    var merged = mergeProps(responses.map(function (res) {
      return res.props;
    }));
    var hrefs = responses.map(function (res) {
      return res.href;
    });
    return { props: merged, hrefs: hrefs };
  }

  return new Request({
    method: 'PROPFIND',
    requestData: requestData,
    transformRequest: transformRequest,
    transformResponse: transformResponse
  });
}

/**
 * Options:
 *
 *   (String) depth - option value for Depth header.
 *   (Array.<Object>) props - list of props to request.
 *   (Number) syncLevel - indicates scope of the sync report request.
 *   (String) syncToken - synchronization token provided by the server.
 */

function syncCollection(options) {
  var requestData = template.syncCollection({
    props: options.props,
    syncLevel: options.syncLevel,
    syncToken: options.syncToken
  });

  function transformRequest(xhr) {
    setRequestHeaders(xhr, options);
  }

  function transformResponse(xhr) {
    var object = (0, _parser.multistatus)(xhr.responseText);
    var responses = object.response.map(function (res) {
      return { href: res.href, props: getProps(res.propstat) };
    });

    return { responses: responses, syncToken: object.syncToken };
  }

  return new Request({
    method: 'REPORT',
    requestData: requestData,
    transformRequest: transformRequest,
    transformResponse: transformResponse
  });
}

var Request = function Request() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _classCallCheck(this, Request);

  Object.assign(this, {
    method: null,
    requestData: null,
    transformRequest: null,
    transformResponse: null,
    onerror: null
  }, options);
};

exports.Request = Request;

function getProp(propstat) {
  if (/404/g.test(propstat.status)) {
    return null;
  }
  if (/5\d{2}/g.test(propstat.status) || /4\d{2}/g.test(propstat.status)) {
    throw new Error('Bad status on propstat: ' + propstat.status);
  }

  return 'prop' in propstat ? propstat.prop : null;
}

function mergeProps(props) {
  return props.reduce(function (a, b) {
    return Object.assign(a, b);
  }, {});
}

/**
 * Map propstats to props.
 */

function getProps(propstats) {
  return mergeProps(propstats.map(getProp).filter(function (prop) {
    return prop && typeof prop === 'object';
  }));
}

function setRequestHeaders(request, options) {
  request.setRequestHeader('Content-Type', options.contentType || 'application/xml;charset=utf-8');

  if ('depth' in options) {
    request.setRequestHeader('Depth', options.depth);
  }

  if ('etag' in options && options.etag) {
    request.setRequestHeader('If-Match', options.etag);
  }
}