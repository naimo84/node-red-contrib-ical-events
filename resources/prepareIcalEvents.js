function prepareIcalEvents() {
    var node = this;
    $("#node-input-eventtypes").typedInput({
        typeField: "#node-input-eventtypestype",
        types: ["str", "msg", {
            value: "eventtypes",
            multiple: true,
            options: [
                { value: "events", label: "Events" },
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

    $("#node-input-timezone").typedInput({
        typeField: "#node-input-timezonetype",
        types: ["str", "msg"]
    });

    $("#node-input-filterProperty").typedInput({
        typeField: "#node-input-filterPropertytype",
        default: "filterProperty",
        types: ["str", "msg", {
            value: "filterProperty",
            options: [
                { value: "summary", label: "summary" },
                { value: "description", label: "description" },
                { value: "attendee", label: "attendee" },
                { value: "categories", label: "category" },
                { value: "location", label: "location" },
                { value: "eventStart", label: "start date" },
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
                { value: "between", label: "between" },
                { value: "before", label: "before" },
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
                { value: "always", label: "Always" },
                { value: "match", label: "Match" },
                { value: "nomatch", label: "No match" }
            ]
        }]
    });


    $('.ui-spinner-button').on('click', function () {
        $(this)
            .siblings('input')
            .trigger('change');
    });

    if (!node.timeoutUnits) {
        $('#node-input-timeoutUnits option')
            .filter(function () {
                return $(this).val() == 'seconds';
            })
            .attr('selected', true);
    }

    if (!node.trigger) {
        $('#node-input-trigger option')
            .filter(function () {
                return $(this).val() == 'always';
            })
            .attr('selected', true);
    }

    if (node.trigger && !node.filterProperty) {
        $('#node-input-filterProperty option')
            .filter(function () {
                return $(this).val() == 'summary';
            })
            .attr('selected', true);
    }

    $("#node-input-timezone").focusin(timezones);
    $('#node-input-cron').change(function () {
        var value = $('#node-input-cron').val();      
        if (value) {
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
            .attr('selected', true);
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
                    .attr('selected', true);
            }

            if (!node.filterOperator) {

                $('#node-input-filterOperator option')
                    .filter(function () {
                        return $(this).val() == 'between';
                    })
                    .attr('selected', true);
                $('#node-input-filter-label1').hide();
                $('#node-input-filter-label2').show();
                $('#node-input-filter2-label1').hide();
                $('#node-input-filter2-label2').show();
                $('#node-input-filter-label3').hide();
            }
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
                .attr('selected', true);
        }

        if (!node.filterOperator) {
            $('#node-input-filterOperator option')
                .filter(function () {
                    return $(this).val() == 'between';
                })
                .attr('selected', true);
            $('#node-input-filter-label1').hide();
            $('#node-input-filter-label2').show();
            $('#node-input-filter2-label1').hide();
            $('#node-input-filter2-label2').show();
            $('#node-input-filter-label3').hide();
        }
        if (trigger === "always") return;
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