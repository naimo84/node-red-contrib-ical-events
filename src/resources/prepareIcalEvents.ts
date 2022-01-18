//@ts-nocheck
const icalDefaults = {
    confignode: {
        value: "",
        type: "ical-config",
        required: false
    },
    timeout: {
        value: ""
    },
    timeoutUnits: {
        value: ""
    },
    cron: {
        value: ""
    },
    name: {
        value: ""
    },
    offsettype: {},
    offset: {
        value: ""
    },
    offsetUnitstype: {},
    offsetUnits: {
        value: ""
    },
    eventtypes: {},
    eventtypestype: {},
    triggertype: {},
    trigger: {},
    timezone: {},
    timezonetype: {},
    filterProperty: {},
    filterPropertytype: {},
    filterOperator: {},
    filterOperatortype: {},
    filtertype: {},
    filter2type: {},
    filter2: {
        required: false,
        validate: function (v) {
            let val = $("#node-input-filter2").val();
            if (!val) return true;
            try {
                //@ts-ignore
                if ($("#node-input-filterProperty").val().indexOf('event') >= 0) {
                    let reg = new RegExp(/^(19|20)\d\d[-/.](0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])_([0-1][0-9]|2[0-3])[:]([0-5][0-9])[:]([0-5][0-9])$/)
                    return reg.test(v)
                } else {
                    new RegExp(v);
                    return true;
                }
            } catch (e) {
                return false;
            }
        },
    },
    filter: {
        required: false,
        validate: function (v) {
            let val = $("#node-input-filter").val();
            if (!val) return true;
            try {
                //@ts-ignore
                if ($("#node-input-filterProperty").val().indexOf('event') >= 0) {
                    let reg = new RegExp(/^(19|20)\d\d[-/.](0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])_([0-1][0-9]|2[0-3])[:]([0-5][0-9])[:]([0-5][0-9])$/)
                    return reg.test(v)
                } else {
                    new RegExp(v);
                    return true;
                }
            } catch (e) {
                return false;
            }
        },
    },
}

function timezones() {
    var dataArray = [];
    $.getJSON(`timezones`, function (data) {
        $.each(data, function (i, element) {
            dataArray.push(element);
        });
    });

    $("#node-input-timezone").typedInput({
        typeField: "#node-input-timezonetype",
        default: "timezone",
        types: ["msg",
            {
                value: "timezone",
                label: "timezone",
                autoComplete: function (val) { 
                    var matches = [];
                    dataArray.forEach(v => {
                        var i = v.toLowerCase().indexOf(val.toLowerCase());
                        if (i > -1) {
                            matches.push({
                                value: v,
                                label: v,
                                i: i
                            });
                        }
                    });
                    matches.sort(function (A, B) { return A.i - B.i });
                    return matches;
                }
            }],
    });
}

