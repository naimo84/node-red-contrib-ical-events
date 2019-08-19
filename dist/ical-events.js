"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto-js");
var ical = require("node-ical");
var cron_1 = require("cron");
var parser = require("cron-parser");
module.exports = function (RED) {
    var newCronJobs = new Map();
    var startedCronJobs = new Map();
    function eventsNode(config) {
        var _this = this;
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.confignode);
        this.config = configNode;
        try {
            this.on('input', function () {
                _this.job.stop();
                cronCheckJob(_this, config);
            });
            parser.parseExpression(config.cron);
            this.job = new cron_1.CronJob(config.cron || '0 0 * * * *', cronCheckJob.bind(null, this, config));
            this.job.start();
            this.on('close', function () {
                _this.job.stop();
                startedCronJobs.forEach(function (job_started, key) {
                    job_started.stop();
                    _this.debug(job_started.uid + " stopped");
                });
                startedCronJobs.clear();
                _this.debug("cron stopped");
            });
        }
        catch (err) {
            this.error('Error: ' + err.message);
            this.status({ fill: "red", shape: "ring", text: err.message });
        }
    }
    function cronCheckJob(node, config) {
        if (node.job.running) {
            node.status({ fill: "green", shape: "dot", text: node.job.nextDate().toISOString() });
        }
        else {
            node.status({});
        }
        var dateNow = new Date();
        ical.fromURL(node.config.url, {}, function (err, data) {
            if (err) {
                node.error(err);
                node.status({ fill: "red", shape: "ring", text: err });
                return;
            }
            for (var k in data) {
                if (data.hasOwnProperty(k)) {
                    var ev = data[k];
                    var eventStart = new Date(ev.start);
                    if (ev.type == 'VEVENT') {
                        if (eventStart.getTime() > dateNow.getTime()) {
                            var uid = crypto.MD5(ev.start + ev.summary).toString();
                            if (ev.uid) {
                                uid = ev.uid;
                            }
                            var event_1 = {
                                summary: ev.summary,
                                id: uid,
                                location: ev.location,
                                eventStart: new Date(ev.start.getTime()),
                                eventEnd: new Date(ev.end.getTime()),
                                description: ev.description
                            };
                            if (config.offset) {
                                eventStart.setMinutes(eventStart.getMinutes() + parseInt(config.offset));
                            }
                            else {
                                eventStart.setMinutes(eventStart.getMinutes() - 1);
                            }
                            var job2 = new cron_1.CronJob(eventStart, cronJob.bind(null, event_1, node));
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
                    startedCronJobs[key] = job;
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
