"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var icloud_1 = require("./icloud");
var caldav_1 = require("./caldav");
var nodeIcal = require('node-ical');
function convertEvents(events) {
    var retEntries = [];
    if (events) {
        if (events.events) {
            events.events.forEach(function (event) {
                var ev = _convertEvent(event);
                retEntries.push(ev);
            });
        }
        if (events.occurrences) {
            var mappedOccurrences = events.occurrences.map(function (o) { return _convertEvent(o); });
            if (mappedOccurrences.length > 0) {
                retEntries.push(mappedOccurrences[0]);
            }
        }
    }
    return retEntries;
}
exports.convertEvents = convertEvents;
function _convertEvent(e) {
    if (e) {
        var startDate = e.startDate.toJSDate();
        var endDate = e.endDate.toJSDate();
        if (e.item) {
            e = e.item;
        }
        if (e.duration.wrappedJSObject) {
            delete e.duration.wrappedJSObject;
        }
        return {
            start: startDate,
            end: endDate,
            summary: e.summary || '',
            description: e.description || '',
            attendees: e.attendees,
            duration: e.duration.toICALString(),
            durationSeconds: e.duration.toSeconds(),
            location: e.location || '',
            organizer: e.organizer || '',
            uid: e.uid || '',
            isRecurring: false,
            datetype: 'date',
            type: 'VEVENT',
            allDay: ((e.duration.toSeconds() % 86400) === 0)
        };
    }
}
function getTimezoneOffset(date) {
    var offset = 0;
    var zone = moment.tz.zone(moment.tz.guess());
    if (zone && date) {
        offset = zone.utcOffset(date.getTime());
    }
    return offset;
}
exports.getTimezoneOffset = getTimezoneOffset;
function addOffset(time, offset) {
    return new Date(time.getTime() + offset * 60 * 1000);
}
exports.addOffset = addOffset;
function countdown(date) {
    var seconds = (date.getTime() - new Date().getTime()) / 1000;
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    return {
        days: d,
        hours: h,
        minutes: m,
        seconds: s,
    };
}
exports.countdown = countdown;
function getICal(node, urlOrFile, config, callback) {
    if (config.caldav && config.caldav === 'icloud') {
        var now = moment();
        var when = now.toDate();
        icloud_1.loadEventsForDay(moment(when), {
            url: urlOrFile,
            username: config.username,
            password: config.password,
            type: 'caldav',
            endpreview: node.endpreview || 1,
            pastview: node.pastview || 0,
            endpreviewUnits: node.endpreviewUnits || 'days',
            pastviewUnits: node.pastviewUnits || 'days',
        }, function (list, start, end) {
            callback && callback(null, list);
        });
    }
    else if (config.caldav && JSON.parse(config.caldav) === true) {
        node.debug('caldav');
        caldav_1.CalDav(node, config).then(function (data) {
            var retEntries = {};
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var events = data_1[_i];
                for (var event_1 in events) {
                    var ev = events[event_1];
                    retEntries[ev.uid] = ev;
                }
            }
            callback(null, retEntries);
        });
    }
    else {
        if (urlOrFile.match(/^https?:\/\//)) {
            var header = {};
            var username = node.config.username;
            var password = node.config.password;
            if (username && password) {
                var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
                header = {
                    headers: {
                        'Authorization': auth,
                    },
                };
            }
            nodeIcal.fromURL(node.config.url, header, function (err, data) {
                if (err) {
                    callback && callback(err, null);
                    return;
                }
                callback && callback(null, data);
            });
        }
        else {
            nodeIcal.parseFile(node.config.url, function (err, data) {
                if (err) {
                    callback && callback(err, null);
                    return;
                }
                callback && callback(null, data);
            });
        }
    }
}
exports.getICal = getICal;

//# sourceMappingURL=helper.js.map
