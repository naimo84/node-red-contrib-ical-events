
import { Red, Node } from 'node-red';
import * as crypto from "crypto-js";
var ical = require('node-ical');
const CronJob = require('cron').CronJob;

export interface Config {
    url: string,
}

export interface Job {
    id: string,
    cronjob: any
}


module.exports = function (RED: Red) {
    let configNode: Config;

    let newCronJobs = new Map();
    let startedCronJobs = new Map();


    function eventsNode(config: any) {
        RED.nodes.createNode(this, config);
        configNode = RED.nodes.getNode(config.confignode) as unknown as Config;
        const job = new CronJob(config.cron || '0,30 * * * * *', cronCheckJob.bind(null, this, config));
        job.start();
    }


    function cronCheckJob(node: Node, config: any) {
        var dateNow = new Date();


        ical.fromURL(configNode.url, {}, function (err, data) {
            if (err) {
                node.error(err);
                return;
            }
            for (let k in data) {
                if (data.hasOwnProperty(k)) {
                    var ev = data[k];

                    const eventStart = new Date(ev.start);
                    if (ev.type == 'VEVENT') {
                        if (eventStart.getTime() > dateNow.getTime()) {
                            const event = {
                                summary: ev.summary,
                                location: ev.location,
                                eventStart: ev.start
                            }

                            if (config.offset) {
                                eventStart.setMinutes(eventStart.getMinutes() + parseInt(config.offset));
                            } else {
                                eventStart.setMinutes(eventStart.getMinutes() - 1);
                            }

                            const job2 = new CronJob(eventStart, cronJob.bind(null, event, node));

                            let uid = crypto.MD5(ev.start + ev.summary).toString();
                            if (ev.uid) {
                                uid = ev.uid;
                            }

                            if (!newCronJobs.has(uid) && !startedCronJobs.has(uid)) {
                                newCronJobs.set(uid, job2);
                                console.debug("new - " + uid);
                            }
                            else if (startedCronJobs.has(uid)) {
                                console.debug("started - " + uid);
                            }

                        }
                    }
                }
            }

            console.debug(newCronJobs.size);
            newCronJobs.forEach((job, key) => {
                job.start();
                startedCronJobs.set(key, job);
            });
            newCronJobs.clear();
        });
    }


    function cronJob(event: any, node: Node) {
        node.send({
            payload: event
        });
    }

    RED.nodes.registerType("ical-events", eventsNode);
}