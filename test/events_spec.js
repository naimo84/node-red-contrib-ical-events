var should = require("should");
var helper = require("node-red-node-test-helper");
var icalEventNode = require("../dist/ical-events.js");
var icalConfigNode = require("../dist/ical-config.js");
const test_helper = require('./test_helper');
helper.init(require.resolve('node-red'));

describe('Events Node', function () {

    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload().then(function () {
            helper.stopServer(done);
        });
    });

    it('should be loaded', function (done) {
        var flow = [
            { id: "c1", type: "ical-config" },
            { id: "n1", type: "ical-events", config: "c1" }
        ];
     



        helper.load([icalConfigNode, icalEventNode], flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('type', 'ical-events');
            done();
        });
    });
});
