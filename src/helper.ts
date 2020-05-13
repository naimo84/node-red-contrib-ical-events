import moment = require('moment');
import { loadEventsForDay } from './icloud';
import { CalDav, Fallback } from './caldav';
import { Config } from './ical-config';
import { CronJob } from 'cron';
import { Node } from 'node-red';
import * as NodeCache from 'node-cache';

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
    cache: NodeCache;
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

export function getICal(node: IcalNode, config, callback) {
    getEvents(node, config, (err, data) => {
        if (node.config.usecache && node.cache) {
            if (data) {
                node.cache.set("events", data);
                callback && callback(null, data);
            }
            if (err) {
                data = node.cache.get("events");
                callback && callback(null, data);
            }
        } else {
            callback && callback(err, data);
        }
    });
}

export function getConfig(config: Config, node: any, msg: any): Config {
    return {
        url: msg?.url || config?.url,
        language: msg?.language || config?.language,
        replacedates: msg?.replacedates || config?.replacedates,
        caldav: msg?.caldav || config?.caldav,
        username: msg?.username || config?.username,
        usecache: msg?.usecache || config?.usecache || false,
        password: msg?.password || config?.password,
        calendar: msg?.calendar || config?.calendar,
        filter: msg?.filter || node.filter,
        trigger: msg?.trigger || node.trigger || 'always',
        preview: parseInt(msg?.preview || node?.preview || node?.endpreview || 10),
        previewUnits: msg?.previewUnits || node?.previewUnits || node?.endpreviewUnits || 'd',
        pastview: parseInt(msg?.pastview || node?.pastview || 0),
        pastviewUnits: msg?.pastviewUnits || node?.pastviewUnits || 'd',
        offset: parseInt(msg?.offset || node?.offset || 0),
        offsetUnits: msg?.offsetUnits || node?.offsetUnits || 'm',
        rejectUnauthorized: msg?.rejectUnauthorized || node?.rejectUnauthorized || false
    } as Config;
}

export function convertEvents(events) {
    let retEntries = [];
    if (events) {
        if (Array.isArray(events)) {
            events.forEach(event => {
                let ev = convertScrapegoat(event.data);
                retEntries.push(ev);
            });
        }
        else {
            if (events.events) {
                events.events.forEach(event => {
                    let ev = convertEvent(event);
                    retEntries.push(ev);
                });
            }
            if (events.occurrences && events.occurrences.length > 0) {
                events.occurrences.forEach(event => {
                    let ev = convertEvent(event);
                    retEntries.push(ev);
                });
            }
        }
    }

    return retEntries;
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function convertEvent(e) {
    if (e) {
        let startDate = e.startDate?.toJSDate() || e.start;
        let endDate = e.endDate?.toJSDate() || e.end;

        const recurrence = e.recurrenceId;

        if (e.item) {
            e = e.item
        }
        if (e.type && e.type !== "VEVENT") {
            return;
        }
        if (e.duration?.wrappedJSObject) {
            delete e.duration.wrappedJSObject
        }

        let uid = e.uid || uuidv4();
        if (recurrence) {
            uid += new Date(recurrence.year, recurrence.month, recurrence.day, recurrence.hour, recurrence.minute, recurrence.second).getTime().toString();
        } else {
            uid += startDate.getTime().toString();
        }

        let duration = e.duration;
        let allday = false;
        if (!duration) {
            var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            seconds = Number(seconds);
            allday = ((seconds % 86400) === 0)
        } else {
            allday = ((duration.toSeconds() % 86400) === 0)
        }

        return {
            start: startDate,
            end: endDate,
            summary: e.summary || '',
            description: e.description || '',
            attendees: e.attendees,
            duration: e.duration?.toICALString(),
            durationSeconds: e.duration?.toSeconds(),
            location: e.location || '',
            organizer: e.organizer || '',
            uid: uid,
            isRecurring: false,
            datetype: 'date',
            type: 'VEVENT',
            allDay: allday,
            calendarName: null
        }
    }
}

function convertScrapegoat(e) {
    if (e) {
        let startDate = moment(e.start).toDate();
        let endDate = moment(e.end).toDate();

        const recurrence = e.recurrenceId;

        if (e.duration?.wrappedJSObject) {
            delete e.duration.wrappedJSObject
        }

        let uid = e.uid || uuidv4();
        uid += startDate.getTime().toString();

        let duration = e.duration;
        let allday = false;
        if (!duration) {
            var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            seconds = Number(seconds);
            allday = ((seconds % 86400) === 0)
        } else {
            allday = ((duration.toSeconds() % 86400) === 0)
        }

        return {
            start: startDate,
            end: endDate,
            summary: e.title || '',
            description: e.title || '',
            attendees: e.attendees,
            duration: e.duration?.toICALString(),
            durationSeconds: e.duration?.toSeconds(),
            location: e.location || '',
            organizer: e.organizer || '',
            uid: uid,
            isRecurring: false,
            datetype: 'date',
            type: 'VEVENT',
            allDay: allday,
            calendarName: null
        }
    }
}

export function getTimezoneOffset(date: Date) {
    const isoDate = date.toISOString();
    var offset = moment(isoDate).utcOffset();
    return -offset;
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

function getEvents(node: IcalNode, config: Config, callback) {
    if (config.caldav && config.caldav === 'icloud') {
        node.debug('icloud');
        const now = moment();
        const when = now.toDate();

        loadEventsForDay(moment(when), config, (list, start, end) => {
            callback && callback(null, list);
        });
    } else if (config.caldav && JSON.parse(config.caldav) === true) {
        node.debug('caldav');
        CalDav(config).then((data) => {
            let retEntries = {};
            if (data) {
                for (let events of data) {
                    for (let event in events) {
                        var ev = events[event];
                        retEntries[ev.uid] = ev;
                    }
                }
            }
            callback(null, retEntries);
        }).catch((err) => {
            node.debug(`caldav - get calendar went wrong. Error Message: ${err}`)
            node.debug(`caldav - using fallback`)
            Fallback(config).then((data) => {
                callback(null, data)
            }).catch(err_fallback => {
                node.error(`caldav - get calendar went wrong. Error Message: ${err_fallback}`)
            })
        });
    } else {
        node.debug('ical');
        if (config?.url?.match(/^https?:\/\//)) {
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

            nodeIcal.fromURL(config.url, header, (err, data) => {
                if (err) {
                    callback && callback(err, null);
                    return;
                }
                callback && callback(null, data);
            });
        } else {
            if (!config.url) {
                node.error("URL/File is not defined");
                node.status({ fill: 'red', shape: 'ring', text: "URL/File is not defined" });
                callback && callback(null, {});
            }
            nodeIcal.parseFile(config.url, (err, data) => {
                if (err) {
                    callback && callback(err, null);
                    return;
                }
                callback && callback(null, data);
            });
        }
    }
}


