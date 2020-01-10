var helper = require("node-red-node-test-helper");
var chai = require("chai");
var icalContainersNode = require("../dist/ical-upcoming.js");
var icalConfigNode = require("../dist/ical-config.js");
const nodeIcal = require("node-ical");
var sinon = require('sinon');
var expect = chai.expect;

helper.init(require.resolve('node-red'));

const fs = require('fs');


function getEvents() {
    let rawdata = fs.readFileSync('./test/mocks/testical.json');
    let data = JSON.parse(rawdata);
    return data;
}

describe('upcoming Node', function () {


    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload().then(function () {
            helper.stopServer(done);
        });
    });

    it('test ical', function (done) {
        var flow = [
            { id: "c1", type: "ical-config", url: "https://domain.com/calendar.ics" },
            { id: "n1", type: "ical-upcoming", confignode: "c1", wires: [["n2"]] },
            { id: "n2", type: "helper" }
        ];

        var events = getEvents();
        sinon.stub(nodeIcal, "fromURL").callsArgWith(2, null, events);

        helper.load([icalConfigNode, icalContainersNode], flow, function () {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {
                expect(msg).to.have.property('total', 0);
                done();
            });
            n1.receive({ payload: 1 });
        });
    });

    // it('should be loaded', function (done) {
    //     var flow = [
    //         { id: "c1", type: "ical-config" },
    //         { id: "n1", type: "ical-upcoming", config: "c1" }
    //     ];

    //     helper.load([icalConfigNode, icalContainersNode], flow, function () {
    //         var n1 = helper.getNode("n1");
    //         n1.should.have.property('type', 'ical-upcoming');
    //         done();
    //     });
    // });



});
