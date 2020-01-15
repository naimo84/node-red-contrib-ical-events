var should = require("should");
var helper = require("node-red-node-test-helper");
var icalSensorNode = require("../dist/ical-sensor.js");
var icalConfigNode = require("../dist/ical-config.js");
const moment = require("moment");
var sinon = require('sinon');
const test_helper = require('./test_helper');
const nodeIcal = require("node-ical");
var chai = require("chai");
var expect = chai.expect;
chai.use(require('chai-like'));
chai.use(require('chai-things')); // Don't swap these two

helper.init(require.resolve('node-red'));

describe('Sensor Node', function () {

    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload().then(function () {
            helper.stopServer(done);
        });
    });

    it('ical - on = true', function (done) {
        var flow_ical = [
            { id: "c1", type: "ical-config", url: "https://domain.com/calendar.ics" },
            {
                id: "n1", type: "ical-sensor", confignode: "c1", wires: [["n2"]]               
            },
            { id: "n2", type: "helper" }
        ];
        var events = test_helper.getEvents();

        events["1"].start = moment().add(1, 'd').toDate();
        events["1"].end = moment().add(1, 'd').endOf('day').toDate();
        events["2"].start = moment().add(1, 'h').toDate();
        events["2"].end = moment().add(2, 'h').toDate();
        events["3"].start = moment().startOf('day').toDate();
        events["3"].end = moment().endOf('day').toDate();

        sinon.stub(nodeIcal, "fromURL").callsArgWith(2, null, events);

        helper.load([icalConfigNode, icalSensorNode], flow_ical, function () {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {
                expect(msg.payload).to.have.property('on', true);
                done();
            });
            n1.receive({ payload: 1 });
        });
    });

    it('ical - on = false', function (done) {
        var flow_ical = [
            { id: "c1", type: "ical-config", url: "https://domain.com/calendar.ics" },
            {
                id: "n1", type: "ical-sensor", confignode: "c1", wires: [["n2"]]               
            },
            { id: "n2", type: "helper" }
        ];
        var events = test_helper.getEvents();
        nodeIcal.fromURL.restore();
        sinon.stub(nodeIcal, "fromURL").callsArgWith(2, null, events);

        helper.load([icalConfigNode, icalSensorNode], flow_ical, function () {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {
                expect(msg.payload).to.have.property('on', false);
                done();
            });
            n1.receive({ payload: 1 });
        });
    });

    it('should be loaded', function (done) {
        var flow = [
            { id: "c1", type: "ical-config" },
            { id: "n1", type: "ical-sensor", config: "c1" }
        ];

        helper.load([icalConfigNode, icalSensorNode], flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('type', 'ical-sensor');
            done();
        });
    });
});
