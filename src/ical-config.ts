import { NodeProperties } from 'node-red';

export interface Config extends NodeProperties {
    url: string,
    language: string,
    replacedates: boolean,
    caldav: string,
    username: string,
    password: string,
    calendar: string,
    pastWeeks: number,
    futureWeeks: number
}

module.exports = function(RED: any) {
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
        this.pastWeeks = Number(config.pastWeeks || 0);
        this.futureWeeks = Number(config.futureWeeks || 4);
    }

    RED.nodes.registerType('ical-config', icalConfig);
};
