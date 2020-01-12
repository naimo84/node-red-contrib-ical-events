"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dav = require('dav');
var moment = require('moment');
var IcalExpander = require('ical-expander');
var ical = require("node-ical");
function CalDav(node, config) {
    var calName = config.calendar;
    this.pastWeeks = config.pastWeeks || 0;
    this.futureWeeks = config.futureWeeks || 4;
    var startDate = moment().startOf('day').subtract(this.pastWeeks, 'weeks');
    var endDate = moment().endOf('day').add(this.futureWeeks, 'weeks');
    var filters = [{
            type: 'comp-filter',
            attrs: { name: 'VCALENDAR' },
            children: [{
                    type: 'comp-filter',
                    attrs: { name: 'VEVENT' },
                    children: [{
                            type: 'time-range',
                            attrs: {
                                start: startDate.format('YYYYMMDD[T]HHmmss[Z]'),
                                end: endDate.format('YYYYMMDD[T]HHmmss[Z]'),
                            },
                        }],
                }],
        }];
    var xhr = new dav.transport.Basic(new dav.Credentials({
        username: config.username,
        password: config.password,
    }));
    var calDavUri = config.url;
    var url = new URL(calDavUri);
    return dav.createAccount({ server: calDavUri, xhr: xhr, loadCollections: true, loadObjects: true })
        .then(function (account) {
        var promises = [];
        if (!account.calendars) {
            node.error('CalDAV -> no calendars found.');
            return;
        }
        var _loop_1 = function (calendar) {
            if (!calName || !calName.length || (calName && calName.length && calName === calendar.displayName)) {
                promises.push(dav.listCalendarObjects(calendar, { xhr: xhr, filters: filters })
                    .then(function (calendarEntries) {
                    var retEntries = {};
                    for (var _i = 0, calendarEntries_1 = calendarEntries; _i < calendarEntries_1.length; _i++) {
                        var calendarEntry = calendarEntries_1[_i];
                        var ics = calendarEntry.calendarData;
                        if (ics) {
                            var icalExpander = new IcalExpander({ ics: ics, maxIterations: 100 });
                            var events = icalExpander.between(startDate.toDate(), endDate.toDate());
                            convertEvents(events).forEach(function (event) {
                                event.calendarName = calendar.displayName;
                                retEntries[event.uid] = event;
                            });
                        }
                    }
                    return retEntries;
                }));
                promises.push(dav.listCalendarObjects(calendar, { xhr: xhr, filters: filters })
                    .then(function (calendarEntries) {
                    var retEntries = {};
                    for (var _i = 0, calendarEntries_2 = calendarEntries; _i < calendarEntries_2.length; _i++) {
                        var calendarEntry = calendarEntries_2[_i];
                        if (calendarEntry.calendar.objects) {
                            for (var _a = 0, _b = calendarEntry.calendar.objects; _a < _b.length; _a++) {
                                var calendarObject = _b[_a];
                                if (calendarObject.data && calendarObject.data.href) {
                                    var ics = url.origin + calendarObject.data.href;
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
                                    return ical.fromURL(ics, header).then(function (data) {
                                        for (var k in data) {
                                            var ev = data[k];
                                            ev.calendarName = calendar.displayName;
                                            retEntries[ev.uid] = ev;
                                        }
                                        return retEntries;
                                    });
                                }
                            }
                        }
                    }
                }));
            }
        };
        for (var _i = 0, _a = account.calendars; _i < _a.length; _i++) {
            var calendar = _a[_i];
            _loop_1(calendar);
        }
        return Promise.all(promises);
    }, function () {
        node.error('CalDAV -> get calendars went wrong.');
    });
}
exports.CalDav = CalDav;
function convertEvents(events) {
    var retEntries = [];
    events.events.forEach(function (event) {
        var ev = _convertEvent(event);
        retEntries.push(ev);
    });
    return retEntries;
}
function _convertEvent(e) {
    if (e) {
        var startDate = e.startDate;
        var endDate = e.endDate;
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
            allDay: ((e.duration.toSeconds() % 86400) === 0),
        };
    }
}
