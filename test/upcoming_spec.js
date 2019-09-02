var should = require("should");
var helper = require("node-red-node-test-helper");


helper.init(require.resolve('node-red'));



describe('upcoming Node', function () {

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
            { id: "n1", type: "ical-upcoming", config: "c1" }
        ];
        var icalContainersNode = require("../dist/ical-upcoming.js");
        var icalConfigNode = require("../dist/ical-config.js");



        helper.load([icalConfigNode, icalContainersNode], flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('type', 'ical-upcoming');
            done();
        });
    });

   
});
