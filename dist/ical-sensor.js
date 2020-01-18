"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto-js");
var cron_1 = require("cron");
var helper_1 = require("./helper");
var RRule = require('rrule').RRule;
var ce = require('cloneextend');
module.exports = function (RED) {
    function sensorNode(config) {
        var _this = this;
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.confignode);
        var node = this;
        node.trigger = config.trigger;
        node.filter = config.filter;
        this.config = configNode;
        try {
            node.on('input', function () {
                cronCheckJob(_this, config);
            });
            if (config.timeout && config.timeout !== "" && config.timeoutUnits && config.timeoutUnits !== "") {
                var cron = '0 0 * * * *';
                switch (config.timeoutUnits) {
                    case 'seconds':
                        cron = "*/" + config.timeout + " * * * * *";
                        break;
                    case 'minutes':
                        cron = "0 */" + config.timeout + " * * * *";
                        break;
                    case 'hours':
                        cron = "0 0 */" + config.timeout + " * * *";
                        break;
                    case 'days':
                        cron = "0 0 0 */" + config.timeout + " * *";
                        break;
                    default:
                        break;
                }
                node.job = new cron_1.CronJob(cron, cronCheckJob.bind(null, node, config));
                node.job.start();
                node.on('close', function () {
                    node.job.stop();
                });
            }
            cronCheckJob(this, config);
        }
        catch (err) {
            node.error('Error: ' + err.message);
            node.status({ fill: "red", shape: "ring", text: err.message });
        }
    }
    function processRRule(ev, node, dateNow) {
        var eventLength = ev.end.getTime() - ev.start.getTime();
        var options = RRule.parseString(ev.rrule.toString());
        options.dtstart = helper_1.addOffset(ev.start, -helper_1.getTimezoneOffset(ev.start));
        if (options.until) {
            options.until = helper_1.addOffset(options.until, -helper_1.getTimezoneOffset(options.until));
        }
        //node.debug('options:' + JSON.stringify(options));
        var rule = new RRule(options);
        var now2 = new Date();
        now2.setHours(0, 0, 0, 0);
        var now3 = new Date(now2.getTime() - eventLength);
        if (now2 < now3)
            now3 = now2;
        var dates = [];
        try {
            dates = rule.between(now3, helper_1.addOffset(new Date(), 24 * 60), true);
        }
        catch (e) {
            node.error('Issue detected in RRule, event ignored; ' +
                e.stack +
                '\n' +
                'RRule object: ' +
                JSON.stringify(rule) +
                '\n' +
                'now3: ' +
                now3 +
                '\n' +
                'string: ' +
                ev.rrule.toString() +
                '\n' +
                'options: ' +
                JSON.stringify(options));
        }
        node.debug('dates:' + JSON.stringify(dates));
        if (dates.length > 0) {
            for (var i = 0; i < dates.length; i++) {
                var ev2 = ce.clone(ev);
                var start = dates[i];
                ev2.start = helper_1.addOffset(start, helper_1.getTimezoneOffset(start));
                var end = new Date(start.getTime() + eventLength);
                ev2.end = helper_1.addOffset(end, helper_1.getTimezoneOffset(end));
                node.debug('   ' + i + ': Event (' + JSON.stringify(ev2.exdate) + '):' + ev2.start.toString() + ' ' + ev2.end.toString());
                var checkDate = true;
                if (ev2.exdate) {
                    for (var d in ev2.exdate) {
                        if (new Date(d).getTime() === ev2.start.getTime()) {
                            checkDate = false;
                            node.debug('   ' + i + ': sort out');
                            break;
                        }
                    }
                }
                if (checkDate && ev.recurrences) {
                    for (var dOri in ev.recurrences) {
                        if (new Date(dOri).getTime() === ev2.start.getTime()) {
                            ev2 = ce.clone(ev.recurrences[dOri]);
                            node.debug('   ' + i + ': different recurring found replaced with Event:' + ev2.start + ' ' + ev2.end);
                        }
                    }
                }
                if (checkDate && ev2.start <= dateNow && ev2.end >= dateNow) {
                    return ev2;
                }
            }
        }
    }
    function cronCheckJob(node, config) {
        if (node.job && node.job.running) {
            node.status({ fill: "green", shape: "dot", text: node.job.nextDate().toISOString() });
        }
        else {
            node.status({});
        }
        var dateNow = new Date();
        helper_1.getICal(node, node.config.url, node.config, function (err, data) {
            if (err || !data) {
                return;
            }
            node.debug('Ical read successfully ' + config.url);
            if (!data)
                return;
            var current = false;
            var last = node.context().get('on');
            for (var k in data) {
                if (data.hasOwnProperty(k)) {
                    var ev = data[k];
                    //delete data[k];
                    if (ev.type == 'VEVENT') {
                        var ev2 = void 0;
                        if (ev.rrule !== undefined) {
                            // console.log(`${ev.summary} "rrule"`)
                            ev2 = ce.clone(processRRule(ev, node, dateNow));
                        }
                        if (ev2) {
                            //console.log(ev2)
                            ev = ev2;
                            // console.log(`${ev.summary} "rrule"`)
                        }
                        var eventStart = new Date(ev.start);
                        var eventEnd = new Date(ev.end);
                        if (eventStart <= dateNow && eventEnd >= dateNow) {
                            var output = false;
                            if (node.trigger == 'match') {
                                var regex = new RegExp(node.filter);
                                if (regex.test(ev.summary))
                                    output = true;
                            }
                            else if (node.trigger == 'nomatch') {
                                var regex = new RegExp(node.filter);
                                if (!regex.test(ev.summary))
                                    output = true;
                            }
                            else {
                                output = true;
                            }
                            var uid = crypto.MD5(ev.created + ev.summary).toString();
                            if (ev.uid) {
                                uid = ev.uid;
                            }
                            var event_1 = {
                                on: false
                            };
                            if (output) {
                                event_1 = {
                                    summary: ev.summary,
                                    topic: ev.summary,
                                    id: uid,
                                    location: ev.location,
                                    eventStart: new Date(ev.start),
                                    eventEnd: new Date(ev.end),
                                    description: ev.description,
                                    on: true,
                                    calendarName: ev.calendarName,
                                    countdown: helper_1.countdown(new Date(ev.start))
                                };
                            }
                            node.send({
                                payload: event_1
                            });
                            current = true;
                            if (last != current) {
                                node.send([null, {
                                        payload: event_1
                                    }]);
                            }
                        }
                    }
                }
            }
            if (!current) {
                var event_2 = {
                    on: false
                };
                node.send({
                    payload: event_2
                });
                if (last != current) {
                    node.send([null, {
                            payload: event_2
                        }]);
                }
            }
            node.context().set('on', current);
        });
    }
    RED.nodes.registerType("ical-sensor", sensorNode);
};

//# sourceMappingURL=ical-sensor.js.map
