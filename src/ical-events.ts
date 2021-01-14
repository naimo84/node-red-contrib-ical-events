
import { Red, Node } from 'node-red';
import * as crypto from "crypto-js";
import { CronJob } from 'cron';
import { CronTime } from 'cron';
import * as parser from 'cron-parser';
import { Config } from './ical-config';
import { getICal, CalEvent, countdown, getConfig, IcalNode, addOffset, getTimezoneOffset, filterOutput } from './helper';
import * as NodeCache from 'node-cache';
var ce = require('cloneextend');
var RRule = require('rrule').RRule;

module.exports = function (RED: Red) {
    let newCronJobs = new Map();
    let startedCronJobs = {};
    function eventsNode(config: any) {
        RED.nodes.createNode(this, config);
        let node: IcalNode = this;

        try {
            node.config = getConfig(RED.nodes.getNode(config.confignode) as unknown as Config, config, null);
            node.cache = new NodeCache();
            node.msg = {};
            node.on('input', (msg) => {
                node.msg = RED.util.cloneMessage(msg);
                node.config = getConfig(RED.nodes.getNode(config.confignode) as unknown as Config, config, msg);
                cronCheckJob(node);
            });

            node.on('close', () => {
                node.debug("cron stopped");
                if (startedCronJobs) {
                    for (let key in startedCronJobs) {
                        if (startedCronJobs.hasOwnProperty(key)) {
                            node.debug(key + " stopped")
                            startedCronJobs[key].stop();
                        }
                    }
                }
            });

            let cron = '';
            if (config.timeout && config.timeout !== '' && parseInt(config.timeout) > 0 && config.timeoutUnits && config.timeoutUnits !== '') {
                switch (config.timeoutUnits) {
                    case 'seconds':
                        cron = `*/${config.timeout} * * * * *`;
                        break;
                    case 'minutes':
                        cron = `0 */${config.timeout} * * * *`;
                        break;
                    case 'hours':
                        cron = `0 0 */${config.timeout} * * *`;
                        break;
                    case 'days':
                        cron = `0 0 0 */${config.timeout} * *`;

                        break;
                    default:
                        break;
                }
            }
            if (config.cron && config.cron !== '') {
                parser.parseExpression(config.cron);
                cron = config.cron;
            }

            if (cron !== '') {
                node.job = new CronJob(cron, cronCheckJob.bind(null, node));
                node.job.start();

                node.on('close', () => {
                    node.job.stop();
                });
            }
        }
        catch (err) {
            node.error('Error: ' + err.message);
            node.status({ fill: "red", shape: "ring", text: err.message })
        }
    }


    function processRRule(ev, node: IcalNode, dateNow) {
        var eventLength = ev.end.getTime() - ev.start.getTime();

        var options = RRule.parseString(ev.rrule.toString());
        options.dtstart = addOffset(ev.start, -getTimezoneOffset(ev.start));
        if (options.until) {
            options.until = addOffset(options.until, -getTimezoneOffset(options.until));
        }
        //node.debug('options:' + JSON.stringify(options));

        var rule = new RRule(options);
        var now2 = new Date();
        now2.setHours(0, 0, 0, 0);
        var now3 = new Date(now2.getTime() - eventLength);
        if (now2 < now3) now3 = now2;

        var dates = [];
        try {
            dates = rule.between(now3, addOffset(new Date(), 24 * 60), true);
        } catch (e) {
            node.error(
                'Issue detected in RRule, event ignored; ' +
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
                JSON.stringify(options)
            );
        }

        node.debug('dates:' + JSON.stringify(dates));
        let reslist = [];
        if (dates.length > 0) {
            for (var i = 0; i < dates.length; i++) {
                var ev2 = ce.clone(ev);
                var start = dates[i];
                ev2.start = addOffset(start, getTimezoneOffset(start));

                var end = new Date(start.getTime() + eventLength);
                ev2.end = addOffset(end, getTimezoneOffset(end));

                node.debug('   ' + i + ': Event (' + JSON.stringify(ev2.exdate) + '):' + ev2.start.toString() + ' ' + ev2.end.toString());

                var checkDate = true;
                if (ev2.exdate) {
                    for (var d in ev2.exdate) {
                        let exdate = ev2.exdate[d]
                        if (exdate) {
                            if (exdate.getTime() === ev2.start.getTime()) {
                                checkDate = false;
                                node.debug('   ' + i + ': sort out');
                                break;
                            }
                        }
                    }
                }
                if (checkDate && ev.recurrences) {
                    for (var dOri in ev.recurrences) {
                        let recurrenceid = ev.recurrences[dOri].recurrenceid
                        if (recurrenceid) {
                            if (recurrenceid.getTime() === ev2.start.getTime()) {
                                ev2 = ce.clone(ev.recurrences[dOri]);
                                node.debug('   ' + i + ': different recurring found replaced with Event:' + ev2.start + ' ' + ev2.end);
                            }
                        }
                    }
                }

                if (checkDate) {
                    reslist.push(ev2);
                }
            }
        }
        return reslist;
    }

    function cronCheckJob(node: IcalNode) {
        if (node.job && node.job.running) {
            node.status({ fill: "green", shape: "dot", text: `next check: ${node.job.nextDate().toLocaleString()}` });
        }
        else {
            node.status({});
        }
        let dateNow = new Date();
        let possibleUids = [];
        getICal(node, node.config).then((data) => {



            node.debug('Ical read successfully ' + node.config.url);
            if (data) {
                for (let k in data) {
                    if (data.hasOwnProperty(k)) {
                        let ev = data[k];


                        if (ev.type == 'VEVENT') {
                            let ev2;
                            if (ev.rrule !== undefined) {
                                ev2 = ce.clone(processRRule(ev, node, dateNow));
                            }
                            if (ev2) {
                                ev = ev2
                            }

                            if (ev instanceof Array && ev.length >= 1) {
                                for (let e of ev) {
                                    processData(e, possibleUids, dateNow, node)
                                }
                            } else {
                                processData(ev, possibleUids, dateNow, node)
                            }

                        }
                    }
                }

                if (newCronJobs) {
                    let triggerDate = [];

                    newCronJobs.forEach((job, key) => {
                        try {
                            let nextDates = job.nextDates();
                            if (nextDates.toDate() > dateNow) {
                                triggerDate.push(nextDates.toString());
                                job.start();
                                node.debug("starting - " + key);
                                startedCronJobs[key] = job;
                            }
                        } catch (newCronErr) {
                            node.warn(newCronErr);
                        }
                    });

                    triggerDate.sort((a, b) => {
                        return new Date(a).valueOf() - new Date(b).valueOf();
                    });

                    if (triggerDate.length > 0)
                        node.status({ text: `next trigger: ${triggerDate[0]}`, fill: "green", shape: "dot" })
                }

                newCronJobs.clear();
            }

            for (let key in startedCronJobs) {
                if (startedCronJobs.hasOwnProperty(key)) {
                    if (startedCronJobs[key].running == false) {
                        delete startedCronJobs[key];
                    }
                    else if (!(possibleUids.includes(key, 0))) {
                        startedCronJobs[key].stop();
                        delete startedCronJobs[key];
                    }
                }
            }
        }).catch(err => {
            if (err) {
                node.error('Error: ' + err);
                node.status({ fill: 'red', shape: 'ring', text: err.message });
                node.send({
                    error: err
                });
                return;
            }
        });
    }

    function processData(ev: any, possibleUids, dateNow, node) {



        let output = filterOutput(node, ev)
        if (output) {
            const eventStart = new Date(ev.start);
            const eventEnd = new Date(ev.end);

            if (node.config.offset) {
                if (node.config?.offsetUnits === 'seconds') {
                    eventStart.setSeconds(eventStart.getSeconds() + node.config.offset);
                    eventEnd.setSeconds(eventEnd.getSeconds() + node.config.offset);
                } else if (node.config?.offsetUnits === 'hours') {
                    eventStart.setHours(eventStart.getHours() + node.config.offset);
                    eventEnd.setHours(eventEnd.getHours() + node.config.offset);
                } else if (node.config?.offsetUnits === 'days') {
                    eventStart.setDate(eventStart.getDate() + node.config.offset);
                    eventEnd.setDate(eventEnd.getDate() + node.config.offset);
                } else {
                    eventStart.setMinutes(eventStart.getMinutes() + node.config.offset);
                    eventEnd.setMinutes(eventEnd.getMinutes() + node.config.offset);
                }
            }
        
            if (eventStart > dateNow) {
                let uid = crypto.MD5(ev.created + ev.summary + "start").toString();
                if (ev.uid) {
                    uid = ev.uid + "start";
                }
                possibleUids.push(uid);
                const event: CalEvent = {
                    summary: ev.summary,
                    categories: ev.categories,
                    topic: ev.summary,
                    id: uid,
                    location: ev.location,
                    eventStart: new Date(ev.start),
                    eventEnd: new Date(ev.end),
                    description: ev.description,
                    calendarName: ev.calendarName || node.config.name,
                    countdown: countdown(new Date(ev.start))
                }

                let job2 = new CronJob(eventStart, cronJobStart.bind(null, event, node));
                let cronJob = startedCronJobs[uid];
                if (!newCronJobs.has(uid) && !cronJob) {
                    newCronJobs.set(uid, job2);
                    node.debug("new - " + uid);
                }
                else if (cronJob) {
                    cronJob.stop();
                    job2 = new CronJob(eventStart, cronJobStart.bind(null, event, node));
                    newCronJobs.set(uid, job2);
                    node.debug("started - " + uid);
                }
            }
            if (eventEnd > dateNow) {
                let uid = crypto.MD5(ev.created + ev.summary + "end").toString();
                if (ev.uid) {
                    uid = ev.uid + "end";
                }
                possibleUids.push(uid);
                const event: CalEvent = {
                    summary: ev.summary,
                    categories: ev.categories,
                    topic: ev.summary,
                    id: uid,
                    location: ev.location,
                    eventStart: new Date(ev.start),
                    eventEnd: new Date(ev.end),
                    description: ev.description,
                    calendarName: ev.calendarName || node.config.name,
                    countdown: countdown(new Date(ev.start))
                }

                let job2 = new CronJob(eventEnd, cronJobEnd.bind(null, event, node));
                let cronJob = startedCronJobs[uid];
                if (!newCronJobs.has(uid) && !startedCronJobs[uid]) {
                    newCronJobs.set(uid, job2);
                    node.debug("new - " + uid);
                }
                else if (startedCronJobs[uid]) {
                    cronJob.stop();
                    job2 = new CronJob(eventEnd, cronJobEnd.bind(null, event, node));
                    newCronJobs.set(uid, job2);
                    node.debug("started - " + uid);
                }
            }
        }
    }

    function cronJobStart(event: any, node) {
        node.send([Object.assign(node.msg, {
            payload: event
        })]);
    }

    function cronJobEnd(event: any, node) {
        node.send([null, Object.assign(node.msg, {
            payload: event
        })]);
    }

    RED.nodes.registerType("ical-events", eventsNode);
}