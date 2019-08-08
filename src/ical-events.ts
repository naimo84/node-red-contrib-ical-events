
import { Red, Node } from 'node-red';
var ical = require('node-ical');
const CronJob = require('cron').CronJob;

export interface Config {
    url: string,
}

module.exports = function (RED: Red) {
    let configNode: Config;

    function eventsNode(config: any) {
        RED.nodes.createNode(this, config);
        configNode = RED.nodes.getNode(config.confignode) as unknown as Config;
        const job = new CronJob(config.cron || '0 * * * * *', cronCheckJob.bind(null, this, config));
        job.start();

    }

    function cronCheckJob(node: Node, config: any) {
        var dateNow = new Date();

        ical.fromURL(configNode.url, {}, function (err, data) {
            if(err){
                node.error(err);
                return;
            }
            for (let k in data) {
                if (data.hasOwnProperty(k)) {
                    var ev = data[k];
                    const eventStart = new Date(ev.start);
                    if (ev.type == 'VEVENT') {
                        if (eventStart.getTime() >= dateNow.getTime()) {
                            const event = {
                                summary: ev.summary,
                                location: ev.location,
                                eventStart: ev.start
                            }

                            if (config.offset) {
                                eventStart.setMinutes(eventStart.getMinutes() + parseInt(config.offset));
                            }

                            try {
                                const job2 = new CronJob(eventStart, cronJob.bind(null, event, node));
                                job2.start();
                            } catch (job_err) {
                                node.error(job_err);
                            }
                        }
                    }
                }
            }
        });


    }

    function cronJob(event: any, node: Node) {
        node.send({
            payload: event
        });
    }

    RED.nodes.registerType("ical-events", eventsNode);
}