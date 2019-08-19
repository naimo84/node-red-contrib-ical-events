
import { Red, Node } from 'node-red';
import * as crypto from "crypto-js";
import * as  ical from 'node-ical';
import { CronJob } from 'cron';

import * as parser from 'cron-parser';
import { Config } from './ical-config';


export interface Job {
    id: string,
    cronjob: any
}

export interface CalEvent {
    summary: string,
    location: string,
    eventStart: Date
    eventEnd: Date,
    date?: string,

    event?: string,
    description?: string,
    id: string,
    allDay?: boolean,
    rule?: string

}


module.exports = function (RED: Red) {


    let newCronJobs = new Map();
    let startedCronJobs = new Map();
   

    function eventsNode(config: any) {
        RED.nodes.createNode(this, config);
        let configNode = RED.nodes.getNode(config.confignode) as unknown as Config;

        
        this.config = configNode;
        try {
            this.on('input', () => {
                this.job.stop();
                cronCheckJob(this, config);               
            });

            parser.parseExpression(config.cron);

            this.job = new CronJob(config.cron || '0 0 * * * *', cronCheckJob.bind(null, this, config));
            this.job.start();

            this.on('close', () => {
                this.job.stop();
                startedCronJobs.forEach((job_started, key) => {
                    job_started.stop();
                    this.debug(job_started.uid + " stopped")
                });
                startedCronJobs.clear();
                this.debug("cron stopped")
            });
        }
        catch (err) {
            this.error('Error: ' + err.message);
            this.status({ fill: "red", shape: "ring", text: err.message })
        }
    }


    function cronCheckJob(node: any, config: any) {       
        if ( node.job.running){
            node.status({ fill: "green", shape: "dot", text:  node.job.nextDate().toISOString() });
        }
        else {
            node.status({});
        }
        var dateNow = new Date();


        ical.fromURL(node.config.url, {}, (err, data) => {
            if (err) {
                node.error(err);
                node.status({ fill: "red", shape: "ring", text: err })
                return;
            }
            for (let k in data) {
                if (data.hasOwnProperty(k)) {
                    var ev = data[k];

                    const eventStart = new Date(ev.start);
                    if (ev.type == 'VEVENT') {
                        if (eventStart.getTime() > dateNow.getTime()) {
                            let uid = crypto.MD5(ev.start + ev.summary).toString();
                            if (ev.uid) {
                                uid = ev.uid;
                            }

                            const event: CalEvent = {
                                summary: ev.summary,
                                id: uid,
                                location: ev.location,
                                eventStart: new Date(ev.start.getTime()),
                                eventEnd: new Date(ev.end.getTime()),
                                description: ev.description
                            }

                            if (config.offset) {
                                eventStart.setMinutes(eventStart.getMinutes() + parseInt(config.offset));
                            } else {
                                eventStart.setMinutes(eventStart.getMinutes() - 1);
                            }

                            const job2 = new CronJob(eventStart, cronJob.bind(null, event, node));



                            if (!newCronJobs.has(uid) && !startedCronJobs.has(uid)) {
                                newCronJobs.set(uid, job2);
                                node.debug("new - " + uid);
                            }
                            else if (startedCronJobs.has(uid)) {
                                node.debug("started - " + uid);
                            }


                        }
                    }
                }
            }

            newCronJobs.forEach((job, key) => {
                try {
                    job.start();
                    startedCronJobs[key] = job;
                } catch (newCronErr) {
                    node.error(newCronErr);
                }

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