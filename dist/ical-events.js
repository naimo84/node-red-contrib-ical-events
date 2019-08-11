"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto-js");
var ical = require("node-ical");
var cron_1 = require("cron");
module.exports = function (RED) {
    var configNode;
    var newCronJobs = new Map();
    var startedCronJobs = new Map();
    var job;
    function eventsNode(config) {
        var _this = this;
        RED.nodes.createNode(this, config);
        configNode = RED.nodes.getNode(config.confignode);
        job = new cron_1.CronJob(config.cron || '0,30 * * * * *', cronCheckJob.bind(null, this, config));
        this.on('close', function () {
            job.stop();
            startedCronJobs.forEach(function (job_started, key) {
                job_started.stop();
                _this.debug(job_started.uid + " stopped");
            });
            startedCronJobs.clear();
            _this.debug("cron stopped");
        });
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
                            var job2 = new cron_1.CronJob(eventStart, cronJob.bind(null, event_1, node));
                            var uid = crypto.MD5(ev.start + ev.summary).toString();
                            if (ev.uid) {
                                uid = ev.uid;
                            }
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
            newCronJobs.forEach(function (job, key) {
                try {
                    job.start();
                    startedCronJobs.set(key, job);
                }
                catch (newCronErr) {
                    node.error(newCronErr);
                }
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
