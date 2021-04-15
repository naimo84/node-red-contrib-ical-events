import { Config } from 'kalender-events/types/config';
var moment = require('moment-timezone');

export interface IcalEventsConfig extends Config {
    credentials: any;
    checkall?: boolean,
    usecache: boolean,
    caltype?: "icloud" | "caldav" | "ical",
    caldav?: string,
    name: string,
    id: any,
    type: any,
    combineResponse: boolean
}



module.exports = function (RED: any) {
    RED.httpAdmin.get("/timezones", async (req, res) => {
        res.json(moment.tz.names());    
    });
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
