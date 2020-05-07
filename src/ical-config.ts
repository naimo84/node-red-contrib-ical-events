import { NodeProperties } from 'node-red';

export interface Config extends NodeProperties {
    rejectUnauthorized?: boolean;    
    url?: string,
    language?: string,
    replacedates?: boolean,
    caldav?: string,
    username?: string,
    password?: string,
    calendar?: string,  
    filter?: string,
    trigger?: string,
    endpreview?: number,
    endpreviewUnits?: string,
    preview?: number,
    previewUnits?: string,
    pastview?: number,
    pastviewUnits?: string,
    offsetUnits?:string,
    offset?: number,
    usecache?: boolean
}

module.exports = function (RED: any) {
    function icalConfig(config: Config) {
        RED.nodes.createNode(this, config);

        this.url = config.url;
        this.caldav = config.caldav;
        this.username = config.username;
        this.password = config.password;

        this.name = config.name;
        this.language = config.language;
        this.replacedates = config.replacedates;
        this.calendar = config.calendar;       
        this.usecache = config.usecache;       
    }

    RED.nodes.registerType('ical-config', icalConfig);
};
