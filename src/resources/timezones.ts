//@ts-nocheck
function timezones() {
    var dataArray = [];
    $.getJSON(`timezones`, function (data) {
        $.each(data, function (i, element) {
            dataArray.push(element);
        });
    });

    $("#node-input-timezone").typedInput({
        typeField: "#node-input-timezonetype",
        default: "str",
        types: ["str", "msg",
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