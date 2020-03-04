
import { Red, Node } from 'node-red';
import * as crypto from "crypto-js";
import { CronJob } from 'cron';
import { Config } from './ical-config';
import { getICal, CalEvent, countdown, addOffset, getTimezoneOffset, getConfig, IcalNode } from './helper';
var RRule = require('rrule').RRule;
var ce = require('cloneextend');

module.exports = function (RED: Red) {
    function sensorNode(config: any) {
        RED.nodes.createNode(this, config);       
        let node:IcalNode = this;  

        try {
            node.config = getConfig(RED.nodes.getNode(config.confignode) as unknown as Config, config, null);
            node.on('input', (msg) => {
                node.config = getConfig(RED.nodes.getNode(config.confignode) as unknown as Config, config, msg); 
                cronCheckJob(node);
            });

            if (config.timeout && config.timeout !== "" && config.timeoutUnits && config.timeoutUnits !== "") {
                let cron = '0 0 * * * *';

                switch (config.timeoutUnits) {
                    case 'seconds':
                        cron = `*/${config.timeout} * * * * *`;
                        break;
                    case 'minutes':
                        cron = `0 */${config.timeout} * * * *`;
                        break;
                    case 'hours':
                        cron = `0 0 */${config.timeout} * * *`;
                        break;
                    case 'days':
                        cron = `0 0 0 */${config.timeout} * *`;
                        break;
                    default:
                        break;
                }
                node.job = new CronJob(cron, cronCheckJob.bind(null, node));
                node.job.start();

                node.on('close', () => {
                    node.job.stop();
                });
            }

            cronCheckJob(node);
        }
        catch (err) {
            node.error('Error: ' + err.message);
            node.status({ fill: "red", shape: "ring", text: err.message })
        }
    }

    function processRRule(ev, node:IcalNode,dateNow) {
        var eventLength = ev.end.getTime() - ev.start.getTime();

        var options = RRule.parseString(ev.rrule.toString());
        options.dtstart = addOffset(ev.start, -getTimezoneOffset(ev.start));
        if (options.until) {
            options.until = addOffset(options.until, -getTimezoneOffset(options.until));
        }
        //node.debug('options:' + JSON.stringify(options));

        var rule = new RRule(options);
        var now2 = new Date();
        now2.setHours(0, 0, 0, 0);
        var now3 = new Date(now2.getTime() - eventLength);
        if (now2 < now3) now3 = now2;

        var dates = [];
        try {
            dates = rule.between(now3, addOffset(new Date(), 24 * 60), true);
        } catch (e) {
            node.error(
                'Issue detected in RRule, event ignored; ' +
                e.stack +
                '\n' +
                'RRule object: ' +
                JSON.stringify(rule) +
                '\n' +
                'now3: ' +
                now3 +
                '\n' +
                'string: ' +
                ev.rrule.toString() +
                '\n' +
                'options: ' +
                JSON.stringify(options)
            );
        }

        node.debug('dates:' + JSON.stringify(dates));

        if (dates.length > 0) {
            for (var i = 0; i < dates.length; i++) {
                var ev2 = ce.clone(ev);
                var start = dates[i];
                ev2.start = addOffset(start, getTimezoneOffset(start));

                var end = new Date(start.getTime() + eventLength);
                ev2.end = addOffset(end, getTimezoneOffset(end));

                node.debug('   ' + i + ': Event (' + JSON.stringify(ev2.exdate) + '):' + ev2.start.toString() + ' ' + ev2.end.toString());

                var checkDate = true;
                if (ev2.exdate) {
                    for (var d in ev2.exdate) {
                        if (new Date(d).getTime() === ev2.start.getTime()) {
                            checkDate = false;
                            node.debug('   ' + i + ': sort out');
                            break;
                        }
                    }
                }
                if (checkDate && ev.recurrences) {
                    for (var dOri in ev.recurrences) {
                        if (new Date(dOri).getTime() === ev2.start.getTime()) {
                            ev2 = ce.clone(ev.recurrences[dOri]);
                            node.debug('   ' + i + ': different recurring found replaced with Event:' + ev2.start + ' ' + ev2.end);
                        }
                    }
                }

                if (checkDate && ev2.start <= dateNow && ev2.end >= dateNow) {
                    return ev2;
                }
            }
        }
    }


    function cronCheckJob(node: IcalNode) {
        if (node.job && node.job.running) {
            node.status({ fill: "green", shape: "dot", text: node.job.nextDate().toISOString() });
        }
        else {
            node.status({});
        }

        var dateNow = new Date();
        getICal(node, node.config, (err, data) => {
            if (err || !data) {
                return;
            }

            node.debug('Ical read successfully ' + node.config.url);
            if (!data) return;

            let current = false;
            let last = node.context().get('on');

            for (let k in data) {
                if (data.hasOwnProperty(k)) {
                    let ev = data[k];
                    //delete data[k];
                    if (ev.type == 'VEVENT') {
                        let ev2;
                        if (ev.rrule !== undefined) {
                           // console.log(`${ev.summary} "rrule"`)
                            ev2 = ce.clone(processRRule(ev, node,dateNow));
                        }
                        if (ev2) {
                            //console.log(ev2)
                            ev = ev2
                           // console.log(`${ev.summary} "rrule"`)
                        }

                        const eventStart = new Date(ev.start);
                        const eventEnd = new Date(ev.end);

                        if (eventStart <= dateNow && eventEnd >= dateNow) {

                            let output = false;
                            if (node.config.trigger == 'match') {
                                let regex = new RegExp(node.config.filter)
                                if (regex.test(ev.summary)) output = true;
                            } else if (node.config.trigger == 'nomatch') {
                                let regex = new RegExp(node.config.filter)
                                if (!regex.test(ev.summary)) output = true;
                            } else {
                                output = true;
                            }


                            let uid = crypto.MD5(ev.created + ev.summary).toString();
                            if (ev.uid) {
                                uid = ev.uid;
                            }

                            let event: CalEvent = {
                                on: false
                            }

                            if (output) {
                                event = {
                                    summary: ev.summary,
                                    topic: ev.summary,
                                    id: uid,
                                    location: ev.location,
                                    eventStart: new Date(ev.start),
                                    eventEnd: new Date(ev.end),
                                    description: ev.description,
                                    on: true,
                                    calendarName: ev.calendarName,
                                    countdown: countdown(new Date(ev.start))
                                }
                            }

                            node.send({
                                payload: event
                            });
                            current = true;

                            if (last != current) {
                                node.send([null, {
                                    payload: event
                                }]);
                            }
                        }
                    }
                }
            }

            if (!current) {
                const event = {
                    on: false
                }

                node.send({
                    payload: event
                });

                if (last != current) {
                    node.send([null, {
                        payload: event
                    }]);
                }
            }

            node.context().set('on', current);

        });
    }

    RED.nodes.registerType("ical-sensor", sensorNode);
}