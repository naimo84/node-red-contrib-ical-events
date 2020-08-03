import { Config } from './ical-config';

import dav = require('dav');
import Scrapegoat = require("scrapegoat");
import moment = require('moment');
import IcalExpander = require('ical-expander');
import * as  ical from 'node-ical';
import * as URL from "url";
import { convertEvents, convertEvent } from './helper';

export function CalDav(config: Config) {
    const calName = config.calendar;
    const now = moment();
    const whenMoment = moment(now.toDate());

    // @ts-ignore
    let start = whenMoment.clone().startOf('day').subtract(config.pastview, config.pastviewUnits);
    // @ts-ignore
    let end = whenMoment.clone().endOf('day').add(config.preview, config.previewUnits);

    if (config.pastviewUnits === 'days') {
        start = whenMoment.clone().startOf('day').subtract(config.pastview + 1, 'days');
    }
    if (config.previewUnits === 'days') {
        end = whenMoment.clone().endOf('day').add(config.preview, 'days');
    }
    const filters = [{
        type: 'comp-filter',
        attrs: { name: 'VCALENDAR' },
        children: [{
            type: 'comp-filter',
            attrs: { name: 'VEVENT' },
            children: [{
                type: 'time-range',
                attrs: {
                    start: start.format('YYYYMMDD[T]HHmmss[Z]'),
                    end: end.format('YYYYMMDD[T]HHmmss[Z]'),
                },
            }],
        }],
    }];

    const xhr = new dav.transport.Basic(
        new dav.Credentials({
            username: config.username,
            password: config.password,
        }),
    );

    let calDavUri = config.url;
    let url = URL.parse(calDavUri);
    let host = url.protocol + '//' + url.host+'/';
    return dav.createAccount({ server: calDavUri, xhr: xhr, loadCollections: true, loadObjects: true })
        .then((account) => {
            let promises = [];
            if (!account.calendars) {
                throw 'CalDAV -> no calendars found.';
            }

            for (let calendar of account.calendars) {

                if (!calName || !calName.length || (calName && calName.length && calName.toLowerCase() === calendar.displayName.toLowerCase())) {
                    promises.push(dav.listCalendarObjects(calendar, { xhr: xhr, filters: filters })
                        .then((calendarEntries) => {
                            let retEntries = {};
                            for (let calendarEntry of calendarEntries) {
                                const ics = calendarEntry.calendarData;
                                if (ics) {
                                    const icalExpander = new IcalExpander({ ics, maxIterations: 100 });
                                    const events = icalExpander.between(start.toDate(), end.toDate());

                                    convertEvents(events).forEach(event => {
                                        if (event) {
                                            event.calendarName = calendar.displayName;
                                            retEntries[event.uid] = event;
                                        }
                                    });
                                }
                            }
                            return retEntries;
                        }),
                    );

                    promises.push(dav.listCalendarObjects(calendar, { xhr: xhr, filters: filters })
                        .then((calendarEntries) => {
                            let retEntries = {};
                            for (let calendarEntry of calendarEntries) {
                                if (calendarEntry.calendar.objects) {
                                    for (let calendarObject of calendarEntry.calendar.objects) {
                                        if (calendarObject.data && calendarObject.data.href) {
                                            let ics = host + calendarObject.data.href;
                                            let header = {};
                                            let username = config.username;
                                            let password = config.password;
                                            if (username && password) {
                                                var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
                                                header = {
                                                    headers: {
                                                        'Authorization': auth,
                                                    },
                                                };
                                            }

                                            return ical.fromURL(ics, header).then(data => {
                                                for (var k in data) {
                                                    var ev = convertEvent(data[k]);
                                                    if (ev) {
                                                        ev.calendarName = calendar.displayName;
                                                        retEntries[ev.uid] = ev;
                                                    }
                                                }
                                                return retEntries;
                                            });
                                        }
                                    }
                                }
                            }
                        }),
                    );
                }
            }
            return Promise.all(promises);
        }, function (err) {           
            throw err;
        });
}

export async function Fallback(config:Config) {
    let scrapegoat = new Scrapegoat({
        auth: {
            user: config.username,
            pass: config.password
        },
        uri: encodeURI(config.url).replace('@','%40'),
        rejectUnauthorized: config.rejectUnauthorized,
        headers:{
            "Content-Type":"application/xml"
        }
    });

    let data = await scrapegoat.getAllEvents();

    return convertEvents(data);
}