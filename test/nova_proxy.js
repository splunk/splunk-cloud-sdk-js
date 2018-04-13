let client = require("../splunk");
let expect = require("chai").expect;

// Commenting this out- the nova APIs will be removed as soon as we have HEC endpoints implemented. I want to
// leave these so that we have a way of creating events.
/*
describe("Using Nova APIs", function() {
    it("should allow submitting and retrieving events", function() {
        let splunk = new client.Splunk('https://api-beta.splunknovadev.com/',
            'irXiqgjEYTvJmbqw9P29uwcQ3JSQT9OL',
            'Ia2ry3ar13HLWpGJjzR1aZcqoguTbo-5pZlDtyX_AphHZiwcL3f7fIexH1y6nq2D');
        // let splunk = new client.Splunk('https://api.splunknova.com/v1', 'F83jrVFbttOX74wSubSKxUmvBdnA81TK', 'yYGulcKshmYP5gGlhJt8P2P7iixcUUNnz6JlJt2hKD8xwzQIU1zyVpKWlaEmyAUs');

        let event = splunk.nova.Event.build("test")
            .withTime(new Date())
            .withSource("testSource")
            .withField("foo", "bar")
            .withFields({"baz": "baf", "bog": "bin"});

        expect(event).to.have.own.property("source");
        expect(event).to.have.own.property("foo");
        expect(event).to.have.own.property("baz");

        return splunk.nova.sendEvent(event)
            .then(function(result) {
                console.log(result);
                return splunk.nova.queryEvents({keywords: "*"})
            });
    });
});
*/