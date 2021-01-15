

import { IcalEventsConfig } from './ical-config';
import { getConfig, IcalNode } from './helper';
import * as NodeCache from 'node-cache';
import { NodeMessageInFlow, NodeMessage } from "node-red";
import * as  ical from 'ical-generator';
import moment = require("moment");
import { IKalenderEvent } from 'kalender-events/types/event';

export interface IcalCreateNode extends IcalNode {
    eventType: string,
    event: string
}

module.exports = function (RED: any) {

    function node(n: any) {
        RED.nodes.createNode(this, n);
        let node: IcalCreateNode = this;
        node.eventType = n.eventType;
        node.event = n.event;
        try {
            node.cache = new NodeCache();
            node.on('input', (msg, send, done) => {
                send = send || function () { node.send.apply(node, arguments) }
                execute(node, msg, send, done);
            });
        }
        catch (err) {
            node.error('Error: ' + err.message);
            node.status({ fill: "red", shape: "ring", text: err.message })
        }
    }

    function getCalConfig(msg) {
        return {
            domain: msg.payload.domain,
            prodId: msg.payload.prodId, // { company: 'superman-industries.com', product: 'ical-generator', language: 'DE' },
            name: msg.payload.name,
            timezone: msg.payload.timezone,
            description: 'desc'
        }
    }

    function convertMsgEvent(ev: IKalenderEvent): ical.EventData {
        let event: ical.EventData = {
            start: ev.eventStart,
            end: ev.eventEnd,
            summary: ev.summary,
            organizer: ev.organizer,
            allDay: ev.allDay,
            attendees: ev.attendee,
            location: ev.location
        }
        return event;
    }

    function execute(node: IcalCreateNode, msg: NodeMessageInFlow, send: (msg: NodeMessage | NodeMessage[]) => void, done: (err?: Error) => void) {
        const calConfig = getCalConfig(msg);

        const cal = ical({
            domain: calConfig.domain,
            prodId: calConfig.prodId, // { company: 'superman-industries.com', product: 'ical-generator', language: 'DE' },
            name: calConfig.name,
            timezone: calConfig.timezone,
            description: calConfig.description
        });

        let createEvent = convertMsgEvent(node.eventType === 'msg' ? msg.payload : JSON.parse(node.event));
        cal.createEvent(Object.assign(createEvent, {
            transparency: 'OPAQUE',
            busystatus: 'FREE',
            repeating: { freq: 'DAILY' },
        }));

        send({ payload: cal.toString() })
    }

    RED.nodes.registerType("ical-create-ics", node);
}