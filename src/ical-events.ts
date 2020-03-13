
import { Red, Node } from 'node-red';
import * as crypto from "crypto-js";
import { CronJob } from 'cron';
import { CronTime } from 'cron';
import * as parser from 'cron-parser';
import { Config } from './ical-config';
import { getICal, CalEvent, countdown, getConfig, IcalNode } from './helper';



module.exports = function (RED: Red) {
    let newCronJobs = new Map();
    let startedCronJobs = {};
    function eventsNode(config: any) {
        RED.nodes.createNode(this, config);
        let node: IcalNode = this;

        try {
            node.config = getConfig(RED.nodes.getNode(config.confignode) as unknown as Config, config, null);
            node.on('input', (msg) => {
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

            if (config.cron && config.cron !== "") {
                parser.parseExpression(config.cron);

                node.job = new CronJob(config.cron || '0 0 * * * *', cronCheckJob.bind(null, node));
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


    function cronCheckJob(node: IcalNode) {
        if (node.job && node.job.running) {
            node.status({ fill: "green", shape: "dot", text: node.job.nextDate().toISOString() });
        }
        else {
            node.status({});
        }
        let dateNow = new Date();
        let possibleUids = [];
        getICal(node, node.config, (err, data) => {
            if (err || !data) {
                return;
            }

            node.debug('Ical read successfully ' + node.config.url);
            if (data) {
                for (let k in data) {
                    if (data.hasOwnProperty(k)) {
                        let ev = data[k];

                        const eventStart = new Date(ev.start);
                        const eventEnd = new Date(ev.end);
                        if (ev.type == 'VEVENT') {
                            if (eventStart > dateNow) {
                                let uid = crypto.MD5(ev.created + ev.summary + "start").toString();
                                if (ev.uid) {
                                    uid = ev.uid + "start";
                                }
                                possibleUids.push(uid);
                                const event: CalEvent = {
                                    summary: ev.summary,
                                    topic: ev.summary,
                                    id: uid,
                                    location: ev.location,
                                    eventStart: new Date(ev.start),
                                    eventEnd: new Date(ev.end),
                                    description: ev.description,
                                    calendarName: ev.calendarName,
                                    countdown: countdown(new Date(ev.start))
                                }


                                if (node.config.offset) {
                                    if (node.config?.offsetUnits === 'seconds') {
                                        eventStart.setSeconds(eventStart.getSeconds() + node.config.offset);
                                    } else if (node.config?.offsetUnits === 'hours') {
                                        eventStart.setMinutes(eventStart.getMinutes() + node.config.offset);
                                    } else if (node.config?.offsetUnits === 'days') {
                                        eventStart.setDate(eventStart.getDate() + node.config.offset);
                                    } else {
                                        eventStart.setMinutes(eventStart.getMinutes() + node.config.offset);
                                    }
                                }


                                let job2 = new CronJob(eventStart, cronJobStart.bind(null, event, node));
                                let cronJob = startedCronJobs[uid];
                                console.log(cronJob)
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
                                    topic: ev.summary,
                                    id: uid,
                                    location: ev.location,
                                    eventStart: new Date(ev.start),
                                    eventEnd: new Date(ev.end),
                                    description: ev.description,
                                    calendarName: ev.calendarName,
                                    countdown: countdown(new Date(ev.start))
                                }

                                if (node.config.offset) {
                                    if (node.config?.offsetUnits === 'seconds') {
                                        eventEnd.setSeconds(eventEnd.getSeconds() + node.config.offset);
                                    } else if (node.config?.offsetUnits === 'hours') {
                                        eventEnd.setMinutes(eventEnd.getMinutes() + node.config.offset);
                                    } else if (node.config?.offsetUnits === 'days') {
                                        eventEnd.setDate(eventEnd.getDate() + node.config.offset);
                                    } else {
                                        eventEnd.setMinutes(eventEnd.getMinutes() + node.config.offset);
                                    }
                                }

                                let job2 = new CronJob(eventEnd, cronJobEnd.bind(null, event, node));
                                let cronJob = startedCronJobs[uid];
                                if (!newCronJobs.has(uid) && !startedCronJobs[uid]) {
                                    newCronJobs.set(uid, job2);
                                    node.debug("new - " + uid);
                                }
                                else if (startedCronJobs[uid]) {
                                    cronJob.stop();
                                    job2 = new CronJob(eventStart, cronJobEnd.bind(null, event, node));
                                    newCronJobs.set(uid, job2);
                                    node.debug("started - " + uid);
                                }
                            }
                        }
                    }
                }

                if (newCronJobs) {
                    newCronJobs.forEach((job, key) => {
                        try {
                            job.start();
                            node.debug("starting - " + key);
                            startedCronJobs[key] = job;
                        } catch (newCronErr) {
                            node.error(newCronErr);
                        }

                    });
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
        });
    }

    function cronJobStart(event: any, node) {
        node.send([{
            payload: event
        }]);
    }

    function cronJobEnd(event: any, node) {
        node.send([null, {
            payload: event
        }]);
    }

    RED.nodes.registerType("ical-events", eventsNode);
}