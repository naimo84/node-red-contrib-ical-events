"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto-js");
var ical = require('node-ical');
var CronJob = require('cron').CronJob;
module.exports = function (RED) {
    var configNode;
    var newCronJobs = new Map();
    var startedCronJobs = new Map();
    function eventsNode(config) {
        RED.nodes.createNode(this, config);
        configNode = RED.nodes.getNode(config.confignode);
        var job = new CronJob(config.cron || '0,30 * * * * *', cronCheckJob.bind(null, this, config));
        job.start();
    }
    function cronCheckJob(node, config) {
        var dateNow = new Date();
        ical.fromURL(configNode.url, {}, function (err, data) {
            if (err) {
                node.error(err);
                return;
            }
            for (var k in data) {
                if (data.hasOwnProperty(k)) {
                    var ev = data[k];
                    var eventStart = new Date(ev.start);
                    if (ev.type == 'VEVENT') {
                        if (eventStart.getTime() > dateNow.getTime()) {
                            var event_1 = {
                                summary: ev.summary,
                                location: ev.location,
                                eventStart: ev.start
                            };
                            if (config.offset) {
                                eventStart.setMinutes(eventStart.getMinutes() + parseInt(config.offset));
                            }
                            else {
                                eventStart.setMinutes(eventStart.getMinutes() - 1);
                            }
                            var job2 = new CronJob(eventStart, cronJob.bind(null, event_1, node));
                            var uid = crypto.MD5(ev.start + ev.summary).toString();
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
            newCronJobs.forEach(function (job, key) {
                job.start();
                startedCronJobs.set(key, job);
            });
            newCronJobs.clear();
        });
    }
    function cronJob(event, node) {
        node.send({
            payload: event
        });
    }
    RED.nodes.registerType("ical-events", eventsNode);
};
