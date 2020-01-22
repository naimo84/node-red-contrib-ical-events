"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Moment = require('moment');
var MomentRange = require('moment-range'), moment = MomentRange.extendMoment(Moment), https = require('https'), icalExpander = require('ical-expander'), xmlParser = require('xml-js');
var helper_1 = require("./helper");
function process(reslist, start, end, ics) {
    var cal = new icalExpander({ ics: ics, maxIterations: 1000 });
    var events = cal.between(start.toDate(), end.toDate());
    helper_1.convertEvents(events).forEach(function (event) {
        reslist[event.uid] = event;
    });
}
function requestIcloudSecure(config, start, end, cb) {
    var DavTimeFormat = 'YYYYMMDDTHHmms\\Z', url = config.url, user = config.username, pass = config.password, urlparts = /(https?)\:\/\/(.*?):?(\d*)?(\/.*\/?)/gi.exec(url), protocol = urlparts[1], host = urlparts[2], port = urlparts[3] || (protocol === "https" ? 443 : 80), path = urlparts[4];
    var xml = '<?xml version="1.0" encoding="utf-8" ?>\n' +
        '<C:calendar-query xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">\n' +
        '  <D:prop>\n' +
        '    <C:calendar-data/>\n' +
        '  </D:prop>\n' +
        '  <C:filter>\n' +
        '    <C:comp-filter name="VCALENDAR">\n' +
        '      <C:comp-filter name="VEVENT">\n' +
        '        <C:time-range start="' + start.format(DavTimeFormat) + '" end="' + end.format(DavTimeFormat) + '" />\n' +
        '      </C:comp-filter>\n' +
        '    </C:comp-filter>\n' +
        '  </C:filter>\n' +
        '</C:calendar-query>';
    var options = {
        rejectUnauthorized: false,
        hostname: host,
        port: port,
        path: path,
        method: 'REPORT',
        headers: {
            "Content-type": "application/xml",
            "Content-Length": xml.length,
            "User-Agent": "calDavClient",
            "Connection": "close",
            "Depth": "1"
        }
    };
    if (user && pass) {
        var userpass = Buffer.from(user + ":" + pass).toString('base64');
        options.headers["Authorization"] = "Basic " + userpass;
    }
    var req = https.request(options, function (res) {
        var s = "";
        res.on('data', function (chunk) {
            s += chunk;
        });
        req.on('close', function () {
            try {
                var json = JSON.parse(xmlParser.xml2json(s, { compact: true, spaces: 0 }));
                cb(json);
            }
            catch (e) {
                console.error("Error parsing response", e);
            }
        });
    });
    req.end(xml);
    req.on('error', function (e) {
        console.error('problem with request: ' + e.message);
    });
}
function loadEventsForDay(whenMoment, config, cb) {
    var start = whenMoment.clone().startOf('day').subtract(config.pastview, config.pastviewUnits);
    var end = whenMoment.clone().endOf('day').add(config.endpreview, config.endpreviewUnits);
    if (config.pastviewUnits === 'days') {
        start = whenMoment.clone().startOf('day').subtract(config.pastview + 1, 'days');
    }
    if (config.endpreviewUnits === 'days') {
        end = whenMoment.clone().endOf('day').add(config.endpreview, 'days');
    }
    requestIcloudSecure(config, start, end, (function (json) {
        var reslist = {};
        if (json && json.multistatus && json.multistatus.response) {
            var ics;
            if (json.multistatus.response.propstat) {
                process(reslist, start, end, json.multistatus.response.propstat.prop['calendar-data']._cdata);
            }
            else {
                json.multistatus.response.forEach(function (response) { return process(reslist, start, end, response.propstat.prop['calendar-data']._cdata); });
            }
        }
        cb(reslist, start, end);
    }));
}
exports.loadEventsForDay = loadEventsForDay;

//# sourceMappingURL=icloud.js.map
