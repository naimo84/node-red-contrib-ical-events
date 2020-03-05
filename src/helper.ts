import moment = require('moment');
import { loadEventsForDay } from './icloud';
import { CalDav } from './caldav';
import { Config } from './ical-config';
import { CronJob } from 'cron';
import { Node } from 'node-red';

const nodeIcal = require('node-ical');

export interface Job {
    id: string,
    cronjob: any
}

export interface IcalNode extends Node {
    datesArray_old: any;
    datesArray: any;
    job: CronJob;
    config: Config;
}

export interface CalEvent {
    summary?: string,
    topic?: string,
    location?: string,
    eventStart?: Date
    eventEnd?: Date,
    date?: string,
    event?: string,
    description?: string,
    id?: string,
    allDay?: boolean,
    rule?: string,
    on?: boolean,
    off?: boolean,
    countdown?: object,
    calendarName?: string

}

export function getConfig(config: Config, node: any, msg: any): Config {
    return {
        url: msg?.url || config?.url,
        language: msg?.language || config?.language,
        replacedates: msg?.replacedates || config?.replacedates,
        caldav: msg?.caldav || config?.caldav,
        username: msg?.username || config?.username,
        password: msg?.password || config?.password,
        calendar: msg?.calendar || config?.calendar,
        pastWeeks: msg?.pastWeeks || config?.pastWeeks,
        futureWeeks: msg?.futureWeeks || config?.futureWeeks,
        filter: msg?.filter || node.filter,
        trigger: msg?.trigger || node.trigger || 'always',
        preview: parseInt(msg?.preview || node?.preview || node?.endpreview || 10),
        previewUnits: msg?.previewUnits || node?.previewUnits || node?.endpreviewUnits || 'd',
        pastview: parseInt(msg?.pastview || node?.pastview || 0),
        pastviewUnits: msg?.pastviewUnits || node?.pastviewUnits || 'd',
        offset: parseInt(msg?.offset || node?.offset || 0),
        offsetUnits: msg?.offsetUnits || node?.offsetUnits || 'm'
    } as Config;
}


export function convertEvents(events) {
    let retEntries = [];
    if (events) {
        if (events.events) {
            events.events.forEach(event => {
                let ev = _convertEvent(event);
                retEntries.push(ev);
            });
        }
        if (events.occurrences && events.occurrences.length > 0) {
            events.occurrences.map(o => retEntries.push(_convertEvent(o)));
        }
    }

    return retEntries;
}

function _convertEvent(e) {
    if (e) {
        let startDate = e.startDate.toJSDate()
        let endDate = e.endDate.toJSDate()

        if (e.item) {
            e = e.item
        }
        if (e.duration.wrappedJSObject) {
            delete e.duration.wrappedJSObject
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
        }
    }
}

export function getTimezoneOffset(date) {
    var offset = 0;
    var zone = moment.tz.zone(moment.tz.guess());
    if (zone && date) {
        offset = zone.utcOffset(date.getTime());
    }
    return offset;
}

export function addOffset(time, offset) {
    return new Date(time.getTime() + offset * 60 * 1000);
}

export function countdown(date) {

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

export function getICal(node: IcalNode, config, callback) {
    if (config.caldav && config.caldav === 'icloud') {
        const now = moment();
        const when = now.toDate();

        loadEventsForDay(moment(when), node, (list, start, end) => {
            callback && callback(null, list);
        });
    } else if (config.caldav && JSON.parse(config.caldav) === true) {
        node.debug('caldav');
        CalDav(node, config).then((data) => {
            let retEntries = {};
            for (let events of data) {
                for (let event in events) {
                    var ev = events[event];
                    retEntries[ev.uid] = ev;
                }
            }
            callback(null, retEntries);
        });
    } else {
        if (node.config?.url?.match(/^https?:\/\//)) {
            let header = {};
            let username = node.config.username;
            let password = node.config.password;

            if (username && password) {
                var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
                header = {
                    headers: {
                        'Authorization': auth,
                    },
                };
            }

            nodeIcal.fromURL(node.config.url, header, (err, data) => {
                if (err) {
                    callback && callback(err, null);
                    return;
                }
                callback && callback(null, data);
            });
        } else {
            if (!node.config.url) {
                node.error("URL/File is not defined");
                node.status({ fill: 'red', shape: 'ring', text: "URL/File is not defined" });
                callback && callback(null, {});
            }
            nodeIcal.parseFile(node.config.url, (err, data) => {
                if (err) {
                    callback && callback(err, null);
                    return;
                }
                callback && callback(null, data);
            });
        }
    }

}
