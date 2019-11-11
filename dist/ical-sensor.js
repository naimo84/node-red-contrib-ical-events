"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto-js");
var cron_1 = require("cron");
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
            if (config.timeout && config.timeout !== "" && config.timeoutUnits && config.timeoutUnits !== "") {
                var cron = '0 0 * * * *';
                switch (config.timeoutUnits) {
                    case 'seconds':
                        cron = "*/" + config.timeout + " * * * * *";
                        break;
                    case 'minutes':
                        cron = "0 */" + config.timeout + " * * * *";
                        break;
                    case 'hours':
                        cron = "0 0 */" + config.timeout + " * * *";
                        break;
                    case 'days':
                        cron = "0 0 0 */" + config.timeout + " * *";
                        break;
                    default:
                        break;
                }
                node.job = new cron_1.CronJob(cron, cronCheckJob.bind(null, node, config));
                node.job.start();
                node.on('close', function () {
                    node.job.stop();
                });
            }
            cronCheckJob(this, config);
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
                var last = node.context().get('on');
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
                                    topic: ev.summary,
                                    id: uid,
                                    location: ev.location,
                                    eventStart: new Date(ev.start),
                                    eventEnd: new Date(ev.end),
                                    description: ev.description,
                                    on: true
                                };
                                node.send({
                                    payload: event_1
                                });
                                current = true;
                                if (last != current) {
                                    node.send([null, {
                                            payload: event_1
                                        }]);
                                }
                            }
                        }
                    }
                }
                if (!current) {
                    var event_2 = {
                        on: false
                    };
                    node.send({
                        payload: event_2
                    });
                    if (last != current) {
                        node.send([null, {
                                payload: event_2
                            }]);
                    }
                }
                node.context().set('on', current);
            }
        });
    }
    RED.nodes.registerType("ical-sensor", sensorNode);
};