function prepareIcalEvents(node) {
    timezones();
    $("#node-input-eventtypes").typedInput({
        typeField: "#node-input-eventtypestype",
        types: ["str", "msg", {
            value: "eventtypes",
            multiple: true,
            options: [
                //@ts-ignore
                { value: "events", label: "Events" },
                //@ts-ignore
                { value: "todos", label: "Todos" }
            ]
        }]
    });

    $('#node-input-confignode').change(function () {
        var value = $('#node-input-confignode').val();
        $.post(`icalconfig`, { id: value }, function (icalconfig) {
            if (icalconfig.type !== 'caldav') {
                $('#node-input-eventtypes').parent().hide();
            } else {
                $('#node-input-eventtypes').parent().show();
            }

            if ((!node.eventtypes || node.eventtypes.trim() === '')) {
                $("#node-input-eventtypes").typedInput('type', 'eventtypes');
                $("#node-input-eventtypes").typedInput('value', icalconfig.includeTodo === true ? 'events,todos' : 'events')
                node.eventtypes = icalconfig.includeTodo === true ? 'events,todos' : 'events';
            }

        });
    });

    $("#node-input-filter").typedInput({
        typeField: "#node-input-filtertype",
        types: ["str", "msg"]
    });

    $("#node-input-filter2").typedInput({
        typeField: "#node-input-filter2type",
        types: ["str", "msg"]
    });



    $("#node-input-filterProperty").typedInput({
        typeField: "#node-input-filterPropertytype",
        default: "filterProperty",
        types: ["str", "msg", {
            value: "filterProperty",
            options: [
                //@ts-ignore
                { value: "summary", label: "summary" },
                //@ts-ignore
                { value: "description", label: "description" },
                //@ts-ignore
                { value: "attendee", label: "attendee" },
                //@ts-ignore
                { value: "categories", label: "category" },
                //@ts-ignore
                { value: "location", label: "location" },
                //@ts-ignore
                { value: "eventStart", label: "start date" },
                //@ts-ignore
                { value: "eventEnd", label: "end date" },
            ]
        }]
    });

    $("#node-input-filterOperator").typedInput({
        typeField: "#node-input-filterOperatortype",
        default: "filterOperator",
        types: ["str", "msg", {
            value: "filterOperator",
            options: [
                //@ts-ignore
                { value: "between", label: "between" },
                //@ts-ignore
                { value: "before", label: "before" },
                //@ts-ignore
                { value: "after", label: "after" }
            ]
        }]
    });

    $("#node-input-trigger").typedInput({
        typeField: "#node-input-triggertype",
        default: "trigger",
        types: ["str", "msg", {
            value: "trigger",
            options: [
                //@ts-ignore
                { value: "always", label: "Always" },
                //@ts-ignore
                { value: "match", label: "Match" },
                //@ts-ignore
                { value: "nomatch", label: "No match" }
            ]
        }]
    });

    if (!node.timeoutUnits) {
        $('#node-input-timeoutUnits option')
            .filter(function () {
                return $(this).val() == 'seconds';
            })
            .attr('selected', 'true');
    }

    if (!node.trigger) {
        $('#node-input-trigger option')
            .filter(function () {
                return $(this).val() == 'always';
            })
            .attr('selected', 'true');
    }

    if (node.trigger && !node.filterProperty) {
        $('#node-input-filterProperty option')
            .filter(function () {
                return $(this).val() == 'summary';
            })
            .attr('selected', 'true');
    }


    $('#node-input-cron').change(function () {
        var value = $('#node-input-cron').val() as string;
        if (value && value.length > 0) {
            $('#timeout-details-for').hide();
        } else {
            $('#timeout-details-for').show();
        }
    });
    if (node.trigger && node.filterProperty && node.filterProperty.indexOf('event') >= 0 && !node.filterOperator) {
        $('#node-input-filterOperator option')
            .filter(function () {
                return $(this).val() == 'between';
            })
            .attr('selected', 'true');
    }

    $('#node-input-trigger').change(function () {
        var value = $('#node-input-trigger').val();
        let filterProperty = $('#node-input-filterProperty').val();
        if (value && value === 'always') {
            $('#node-input-filterProperty').parent().hide();
            $('#node-input-filter').parent().hide();
            $('#node-input-filter2').parent().hide();
            $('#node-input-filterOperator').parent().hide();
            $('#filter-tip').hide();

            return;
        } else {
            $('#node-input-filterProperty').parent().show();
            $('#node-input-filter').parent().show();
            if (!node.filterProperty) {
                $('#node-input-filterProperty option')
                    .filter(function () {
                        return $(this).val() == 'summary';
                    })
                    .attr('selected', 'true');
            }

            if (!node.filterOperator) {

                $('#node-input-filterOperator option')
                    .filter(function () {
                        return $(this).val() == 'between';
                    })
                    .attr('selected', 'true');
                $('#node-input-filter-label1').hide();
                $('#node-input-filter-label2').show();
                $('#node-input-filter2-label1').hide();
                $('#node-input-filter2-label2').show();
                $('#node-input-filter-label3').hide();
            }
            //@ts-ignore
            if (filterProperty && filterProperty.indexOf('event') >= 0) {
                $('#node-input-filter2').parent().show();
                $('#node-input-filterOperator').parent().show();
                $('#filter-tip').show();
                var filterOperator = $('#node-input-filterOperator').val();
                if (filterOperator === 'between') {
                    $('#node-input-filter-label1').hide();
                    $('#node-input-filter-label2').show();
                    $('#node-input-filter2-label1').hide();
                    $('#node-input-filter2-label2').show();
                    $('#node-input-filter-label3').hide();
                } else {
                    $('#node-input-filter2-label2').hide();
                    $('#node-input-filter2-label1').show();
                    if (filterOperator === 'before') {
                        $('#node-input-filter-label2').hide();
                        $('#node-input-filter-label3').show();
                        $('#node-input-filter-label1').hide();
                    } else {
                        $('#node-input-filter-label2').show();
                        $('#node-input-filter-label3').hide();
                        $('#node-input-filter-label1').hide();
                    }
                }
            } else {
                $('#node-input-filter2').parent().hide();
                $('#node-input-filterOperator').parent().hide();
                $('#filter-tip').hide();
                $('#node-input-filter-label2').hide();
                $('#node-input-filter-label1').show();
                $('#node-input-filter-label3').hide();

            }
        }
    });

    $('#node-input-filterProperty').change(function () {
        var value = $('#node-input-filterProperty').val();
        var trigger = $('#node-input-trigger').val();
        if (!node.filterProperty) {
            $('#node-input-filterProperty option')
                .filter(function () {
                    return $(this).val() == 'summary';
                })
                .attr('selected', 'true');
        }

        if (!node.filterOperator) {
            $('#node-input-filterOperator option')
                .filter(function () {
                    return $(this).val() == 'between';
                })
                .attr('selected', 'true');
            $('#node-input-filter-label1').hide();
            $('#node-input-filter-label2').show();
            $('#node-input-filter2-label1').hide();
            $('#node-input-filter2-label2').show();
            $('#node-input-filter-label3').hide();
        }
        if (trigger === "always") return;
        //@ts-ignore
        if (value && value.indexOf('event') >= 0) {
            $('#node-input-filter2').parent().show();
            $('#node-input-filterOperator').parent().show();

            $('#filter-tip').show();
            var filterOperator = $('#node-input-filterOperator').val();
            if (filterOperator === 'between') {
                $('#node-input-filter-label1').hide();
                $('#node-input-filter-label2').show();
                $('#node-input-filter2-label1').hide();
                $('#node-input-filter2-label2').show();
                $('#node-input-filter-label3').hide();
            } else {
                $('#node-input-filter2-label2').hide();
                $('#node-input-filter2-label1').show();
                if (filterOperator === 'before') {
                    $('#node-input-filter-label2').hide();
                    $('#node-input-filter-label3').show();
                    $('#node-input-filter-label1').hide();
                } else {
                    $('#node-input-filter-label2').show();
                    $('#node-input-filter-label3').hide();
                    $('#node-input-filter-label1').hide();
                }
            }
        } else {
            $('#node-input-filter2').parent().hide();
            $('#node-input-filterOperator').parent().hide();
            $('#filter-tip').hide();
            $('#node-input-filter-label2').hide();
            $('#node-input-filter-label1').show();
            $('#node-input-filter-label3').hide();
        }
    });

    $('#node-input-filterOperator').change(function () {
        var value = $('#node-input-filterOperator').val();
        var trigger = $('#node-input-trigger').val();
        var filterProperty = $('#node-input-filterProperty').val();
        if (trigger === "always") return;
        //@ts-ignore
        if (filterProperty && ['eventStart', 'eventEnd'].indexOf(filterProperty) >= 0) {
            if (value === 'between') {
                $('#node-input-filter2').parent().show();
                $('#node-input-filter-label1').hide();
                $('#node-input-filter-label2').show();
                $('#node-input-filter2-label1').hide();
                $('#node-input-filter2-label2').show();
                $('#node-input-filter-label3').hide();
            } else {
                $('#node-input-filter2').parent().hide();
                $('#node-input-filter2-label2').hide();
                $('#node-input-filter2-label1').show();
                if (value === 'before') {
                    $('#node-input-filter-label2').hide();
                    $('#node-input-filter-label3').show();
                    $('#node-input-filter-label1').hide();
                } else {
                    $('#node-input-filter-label2').show();
                    $('#node-input-filter-label3').hide();
                    $('#node-input-filter-label1').hide();
                }
            }
        }
    });
}
