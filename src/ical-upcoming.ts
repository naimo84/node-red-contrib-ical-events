import { Red, Node } from 'node-red';
import { Config } from "./ical-events";
import { CronJob } from 'cron';
import * as  ical from 'node-ical';
import icalHelper from './icalHelper';
import { isEqual } from 'lodash';

var parser = require('cron-parser');
var RRule = require('rrule').RRule;

var ce = require('cloneextend');
var datesArray = [];
var datesArray_old = [];

module.exports = function (RED: Red) {
    let configNode: Config;
    let job: CronJob;
    function upcomingNode(config: any) {
        RED.nodes.createNode(this, config);
        try {
            var next = parser.parseExpression(config.cron);
            configNode = RED.nodes.getNode(config.confignode) as unknown as Config;
            this.status({fill:"green",shape:"dot",text:next.next().toISOString()})
            job = new CronJob(config.cron || '0,30 * * * * *', cronCheckJob.bind(null, this, configNode));
            this.on('close', () => {
                job.stop();
                this.debug("cron stopped")
            });

            icalHelper.config = configNode;

            job.start();
        }
        catch (err) {
            this.error('Error: ' + err.message);
            this.status({fill:"red",shape:"ring",text:err.message})
        }
    }

    function cronCheckJob(node: Node, config: Config) {
        node.debug("upcoming events");
        datesArray_old = ce.clone(datesArray);
        datesArray = [];
        checkICal(config.url, (err) => {
            displayDates(node);
        }, node, config);
    }

    function processData(data, realnow, today, endpreview, now2, callback, node, config) {
        var processedEntries = 0;
        for (var k in data) {
            var ev = data[k];
            delete data[k];

            if ((ev.summary !== undefined) && (ev.type === 'VEVENT')) {
                if (!ev.end) {
                    ev.end = ce.clone(ev.start);
                    if (!ev.start.getHours() && !ev.start.getMinutes() && !ev.start.getSeconds()) {
                        ev.end.setDate(ev.end.getDate() + 1);
                    }
                }
                // aha, it is RRULE in the event --> process it
                if (ev.rrule !== undefined) {
                    var eventLength = ev.end.getTime() - ev.start.getTime();

                    var options = RRule.parseString(ev.rrule.toString());
                    // convert times temporary to UTC
                    options.dtstart = icalHelper.addOffset(ev.start, -icalHelper.getTimezoneOffset(ev.start));
                    if (options.until) {
                        options.until = icalHelper.addOffset(options.until, -icalHelper.getTimezoneOffset(options.until));
                    }
                    node.debug('options:' + JSON.stringify(options));

                    var rule = new RRule(options);

                    var now3 = new Date(now2.getTime() - eventLength);
                    if (now2 < now3) now3 = now2;
                    node.debug('RRule event:' + ev.summary + '; start:' + ev.start.toString() + '; endpreview:' + endpreview.toString() + '; today:' + today + '; now2:' + now2 + '; now3:' + now3 + '; rule:' + JSON.stringify(rule));

                    var dates = [];
                    try {
                        dates = rule.between(now3, endpreview, true);
                    } catch (e) {
                        node.error('Issue detected in RRule, event ignored; Please forward debug information to iobroker.ical developer: ' + e.stack + '\n' +
                            'RRule object: ' + JSON.stringify(rule) + '\n' +
                            'now3: ' + now3 + '\n' +
                            'endpreview: ' + endpreview + '\n' +
                            'string: ' + ev.rrule.toString() + '\n' +
                            'options: ' + JSON.stringify(options)
                        );
                    }

                    node.debug('dates:' + JSON.stringify(dates));
                    // event within the time window
                    if (dates.length > 0) {
                        for (var i = 0; i < dates.length; i++) {
                            // use deep-copy otherwise setDate etc. overwrites data from different events
                            var ev2 = ce.clone(ev);

                            // replace date & time for each event in RRule
                            // convert time back to local times
                            var start = dates[i];
                            ev2.start = icalHelper.addOffset(start, icalHelper.getTimezoneOffset(start));

                            // Set end date based on length in ms
                            var end = new Date(start.getTime() + eventLength);
                            ev2.end = icalHelper.addOffset(end, icalHelper.getTimezoneOffset(end));

                            node.debug('  ' + i + ': Event (' + JSON.stringify(ev2.exdate) + '):' + ev2.start.toString() + ' ' + ev2.end.toString());

                            // we have to check if there is an exdate array
                            // which defines dates that - if matched - should
                            // be excluded.
                            var checkDate = true;
                            if (ev2.exdate) {
                                for (var d in ev2.exdate) {
                                    let dt = new Date(d);
                                    if (dt.getTime() === ev2.start.getTime()) {
                                        checkDate = false;
                                        node.debug('   ' + i + ': sort out');
                                        break;
                                    }
                                }
                            }
                            if (checkDate && ev.recurrences) {
                                for (var dOri in ev.recurrences) {
                                    var dt = new Date(dOri);
                                    if (dt.getTime() === ev2.start.getTime()) {
                                        ev2 = ce.clone(ev.recurrences[dOri]);
                                        node.debug('   ' + i + ': different recurring found replaced with Event:' + ev2.start + ' ' + ev2.end);
                                    }
                                }
                            }

                            if (checkDate) {
                                checkDates(ev2, endpreview, today, realnow, ' rrule ', node, config);
                            }
                        }
                    } else {
                        node.debug('no RRule events inside the time interval');
                    }
                } else {
                    // No RRule event
                    checkDates(ev, endpreview, today, realnow, ' ', node, config);
                }
            }

            if (++processedEntries > 100) {
                break;
            }
        }
        if (!Object.keys(data).length) {
            callback("Object.keys(data).length");
            return;
        } else {
            setImmediate(() => {
                processData(data, realnow, today, endpreview, now2, callback, node, config);
            });
        }
    }

    function checkDates(ev, endpreview, today, realnow, rule, node, config) {
        var fullday = false;
        var reason;
        var date;

        // chech if sub parameter exists for outlook 
        if (ev.summary.hasOwnProperty('val')) {
            // yes -> read reason
            reason = ev.summary.val;
        } else {
            // no
            reason = ev.summary;
        }

        var location = ev.location || '';

        // If not start point => ignore it
        if (!ev.start) return;

        // If not end point => assume 0:0:0 event and set to same as start
        if (!ev.end) ev.end = ev.start;

        // If full day
        if (!ev.start.getHours() &&
            !ev.start.getMinutes() &&
            !ev.start.getSeconds() &&
            !ev.end.getHours() &&
            !ev.end.getMinutes() &&
            !ev.end.getSeconds()
        ) {
            // interpreted as one day; RFC says end date must be after start date
            if (ev.end.getTime() == ev.start.getTime() && ev.datetype == 'date') {
                ev.end.setDate(ev.end.getDate() + 1);
            }
            if (ev.end.getTime() !== ev.start.getTime()) {
                fullday = true;
            }
        }

        // If force Fullday is set
        if (config.forceFullday && !fullday) {
            fullday = true;
            ev.start.setMinutes(0);
            ev.start.setSeconds(0);
            ev.start.setHours(0);
            ev.end.setDate(ev.end.getDate() + 1);
            ev.end.setHours(0);
            ev.end.setMinutes(0);
            ev.end.setSeconds(0);
        }

        // Full day
        if (fullday) {
            if ((ev.start < endpreview && ev.start >= today) || (ev.end > today && ev.end <= endpreview) || (ev.start < today && ev.end > today)) {
                date = icalHelper.formatDate(ev.start, ev.end, true, true, config);

                icalHelper.insertSorted(datesArray, {
                    date: date.text,
                    event: reason,
                    _date: new Date(ev.start.getTime()),
                    _end: new Date(ev.end.getTime()),
                    _section: ev.description,
                    _IDID: ev.uid,
                    _allDay: true,
                    _rule: rule,
                    location: location
                });

                node.debug('Event (full day) added : ' + JSON.stringify(rule) + ' ' + reason + ' at ' + date.text);
            }
        } else {
            // Event with time         
            if ((ev.start >= today && ev.start < endpreview && ev.end >= realnow) || (ev.end >= realnow && ev.end <= endpreview) || (ev.start < realnow && ev.end > realnow)) {

                date = icalHelper.formatDate(ev.start, ev.end, true, false, config);
                icalHelper.insertSorted(datesArray, {
                    date: date.text,
                    event: reason,
                    _date: new Date(ev.start.getTime()),
                    _end: new Date(ev.end.getTime()),
                    _section: ev.description,
                    _IDID: ev.uid,
                    _allDay: false,
                    _rule: rule,
                    location: location
                });
                node.debug('Event with time added: ' + JSON.stringify(rule) + ' ' + reason + ' at ' + date.text);
            }
        }
    }

    function getICal(urlOrFile, callback) {
        // Is it file or URL
        if (urlOrFile.match(/^https?:\/\//)) {
            ical.fromURL(configNode.url, {}, (err, data) => {
                if (err) {
                    callback && callback(err, null);
                    return;
                }
                callback && callback(null, data);
            });

        }
    }


    function checkICal(urlOrFile, callback, node, config) {
        getICal(urlOrFile, (err, data) => {
            if (err || !data) {
                callback(err);
                return;
            }

            node.debug('Ical read successfully ' + urlOrFile);

            try {
                if (data) {
                    var realnow = new Date();
                    var today = new Date();
                    today.setHours(0, 0, 0, 0);
                    var endpreview = new Date();
                    endpreview.setDate(endpreview.getDate() + 10);

                    var now2 = new Date();
                    now2.setHours(0, 0, 0, 0);

                    setImmediate(() => {
                        processData(data, realnow, today, endpreview, now2, callback, node, config);
                    });
                }
                else {
                    callback("no Data");
                }

            } catch (e) {
                node.debug(JSON.stringify(e));
                callback("no Data" + e);
            }
        });
    }

    function displayDates(node: Node) {
        let todayEventcounter = 0;
        let tomorrowEventcounter = 0;
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let oneDay = 24 * 60 * 60 * 1000;
        let tomorrow = new Date(today.getTime() + oneDay);
        let dayAfterTomorrow = new Date(tomorrow.getTime() + oneDay);

        if (datesArray.length && !isEqual(datesArray, datesArray_old)) {
            for (var t = 0; t < datesArray.length; t++) {
                if (datesArray[t]._end.getTime() > today.getTime() && datesArray[t]._date.getTime() < tomorrow.getTime()) {
                    todayEventcounter++;
                }
                if (datesArray[t]._end.getTime() > tomorrow.getTime() && datesArray[t]._date.getTime() < dayAfterTomorrow.getTime()) {
                    tomorrowEventcounter++;
                }
            }

            node.send({
                today: todayEventcounter,
                tomorrow: tomorrowEventcounter,
                total: datesArray.length,
                payload: datesArray
            });

        }
    }


    RED.nodes.registerType("ical-upcoming", upcomingNode);
}