'use strict';

let plugins = [];

module.exports = function(_chai, utils) {
  function isType(type, target) {
    return utils.type(target).toUpperCase() === type.toUpperCase();
  }

  function like(object, expected) {
    for (let validator of plugins) {
      if (validator.match(object, expected)) {
        return validator.assert(object, expected);
      }
    }

    // Early check for optimization and prevent recursion failures
    if (object === expected) {
      return true;
    }

    if (isType('object', expected) && isType('object', object)) {
      for (let key of Object.keys(expected)) {
        if (!(key in object)) {
          return false;
        }
        if (!like(object[key], expected[key])) {
          return false;
        }
      }
      return true;
    }

    if (isType('array', expected) && isType('array', object)) {
      if (object.length !== expected.length) {
        return false;
      }
      for (let i = 0; i < expected.length; i++) {
        if (!like(object[i], expected[i])) {
          return false;
        }
      }
      return true;
    }

    // Special case for RegExps because literal regexp (/.../) not equal new RegExp(...)
    if (isType('RegExp', object) && isType('RegExp', expected)) {
      return object.toString() === expected.toString();
    }

    if (isType('Date', object) && isType('Date', expected)) {
      return object.getTime() === expected.getTime();
    }

    // Do reflexed compare so primitives and object wrappers will be equal
    if (isType('string', object) && isType('string', expected)
     || isType('number', object) && isType('number', expected)
     || isType('boolean', object) && isType('boolean', expected)
    ) {
      return object == expected;
    }

    return false;
  }

  _chai.Assertion.addMethod('like', function(expected) {
    let object = utils.flag(this, 'object');
    this.assert(
      like(object, expected),
      'expected #{this} to be like #{exp}',
      'expected #{this} to not like #{exp}',
      expected, object,
      _chai.config.showDiff
    );
  });
};

module.exports.extend = function(plugin) {
  plugins.push(plugin);
};

module.exports.clearPlugins = function() {
  plugins = [];
};
