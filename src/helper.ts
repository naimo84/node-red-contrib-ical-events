import moment = require("moment");
import { loadEventsForDay } from "./icloud";
import { CalDav } from "./caldav";
import * as  ical from 'node-ical';

export function getICal(node, urlOrFile, config, callback) {        
    if (urlOrFile.match(/^https?:\/\//)) {
        if (config.caldav && config.caldav === 'icloud') {
            const now = moment();
            const when = now.toDate();
            loadEventsForDay(moment(when), {
                url: urlOrFile,
                username: config.username,
                password: config.password,
                type: "caldav",
                endpreview:node.endpreview
            }, (list, start, end) => {
                callback && callback(null, list);
            });
        } else if (config.caldav && JSON.parse(config.caldav) === true) {
            node.debug("caldav")
            CalDav(node, config, null, (data) => {
                callback(null, data);
            });            
        } else {
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
                callback && callback(null, data);
            });
        }
    }
}
