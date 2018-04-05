let client = require("../dist/splunk");
let expect = require("chai").expect;

describe("Using Search APIs", function() {
    let splk = new client.Splunk("http://ssc-sdk-shared-stubby:8882", "admin", "changeme");

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