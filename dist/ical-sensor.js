"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto-js");
var cron_1 = require("cron");
var parser = require("cron-parser");
var helper_1 = require("./helper");
module.exports = function (RED) {
    function sensorNode(config) {
        var _this = this;
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.confignode);
        var node = this;
        this.config = configNode;
        try {
            node.on('input', function () {
                cronCheckJob(_this, config);
            });
            if (config.cron && config.cron !== "") {
                parser.parseExpression(config.cron);
                node.job = new cron_1.CronJob(config.cron || '0 0 * * * *', cronCheckJob.bind(null, node, config));
                node.job.start();
                node.on('close', function () {
                    node.job.stop();
                });
            }
        }
        catch (err) {
            node.error('Error: ' + err.message);
            node.status({ fill: "red", shape: "ring", text: err.message });
        }
    }
    function cronCheckJob(node, config) {
        if (node.job && node.job.running) {
            node.status({ fill: "green", shape: "dot", text: node.job.nextDate().toISOString() });
        }
        else {
            node.status({});
        }
        var dateNow = new Date();
        helper_1.getICal(node, node.config.url, node.config, function (err, data) {
            if (err || !data) {
                return;
            }
            node.debug('Ical read successfully ' + config.url);
            if (data) {
                var current = false;
                for (var k in data) {
                    if (data.hasOwnProperty(k)) {
                        var ev = data[k];
                        var eventStart = new Date(ev.start);
                        var eventEnd = new Date(ev.end);
                        if (ev.type == 'VEVENT') {
                            if (eventStart <= dateNow && dateNow <= eventEnd) {
                                var uid = crypto.MD5(ev.created + ev.summary).toString();
                                if (ev.uid) {
                                    uid = ev.uid;
                                }
                                var event_1 = {
                                    summary: ev.summary,
                                    id: uid,
                                    location: ev.location,
                                    eventStart: new Date(ev.start),
                                    eventEnd: new Date(ev.end),
                                    description: ev.description,
                                    on: true,
                                    off: false
                                };
                                node.send(event_1);
                                current = true;
                            }
                        }
                    }
                }
                if (!current) {
                    var event_2 = {
                        on: false,
                        off: true
                    };
                    node.send(event_2);
                }
            }
        });
    }
    RED.nodes.registerType("ical-sensor", sensorNode);
};
