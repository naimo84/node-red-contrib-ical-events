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
    calendar: {},
    calendartype: {},
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

