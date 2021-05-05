
import * as crypto from "crypto-js";
import { CronJob } from 'cron';
import * as parser from 'cron-parser';
import { IcalEventsConfig } from './ical-config';
import { getConfig, getICal, CalEvent, IcalNode } from './helper';
import * as NodeCache from 'node-cache';
import { IKalenderEvent } from 'kalender-events/types/event';
import { NodeMessageInFlow, NodeMessage } from "node-red";
import moment = require("moment");
module.exports = function (RED: any) {

    function eventsNode(config: any) {
        RED.nodes.createNode(this, config);
        let node: IcalNode = this;
        let startedCronJobs = {};
        try {
            node.cache = new NodeCache();
            node.msg = {};
            node.timezone = config.timezone;

            node.on('input', (msg, send, done) => {
                node.msg = RED.util.cloneMessage(msg);
                send = send || function () { node.send.apply(node, arguments) }
                node.config = getConfig(RED.nodes.getNode(config.confignode) as unknown as IcalEventsConfig, config, msg);
                cronCheckJob(node, msg, send, done, config.confignode, startedCronJobs);
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
                node.job = new CronJob(cron, function () { node.emit("input", {}); });
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

    function cronCheckJob(node: IcalNode, msg: NodeMessageInFlow, send: (msg: NodeMessage | NodeMessage[]) => void, done: (err?: Error) => void, config, startedCronJobs) {
        let newCronJobs = new Map();
        if (node.job && node.job.running) {
            node.status({ fill: "green", shape: "dot", text: `next check: ${node.job.nextDate().toLocaleString()}` });
        }
        else {
            node.status({});
        }
        let dateNow = new Date();
        let possibleUids = [];
        getICal(node).then((data: IKalenderEvent[]) => {
            node.debug('Ical read successfully ' + node.config.url);
            if (data) {
                for (let k in data) {
                    if (data.hasOwnProperty(k)) {
                        let ev = data[k];

                        const eventStart = new Date(ev.eventStart);
                        const eventEnd = new Date(ev.eventEnd);

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
                            let uid = crypto.MD5(ev.uid + ev.summary + "start").toString();
                            if (ev.uid) {
                                uid = (ev.uid.uid ? ev.uid.uid : ev.uid) + eventStart.toISOString() + "start";
                            }
                            possibleUids.push(uid);
                            let event: CalEvent = Object.assign(ev, {
                                topic: ev.summary,
                                id: uid,
                                calendarName: ev.calendarName || node.config.name
                            });

                            let job2 = new CronJob(moment(eventStart), cronJobStart.bind(null, event, send, done, msg));
                            let cronJob = startedCronJobs[uid];
                            if (cronJob) {
                                cronJob.stop();
                            }
                            newCronJobs.set(uid, job2);
                        }

                        if (eventEnd > dateNow) {
                            let uid = crypto.MD5(ev.uid + ev.summary + "end").toString();
                            if (ev.uid) {
                                uid = (ev.uid.uid ? ev.uid.uid : ev.uid) + eventEnd.toISOString() + "end";
                            }
                            possibleUids.push(uid);
                            let event: CalEvent = Object.assign(ev, {
                                topic: ev.summary,
                                id: uid,
                                calendarName: ev.calendarName || node.config.name
                            });

                            let job2 = new CronJob(moment(eventEnd), cronJobEnd.bind(null, event, send, done, msg));
                            let cronJob = startedCronJobs[uid];
                            if (cronJob) {
                                cronJob.stop();
                            }
                            newCronJobs.set(uid, job2);
                        }
                    }
                }

                if (newCronJobs) {
                    let triggerDate: Date[] = [];

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
                        node.status({ text: `next trigger: ${triggerDate[0].toLocaleString()}`, fill: "green", shape: "dot" })
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
            node.status({ fill: 'red', shape: 'ring', text: err.message });
            send({
                //@ts-ignore
                error: err
            });
            if (done)
                done(err);
        });
    }

    function cronJobStart(event: any, send: (msg: NodeMessage | NodeMessage[]) => void, done: (err?: Error) => void, msg: NodeMessageInFlow) {
        let msg2 = RED.util.cloneMessage(msg);
        delete msg2._msgid;
        delete event.id;
        send([Object.assign(msg2, {
            payload: event
        })]);
        if (done)
            done();

    }

    function cronJobEnd(event: any, send: (msg: NodeMessage | NodeMessage[]) => void, done: (err?: Error) => void, msg: NodeMessageInFlow) {
        let msg2 = RED.util.cloneMessage(msg);
        delete msg2._msgid;
        delete event.id;
        send([null, Object.assign(msg2, {
            payload: event
        })]);
        if (done)
            done();
    }

    RED.nodes.registerType("ical-events", eventsNode);
}