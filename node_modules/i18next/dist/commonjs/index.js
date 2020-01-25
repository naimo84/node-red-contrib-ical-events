"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.use = exports.t = exports.setDefaultNamespace = exports.on = exports.off = exports.loadResources = exports.loadNamespaces = exports.loadLanguages = exports.init = exports.getFixedT = exports.exists = exports.dir = exports.createInstance = exports.cloneInstance = exports.changeLanguage = exports.default = void 0;

var _i18next = _interopRequireDefault(require("./i18next.js"));

var _default = _i18next.default;
exports.default = _default;

var changeLanguage = _i18next.default.changeLanguage.bind(_i18next.default);

exports.changeLanguage = changeLanguage;

var cloneInstance = _i18next.default.cloneInstance.bind(_i18next.default);

exports.cloneInstance = cloneInstance;

var createInstance = _i18next.default.createInstance.bind(_i18next.default);

exports.createInstance = createInstance;

var dir = _i18next.default.dir.bind(_i18next.default);

exports.dir = dir;

var exists = _i18next.default.exists.bind(_i18next.default);

exports.exists = exists;

var getFixedT = _i18next.default.getFixedT.bind(_i18next.default);

exports.getFixedT = getFixedT;

var init = _i18next.default.init.bind(_i18next.default);

exports.init = init;

var loadLanguages = _i18next.default.loadLanguages.bind(_i18next.default);

exports.loadLanguages = loadLanguages;

var loadNamespaces = _i18next.default.loadNamespaces.bind(_i18next.default);

exports.loadNamespaces = loadNamespaces;

var loadResources = _i18next.default.loadResources.bind(_i18next.default);

exports.loadResources = loadResources;

var off = _i18next.default.off.bind(_i18next.default);

exports.off = off;

var on = _i18next.default.on.bind(_i18next.default);

exports.on = on;

var setDefaultNamespace = _i18next.default.setDefaultNamespace.bind(_i18next.default);

exports.setDefaultNamespace = setDefaultNamespace;

var t = _i18next.default.t.bind(_i18next.default);

exports.t = t;

var use = _i18next.default.use.bind(_i18next.default);

exports.use = use;