"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var icloud_1 = require("./icloud");
var caldav_1 = require("./caldav");
var ical = require("node-ical");
function getICal(node, urlOrFile, config, callback) {
    if (config.caldav && config.caldav === 'icloud') {
        var now = moment();
        var when = now.toDate();
        icloud_1.loadEventsForDay(moment(when), {
            url: urlOrFile,
            username: config.username,
            password: config.password,
            type: "caldav",
            endpreview: node.endpreview || 1
        }, function (list, start, end) {
            callback && callback(null, list);
        });
    }
    else if (config.caldav && JSON.parse(config.caldav) === true) {
        node.debug("caldav");
        caldav_1.CalDav(node, config, null).then(function (data) {
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
                        'Authorization': auth
                    }
                };
            }
            ical.fromURL(node.config.url, header, function (err, data) {
                if (err) {
                    callback && callback(err, null);
                    return;
                }
                console.log('data');
                console.log(data);
                console.log('data');
                callback && callback(null, data);
            });
        }
        else {
            ical.parseFile(node.config.url, function (err, data) {
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
