import { Red, Node } from 'node-red';
import { CalEvent } from "./ical-events";
import { CronJob } from 'cron';
import * as  ical from 'node-ical';
import icalHelper, { Config } from './icalHelper';
import { isEqual } from 'lodash';

var parser = require('cron-parser');
var RRule = require('rrule').RRule;

var ce = require('cloneextend');
var datesArray: CalEvent[] = [];

var datesArray_old = [];

module.exports = function (RED: Red) {
    let configNode: Config;
    let job: CronJob;
    function upcomingNode(config: any) {
        RED.nodes.createNode(this, config);
        try {
            parser.parseExpression(config.cron);
            configNode = RED.nodes.getNode(config.confignode) as unknown as Config;
            icalHelper.config = configNode;
            this.on('input', () => {
                job.stop();
                cronCheckJob(this, configNode);               
            });

            job = new CronJob(config.cron || '0 0 * * * *', cronCheckJob.bind(null, this, configNode));
            this.on('close', () => {
                job.stop();
                this.debug("cron stopped")
            });

            
            job.start();
        }
        catch (err) {
            this.error('Error: ' + err.message);
            this.status({ fill: "red", shape: "ring", text: err.message })
        }
    }

    function cronCheckJob(node: Node, config: Config) {        
        if (job.running){
            node.status({ fill: "green", shape: "dot", text: job.nextDate().toISOString() });
        }
        else {
            node.status({});
        }

        datesArray_old = ce.clone(datesArray);
        datesArray = [];
        checkICal(config.url, (err) => {
            displayDates(node, config);
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

                if (ev.rrule === undefined) {
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

    function checkDates(ev, endpreview, today, realnow, rule, node, config: Config) {
        var fullday = false;
        var reason;
        var date;

        if (ev.summary.hasOwnProperty('val')) {
            reason = ev.summary.val;
        } else {
            reason = ev.summary;
        }

        var location = ev.location || '';

        if (!ev.start) return;
        if (!ev.end) ev.end = ev.start;
        if (!ev.start.getHours() &&
            !ev.start.getMinutes() &&
            !ev.start.getSeconds() &&
            !ev.end.getHours() &&
            !ev.end.getMinutes() &&
            !ev.end.getSeconds()
        ) {
            if (ev.end.getTime() == ev.start.getTime() && ev.datetype == 'date') {
                ev.end.setDate(ev.end.getDate() + 1);
            }
            if (ev.end.getTime() !== ev.start.getTime()) {
                fullday = true;
            }
        }

        if (fullday) {
            if ((ev.start < endpreview && ev.start >= today) || (ev.end > today && ev.end <= endpreview) || (ev.start < today && ev.end > today)) {
                date = icalHelper.formatDate(ev.start, ev.end, true, true);

                icalHelper.insertSorted(datesArray, {
                    date: date.text,
                    summary: ev.summary,
                    event: reason,
                    eventStart: new Date(ev.start.getTime()),
                    eventEnd: new Date(ev.end.getTime()),
                    description: ev.description,
                    id: ev.uid,
                    allDay: true,
                    rule: rule,
                    location: location
                });

                node.debug('Event (full day) added : ' + JSON.stringify(rule) + ' ' + reason + ' at ' + date.text);
            }
        } else {
            // Event with time         
            if ((ev.start >= today && ev.start < endpreview && ev.end >= realnow) || (ev.end >= realnow && ev.end <= endpreview) || (ev.start < realnow && ev.end > realnow)) {

                date = icalHelper.formatDate(ev.start, ev.end, true, false);
                icalHelper.insertSorted(datesArray, {
                    date: date.text,
                    event: reason,
                    summary: ev.summary,
                    eventStart: new Date(ev.start.getTime()),
                    eventEnd: new Date(ev.end.getTime()),
                    description: ev.description,
                    id: ev.uid,
                    allDay: false,
                    rule: rule,
                    location: location
                });
                node.debug('Event with time added: ' + JSON.stringify(rule) + ' ' + reason + ' at ' + date.text);
            }
        }
    }

    function getICal(urlOrFile, callback) {
        console.log(urlOrFile);
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


    function checkICal(urlOrFile, callback, node, config: Config) {
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

    function displayDates(node: Node, config: Config) {
        let todayEventcounter = 0;
        let tomorrowEventcounter = 0;
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let oneDay = 24 * 60 * 60 * 1000;
        let tomorrow = new Date(today.getTime() + oneDay);
        let dayAfterTomorrow = new Date(tomorrow.getTime() + oneDay);

        if (datesArray.length && !isEqual(datesArray, datesArray_old)) {
            for (var t = 0; t < datesArray.length; t++) {
                if (datesArray[t].eventEnd.getTime() > today.getTime() && datesArray[t].eventStart.getTime() < tomorrow.getTime()) {
                    todayEventcounter++;
                }
                if (datesArray[t].eventEnd.getTime() > tomorrow.getTime() && datesArray[t].eventStart.getTime() < dayAfterTomorrow.getTime()) {
                    tomorrowEventcounter++;
                }
            }

            node.send({
                today: todayEventcounter,
                tomorrow: tomorrowEventcounter,
                total: datesArray.length,
                htmlTable: icalHelper.brSeparatedList(datesArray),
                payload: datesArray
            });
        }
    }


    RED.nodes.registerType("ical-upcoming", upcomingNode);
}