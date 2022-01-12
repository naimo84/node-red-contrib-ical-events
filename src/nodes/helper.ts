import { IcalEventsConfig } from './ical-config';
import { CronJob } from 'cron';
import * as NodeCache from 'node-cache';
import { KalenderEvents, IKalenderEvent } from 'kalender-events';
import { DateTime } from "luxon";
import { Node } from 'node-red';

export interface Job {
    id: string,
    cronjob: any
}

export interface IcalNode extends Node {
    datesArray_old: any;
    datesArray: any;
    job: CronJob;
    config: IcalEventsConfig;
    cache: NodeCache;
    red: any;
    msg: any;
    ke: KalenderEvents;
    combineResponse: boolean;
    timezone: string;
}

export interface CalEvent extends IKalenderEvent {
    topic?: string,
    on?: boolean,
    off?: boolean,
}


export function getConfig(config: IcalEventsConfig,  RED: any, node?: any, msg?: any,): IcalEventsConfig {

    let type = msg?.caldav || msg?.type || config?.caltype;
    if (!type && config?.caldav) {
        if (config.caldav === "false")
            type = "ical"
        else if (config.caldav === "true")
            type = "caldav"
        else if (config.caldav === "icloud")
            type = "icloud"
    }
    
    const icalConfig = {
        url: msg?.url || config?.url,
        name: msg?.calendarName || config?.name,
        language: msg?.language || config?.language,
        checkall: msg?.checkall || node?.checkall || false,
        replacedates: msg?.replacedates || config?.replacedates,
        type: type,
        username: msg?.username || config?.credentials?.user || config?.username,
        usecache: msg?.usecache || config?.usecache || false,
        includeTodo: msg?.includeTodo || config?.includeTodo || false,

        eventtypes: RED.util.evaluateNodeProperty(config.eventtypes, config.eventtypestype, config, msg),

        password: msg?.password || config?.credentials?.pass || config?.password,
        calendar: msg?.calendar || config?.calendar,

        filter: RED.util.evaluateNodeProperty(node.filter, node.filtertype, node, msg) || msg?.filter || node?.filter,
        timezone: RED.util.evaluateNodeProperty(node.timezone, node.timezonetype, node, msg) ||  msg?.timezone || node?.timezone,
        filter2: RED.util.evaluateNodeProperty(node.filter2, node.filter2type, node, msg) || msg?.filter2 || node?.filter2,
        filterProperty: RED.util.evaluateNodeProperty(node.filterProperty, node.filterPropertytype, node, msg) || msg?.filterProperty || node?.filterProperty,
        filterOperator: RED.util.evaluateNodeProperty(node.filterOperator, node.filterOperator2type, node, msg) || msg?.filterOperator || node?.filterOperator,
        trigger: RED.util.evaluateNodeProperty(node.trigger, node.triggertype, node, msg) || msg?.trigger || node?.trigger || 'always',


        preview: parseInt(RED.util.evaluateNodeProperty(node.preview, node.previewtype, node, msg) || msg?.preview || node?.preview || node?.endpreview || 10),
        previewUnits: RED.util.evaluateNodeProperty(node.previewUnits, node.previewUnitstype, node, msg) || msg?.previewUnits || node?.previewUnits || node?.endpreviewUnits || 'd',
        pastview: parseInt(RED.util.evaluateNodeProperty(node.pastview, node.pastviewtype, node, msg) || msg?.pastview || node?.pastview || 0),
        pastviewUnits: RED.util.evaluateNodeProperty(node.pastviewUnits, node.pastviewUnitstype, node, msg) || msg?.pastviewUnits || node?.pastviewUnits || 'd',
        offset: parseInt(RED.util.evaluateNodeProperty(node.offset, node.offsettype, node, msg) || msg?.offset || node?.offset || 0),
        offsetUnits: RED.util.evaluateNodeProperty(node.offsetUnits, node.offsetUnitstype, node, msg) || msg?.offsetUnits || node?.offsetUnits || 'm',

        rejectUnauthorized: msg?.rejectUnauthorized || node?.rejectUnauthorized || false,
        combineResponse: msg?.combineResponse || node?.combineResponse || false,
        cache: new NodeCache()
    } as IcalEventsConfig;

    return icalConfig;
}

function extendEvent(event: IKalenderEvent, config: IcalEventsConfig, kalenderEvents?: KalenderEvents) {
    if (config.timezone) {
        //@ts-ignore
        event.eventStart = DateTime.fromJSDate(new Date(event.eventStart)).setZone(config.timezone).toString();
        //@ts-ignore
        event.eventEnd = DateTime.fromJSDate(new Date(event.eventEnd)).setZone(config.timezone).toString();
    }
    event.countdown = kalenderEvents.countdown(new Date(event.eventStart));
    if (!event.calendarName) event.calendarName = config.name;
    return event;
}

export async function getICal(node: IcalNode) {
    const kalenderEvents = new KalenderEvents()

    let configs: IcalEventsConfig[] = [];
    if (node.config.checkall) {
        node.red.nodes.eachNode(n => {
            if (n.type === 'ical-config') {
                configs.push(node.red.nodes.getNode(n.id));
            }
        })
    } else {
        configs.push(node.config);
    }

    let datas = [];
    for (let config of configs) {
        try {
            if (configs.length === 1) {
                let icalConfig = node.config;
                if ((new Date(node.msg.payload)).getTime() > 1) {
                    icalConfig = Object.assign(icalConfig, { now: new Date(node.msg.payload) })
                }
                let data = await kalenderEvents.getEvents(icalConfig)
                for (let d in data) {
                    datas.push(extendEvent(data[d], icalConfig, kalenderEvents));
                }
            }
            else {
                let icalConfig = getConfig(config, node.config);
                let data = await kalenderEvents.getEvents(icalConfig)
                for (let d in data) {
                    datas.push(extendEvent(data[d], icalConfig, kalenderEvents));
                }
            }
        }
        catch (err) {
            if (node.config.usecache && node.cache) {
                datas = node.cache.get("events");
            }
            node.error(err);
        }
    }

    if (node.config.usecache && node.cache) {
        node.cache.set("events", datas);
    }
    return datas;
}





