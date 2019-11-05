"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var icloud_1 = require("./icloud");
var caldav_1 = require("./caldav");
var ical = require("node-ical");
function getICal(node, urlOrFile, config, callback) {
    if (urlOrFile.match(/^https?:\/\//)) {
        if (config.caldav && config.caldav === 'icloud') {
            var now = moment();
            var when = now.toDate();
            icloud_1.loadEventsForDay(moment(when), {
                url: urlOrFile,
                username: config.username,
                password: config.password,
                type: "caldav",
                endpreview: node.endpreview
            }, function (list, start, end) {
                callback && callback(null, list);
            });
        }
        else if (config.caldav && JSON.parse(config.caldav) === true) {
            node.debug("caldav");
            caldav_1.CalDav(node, config, null, function (data) {
                callback(null, data);
            });
        }
        else {
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
                callback && callback(null, data);
            });
        }
    }
}
exports.getICal = getICal;
