"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Account = function Account(options) {
  _classCallCheck(this, Account);

  Object.assign(this, {
    server: null,
    credentials: null,
    rootUrl: null,
    principalUrl: null,
    homeUrl: null,
    calendars: null,
    addressBooks: null
  }, options);
}

/**
 * Options:
 *   (String) username - username (perhaps email) for calendar user.
 *   (String) password - plaintext password for calendar user.
 *   (String) clientId - oauth client id.
 *   (String) clientSecret - oauth client secret.
 *   (String) authorizationCode - oauth code.
 *   (String) redirectUrl - oauth redirect url.
 *   (String) tokenUrl - oauth token url.
 *   (String) accessToken - oauth access token.
 *   (String) refreshToken - oauth refresh token.
 *   (Number) expiration - unix time for access token expiration.
 */
;

exports.Account = Account;

var Credentials = function Credentials(options) {
  _classCallCheck(this, Credentials);

  Object.assign(this, {
    username: null,
    password: null,
    clientId: null,
    clientSecret: null,
    authorizationCode: null,
    redirectUrl: null,
    tokenUrl: null,
    accessToken: null,
    refreshToken: null,
    expiration: null
  }, options);
};

exports.Credentials = Credentials;

var DAVCollection = function DAVCollection(options) {
  _classCallCheck(this, DAVCollection);

  Object.assign(this, {
    data: null,
    objects: null,
    account: null,
    ctag: null,
    description: null,
    displayName: null,
    reports: null,
    resourcetype: null,
    syncToken: null,
    url: null
  }, options);
};

exports.DAVCollection = DAVCollection;

var AddressBook = (function (_DAVCollection) {
  _inherits(AddressBook, _DAVCollection);

  function AddressBook(options) {
    _classCallCheck(this, AddressBook);

    _get(Object.getPrototypeOf(AddressBook.prototype), "constructor", this).call(this, options);
  }

  return AddressBook;
})(DAVCollection);

exports.AddressBook = AddressBook;

var Calendar = (function (_DAVCollection2) {
  _inherits(Calendar, _DAVCollection2);

  function Calendar(options) {
    _classCallCheck(this, Calendar);

    _get(Object.getPrototypeOf(Calendar.prototype), "constructor", this).call(this, options);
    Object.assign(this, {
      components: null,
      timezone: null
    }, options);
  }

  return Calendar;
})(DAVCollection);

exports.Calendar = Calendar;

var DAVObject = function DAVObject(options) {
  _classCallCheck(this, DAVObject);

  Object.assign(this, {
    data: null,
    etag: null,
    url: null
  }, options);
};

exports.DAVObject = DAVObject;

var CalendarObject = (function (_DAVObject) {
  _inherits(CalendarObject, _DAVObject);

  function CalendarObject(options) {
    _classCallCheck(this, CalendarObject);

    _get(Object.getPrototypeOf(CalendarObject.prototype), "constructor", this).call(this, options);
    Object.assign(this, {
      calendar: null,
      calendarData: null
    }, options);
  }

  return CalendarObject;
})(DAVObject);

exports.CalendarObject = CalendarObject;

var VCard = (function (_DAVObject2) {
  _inherits(VCard, _DAVObject2);

  function VCard(options) {
    _classCallCheck(this, VCard);

    _get(Object.getPrototypeOf(VCard.prototype), "constructor", this).call(this, options);
    Object.assign(this, {
      addressBook: null,
      addressData: null
    }, options);
  }

  return VCard;
})(DAVObject);

exports.VCard = VCard;