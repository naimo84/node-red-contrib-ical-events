
import { Red, Node } from 'node-red';
import * as crypto from "crypto-js";
import { CronJob } from 'cron';
import { CronTime } from 'cron';
import * as parser from 'cron-parser';
import { Config } from './ical-config';
import { getICal, CalEvent, countdown } from './helper';

module.exports = function (RED: Red) {
    let newCronJobs = new Map();

    function eventsNode(config: any) {
        RED.nodes.createNode(this, config);
        let configNode = RED.nodes.getNode(config.confignode) as unknown as Config;
        let node = this;
        this.config = configNode;
        try {
            node.on('input', () => {
                cronCheckJob(this, config);
            });

            node.on('close', () => {
                node.debug("cron stopped")
                let startedCronJobs = node.context().get('startedCronJobs');
                if (startedCronJobs) {
                    for (let key in startedCronJobs) {
                        if (startedCronJobs.hasOwnProperty(key)) {
                            node.debug(key + " stopped")
                            startedCronJobs[key].stop();
                        }
                    }
                    node.context().get('startedCronJobs').clear();
                }

            });

            if (config.cron && config.cron !== "") {
                parser.parseExpression(config.cron);

                node.job = new CronJob(config.cron || '0 0 * * * *', cronCheckJob.bind(null, node, config));
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


    function cronCheckJob(node: any, config: any) {
        if (node.job && node.job.running) {
            node.status({ fill: "green", shape: "dot", text: node.job.nextDate().toISOString() });
        }
        else {
            node.status({});
        }
        var dateNow = new Date();
        var possibleUids = [];
        getICal(node, node.config.url, node.config, (err, data) => {
            if (err || !data) {
                return;
            }

            node.debug('Ical read successfully ' + config.url);
            if (data) {
                for (let k in data) {
                    if (data.hasOwnProperty(k)) {
                        var ev = data[k];

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

                                if (config.offset) {
                                    eventStart.setMinutes(eventStart.getMinutes() + parseInt(config.offset));
                                } else {
                                    eventStart.setMinutes(eventStart.getMinutes() - 1);
                                }

                                const job2 = new CronJob(eventStart, cronJobStart.bind(null, event, node));
                                let startedCronJobs = node.context().get('startedCronJobs') || {};
                                if (!newCronJobs.has(uid) && !startedCronJobs[uid]) {
                                    newCronJobs.set(uid, job2);
                                    node.debug("new - " + uid);
                                }
                                else if (startedCronJobs[uid]) {
                                    startedCronJobs[uid].setTime(new CronTime(eventStart));
                                    startedCronJobs[uid].start();
                                    node.context().set('startedCronJobs', startedCronJobs);
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

                                if (config.offset) {
                                    eventStart.setMinutes(eventEnd.getMinutes() + parseInt(config.offset));
                                } else {
                                    eventStart.setMinutes(eventEnd.getMinutes() - 1);
                                }

                                const job2 = new CronJob(eventEnd, cronJobEnd.bind(null, event, node));
                                let startedCronJobs = node.context().get('startedCronJobs') || {};
                                if (!newCronJobs.has(uid) && !startedCronJobs[uid]) {
                                    newCronJobs.set(uid, job2);
                                    node.debug("new - " + uid);
                                }
                                else if (startedCronJobs[uid]) {
                                    startedCronJobs[uid].setTime(new CronTime(eventEnd));
                                    startedCronJobs[uid].start();
                                    node.context().set('startedCronJobs', startedCronJobs);
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
                            var startedCronJobs = node.context().get('startedCronJobs') || {};
                            startedCronJobs[key] = job;
                            node.context().set('startedCronJobs', startedCronJobs);
                        } catch (newCronErr) {
                            node.error(newCronErr);
                        }

                    });
                }

                newCronJobs.clear();
            }
            var startedCronJobs = node.context().get('startedCronJobs');
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
            node.context().set('startedCronJobs', startedCronJobs);
            //possibleUids.length = 0;
        });
    }

    function cronJobStart(event: any, node: Node) {
        node.send([{
            payload: event
        }, null]);
    }

    function cronJobEnd(event: any, node: Node) {
        node.send([null, {
            payload: event
        }]);
    }

    RED.nodes.registerType("ical-events", eventsNode);
}