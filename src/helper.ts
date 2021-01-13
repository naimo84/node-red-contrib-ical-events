import { IcalEventsConfig } from './ical-config';
import { CronJob } from 'cron';
import { Node } from 'node-red';
import * as NodeCache from 'node-cache';
import { KalenderEvents } from "kalender-events";
import { IKalenderEvent } from 'kalender-events/types/event';
const kalenderEvents = new KalenderEvents()
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
}

export interface CalEvent extends IKalenderEvent {
    topic?: string,
    on?: boolean,
    off?: boolean,
}


export function getConfig(config: IcalEventsConfig, node?: any, msg?: any): IcalEventsConfig {
    
    let type = msg?.caldav || msg?.type || config?.caltype;
    if (!type && config?.caldav) {
        if (config.caldav === "false")
            type = "ical"
        else if (config.caldav === "true")
            type = "caldav"
        else if (config.caldav === "icloud")
            type = "icloud"
    }

    const icalConfig= {
        url: msg?.url || config?.url,
        name: msg?.calendarName || config?.name,
        language: msg?.language || config?.language,
        checkall: msg?.checkall || node?.checkall || false,
        replacedates: msg?.replacedates || config?.replacedates,
        type: type,
        username: msg?.username || config?.credentials?.username,
        usecache: msg?.usecache || config?.usecache || false,
        password: msg?.password || config?.credentials?.password,
        calendar: msg?.calendar || config?.calendar,
        filter: msg?.filter || node?.filter,
        filter2: msg?.filter2 || node?.filter2,
        filterProperty: msg?.filterProperty || node?.filterProperty,
        filterOperator: msg?.filterOperator || node?.filterOperator,
        trigger: msg?.trigger || node?.trigger || 'always',
        preview: parseInt(msg?.preview || node?.preview || node?.endpreview || 10),
        previewUnits: msg?.previewUnits || node?.previewUnits || node?.endpreviewUnits || 'd',
        pastview: parseInt(msg?.pastview || node?.pastview || 0),
        pastviewUnits: msg?.pastviewUnits || node?.pastviewUnits || 'd',
        offset: parseInt(msg?.offset || node?.offset || 0),
        offsetUnits: msg?.offsetUnits || node?.offsetUnits || 'm',
        rejectUnauthorized: msg?.rejectUnauthorized || node?.rejectUnauthorized || false
    } as IcalEventsConfig;

    return icalConfig;
}


export async function getICal(node: IcalNode) {
    

    let configs:IcalEventsConfig[] = [];
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
                let data = await kalenderEvents.getEvents(icalConfig)
                for (let d in data) {
                    let event=data[d];
                    if(!event.calendarName) event.calendarName=config.name;
                    datas.push(event)
                }
            }
            else {
                let icalConfig = getConfig(config,node.config);
                let data = await kalenderEvents.getEvents(icalConfig)
                for (let d in data) {
                    let event=data[d];
                    if(!event.calendarName) event.calendarName=icalConfig.name;
                    datas.push(event)
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






