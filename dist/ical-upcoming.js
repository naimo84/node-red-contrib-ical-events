"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cron_1 = require("cron");
var ical = require("node-ical");
var icalHelper_1 = require("./icalHelper");
var lodash_1 = require("lodash");
var parser = require('cron-parser');
var RRule = require('rrule').RRule;
var ce = require('cloneextend');
var datesArray = [];
var datesArray_old = [];
module.exports = function (RED) {
    var configNode;
    var job;
    function upcomingNode(config) {
        var _this = this;
        RED.nodes.createNode(this, config);
        try {
            parser.parseExpression(config.cron);
            configNode = RED.nodes.getNode(config.confignode);
            job = new cron_1.CronJob(config.cron || '0 0 * * * *', cronCheckJob.bind(null, this, configNode));
            this.on('close', function () {
                job.stop();
                _this.debug("cron stopped");
            });
            icalHelper_1.default.config = configNode;
            job.start();
        }
        catch (err) {
            this.error('Error: ' + err.message);
            this.status({ fill: "red", shape: "ring", text: err.message });
        }
    }
    function cronCheckJob(node, config) {
        node.debug("upcoming events");
        node.status({ fill: "green", shape: "dot", text: job.nextDate().toISOString() });
        datesArray_old = ce.clone(datesArray);
        datesArray = [];
        checkICal(config.url, function (err) {
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
                    options.dtstart = icalHelper_1.default.addOffset(ev.start, -icalHelper_1.default.getTimezoneOffset(ev.start));
                    if (options.until) {
                        options.until = icalHelper_1.default.addOffset(options.until, -icalHelper_1.default.getTimezoneOffset(options.until));
                    }
                    node.debug('options:' + JSON.stringify(options));
                    var rule = new RRule(options);
                    var now3 = new Date(now2.getTime() - eventLength);
                    if (now2 < now3)
                        now3 = now2;
                    node.debug('RRule event:' + ev.summary + '; start:' + ev.start.toString() + '; endpreview:' + endpreview.toString() + '; today:' + today + '; now2:' + now2 + '; now3:' + now3 + '; rule:' + JSON.stringify(rule));
                    var dates = [];
                    try {
                        dates = rule.between(now3, endpreview, true);
                    }
                    catch (e) {
                        node.error('Issue detected in RRule, event ignored; Please forward debug information to iobroker.ical developer: ' + e.stack + '\n' +
                            'RRule object: ' + JSON.stringify(rule) + '\n' +
                            'now3: ' + now3 + '\n' +
                            'endpreview: ' + endpreview + '\n' +
                            'string: ' + ev.rrule.toString() + '\n' +
                            'options: ' + JSON.stringify(options));
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
                            ev2.start = icalHelper_1.default.addOffset(start, icalHelper_1.default.getTimezoneOffset(start));
                            // Set end date based on length in ms
                            var end = new Date(start.getTime() + eventLength);
                            ev2.end = icalHelper_1.default.addOffset(end, icalHelper_1.default.getTimezoneOffset(end));
                            node.debug('  ' + i + ': Event (' + JSON.stringify(ev2.exdate) + '):' + ev2.start.toString() + ' ' + ev2.end.toString());
                            // we have to check if there is an exdate array
                            // which defines dates that - if matched - should
                            // be excluded.
                            var checkDate = true;
                            if (ev2.exdate) {
                                for (var d in ev2.exdate) {
                                    var dt_1 = new Date(d);
                                    if (dt_1.getTime() === ev2.start.getTime()) {
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
                    }
                    else {
                        node.debug('no RRule events inside the time interval');
                    }
                }
                else {
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
        }
        else {
            setImmediate(function () {
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
        }
        else {
            // no
            reason = ev.summary;
        }
        var location = ev.location || '';
        // If not start point => ignore it
        if (!ev.start)
            return;
        // If not end point => assume 0:0:0 event and set to same as start
        if (!ev.end)
            ev.end = ev.start;
        // If full day
        if (!ev.start.getHours() &&
            !ev.start.getMinutes() &&
            !ev.start.getSeconds() &&
            !ev.end.getHours() &&
            !ev.end.getMinutes() &&
            !ev.end.getSeconds()) {
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
                date = icalHelper_1.default.formatDate(ev.start, ev.end, true, true, config);
                icalHelper_1.default.insertSorted(datesArray, {
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
        }
        else {
            // Event with time         
            if ((ev.start >= today && ev.start < endpreview && ev.end >= realnow) || (ev.end >= realnow && ev.end <= endpreview) || (ev.start < realnow && ev.end > realnow)) {
                date = icalHelper_1.default.formatDate(ev.start, ev.end, true, false, config);
                icalHelper_1.default.insertSorted(datesArray, {
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
        // Is it file or URL
        if (urlOrFile.match(/^https?:\/\//)) {
            ical.fromURL(configNode.url, {}, function (err, data) {
                if (err) {
                    callback && callback(err, null);
                    return;
                }
                callback && callback(null, data);
            });
        }
    }
    function checkICal(urlOrFile, callback, node, config) {
        getICal(urlOrFile, function (err, data) {
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
                    setImmediate(function () {
                        processData(data, realnow, today, endpreview, now2, callback, node, config);
                    });
                }
                else {
                    callback("no Data");
                }
            }
            catch (e) {
                node.debug(JSON.stringify(e));
                callback("no Data" + e);
            }
        });
    }
    function displayDates(node) {
        var todayEventcounter = 0;
        var tomorrowEventcounter = 0;
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var oneDay = 24 * 60 * 60 * 1000;
        var tomorrow = new Date(today.getTime() + oneDay);
        var dayAfterTomorrow = new Date(tomorrow.getTime() + oneDay);
        if (datesArray.length && !lodash_1.isEqual(datesArray, datesArray_old)) {
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
                payload: datesArray
            });
        }
    }
    RED.nodes.registerType("ical-upcoming", upcomingNode);
};
