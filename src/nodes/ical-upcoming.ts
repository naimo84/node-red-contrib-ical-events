import { NodeMessage, NodeMessageInFlow } from 'node-red';
import { CronJob } from 'cron';
import { IcalEventsConfig } from './ical-config';
import * as NodeCache from 'node-cache';
import { getConfig, getICal, CalEvent, IcalNode } from './helper';
var parser = require('cron-parser');

module.exports = function (RED: any) {
    function upcomingNode(config: any) {
        RED.nodes.createNode(this, config);
        let node: IcalNode = this;
        node.cache = new NodeCache();
        node.red = RED;
        node.msg = {};

        node.on('input', (msg, send, done) => {
            node.msg = RED.util.cloneMessage(msg);
            send = send || function () { node.send.apply(node, arguments) }
            node.config = getConfig(RED.nodes.getNode(config.confignode) as unknown as IcalEventsConfig, RED, config, msg);           
            cronCheckJob(node, msg, send, done,config);
        });


        try {
            let cron = '';
            if (config.timeout && config.timeout !== '' && parseInt(config.timeout) > 0 && config.timeoutUnits && config.timeoutUnits !== '') {
                switch (config.timeoutUnits) {
                    case 'seconds':
                        cron = `*/${config.timeout} * * * * *`;
                        break;
                    case 'minutes':
                        cron = `0 */${config.timeout} * * * *`;
                        break;
                    case 'hours':
                        cron = `0 0 */${config.timeout} * * *`;
                        break;
                    case 'days':
                        cron = `0 0 0 */${config.timeout} * *`;

                        break;
                    default:
                        break;
                }
            }
            if (config.cron && config.cron !== '') {
                parser.parseExpression(config.cron);
                cron = config.cron;
            }

            if (cron !== '') {
                node.job = new CronJob(cron, function () { node.emit("input", {}); }, null, true);

                node.on('close', () => {
                    node.job.stop();
                    node.debug('cron stopped');
                });
            }
        } catch (err) {
            node.error('Error: ' + err.message);
            node.status({ fill: 'red', shape: 'ring', text: err.message });
        }
    }

    function cronCheckJob(node: IcalNode, msg: NodeMessageInFlow, send: (msg: NodeMessage | NodeMessage[]) => void, done: (err?: Error) => void,n:any) {

        if (node.job && node.job.running) {
            node.status({ fill: 'green', shape: 'dot', text: `next check: ${node.job.nextDate().toISOString()}` });
        } else {
            node.status({});
        }


        node.datesArray = [];
        getICal(node, RED,n).then(data => {
            node.datesArray = data || [];

            let todayEventcounter = 0;
            let tomorrowEventcounter = 0;
            let today = new Date();
            today.setHours(0, 0, 0, 0);
            let oneDay = 24 * 60 * 60 * 1000;
            let tomorrow = new Date(today.getTime() + oneDay);
            let dayAfterTomorrow = new Date(tomorrow.getTime() + oneDay);

            for (var t = 0; t < node.datesArray.length; t++) {
                const eventStart = new Date(node.datesArray[t].eventStart);
                const eventEnd = new Date(node.datesArray[t].eventEnd);

                if (eventEnd.getTime() > today.getTime() && eventStart.getTime() < tomorrow.getTime()) {
                    todayEventcounter++;
                }
                if (eventEnd.getTime() > tomorrow.getTime() && eventStart.getTime() < dayAfterTomorrow.getTime()) {
                    tomorrowEventcounter++;
                }
                node.datesArray[t].on = (eventStart <= today && eventEnd >= today)
            }
            send = send || function () { node.send.apply(node, arguments); };
            send(Object.assign(node.msg, {
                today: todayEventcounter,
                tomorrow: tomorrowEventcounter,
                total: node.datesArray.length,
                htmlTable: brSeparatedList(node.datesArray, node.config),
                payload: node.datesArray,
            }));
            if (done) {
                done();
            }
        }).catch(err => {
            node.status({ fill: 'red', shape: 'ring', text: err.message });
            let datas = [];
            if (node.config.usecache && node.cache) {
                datas = node.cache.get("events");
            }
            node.datesArray = datas || [];
            //@ts-ignore
            send(Object.assign(node.msg, {
                // today: todayEventcounter,
                // tomorrow: tomorrowEventcounter,
                total: node.datesArray.length,
                htmlTable: brSeparatedList(node.datesArray, node.config),
                payload: node.datesArray,
                error: err }
            ));
            if (done) {
                done(err);
            } else {
                node.error(err, msg);
            }
        });
    }

    function brSeparatedList(datesArray: CalEvent[], config) {
        var text = '<span>';
        var today = new Date();
        var tomorrow = new Date();
        var dayafter = new Date();
        today.setHours(0, 0, 0, 0);
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        dayafter.setDate(today.getDate() + 2);
        dayafter.setHours(0, 0, 0, 0);

        for (var i = 0; i < datesArray.length; i++) {
            if (text)
                text += '<br/>\n';
            //@ts-ignore
            let summary = (datesArray[i].summary && datesArray[i].summary.val ? datesArray[i].summary.val : datesArray[i].summary);
            text += `${datesArray[i].date} ${summary}`.trim();
        }
        text += '</span>';
        return text;
    }


    RED.nodes.registerType('ical-upcoming', upcomingNode);
};
