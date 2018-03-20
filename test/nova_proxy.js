let client = require("../dist/splunk");
let expect = require("chai").expect;

describe("Using Nova APIs", function() {
    it("should allow submitting and retrieving events", function() {
        let splunk = new client.Splunk('https://api.splunknova.com/v1', 'F83jrVFbttOX74wSubSKxUmvBdnA81TK', 'yYGulcKshmYP5gGlhJt8P2P7iixcUUNnz6JlJt2hKD8xwzQIU1zyVpKWlaEmyAUs');

        let event = splunk.nova.Event.build("test")
            .withTime(new Date())
            .withSource("testSource")
            .withField("foo", "bar")
            .withFields({"baz": "baf", "bog": "bin"});

        expect(event).to.have.own.property("source");
        expect(event).to.have.own.property("foo");
        expect(event).to.have.own.property("baz");

        splunk.nova.sendEvent(event)
            .then(function(result) {
                return splunk.nova.queryEvents({keywords: "*"})
            }).then(function(data) {
                console.log(data.events.map(e => e.getDate()));
            });
    });
});