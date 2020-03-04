const Moment = require('moment');
const MomentRange = require('moment-range'),
    moment = MomentRange.extendMoment(Moment),
    https = require('https'),
    icalExpander = require('ical-expander'),
    xmlParser = require('xml-js');
import { convertEvents, IcalNode } from './helper';
import { Config } from './ical-config';

function process(reslist, start, end, ics) {
    const cal = new icalExpander({ ics, maxIterations: 1000 });
    const events = cal.between(start.toDate(), end.toDate());

    for(let event of convertEvents(events)){
        reslist[event.uid+event.start] = event;  
    }
}

function requestIcloudSecure(config: Config, start, end, cb): any {
    const DavTimeFormat = 'YYYYMMDDTHHmms\\Z',
        url = config.url,
        user = config.username,
        pass = config.password,
        urlparts = /(https?)\:\/\/(.*?):?(\d*)?(\/.*\/?)/gi.exec(url),
        protocol = urlparts[1],
        host = urlparts[2],
        port = urlparts[3] || (protocol === "https" ? 443 : 80),
        path = urlparts[4];

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
                const json = JSON.parse(xmlParser.xml2json(s, { compact: true, spaces: 0 }));

                cb(json);
            } catch (e) {
                console.error("Error parsing response", e)
            }
        });
    });

    req.end(xml);

    req.on('error', function (e) {
        console.error('problem with request: ' + e.message);
    });
}

export function loadEventsForDay(whenMoment, node: IcalNode, cb) {


    let start = whenMoment.clone().startOf('day').subtract(node.config.pastview, node.config.pastviewUnits);
    let end = whenMoment.clone().endOf('day').add(node.config.preview, node.config.previewUnits);

    if (node.config.pastviewUnits === 'days') {
        start = whenMoment.clone().startOf('day').subtract(node.config.pastview + 1, 'days');
    }
    if (node.config.previewUnits === 'days') {
        end = whenMoment.clone().endOf('day').add(node.config.preview, 'days');
    }

    requestIcloudSecure(node.config, start, end, (json => {
        var reslist = {};
        if (json && json.multistatus && json.multistatus.response) {
            var ics;
            if (json.multistatus.response.propstat) {
                process(reslist, start, end, json.multistatus.response.propstat.prop['calendar-data']._cdata);
            } else {
                json.multistatus.response.forEach(response => process(reslist, start, end, response.propstat.prop['calendar-data']._cdata));
            }
        }
        cb(reslist, start, end);
    }));
}