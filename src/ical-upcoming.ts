import { Red, Node } from 'node-red';
import { CalEvent } from "./ical-events";
import { CronJob } from 'cron';
import * as  ical from 'node-ical';
import { Config } from './ical-config';
import { isEqual } from 'lodash';
import * as moment from 'moment';
import { CalDav } from './caldav';
import { loadEventsForDay } from './icloud'

var parser = require('cron-parser');
var RRule = require('rrule').RRule;

var ce = require('cloneextend');

module.exports = function (RED: Red) {
    function upcomingNode(config: any) {
        RED.nodes.createNode(this, config);

        try {
            parser.parseExpression(config.cron);
            let configNode = RED.nodes.getNode(config.confignode) as unknown as Config;
            this.config = configNode;
            this.endpreview = config.endpreview || 10;

            this.on('input', () => {
                cronCheckJob(this);
            });

            if (config.cron && config.cron !== "") {
                this.job = new CronJob(config.cron || '0 0 * * * *', cronCheckJob.bind(null, this, configNode));

                this.on('close', () => {
                    this.job.stop();
                    this.debug("cron stopped")
                });

                this.job.start();
            }
        }
        catch (err) {
            this.error('Error: ' + err.message);
            this.status({ fill: "red", shape: "ring", text: err.message })
        }
    }

    function cronCheckJob(node: any) {
        if (node.job && node.job.running) {
            node.status({ fill: "green", shape: "dot", text: node.job.nextDate().toISOString() });
        }
        else {
            node.status({});
        }

        node.datesArray_old = ce.clone(node.datesArray);
        node.datesArray = [];
        checkICal(node.config.url, (data, err) => {
            if (err) {
                node.error('Error: ' + err);
                node.status({ fill: "red", shape: "ring", text: err.message })
                return;
            }
            displayDates(node, node.config);
        }, node, node.config);
    }

    function processRRule(ev, endpreview, today, realnow, node, config) {
        var eventLength = ev.end.getTime() - ev.start.getTime();

        var options = RRule.parseString(ev.rrule.toString());
        options.dtstart = addOffset(ev.start, -getTimezoneOffset(ev.start));
        if (options.until) {
            options.until = addOffset(options.until, -getTimezoneOffset(options.until));
        }
        node.debug('options:' + JSON.stringify(options));

        var rule = new RRule(options);
        var now2 = new Date();
        now2.setHours(0, 0, 0, 0);
        var now3 = new Date(now2.getTime() - eventLength);
        if (now2 < now3) now3 = now2;
        node.debug('RRule event:' + ev.summary + '; start:' + ev.start.toString() + '; endpreview:' + endpreview.toString() + '; today:' + today + '; now2:' + now2 + '; now3:' + now3 + '; rule:' + JSON.stringify(rule));

        var dates = [];
        try {
            dates = rule.between(now3, endpreview, true);
        } catch (e) {
            node.error('Issue detected in RRule, event ignored; Please forward debug information to iobroker.ical developer: ' + e.stack + '\n' +
                'RRule object: ' + JSON.stringify(rule) + '\n' +
                'now3: ' + now3 + '\n' +
                'endpreview: ' + endpreview + '\n' +
                'string: ' + ev.rrule.toString() + '\n' +
                'options: ' + JSON.stringify(options)
            );
        }

        node.debug('dates:' + JSON.stringify(dates));

        if (dates.length > 0) {
            for (var i = 0; i < dates.length; i++) {
                var ev2 = ce.clone(ev);
                var start = dates[i];
                ev2.start = addOffset(start, getTimezoneOffset(start));

                var end = new Date(start.getTime() + eventLength);
                ev2.end = addOffset(end, getTimezoneOffset(end));

                node.debug('   ' + i + ': Event (' + JSON.stringify(ev2.exdate) + '):' + ev2.start.toString() + ' ' + ev2.end.toString());

                var checkDate = true;
                if (ev2.exdate) {
                    for (var d in ev2.exdate) {
                        if (new Date(d).getTime() === ev2.start.getTime()) {
                            checkDate = false;
                            node.debug('   ' + i + ': sort out');
                            break;
                        }
                    }
                }
                if (checkDate && ev.recurrences) {
                    for (var dOri in ev.recurrences) {
                        if (new Date(dOri).getTime() === ev2.start.getTime()) {
                            ev2 = ce.clone(ev.recurrences[dOri]);
                            node.debug('   ' + i + ': different recurring found replaced with Event:' + ev2.start + ' ' + ev2.end);
                        }
                    }
                }

                if (checkDate) {
                    checkDates(ev2, endpreview, today, realnow, ' rrule ', node, config);
                }
            }
        }
    }

    function processData(data, realnow, today, endpreview, now2, callback, node, config) {
        var processedEntries = 0;
        for (var k in data) {
            var ev = data[k];
            delete data[k];

            if ((ev.summary !== undefined) && (ev.type === 'VEVENT')) {
                if (!ev.end) {
                    ev.end = ce.clone(ev.start);
                    if (!ev.start.getHours() && !ev.start.getMinutes() && !ev.start.getSeconds()) {
                        ev.end.setDate(ev.end.getDate() + 1);
                    }
                }

                if (ev.rrule === undefined) {
                    checkDates(ev, endpreview, today, realnow, ' ', node, config);
                } else {
                    processRRule(ev, endpreview, today, realnow, node, config);
                }
            }

            if (++processedEntries > 100) {
                break;
            }
        }
        if (!Object.keys(data).length) {
            return;
        } else {
            processData(data, realnow, today, endpreview, now2, callback, node, config);
        }
    }

    function checkDates(ev, endpreview, today, realnow, rule, node, config: Config) {
        var fullday = false;
        var reason;
        var date;

        if (ev.summary.hasOwnProperty('val')) {
            reason = ev.summary.val;
        } else {
            reason = ev.summary;
        }

        var location = ev.location || '';

        if (!ev.start) return;
        if (!ev.end) ev.end = ev.start;
        ev.start = new Date(ev.start);
        ev.end = new Date(ev.end)
        if (!ev.start.getHours() && !ev.start.getMinutes() && !ev.start.getSeconds()
            && !ev.end.getHours() && !ev.end.getMinutes() && !ev.end.getSeconds()) {
            if (ev.end.getTime() == ev.start.getTime() && ev.datetype == 'date') {
                ev.end.setDate(ev.end.getDate() + 1);
            }
            if (ev.end.getTime() !== ev.start.getTime()) {
                fullday = true;
            }
        }

        if (fullday) {
            if ((ev.start < endpreview && ev.start >= today) || (ev.end > today && ev.end <= endpreview) || (ev.start < today && ev.end > today)) {
                date = formatDate(ev.start, ev.end, true, true, config);

                insertSorted(node.datesArray, {
                    date: date.text,
                    summary: ev.summary,
                    event: reason,
                    eventStart: new Date(ev.start.getTime()),
                    eventEnd: new Date(ev.end.getTime()),
                    description: ev.description,
                    id: ev.uid,
                    allDay: true,
                    rule: rule,
                    location: location
                });

                node.debug('Event (full day) added : ' + JSON.stringify(rule) + ' ' + reason + ' at ' + date.text);
            }
        } else {
            // Event with time             
            if ((ev.start >= today && ev.start < endpreview && ev.end >= realnow) || (ev.end >= realnow && ev.end <= endpreview) || (ev.start < realnow && ev.end > realnow)) {

                date = formatDate(ev.start, ev.end, true, false, config);
                insertSorted(node.datesArray, {
                    date: date.text,
                    event: reason,
                    summary: ev.summary,
                    eventStart: new Date(ev.start.getTime()),
                    eventEnd: new Date(ev.end.getTime()),
                    description: ev.description,
                    id: ev.uid,
                    allDay: false,
                    rule: rule,
                    location: location
                });
                node.debug('Event with time added: ' + JSON.stringify(rule) + ' ' + reason + ' at ' + date.text);
            }
        }
    }

    function getICal(node, urlOrFile, config, callback) {
        if (urlOrFile.match(/^https?:\/\//)) {
            if (config.caldav && config.caldav === 'icloud') {
                const now = moment();
                const when = now.toDate();
                loadEventsForDay(moment(when), {
                    url: urlOrFile,
                    username: config.username,
                    password: config.password,
                    type: "caldav",
                    endpreview:node.endpreview
                }, (list, start, end) => {
                    callback && callback(null, list);
                });
            } else if (config.caldav && JSON.parse(config.caldav) === true) {
                node.debug("caldav")
                CalDav(node, config, null, (data) => {
                    callback(null, data);
                });
            }
            else {
                let header = {};
                let username = config.username;
                let password = config.password;

                if (username && password) {
                    var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
                    header = {
                        headers: {
                            'Authorization': auth
                        }
                    }
                }

                ical.fromURL(config.url, header, (err, data) => {
                    if (err) {
                        callback && callback(err, null);
                        return;
                    }
                    callback && callback(null, data);
                });
            }
        }
    }


    function checkICal(urlOrFile, callback, node, config: Config) {
        getICal(node, urlOrFile, config, (err, data) => {
            if (err || !data) {
                callback(err);
                return;
            }

            node.debug('Ical read successfully ' + urlOrFile);

            try {
                if (data) {
                    var realnow = new Date();
                    var today = new Date();
                    today.setHours(0, 0, 0, 0);
                    var endpreview = new Date();

                    endpreview.setDate(endpreview.getDate() + parseInt(node.endpreview));
                    var now2 = new Date();
                    now2.setHours(0, 0, 0, 0);

                    processData(data, realnow, today, endpreview, now2, callback, node, config);
                    callback(data);
                }
                else {
                    callback(null, "no Data");
                }

            } catch (e) {
                node.debug(JSON.stringify(e));
                callback("no Data" + e);
            }
        });
    }

    function getTimezoneOffset(date) {
        var offset = 0;
        var zone = moment.tz.zone(moment.tz.guess());
        if (zone && date) {
            offset = zone.utcOffset(date.getTime());
        }
        return offset;
    }

    function addOffset(time, offset) {
        return new Date(time.getTime() + (offset * 60 * 1000));
    }

    function displayDates(node: any, config: Config) {

        let todayEventcounter = 0;
        let tomorrowEventcounter = 0;
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let oneDay = 24 * 60 * 60 * 1000;
        let tomorrow = new Date(today.getTime() + oneDay);
        let dayAfterTomorrow = new Date(tomorrow.getTime() + oneDay);

        for (var t = 0; t < node.datesArray.length; t++) {
            if (node.datesArray[t].eventEnd.getTime() > today.getTime() && node.datesArray[t].eventStart.getTime() < tomorrow.getTime()) {
                todayEventcounter++;
            }
            if (node.datesArray[t].eventEnd.getTime() > tomorrow.getTime() && node.datesArray[t].eventStart.getTime() < dayAfterTomorrow.getTime()) {
                tomorrowEventcounter++;
            }
        }

        node.send({
            today: todayEventcounter,
            tomorrow: tomorrowEventcounter,
            total: node.datesArray.length,
            htmlTable: brSeparatedList(node.datesArray, config),
            payload: node.datesArray
        });

    }

    let dictionary = {
        'today': { 'en': 'Today', 'it': 'Oggi', 'es': 'Hoy', 'pl': 'Dzisiaj', 'fr': 'Aujourd\'hui', 'de': 'Heute', 'ru': 'Сегодня', 'nl': 'Vandaag' },
        'tomorrow': { 'en': 'Tomorrow', 'it': 'Domani', 'es': 'Mañana', 'pl': 'Jutro', 'fr': 'Demain', 'de': 'Morgen', 'ru': 'Завтра', 'nl': 'Morgen' },
        'dayafter': { 'en': 'Day After Tomorrow', 'it': 'Dopodomani', 'es': 'Pasado mañana', 'pl': 'Pojutrze', 'fr': 'Après demain', 'de': 'Übermorgen', 'ru': 'Послезавтра', 'nl': 'Overmorgen' },
        '3days': { 'en': 'In 3 days', 'it': 'In 3 giorni', 'es': 'En 3 días', 'pl': 'W 3 dni', 'fr': 'Dans 3 jours', 'de': 'In 3 Tagen', 'ru': 'Через 2 дня', 'nl': 'Over 3 dagen' },
        '4days': { 'en': 'In 4 days', 'it': 'In 4 giorni', 'es': 'En 4 días', 'pl': 'W 4 dni', 'fr': 'Dans 4 jours', 'de': 'In 4 Tagen', 'ru': 'Через 3 дня', 'nl': 'Over 4 dagen' },
        '5days': { 'en': 'In 5 days', 'it': 'In 5 giorni', 'es': 'En 5 días', 'pl': 'W ciągu 5 dni', 'fr': 'Dans 5 jours', 'de': 'In 5 Tagen', 'ru': 'Через 4 дня', 'nl': 'Over 5 dagen' },
        '6days': { 'en': 'In 6 days', 'it': 'In 6 giorni', 'es': 'En 6 días', 'pl': "W ciągu 6 dni", 'fr': "Dans 6 jours", 'de': 'In 6 Tagen', 'ru': 'Через 5 дней', 'nl': 'Over 6 dagen' },
        'oneweek': { 'en': 'In one week', 'it': 'In una settimana', 'es': 'En una semana', 'pl': 'W jeden tydzień', 'fr': 'Dans une semaine', 'de': 'In einer Woche', 'ru': 'Через неделю', 'nl': 'Binnen een week' },
        '1week_left': { 'en': 'One week left', 'it': 'Manca una settimana', 'es': 'Queda una semana', 'pl': 'Został jeden tydzień', 'fr': 'Reste une semaine', 'de': 'Noch eine Woche', 'ru': 'Ещё неделя', 'nl': 'Over een week' },
        '2week_left': { 'en': 'Two weeks left', 'it': 'Due settimane rimaste', 'es': 'Dos semanas restantes', 'pl': 'Zostały dwa tygodnie', 'fr': 'Il reste deux semaines', 'de': 'Noch zwei Wochen', 'ru': 'Ещё две недели', 'nl': 'Over twee weken' },
        '3week_left': { 'en': 'Three weeks left', 'it': 'Tre settimane rimanenti', 'es': 'Tres semanas quedan', 'pl': "Pozostały trzy tygodnie", 'fr': 'Trois semaines restantes', 'de': 'Noch drei Wochen', 'ru': 'Ещё три недели', 'nl': 'Over drie weken' },
        '4week_left': { 'en': 'Four weeks left', 'it': 'Quattro settimane rimaste', 'es': 'Cuatro semanas quedan', 'pl': 'Pozostały cztery tygodnie', 'fr': 'Quatre semaines à gauche', 'de': 'Noch vier Wochen', 'ru': 'Ещё три недели', 'nl': 'Over vier weken' },
        '5week_left': { 'en': 'Five weeks left', 'it': 'Cinque settimane rimaste', 'es': 'Quedan cinco semanas', 'pl': 'Pozostało pięć tygodni', 'fr': 'Cinq semaines à gauche', 'de': 'Noch fünf Wochen', 'ru': 'Ещё пять недель', 'nl': 'Over vijf weken' },
        '6week_left': { 'en': 'Six weeks left', 'it': 'Sei settimane a sinistra', 'es': 'Seis semanas restantes', 'pl': 'Pozostało sześć tygodni', 'fr': 'Six semaines à gauche', 'de': 'Noch sechs Wochen', 'ru': 'Ещё шесть недель', 'nl': 'Over zes weken' },
        'left': { 'en': 'left', 'it': 'sinistra', 'es': 'izquierda', 'pl': 'lewo', 'fr': 'la gauche', 'de': ' ', 'ru': 'осталось', 'nl': 'over' },
        'still': { 'en': ' ', 'it': '', 'es': '', 'pl': '', 'fr': '', 'de': 'Noch', 'ru': ' ', 'nl': 'nog' },
        'days': { 'en': 'days', 'it': 'Giorni', 'es': 'dias', 'pl': 'dni', 'fr': 'journées', 'de': 'Tage', 'ru': 'дней', 'nl': 'dagen' },
        'day': { 'en': 'day', 'it': 'giorno', 'es': 'día', 'pl': 'dzień', 'fr': 'journée', 'de': 'Tag', 'ru': 'день', 'nl': 'dag' },
        'hours': { 'en': 'hours', 'it': 'ore', 'es': 'horas', 'pl': 'godziny', 'fr': 'heures', 'de': 'Stunden', 'ru': 'часов', 'nl': 'uren' },
        'hour': { 'en': 'hour', 'it': 'ora', 'es': 'hora', 'pl': 'godzina', 'fr': 'heure', 'de': 'Stunde', 'ru': 'час', 'nl': 'uur' }
    };

    function _(text, config) {
        if (!text) return '';

        if (dictionary[text]) {
            var newText = dictionary[text][config.language];
            if (newText) {
                return newText;
            } else if (config.language !== 'en') {
                newText = dictionary[text].en;
                if (newText) {
                    return newText;
                }
            }
        }
        return text;
    }

    function insertSorted(arr: CalEvent[], element: CalEvent) {
        if (!arr.length) {
            arr.push(element);
        } else {
            if (arr[0].eventStart > element.eventStart) {
                arr.unshift(element);
            } else if (arr[arr.length - 1].eventStart < element.eventStart) {
                arr.push(element);
            } else {
                if (arr.length === 1) {
                    arr.push(element);
                } else {
                    for (var i = 0; i < arr.length - 1; i++) {
                        if (arr[i].eventStart <= element.eventStart && element.eventStart < arr[i + 1].eventStart) {
                            arr.splice(i + 1, 0, element);
                            element = null;
                            break;
                        }
                    }
                    if (element)
                        arr.push(element);
                }
            }
        }
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
            var date = formatDate(datesArray[i].eventStart, datesArray[i].eventEnd, true, datesArray[i].allDay, config);

            if (text) text += '<br/>\n';
            text += date.text + ' ' + datesArray[i].event + '</span>';
        }

        return text;
    }

    function formatDate(_date, _end: Date, withTime, fullday, config) {
        var day = _date.getDate();
        var month = _date.getMonth() + 1;
        var year = _date.getFullYear();
        var endday = _end.getDate();
        var endmonth = _end.getMonth() + 1;
        var endyear = _end.getFullYear();
        var _time = '';
        var alreadyStarted = (_date < new Date());

        if (withTime) {
            var hours = _date.getHours();
            var minutes = _date.getMinutes();


            if (!alreadyStarted) {

                if (hours < 10) hours = '0' + hours.toString();
                if (minutes < 10) minutes = '0' + minutes.toString();
                _time = ' ' + hours + ':' + minutes;
            }
            var timeDiff = _end.getTime() - _date.getTime();
            if (timeDiff === 0 && hours === 0 && minutes === 0) {
                _time = ' ';
            }
            else if (timeDiff > 0) {
                if (!alreadyStarted) {
                    _time += '-';
                }
                else {
                    _time += ' ';
                }

                var endhours = _end.getHours().toString();
                var endminutes = _end.getMinutes().toString();

                if (parseInt(endhours) < 10) endhours = '0' + endhours.toString();

                if (parseInt(endminutes) < 10) endminutes = '0' + endminutes.toString();
                _time += endhours + ':' + endminutes;

                var startDayEnd = new Date();
                startDayEnd.setFullYear(_date.getFullYear());
                startDayEnd.setMonth(_date.getMonth());
                startDayEnd.setDate(_date.getDate() + 1);
                startDayEnd.setHours(0, 0, 0, 0);

                if (_end > startDayEnd) {
                    var start = new Date();
                    if (!alreadyStarted) {
                        start.setDate(_date.getDate());
                        start.setMonth(_date.getMonth());
                        start.setFullYear(_date.getFullYear());
                    }
                    start.setHours(0, 0, 1, 0);
                    var fullTimeDiff = timeDiff;
                    timeDiff = _end.getTime() - start.getTime();

                    if (fullTimeDiff >= 24 * 60 * 60 * 1000) {
                        _time += '+' + Math.floor(timeDiff / (24 * 60 * 60 * 1000));
                    }
                }
                else if (config.replacedates && _end.getHours() === 0 && _end.getMinutes() === 0) {
                    _time = ' ';
                }
            }

        }
        var _class = '';
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        var d2 = new Date();
        d2.setDate(d.getDate() + 1);

        var todayOnly = false;
        if (day === d.getDate() && month === (d.getMonth() + 1) && year === d.getFullYear() && endday === d2.getDate() && endmonth === (d2.getMonth() + 1) && endyear === d2.getFullYear() && fullday) {
            todayOnly = true;
        }

        if (todayOnly || !alreadyStarted) {
            if (day === d.getDate() &&
                month === (d.getMonth() + 1) &&
                year === d.getFullYear()) {
                _class = 'ical_today';
            }

            d.setDate(d.getDate() + 1);
            if (day === d.getDate() &&
                month === (d.getMonth() + 1) &&
                year === d.getFullYear()) {
                _class = 'ical_tomorrow';
            }

            d.setDate(d.getDate() + 1);
            if (day === d.getDate() &&
                month === (d.getMonth() + 1) &&
                year === d.getFullYear()) {
                _class = 'ical_dayafter';
            }

            d.setDate(d.getDate() + 1);
            if (day === d.getDate() &&
                month === (d.getMonth() + 1) &&
                year === d.getFullYear()) {
                _class = 'ical_3days';
            }

            d.setDate(d.getDate() + 1);
            if (day === d.getDate() &&
                month === (d.getMonth() + 1) &&
                year === d.getFullYear()) {
                _class = 'ical_4days';
            }

            d.setDate(d.getDate() + 1);
            if (day === d.getDate() &&
                month === (d.getMonth() + 1) &&
                year === d.getFullYear()) {
                _class = 'ical_5days';
            }

            d.setDate(d.getDate() + 1);
            if (day === d.getDate() &&
                month === (d.getMonth() + 1) &&
                year === d.getFullYear()) {
                _class = 'ical_6days';
            }

            d.setDate(d.getDate() + 1);
            if (day === d.getDate() &&
                month === (d.getMonth() + 1) &&
                year === d.getFullYear()) {
                _class = 'ical_oneweek';
            }

            if (config.replacedates) {
                if (_class === 'ical_today') return { text: ((alreadyStarted && !todayOnly) ? '&#8594; ' : '') + _('today', config) + _time, _class: _class };
                if (_class === 'ical_tomorrow') return { text: (alreadyStarted ? '&#8594; ' : '') + _('tomorrow', config) + _time, _class: _class };
                if (_class === 'ical_dayafter') return { text: (alreadyStarted ? '&#8594; ' : '') + _('dayafter', config) + _time, _class: _class };
                if (_class === 'ical_3days') return { text: (alreadyStarted ? '&#8594; ' : '') + _('3days', config) + _time, _class: _class };
                if (_class === 'ical_4days') return { text: (alreadyStarted ? '&#8594; ' : '') + _('4days', config) + _time, _class: _class };
                if (_class === 'ical_5days') return { text: (alreadyStarted ? '&#8594; ' : '') + _('5days', config) + _time, _class: _class };
                if (_class === 'ical_6days') return { text: (alreadyStarted ? '&#8594; ' : '') + _('6days', config) + _time, _class: _class };
                if (_class === 'ical_oneweek') return { text: (alreadyStarted ? '&#8594; ' : '') + _('oneweek', config) + _time, _class: _class };
            }
        } else {
            _class = 'ical_today';
            var daysleft = Math.round((_end.getDate() - new Date().getDate()) / (1000 * 60 * 60 * 24));
            var hoursleft = Math.round((_end.getDate() - new Date().getDate()) / (1000 * 60 * 60));

            if (config.replacedates) {
                var _left = (_('left', config) !== ' ' ? ' ' + _('left', config) : '');
                var text;
                if (daysleft === 42) {
                    text = _('6week_left', config);
                } else if (daysleft === 35) {
                    text = _('5week_left', config);
                } else if (daysleft === 28) {
                    text = _('4week_left', config);
                } else if (daysleft === 21) {
                    text = _('3week_left', config);
                } else if (daysleft === 14) {
                    text = _('2week_left', config);
                } else if (daysleft === 7) {
                    text = _('1week_left', config);
                } else if (daysleft >= 1) {
                    if (config.language === 'ru') {
                        var c = daysleft % 10;
                        var cc = Math.floor(daysleft / 10) % 10;
                        if (daysleft === 1) {
                            text = (_('still', config) !== ' ' ? _('still', config) : '') + ' ' + daysleft + ' ' + _('day', config) + _left;
                        } else if (cc > 1 && (c > 1 || c < 5)) {
                            text = (_('still', config) !== ' ' ? _('still', config) : '') + ' ' + daysleft + ' ' + 'дня' + _left;
                        } else {
                            text = (_('still', config) !== ' ' ? _('still', config) : '') + ' ' + daysleft + ' ' + _('days', config) + _left;
                        }
                    } else {
                        text = (_('still', config) !== ' ' ? _('still', config) : '') + ' ' + daysleft + ' ' + (daysleft === 1 ? _('day', config) : _('days', config)) + _left;
                    }
                } else {
                    if (config.language === 'ru') {
                        var c = hoursleft % 10;
                        var cc = Math.floor(hoursleft / 10) % 10;
                        if (hoursleft === 1) {
                            text = (_('still', config) !== ' ' ? _('still', config) : '') + ' ' + hoursleft + ' ' + _('hour', config) + _left;
                        } else if (cc !== 1 && (c > 1 || c < 5)) {
                            text = (_('still', config) !== ' ' ? _('still', config) : '') + ' ' + hoursleft + ' ' + 'часа' + _left;
                        } else {
                            text = (_('still', config) !== ' ' ? _('still', config) : '') + ' ' + hoursleft + ' ' + _('hours', config) + _left;
                        }
                    } else {
                        text = (_('still', config) !== ' ' ? _('still', config) : '') + ' ' + hoursleft + ' ' + (hoursleft === 1 ? _('hour', config) : _('hours', config)) + _left;
                    }
                }
            } else {
                day = _end.getDate();
                month = _end.getMonth() + 1;
                year = _end.getFullYear();

                if (day < 10) day = '0' + day.toString();
                if (month < 10) month = '0' + month.toString();

                text = '&#8594; ' + day + '.' + month + '.';
                text += year;

                if (withTime) {
                    let endhours = _end.getHours().toString();
                    let endminutes = _end.getMinutes().toString();

                    if (parseInt(endhours) < 10) {
                        endhours = '0' + endhours.toString();
                    }
                    if (parseInt(endminutes) < 10) {
                        endminutes = '0' + endminutes.toString();
                    }
                    text += ' ' + endhours + ':' + endminutes;
                }
            }

            return { text: text, _class: _class };
        }

        if (day < 10) day = '0' + day.toString();
        if (month < 10) month = '0' + month.toString();


        return {
            text: day + '.' + month + '.' + year + _time,
            _class: _class
        };
    }

    RED.nodes.registerType("ical-upcoming", upcomingNode);
}