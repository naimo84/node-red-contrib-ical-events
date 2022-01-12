import { Config } from 'kalender-events';
var moment = require('moment-timezone');

export interface IcalEventsConfig extends Config {
    eventtypestype: string;
    filterPropertytype: string;
    filterOperator2type: string;
    filtertype: string;
    triggertype: string;
    filter2type: any;
    credentials: any;
    checkall?: boolean,
    usecache: boolean,
    caltype?: "icloud" | "caldav" | "ical",
    caldav?: string,
    name: string,
    id: any,
    type: any,
    combineResponse: boolean,
}

module.exports = function (RED: any) {
    RED.httpAdmin.get("/timezones", async (req, res) => {
        res.json(moment.tz.names());
    });

    RED.httpAdmin.post("/icalconfig", function (req, res) {
        RED.log.debug("POST /icalconfig");

        const nodeId = req.body.id;
        let config = RED.nodes.getNode(nodeId) as IcalEventsConfig;
        if (config) {
            res.json({
                includeTodo: config.includeTodo,
                type: config.caltype ? config.caltype : config.caldav
            });
        }
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
        this.username = config.username;
        this.password = config.password;
        this.includeTodo = config.includeTodo;
    }

    RED.nodes.registerType('ical-config', icalConfig, {
        credentials: {
            pass: { type: 'password' },
            user: { type: 'text' }
        }
    });
};
