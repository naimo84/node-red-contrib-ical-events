"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dav = require('dav');
var moment = require('moment');
var IcalExpander = require('ical-expander');
function CalDav(node, config, calName, callback) {
    this.server = config.server;
    this.calendar = config.calendar;
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
                                end: endDate.format('YYYYMMDD[T]HHmmss[Z]')
                            }
                        }]
                }]
        }];
    var xhr = new dav.transport.Basic(new dav.Credentials({
        username: config.username,
        password: config.password
    }));
    var calDavUri = config.url;
    dav.createAccount({ server: calDavUri, xhr: xhr, loadCollections: true, loadObjects: true })
        .then(function (account) {
        if (!account.calendars) {
            node.error('CalDAV -> no calendars found.');
            return;
        }
        node.debug(account.calendars);
        var retEntries = {};
        account.calendars.forEach(function (calendar) {
            if (!calName || !calName.length || (calName && calName.length && calName === calendar.displayName)) {
                dav.listCalendarObjects(calendar, { xhr: xhr, filters: filters })
                    .then(function (calendarEntries) {
                    calendarEntries.forEach(function (calendarEntry) {
                        try {
                            var ics = calendarEntry.calendarData;
                            var icalExpander = new IcalExpander({ ics: ics, maxIterations: 100 });
                            var events = icalExpander.between(startDate.toDate(), endDate.toDate());
                            convertEvents(events).forEach(function (event) {
                                retEntries[event.uid] = event;
                            });
                        }
                        catch (error) {
                            node.error('Error parsing calendar data: ' + error);
                        }
                    });
                    callback(retEntries);
                }, function () {
                    node.error('CalDAV -> get ics went wrong.');
                });
            }
        });
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
            allDay: ((e.duration.toSeconds() % 86400) === 0)
        };
    }
}
