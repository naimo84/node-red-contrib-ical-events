module.exports = function (RED: any) {
    function icalConfig(config) {
        RED.nodes.createNode(this, config);
		
        this.url = config.url;
    }
  
    RED.nodes.registerType("ical-config", icalConfig);
}