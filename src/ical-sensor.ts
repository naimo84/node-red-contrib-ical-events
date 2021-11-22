
import { NodeMessage, NodeMessageInFlow } from 'node-red';
import { CronJob } from 'cron';
import { IcalEventsConfig } from './ical-config';
import { getConfig, getICal, CalEvent, IcalNode } from './helper';
import * as NodeCache from 'node-cache';
import { IKalenderEvent } from 'kalender-events';

module.exports = function (RED: any) {
    function sensorNode(config: any) {
        RED.nodes.createNode(this, config);
        let node: IcalNode = this;

        try {
            node.cache = new NodeCache();
            node.msg = {};
            node.combineResponse = config.combineResponse;
            node.timezone = config.timezone;
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
            let events = [];

            for (let k in data) {
                if (data.hasOwnProperty(k)) {
                    let ev = data[k];
                    if (ev instanceof Array && ev.length >= 1) {
                        for (let e of ev) {
                            current = processData(e, dateNow, node, last, current, msg, send, events)
                        }
                    } else {
                        current = processData(ev, dateNow, node, last, current, msg, send, events)
                    }

                }
            }

            if (!current) {
                let event: any = {
                    on: false
                }
                let msg2 = RED.util.cloneMessage(msg);
                delete msg2._msgid;
                if (node.config.combineResponse) {
                    event = [event]
                }
                send(Object.assign(msg2, {
                    payload: event
                }));

                if (last != current) {
                    send([null, Object.assign(msg2, {
                        payload: event
                    })]);
                }
            } else {
                if (!node.config.combineResponse) {
                    let retEvents: NodeMessage[] = []
                    for (let event of events) {
                        let msg2 = RED.util.cloneMessage(msg);
                        delete msg2._msgid;
                        retEvents.push(Object.assign(msg2, {
                            payload: event
                        }))
                    }

                    if (last != current) {
                        send([
                            //@ts-ignore
                            retEvents,
                            //@ts-ignore
                            retEvents
                        ])
                    } else {
                        send([
                            //@ts-ignore
                            retEvents
                        ])
                    }

                } else {
                    let msg2 = RED.util.cloneMessage(msg);
                    delete msg2._msgid;
                    if (last !== current) {
                        send([
                            Object.assign(msg2, {
                                payload: events
                            }),
                            Object.assign(msg2, {
                                payload: events
                            })
                        ]);
                    } else {
                        send(Object.assign(msg2, {
                            payload: events
                        }));
                    }
                }
            }

            node.context().set('on', current);
            if (done)
                done();
        }).catch(err => {
            node.status({ fill: 'red', shape: 'ring', text: err.message });
            send({
                //@ts-ignore
                error: err
            });
            if (done)
                done(err);
        });
    }

    function processData(ev: IKalenderEvent, dateNow, node, last, current, message, send, events) {
        const eventStart = new Date(ev.eventStart);
        const eventEnd = new Date(ev.eventEnd);

        if (eventStart <= dateNow && eventEnd >= dateNow) {
            let event: CalEvent = Object.assign(ev, {
                topic: ev.summary,
                on: true,
                calendarName: ev.calendarName || node.config.name
            });
            events.push(event)
            current = true;
        }
        return current;
    }

    RED.nodes.registerType("ical-sensor", sensorNode);
}