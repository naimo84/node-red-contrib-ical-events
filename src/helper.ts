import moment = require("moment");
import { loadEventsForDay } from "./icloud";
import { CalDav } from "./caldav";
import * as  ical from 'node-ical';

export interface Job {
    id: string,
    cronjob: any
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
    off?: boolean
}

export function getICal(node, urlOrFile, config, callback) {
    if (config.caldav && config.caldav === 'icloud') {
        const now = moment();
        const when = now.toDate();

        loadEventsForDay(moment(when), {
            url: urlOrFile,
            username: config.username,
            password: config.password,
            type: "caldav",
            endpreview: node.endpreview || 1
        }, (list, start, end) => {

            callback && callback(null, list);
        });
    } else if (config.caldav && JSON.parse(config.caldav) === true) {
        node.debug("caldav")
        CalDav(node, config, null).then((data) => {
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
        if (urlOrFile.match(/^https?:\/\//)) {
            let header = {};
            let username = node.config.username;
            let password = node.config.password;

            if (username && password) {
                var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
                header = {
                    headers: {
                        'Authorization': auth
                    }
                }
            }

            ical.fromURL(node.config.url, header, (err, data) => {
                if (err) {
                    callback && callback(err, null);
                    return;
                }
                console.log('data');
                console.log(data);
                console.log('data');
                callback && callback(null, data);
            });
        } else {
            ical.parseFile(node.config.url, (err, data) => {
                if (err) {
                    callback && callback(err, null);
                    return;
                }
                callback && callback(null, data);
            });
        }
    }

}
