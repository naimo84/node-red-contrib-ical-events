
import { Red, Node } from 'node-red';
import * as crypto from "crypto-js";
import * as  ical from 'node-ical';
import { CronJob } from 'cron';
import { CronTime } from 'cron';
import { CalDav } from './caldav';
import * as parser from 'cron-parser';
import { Config } from './ical-config';
import { loadEventsForDay } from './icloud'
import * as moment from 'moment';

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

    function getICal(node, urlOrFile, config, callback) {        
        if (urlOrFile.match(/^https?:\/\//)) {
            if (config.caldav && config.caldav === 'icloud') {
                const now = moment();
                const when = now.toDate();
                loadEventsForDay(moment(when), {
                    url: urlOrFile,
                    username: config.username,
                    password: config.password,
                    type: "caldav",
                    endpreview:node.endpreview
                }, (list, start, end) => {
                    callback && callback(null, list);
                });
            } else if (config.caldav && JSON.parse(config.caldav) === true) {
                node.debug("caldav")
                CalDav(node, config, null, (data) => {
                    callback(null, data);
                });            
            } else {
                let header = {};
                let username = node.config.username;
                let password = node.config.password;

                if (username && password) {
                    var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
                    header = {
                        headers: {
                            'Authorization': auth
                        }
                    }
                }

                ical.fromURL(node.config.url, header, (err, data) => {
                    if (err) {
                        callback && callback(err, null);
                        return;
                    }
                    callback && callback(null, data);
                });
            }
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
                                    id: uid,
                                    location: ev.location,
                                    eventStart: new Date(ev.start),
                                    eventEnd: new Date(ev.end),
                                    description: ev.description
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
                                    id: uid,
                                    location: ev.location,
                                    eventStart: new Date(ev.start),
                                    eventEnd: new Date(ev.end),
                                    description: ev.description
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

                newCronJobs.clear();
            }
            var startedCronJobs = node.context().get('startedCronJobs');
            for (let key in startedCronJobs){
                if(startedCronJobs.hasOwnProperty(key)){
                    if(startedCronJobs[key].running == false){
                        delete startedCronJobs[key];
                    }
                    else if(!(possibleUids.includes(key,0))){
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