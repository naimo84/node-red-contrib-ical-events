"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (RED) {
    function icalConfig(config) {
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

//# sourceMappingURL=ical-config.js.map
