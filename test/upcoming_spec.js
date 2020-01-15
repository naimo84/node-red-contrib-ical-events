var helper = require("node-red-node-test-helper");
var chai = require("chai");
var icalUpcomingNode = require("../dist/ical-upcoming.js");
var icalConfigNode = require("../dist/ical-config.js");
const nodeIcal = require("node-ical");
const moment = require("moment");
var sinon = require('sinon');
const test_helper = require('./test_helper');
var expect = chai.expect;
chai.use(require('chai-like'));
chai.use(require('chai-things')); // Don't swap these two
helper.init(require.resolve('node-red'));

describe('Upcoming Node', function () {


    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {

        helper.unload().then(function () {
            helper.stopServer(done);
        });
    });

    it('ical - 1 day preview - today 2 - tomorrow 0 - total 2', function (done) {
        var flow_ical = [
            { id: "c1", type: "ical-config", url: "https://domain.com/calendar.ics" },
            {
                id: "n1", type: "ical-upcoming", confignode: "c1", wires: [["n2"]],
                endpreview: "1",
                endpreviewUnits: "days"
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
        nodeIcal.fromURL.restore();
        sinon.stub(nodeIcal, "fromURL").callsArgWith(2, null, events);

        helper.load([icalConfigNode, icalUpcomingNode], flow_ical, function () {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {
                expect(msg).to.have.property('today', 2);
                expect(msg).to.have.property('tomorrow',0);
                expect(msg).to.have.property('total', 2);
                expect(msg.payload).to.be.an('array').that.contains.something.like({ id: "3" });
                done();
            });
            n1.receive({ payload: 1 });
        });
    });

    it('ical - 1 day pastview - 1 day pastview - today 6 - total 6', function (done) {
        var flow_ical = [
            { id: "c1", type: "ical-config", url: "https://domain.com/calendar.ics" },
            {
                id: "n1", type: "ical-upcoming", confignode: "c1", wires: [["n2"]],
                pastview: "1",
                endpreview: "1"
            },
            { id: "n2", type: "helper" }
        ];
        var events = test_helper.getEvents();

        events["1"].start = moment().subtract(1, 'h').toDate();
        events["1"].end = moment().subtract(1, 'h').toDate();
        events["2"].start = moment().subtract(2, 'h').toDate();
        events["2"].end = moment().subtract(2, 'h').toDate();
        events["3"].start = moment().subtract(2, 'h').toDate();
        events["3"].end = moment().subtract(2, 'h').toDate();

        events["4"].start = moment().add(2, 'h').toDate();
        events["4"].end = moment().add(2, 'h').toDate();
        events["5"].start = moment().add(2, 'h').toDate();
        events["5"].end = moment().add(2, 'h').toDate();
        events["6"].start = moment().add(2, 'h').toDate();
        events["6"].end = moment().add(2, 'h').toDate();

        nodeIcal.fromURL.restore();
        sinon.stub(nodeIcal, "fromURL").callsArgWith(2, null, events);

        helper.load([icalConfigNode, icalUpcomingNode], flow_ical, function () {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {
                expect(msg).to.have.property('today', 6);
                expect(msg).to.have.property('tomorrow', 0);
                expect(msg).to.have.property('total', 6);
                done();
            });
            n1.receive({ payload: 1 });
        });
    });

    it('ical - 2 day pastview - today 1 - total 2', function (done) {
        var flow_ical = [
            { id: "c1", type: "ical-config", url: "https://domain.com/calendar.ics" },
            {
                id: "n1", type: "ical-upcoming", confignode: "c1", wires: [["n2"]],
                pastview: "2",
                pastviewUnits: "days",
                endpreview: "0"
            },
            { id: "n2", type: "helper" }
        ];
        var events = test_helper.getEvents();

        events["1"].start = moment().subtract(1, 'd').add(1, 's').toDate();
        events["1"].end = moment().subtract(1, 'd').endOf('day').toDate();
        events["2"].start = moment().add(2, 'd').startOf('day').toDate();
        events["2"].end = moment().add(2, 'd').endOf('day').toDate();
        events["3"].start = moment().startOf('day').toDate();
        events["3"].end = moment().endOf('day').toDate();

        nodeIcal.fromURL.restore();
        sinon.stub(nodeIcal, "fromURL").callsArgWith(2, null, events);

        helper.load([icalConfigNode, icalUpcomingNode], flow_ical, function () {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {               
                expect(msg).to.have.property('today', 1);
                expect(msg).to.have.property('tomorrow', 0);
                expect(msg).to.have.property('total', 2);
                done();
            });
            n1.receive({ payload: 1 });
        });
    });

    it('ical - total 0', function (done) {
        var flow_ical = [
            { id: "c1", type: "ical-config", url: "https://domain.com/calendar.ics" },
            { id: "n1", type: "ical-upcoming", confignode: "c1", wires: [["n2"]] },
            { id: "n2", type: "helper" }
        ];
        var events = test_helper.getEvents();
        nodeIcal.fromURL.restore();
        sinon.stub(nodeIcal, "fromURL").callsArgWith(2, null, events);

        helper.load([icalConfigNode, icalUpcomingNode], flow_ical, function () {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {
                expect(msg).to.have.property('total', 0);
                done();
            });
            n1.receive({ payload: 1 });
        });
    });

    it('ical - today 1 - tomorrow 1 - total 2', function (done) {
        var flow_ical = [
            { id: "c1", type: "ical-config", url: "https://domain.com/calendar.ics" },
            { id: "n1", type: "ical-upcoming", confignode: "c1", wires: [["n2"]] },
            { id: "n2", type: "helper" }
        ];
        var events = test_helper.getEvents();
        events["1"].start = moment(new Date()).subtract(30, 'm').toDate();
        events["1"].end = moment(new Date()).add(30, 'm').toDate();
        events["2"].start = moment(new Date()).add(1, 'd').toDate();
        events["2"].end = moment(new Date()).add(1, 'd').add(30, 'm').toDate();

        nodeIcal.fromURL.restore();
        sinon.stub(nodeIcal, "fromURL").callsArgWith(2, null, events);

        helper.load([icalConfigNode, icalUpcomingNode], flow_ical, function () {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function (msg) {

                expect(msg).to.have.property('today', 1);
                expect(msg).to.have.property('tomorrow', 1);
                done();
            });
            n1.receive({ payload: 1 });
        });
    });

    it('should be loaded', function (done) {
        var flow = [
            { id: "c1", type: "ical-config" },
            { id: "n1", type: "ical-upcoming", config: "c1" }
        ];

        helper.load([icalConfigNode, icalUpcomingNode], flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('type', 'ical-upcoming');
            done();
        });
    });
});
