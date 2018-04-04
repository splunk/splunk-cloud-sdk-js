// let client = require("../dist/splunk");
// let expect = require("chai").expect;

<<<<<<< HEAD
describe("Using Search APIs", function() {
    let splk = new client.Splunk("http://localhost:8882", "admin", "changeme");

    describe("Submit a search", function() {
        it("should allow submission of a search", function() {
            var response = splk.search.createJob({query: "search index=*"});
            return response.then(function(json) {
                expect(json).to.have.property("searchId", "SEARCH_ID");
            });
        });

        it("should allow retrieval of results", function() {
            return splk.search.getResults("SEARCH_ID").then(function(json) {
                expect(json).to.have.property("fields");
            });
        })
    });

    describe("Search synchronously", function() {
        // Undespecified- format will change
        it("should allow posting a search and getting results", function() {
            return splk.search.createJobSync({query: "search index=*"}).then(function(data) {
                expect(data).to.have.property("fields");
                var index = data.fields.filter(f => f.name == "index")[0];
                expect(index).to.not.be.undefined;
                expect(data).to.have.property("results").that.is.an("array").that.is.not.empty;
            });
        });
    });

});
=======
// describe("Using Search APIs", function() {
//     it("should allow sync searching", function() {
//         let splunk = new client.Splunk('https://api-beta.splunknovadev.com/',
//             'irXiqgjEYTvJmbqw9P29uwcQ3JSQT9OL',
//             'Ia2ry3ar13HLWpGJjzR1aZcqoguTbo-5pZlDtyX_AphHZiwcL3f7fIexH1y6nq2D');
//         return splunk.search.createJobSync({query: "search index=*"}).then(function(data) {
//             console.log(data);
//         });
//     });
// });
>>>>>>> 9e399b73227876693f5c8b26b273a56155736cdc
