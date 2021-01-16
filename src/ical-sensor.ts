
import { NodeMessage, NodeMessageInFlow } from 'node-red';
import { CronJob } from 'cron';
import { IcalEventsConfig } from './ical-config';
import { getConfig, getICal, CalEvent, IcalNode } from './helper';
import * as NodeCache from 'node-cache';
import { KalenderEvents } from 'kalender-events';
import { IKalenderEvent } from 'kalender-events/types/event';

module.exports = function (RED: any) {
    function sensorNode(config: any) {
        RED.nodes.createNode(this, config);
        let node: IcalNode = this;

        try {
            node.cache = new NodeCache();
            node.msg = {};
            node.on('input', (msg, send, done) => {
                send = send || function () { node.send.apply(node, arguments) }
                node.config = getConfig(RED.nodes.getNode(config.confignode) as unknown as IcalEventsConfig, config, msg);
                cronCheckJob(node, msg, send, done);
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
                node.job = new CronJob(cron, function () { node.emit("input", {}); });
                node.job.start();

                node.on('close', () => {
                    node.job.stop();
                });
            }
            node.emit("input", {});
        }
        catch (err) {
            node.error('Error: ' + err.message);
            node.status({ fill: "red", shape: "ring", text: err.message })
        }
    }


    function cronCheckJob(node: IcalNode, msg: NodeMessageInFlow, send: (msg: NodeMessage | NodeMessage[]) => void, done: (err?: Error) => void) {
        if (node.job && node.job.running) {
            node.status({ fill: "green", shape: "dot", text: `next check: ${node.job.nextDate().toLocaleString()}` });
        }
        else {
            node.status({});
        }
        //@ts-ignore
        if (!msg) msg = {};
        var dateNow = new Date();
        getICal(node).then(data => {
            node.debug('Ical read successfully ' + node.config.url);
            if (!data) return;

            let current = false;
            let last = node.context().get('on');

            for (let k in data) {
                if (data.hasOwnProperty(k)) {
                    let ev = data[k];
                    if (ev instanceof Array && ev.length >= 1) {
                        for (let e of ev) {
                            current = processData(e, dateNow, node, last, current, msg, send)
                        }
                    } else {
                        current = processData(ev, dateNow, node, last, current, msg, send)
                    }

                }
            }

            if (!current) {
                const event = {
                    on: false
                }
                let msg2 = RED.util.cloneMessage(msg);
                delete msg2._msgid;
                send(Object.assign(msg2, {
                    payload: event
                }));

                if (last != current) {
                    send([null, Object.assign(msg2, {
                        payload: event
                    })]);
                }
            }

            node.context().set('on', current);

        }).catch(err => {
            node.status({ fill: 'red', shape: 'ring', text: err.message });
            send({
                //@ts-ignore
                error: err
            });
        });
    }

    function processData(ev: IKalenderEvent, dateNow, node, last, current, message, send) {
        const eventStart = new Date(ev.eventStart);
        const eventEnd = new Date(ev.eventEnd);

        if (eventStart <= dateNow && eventEnd >= dateNow) {
            let event: CalEvent = Object.assign(ev, {
                topic: ev.summary,
                on: true,
                calendarName: ev.calendarName || node.config.name
            });
            let msg = RED.util.cloneMessage(message);
            delete msg._msgid;
            send(Object.assign(msg, {
                payload: event
            }));
            current = true;

            if (last != current) {
                send([null, Object.assign(msg, {
                    payload: event
                })]);
            }
        }
        return current;
    }

    RED.nodes.registerType("ical-sensor", sensorNode);
}