'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.multistatus = multistatus;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _camelize = require('./camelize');

var _camelize2 = _interopRequireDefault(_camelize);

var debug = require('./debug')('dav:parser');

var DOMParser = undefined;
if (typeof self !== 'undefined' && 'DOMParser' in self) {
  // browser main thread
  DOMParser = self.DOMParser;
} else {
  // nodejs or web worker
  DOMParser = require('xmldom').DOMParser;
}

function multistatus(string) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(string, 'text/xml');
  var result = traverse.multistatus(child(doc, 'multistatus'));
  debug('input:\n' + string + '\noutput:\n' + JSON.stringify(result) + '\n');
  return result;
}

var traverse = {
  // { response: [x, y, z] }
  multistatus: function multistatus(node) {
    return complex(node, { response: true });
  },

  // { propstat: [x, y, z] }
  response: function response(node) {
    return complex(node, { propstat: true, href: false });
  },

  // { prop: x }
  propstat: function propstat(node) {
    return complex(node, { prop: false });
  },

  // {
  //   resourcetype: x
  //   supportedCalendarComponentSet: y,
  //   supportedReportSet: z
  // }
  prop: function prop(node) {
    return complex(node, {
      resourcetype: false,
      supportedCalendarComponentSet: false,
      supportedReportSet: false,
      currentUserPrincipal: false
    });
  },

  resourcetype: function resourcetype(node) {
    return childNodes(node).map(function (childNode) {
      return childNode.localName;
    });
  },

  // [x, y, z]
  supportedCalendarComponentSet: function supportedCalendarComponentSet(node) {
    return complex(node, { comp: true }, 'comp');
  },

  // [x, y, z]
  supportedReportSet: function supportedReportSet(node) {
    return complex(node, { supportedReport: true }, 'supportedReport');
  },

  comp: function comp(node) {
    return node.getAttribute('name');
  },

  // x
  supportedReport: function supportedReport(node) {
    return complex(node, { report: false }, 'report');
  },

  report: function report(node) {
    return childNodes(node).map(function (childNode) {
      return childNode.localName;
    });
  },

  href: function href(node) {
    return decodeURIComponent(childNodes(node)[0].nodeValue);
  },

  currentUserPrincipal: function currentUserPrincipal(node) {
    return complex(node, { href: false }, 'href');
  }
};

function complex(node, childspec, collapse) {
  var result = {};
  for (var key in childspec) {
    if (childspec[key]) {
      // Create array since we're expecting multiple.
      result[key] = [];
    }
  }

  childNodes(node).forEach(function (childNode) {
    return traverseChild(node, childNode, childspec, result);
  });

  return maybeCollapse(result, childspec, collapse);
}

/**
 * Parse child childNode of node with childspec and write outcome to result.
 */
function traverseChild(node, childNode, childspec, result) {
  if (childNode.nodeType === 3 && /^\s+$/.test(childNode.nodeValue)) {
    // Whitespace... nothing to do.
    return;
  }

  var localName = (0, _camelize2['default'])(childNode.localName, '-');
  if (!(localName in childspec)) {
    debug('Unexpected node of type ' + localName + ' encountered while ' + 'parsing ' + node.localName + ' node!');
    var value = childNode.textContent;
    if (localName in result) {
      if (!Array.isArray(result[localName])) {
        // Since we've already encountered this node type and we haven't yet
        // made an array for it, make an array now.
        result[localName] = [result[localName]];
      }

      result[localName].push(value);
      return;
    }

    // First time we're encountering this node.
    result[localName] = value;
    return;
  }

  var traversal = traverse[localName](childNode);
  if (childspec[localName]) {
    // Expect multiple.
    result[localName].push(traversal);
  } else {
    // Expect single.
    result[localName] = traversal;
  }
}

function maybeCollapse(result, childspec, collapse) {
  if (!collapse) {
    return result;
  }

  if (!childspec[collapse]) {
    return result[collapse];
  }

  // Collapse array.
  return result[collapse].reduce(function (a, b) {
    return a.concat(b);
  }, []);
}

function childNodes(node) {
  var result = node.childNodes;
  if (!Array.isArray(result)) {
    result = Array.prototype.slice.call(result);
  }

  return result;
}

function children(node, localName) {
  return childNodes(node).filter(function (childNode) {
    return childNode.localName === localName;
  });
}

function child(node, localName) {
  return children(node, localName)[0];
}