import { Config } from 'kalender-events/types/config';

export interface IcalEventsConfig extends Config {
    credentials: any;
    checkall?: boolean,
    usecache: boolean,
    caltype?: "icloud" | "caldav" | "ical",
    caldav?: string,
    name: string,
    id: any,
    type: any
}


module.exports = function (RED: any) {
    function icalConfig(config: IcalEventsConfig) {
        RED.nodes.createNode(this, config);

        this.url = config.url;
        if (!config.caltype) {
            if (!config.caldav || config.caldav === "false")
                this.caltype = "ical"
            else if (config.caldav === "true")
                this.caltype = "caldav"
            else if (config.caldav === "icloud")
                this.caltype = "icloud"
        } else {
            this.caltype = config.caltype;
        }

        if (config.username) {
            RED.nodes.addCredentials(this.id, { user: config.username, pass: config.password })
        }

        this.name = config.name;
        this.caldav = config.caldav;
        this.language = config.language;
        this.replacedates = config.replacedates;
        this.calendar = config.calendar;
        this.usecache = config.usecache;
        this.username=config.username;
        this.password=config.password;
    }

    RED.nodes.registerType('ical-config', icalConfig, {
        credentials: {
            pass: { type: 'password' },
            user: { type: 'text' }
        }
    });
};
