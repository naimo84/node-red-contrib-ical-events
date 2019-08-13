"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var icalHelper = /** @class */ (function () {
    function icalHelper() {
    }
    icalHelper.getTimezoneOffset = function (date) {
        return moment().utcOffset(date.getTime()).utcOffset();
    };
    icalHelper.addOffset = function (time, offset) {
        return new Date(time.getTime() + (offset * 60 * 1000));
    };
    icalHelper._ = function (text) {
        if (!text)
            return '';
        if (this.dictionary[text]) {
            var newText = this.dictionary[text][this.config.language];
            if (newText) {
                return newText;
            }
            else if (this.config.language !== 'en') {
                newText = this.dictionary[text].en;
                if (newText) {
                    return newText;
                }
            }
        }
        return text;
    };
    icalHelper.insertSorted = function (arr, element) {
        if (!arr.length) {
            arr.push(element);
        }
        else {
            if (arr[0].eventStart > element.eventStart) {
                arr.unshift(element);
            }
            else if (arr[arr.length - 1].eventStart < element.eventStart) {
                arr.push(element);
            }
            else {
                if (arr.length === 1) {
                    arr.push(element);
                }
                else {
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
    };
    icalHelper.brSeparatedList = function (datesArray, config) {
        var text = '';
        var today = new Date();
        var tomorrow = new Date();
        var dayafter = new Date();
        today.setHours(0, 0, 0, 0);
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        dayafter.setDate(today.getDate() + 2);
        dayafter.setHours(0, 0, 0, 0);
        for (var i = 0; i < datesArray.length; i++) {
            var date = this.formatDate(datesArray[i].eventStart, datesArray[i]._end, true, datesArray[i]._allDay, config);
            if (text)
                text += '<br/>\n';
            text += date.text + ' ' + datesArray[i].event + '</span>';
        }
        return text;
    };
    icalHelper.formatDate = function (_date, _end, withTime, fullday, config) {
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
            if (config.fulltime && fullday) {
                _time = ' ' + config.fulltime;
            }
            else {
                if (!alreadyStarted) {
                    if (config.dataPaddingWithZeros) {
                        if (hours < 10)
                            hours = '0' + hours.toString();
                    }
                    if (minutes < 10)
                        minutes = '0' + minutes.toString();
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
                    if (config.dataPaddingWithZeros) {
                        if (parseInt(endhours) < 10)
                            endhours = '0' + endhours.toString();
                    }
                    if (parseInt(endminutes) < 10)
                        endminutes = '0' + endminutes.toString();
                    _time += endhours + ':' + endminutes;
                    var startDayEnd = new Date();
                    startDayEnd.setFullYear(_date.getFullYear());
                    startDayEnd.setMonth(_date.getMonth());
                    startDayEnd.setDate(_date.getDate() + 1);
                    startDayEnd.setHours(0, 0, 0, 0);
                    // end is next day
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
                        //node.debug('    time difference: ' + timeDiff + ' (' + _date + '-' + _end + ' / ' + start + ') --> ' + (timeDiff / (24 * 60 * 60 * 1000)));
                        if (fullTimeDiff >= 24 * 60 * 60 * 1000) {
                            _time += '+' + Math.floor(timeDiff / (24 * 60 * 60 * 1000));
                        }
                    }
                    else if (config.replaceDates && _end.getHours() === 0 && _end.getMinutes() === 0) {
                        _time = ' ';
                    }
                }
            }
        }
        var _class = '';
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        var d2 = new Date();
        d2.setDate(d.getDate() + 1);
        var todayOnly = false;
        if (day === d.getDate() &&
            month === (d.getMonth() + 1) &&
            year === d.getFullYear() &&
            endday === d2.getDate() &&
            endmonth === (d2.getMonth() + 1) &&
            endyear === d2.getFullYear() &&
            fullday) {
            todayOnly = true;
        }
        //node.debug('    todayOnly = ' + todayOnly + ': (' + _date + '-' + _end + '), alreadyStarted=' + alreadyStarted);
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
            if (config.replaceDates) {
                if (_class === 'ical_today')
                    return { text: ((alreadyStarted && !todayOnly) ? '&#8594; ' : '') + this._('today') + _time, _class: _class };
                if (_class === 'ical_tomorrow')
                    return { text: (alreadyStarted ? '&#8594; ' : '') + this._('tomorrow') + _time, _class: _class };
                if (_class === 'ical_dayafter')
                    return { text: (alreadyStarted ? '&#8594; ' : '') + this._('dayafter') + _time, _class: _class };
                if (_class === 'ical_3days')
                    return { text: (alreadyStarted ? '&#8594; ' : '') + this._('3days') + _time, _class: _class };
                if (_class === 'ical_4days')
                    return { text: (alreadyStarted ? '&#8594; ' : '') + this._('4days') + _time, _class: _class };
                if (_class === 'ical_5days')
                    return { text: (alreadyStarted ? '&#8594; ' : '') + this._('5days') + _time, _class: _class };
                if (_class === 'ical_6days')
                    return { text: (alreadyStarted ? '&#8594; ' : '') + this._('6days') + _time, _class: _class };
                if (_class === 'ical_oneweek')
                    return { text: (alreadyStarted ? '&#8594; ' : '') + this._('oneweek') + _time, _class: _class };
            }
        }
        else {
            // check if date is in the past and if so we show the end time instead
            _class = 'ical_today';
            var daysleft = Math.round((_end.getDate() - new Date().getDate()) / (1000 * 60 * 60 * 24));
            var hoursleft = Math.round((_end.getDate() - new Date().getDate()) / (1000 * 60 * 60));
            //node.debug('    time difference: ' + daysleft + '/' + hoursleft + ' (' + _date + '-' + _end + ' / ' + start + ') --> ' + (timeDiff / (24 * 60 * 60 * 1000)));
            if (config.forceFullday && daysleft < 1)
                daysleft = 1;
            if (config.replaceDates) {
                var _left = (this._('left') !== ' ' ? ' ' + this._('left') : '');
                var text;
                if (daysleft === 42) {
                    text = this._('6week_left');
                }
                else if (daysleft === 35) {
                    text = this._('5week_left');
                }
                else if (daysleft === 28) {
                    text = this._('4week_left');
                }
                else if (daysleft === 21) {
                    text = this._('3week_left');
                }
                else if (daysleft === 14) {
                    text = this._('2week_left');
                }
                else if (daysleft === 7) {
                    text = this._('1week_left');
                }
                else if (daysleft >= 1) {
                    if (config.language === 'ru') {
                        var c = daysleft % 10;
                        var cc = Math.floor(daysleft / 10) % 10;
                        if (daysleft === 1) {
                            text = (this._('still') !== ' ' ? this._('still') : '') + ' ' + daysleft + ' ' + this._('day') + _left;
                        }
                        else if (cc > 1 && (c > 1 || c < 5)) {
                            text = (this._('still') !== ' ' ? this._('still') : '') + ' ' + daysleft + ' ' + 'дня' + _left;
                        }
                        else {
                            text = (this._('still') !== ' ' ? this._('still') : '') + ' ' + daysleft + ' ' + this._('days') + _left;
                        }
                    }
                    else {
                        text = (this._('still') !== ' ' ? this._('still') : '') + ' ' + daysleft + ' ' + (daysleft === 1 ? this._('day') : this._('days')) + _left;
                    }
                }
                else {
                    if (config.language === 'ru') {
                        var c = hoursleft % 10;
                        var cc = Math.floor(hoursleft / 10) % 10;
                        if (hoursleft === 1) {
                            text = (this._('still') !== ' ' ? this._('still') : '') + ' ' + hoursleft + ' ' + this._('hour') + _left;
                        }
                        else if (cc !== 1 && (c > 1 || c < 5)) {
                            text = (this._('still') !== ' ' ? this._('still') : '') + ' ' + hoursleft + ' ' + 'часа' + _left;
                        }
                        else {
                            text = (this._('still') !== ' ' ? this._('still') : '') + ' ' + hoursleft + ' ' + this._('hours') + _left;
                        }
                    }
                    else {
                        text = (this._('still') !== ' ' ? this._('still') : '') + ' ' + hoursleft + ' ' + (hoursleft === 1 ? this._('hour') : this._('hours')) + _left;
                    }
                }
            }
            else {
                day = _end.getDate();
                month = _end.getMonth() + 1;
                year = _end.getFullYear();
                if (config.dataPaddingWithZeros) {
                    if (day < 10)
                        day = '0' + day.toString();
                    if (month < 10)
                        month = '0' + month.toString();
                }
                text = '&#8594; ' + day + '.' + month + '.';
                if (!config.hideYear) {
                    text += year;
                }
                if (withTime) {
                    if (config.fulltime && fullday) {
                        text += ' ' + config.fulltime;
                    }
                    else {
                        var endhours_1 = _end.getHours().toString();
                        var endminutes_1 = _end.getMinutes().toString();
                        if (config.dataPaddingWithZeros) {
                            if (parseInt(endhours_1) < 10) {
                                endhours_1 = '0' + endhours_1.toString();
                            }
                        }
                        if (parseInt(endminutes_1) < 10) {
                            endminutes_1 = '0' + endminutes_1.toString();
                        }
                        text += ' ' + endhours_1 + ':' + endminutes_1;
                    }
                }
            }
            return { text: text, _class: _class };
        }
        if (config.dataPaddingWithZeros) {
            if (day < 10)
                day = '0' + day.toString();
            if (month < 10)
                month = '0' + month.toString();
        }
        return {
            text: day + '.' + month + ((config.hideYear) ? '.' : '.' + year) + _time,
            _class: _class
        };
    };
    icalHelper.dictionary = {
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
    return icalHelper;
}());
exports.default = icalHelper;
