import { NodeMessage, NodeMessageInFlow } from 'node-red';
import { IcalEventsConfig } from './ical-config';
import { getConfig, CalEvent, IcalNode } from './helper';
import { KalenderEvents } from 'kalender-events';
var parser = require('cron-parser');

module.exports = function (RED: any) {
    function createEventNode(n: any) {
        RED.nodes.createNode(this, n);
        let node: IcalNode = this;

        node.on('input', (msg, send, done) => {
            const data = {
                event: RED?.util.evaluateNodeProperty(n.event, n.eventtype, n, msg)              
            }
            send = send || function () { node.send.apply(node, arguments) }
            const config = getConfig(RED.nodes.getNode(n.confignode) as unknown as IcalEventsConfig, RED, n, RED.util.cloneMessage(msg));
            execute(node, msg, data, config, send, done);
        });
    }

    async function execute(node: IcalNode, msg: NodeMessageInFlow, data: any, config: any, send: (msg: NodeMessage | NodeMessage[]) => void, done: (err?: Error) => void) {
        const ke = new KalenderEvents(config);
        const ret: any = await ke.createEvent(data.event)

        send = send || function () { node.send.apply(node, arguments); };
        send(Object.assign(msg, {
            payload: !ret
        }));
        if (done) {
            done();
        }
    }

    RED.nodes.registerType('ical-create', createEventNode);
};
