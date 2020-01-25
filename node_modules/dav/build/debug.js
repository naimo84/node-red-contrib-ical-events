"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = debug;

function debug(topic) {
  return function (message) {
    if (debug.enabled) {
      console.log("[" + topic + "] " + message);
    }
  };
}

module.exports = exports["default"];