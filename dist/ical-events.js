"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ical = require('node-ical');
var CronJob = require('cron').CronJob;
module.exports = function (RED) {
    var configNode;
    function eventsNode(config) {
        RED.nodes.createNode(this, config);
        configNode = RED.nodes.getNode(config.confignode);
        var job = new CronJob(config.cron || '0 * * * * *', cronCheckJob.bind(null, this, config));
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
                        if (eventStart.getTime() >= dateNow.getTime()) {
                            var event_1 = {
                                summary: ev.summary,
                                location: ev.location,
                                eventStart: ev.start
                            };
                            if (config.offset) {
                                eventStart.setMinutes(eventStart.getMinutes() + parseInt(config.offset));
                            }
                            try {
                                var job2 = new CronJob(eventStart, cronJob.bind(null, event_1, node));
                                job2.start();
                            }
                            catch (job_err) {
                                node.error(job_err);
                            }
                        }
                    }
                }
            }
        });
    }
    function cronJob(event, node) {
        node.send({
            payload: event
        });
    }
    RED.nodes.registerType("ical-events", eventsNode);
};
