"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto-js");
var ical = require("node-ical");
var cron_1 = require("cron");
var cron_2 = require("cron");
var caldav_1 = require("./caldav");
var parser = require("cron-parser");
var icloud_1 = require("./icloud");
var moment = require("moment");
module.exports = function (RED) {
    var newCronJobs = new Map();
    function eventsNode(config) {
        var _this = this;
        RED.nodes.createNode(this, config);
        var configNode = RED.nodes.getNode(config.confignode);
        var node = this;
        this.config = configNode;
        try {
            node.on('input', function () {
                cronCheckJob(_this, config);
            });
            node.on('close', function () {
                node.debug("cron stopped");
                var startedCronJobs = node.context().get('startedCronJobs');
                if (startedCronJobs) {
                    for (var key in startedCronJobs) {
                        if (startedCronJobs.hasOwnProperty(key)) {
                            node.debug(key + " stopped");
                            startedCronJobs[key].stop();
                        }
                    }
                    node.context().get('startedCronJobs').clear();
                }
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
    function getICal(node, urlOrFile, config, callback) {
        if (urlOrFile.match(/^https?:\/\//)) {
            if (config.caldav && config.caldav === 'icloud') {
                var now = moment();
                var when = now.toDate();
                icloud_1.loadEventsForDay(moment(when), {
                    url: urlOrFile,
                    username: config.username,
                    password: config.password,
                    type: "caldav",
                    endpreview: node.endpreview
                }, function (list, start, end) {
                    callback && callback(null, list);
                });
            }
            else if (config.caldav && JSON.parse(config.caldav) === true) {
                node.debug("caldav");
                caldav_1.CalDav(node, config, null, function (data) {
                    callback(null, data);
                });
            }
            else {
                var header = {};
                var username = node.config.username;
                var password = node.config.password;
                if (username && password) {
                    var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
                    header = {
                        headers: {
                            'Authorization': auth
                        }
                    };
                }
                ical.fromURL(node.config.url, header, function (err, data) {
                    if (err) {
                        callback && callback(err, null);
                        return;
                    }
                    callback && callback(null, data);
                });
            }
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
        var possibleUids = [];
        getICal(node, node.config.url, node.config, function (err, data) {
            if (err || !data) {
                return;
            }
            node.debug('Ical read successfully ' + config.url);
            if (data) {
                for (var k in data) {
                    if (data.hasOwnProperty(k)) {
                        var ev = data[k];
                        var eventStart = new Date(ev.start);
                        var eventEnd = new Date(ev.end);
                        if (ev.type == 'VEVENT') {
                            if (eventStart > dateNow) {
                                var uid = crypto.MD5(ev.created + ev.summary + "start").toString();
                                if (ev.uid) {
                                    uid = ev.uid + "start";
                                }
                                possibleUids.push(uid);
                                var event_1 = {
                                    summary: ev.summary,
                                    id: uid,
                                    location: ev.location,
                                    eventStart: new Date(ev.start),
                                    eventEnd: new Date(ev.end),
                                    description: ev.description
                                };
                                if (config.offset) {
                                    eventStart.setMinutes(eventStart.getMinutes() + parseInt(config.offset));
                                }
                                else {
                                    eventStart.setMinutes(eventStart.getMinutes() - 1);
                                }
                                var job2 = new cron_1.CronJob(eventStart, cronJobStart.bind(null, event_1, node));
                                var startedCronJobs_1 = node.context().get('startedCronJobs') || {};
                                if (!newCronJobs.has(uid) && !startedCronJobs_1[uid]) {
                                    newCronJobs.set(uid, job2);
                                    node.debug("new - " + uid);
                                }
                                else if (startedCronJobs_1[uid]) {
                                    startedCronJobs_1[uid].setTime(new cron_2.CronTime(eventStart));
                                    startedCronJobs_1[uid].start();
                                    node.context().set('startedCronJobs', startedCronJobs_1);
                                    node.debug("started - " + uid);
                                }
                            }
                            if (eventEnd > dateNow) {
                                var uid = crypto.MD5(ev.created + ev.summary + "end").toString();
                                if (ev.uid) {
                                    uid = ev.uid + "end";
                                }
                                possibleUids.push(uid);
                                var event_2 = {
                                    summary: ev.summary,
                                    id: uid,
                                    location: ev.location,
                                    eventStart: new Date(ev.start),
                                    eventEnd: new Date(ev.end),
                                    description: ev.description
                                };
                                if (config.offset) {
                                    eventStart.setMinutes(eventEnd.getMinutes() + parseInt(config.offset));
                                }
                                else {
                                    eventStart.setMinutes(eventEnd.getMinutes() - 1);
                                }
                                var job2 = new cron_1.CronJob(eventEnd, cronJobEnd.bind(null, event_2, node));
                                var startedCronJobs_2 = node.context().get('startedCronJobs') || {};
                                if (!newCronJobs.has(uid) && !startedCronJobs_2[uid]) {
                                    newCronJobs.set(uid, job2);
                                    node.debug("new - " + uid);
                                }
                                else if (startedCronJobs_2[uid]) {
                                    startedCronJobs_2[uid].setTime(new cron_2.CronTime(eventEnd));
                                    startedCronJobs_2[uid].start();
                                    node.context().set('startedCronJobs', startedCronJobs_2);
                                    node.debug("started - " + uid);
                                }
                            }
                        }
                    }
                }
                newCronJobs.forEach(function (job, key) {
                    try {
                        job.start();
                        node.debug("starting - " + key);
                        var startedCronJobs = node.context().get('startedCronJobs') || {};
                        startedCronJobs[key] = job;
                        node.context().set('startedCronJobs', startedCronJobs);
                    }
                    catch (newCronErr) {
                        node.error(newCronErr);
                    }
                });
                newCronJobs.clear();
            }
            var startedCronJobs = node.context().get('startedCronJobs');
            for (var key in startedCronJobs) {
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
    function cronJobStart(event, node) {
        node.send([{
                payload: event
            }, null]);
    }
    function cronJobEnd(event, node) {
        node.send([null, {
                payload: event
            }]);
    }
    RED.nodes.registerType("ical-events", eventsNode);
};
