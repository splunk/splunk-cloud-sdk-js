const SplunkSSC = require("../../src/splunk");
const config = require("../config");
const {isGuid} = require("is-guid");
const {assert} = require("chai");
const {expect} = require("chai");

const token = process.env.BEARER_TOKEN;
const tenantID = process.env.TENANT_ID;

const splunk = new SplunkSSC(`https://${config.novaHost}:443`, token, tenantID);

const standardQuery = {
    "query": "search index =_internal | head 5",
}
const queryTimeout = {
    "query": "search index =_internal | head 5",
    "timeout": 10000,
};
const queryTTL = {
    "query": "search index =_internal | head 5",
    "ttl": 100,
};
const queryLimit = {
    "query": "search index =_internal | head 5",
    "limit": 100000,
};
const queryWithTTLTimeoutLimit = {
    "query": "search index =_internal | head 5",
    "timeout": 1000000,
    "ttl": 1000,
    "limit": 1000000
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


describe("integration tests Using Search APIs", () => {

    // Scenario 1:
    // Dispatch a new search job
    // Validate a search id is returned
    // Repeat test with various other supported query params such as Limit, TTL, Timeout
    // Error case when a bad search request is provided

    let searchGuid;

    describe("Create new search", () => {

        it("Dispatch a new search job", () => {
            const response = splunk.search.createJob(standardQuery);
            response.then((json) => {
                searchGuid = json.searchId
                expect(json).to.have.property("searchId");
                expect(isGuid(searchGuid));
            });
        });

        it("Dispatch a new search job with limit", () => {
            const response = splunk.search.createJob(queryLimit);
            response.then((json) => {
                searchGuid = json.searchId
                expect(json).to.have.property("searchId");
                expect(isGuid(searchGuid));
            });
        });

        it("Dispatch a new search job with ttl", () => {
            const response = splunk.search.createJob(queryTTL);
            response.then((json) => {
                searchGuid = json.searchId
                expect(json).to.have.property("searchId");
                expect(isGuid(searchGuid));
            });
        });
        it("Dispatch a new search job with timeout", () => {
            const response = splunk.search.createJob(queryTimeout);
            response.then((json) => {
                searchGuid = json.searchId
                expect(json).to.have.property("searchId");
                expect(isGuid(searchGuid));
            });
        });
        it("Dispatch a new search job with limit, ttl and limit", () => {
            const response = splunk.search.createJob(queryWithTTLTimeoutLimit);
            response.then((json) => {
                searchGuid = json.searchId
                expect(json).to.have.property("searchId");
                expect(isGuid(searchGuid));
            });
        });
        it('should throw a 400 with a bad search request', () => splunk.search.createJob({}).then(success =>
            assert.fail(success), err => assert.equal(err.code, "400")
        ));
    });

    // Scenario 2:
    // Dispatch a new search job
    // Validate a search id is returned
    // Get job results for that search id
    // Validate results are non-empty
    // Error case to Retrieve results when invalid SearchId is specified

    describe("Create search and get search results ", () => {
        it("Create job and get search results for that search id", () => {
            const response = splunk.search.createJob(standardQuery);
            response.then((json) => {
                searchGuid = json.searchId
                expect(json).to.have.property("searchId");
                expect(isGuid(searchGuid));
                return searchGuid
            }).then(id => {
                sleep(5000).then(() => {
                    splunk.search.getResults(id).then(data => {
                        expect(data).to.have.property("fields");
                    }).catch(err => {
                        assert.fail(err)
                    })
                });
            });
        });
        it("Create job and get search results for an invalid search id", () => {
            const response = splunk.search.createJob(standardQuery);
            response.then((json) => {
                searchGuid = json.searchId
                expect(json).to.have.property("searchId");
                expect(isGuid(searchGuid));
                return searchGuid
            }).then(id => {
                sleep(5000).then(() => {
                    splunk.search.getResults("badsearchid").then(success =>
                        assert.fail(success), err => assert.equal(err.code, "500")
                    )
                });
            });
        });
    });

    // Scenario 3:
    // Dispatch a new search job asynchronously
    // Validate results returned once the job completes and returns
    // Repeat tests with various other supported query params such as Limit, TTL, Timeout

    describe("Dispatch async search job ", () => {
        it("Dispatch a new search job asynchronously", () => {
            const response = splunk.search.createJobSync(standardQuery);
            sleep(10000).then(() => {
                return response
            }).then(data => {
                expect(data).to.have.property("fields");
                const index = data.fields.filter(f => f.name === "index")[0];
                expect(index).to.not.be.undefined;
                expect(data).to.have.property("results").that.is.an("array").that.is.not.empty;
            }).catch(err => {
                assert.fail(err)
            })
        });
        it("Dispatch a new search job asynchronously with limit", () => {
            const response = splunk.search.createJobSync(queryLimit);
            sleep(10000).then(() => {
                return response
            }).then(data => {
                expect(data).to.have.property("fields");
                const index = data.fields.filter(f => f.name === "index")[0];
                expect(index).to.not.be.undefined;
                expect(data).to.have.property("results").that.is.an("array").that.is.not.empty;
            }).catch(err => {
                assert.fail(err)
            })
        });
        it("Dispatch a new search job asynchronously with ttl", () => {
            const response = splunk.search.createJobSync(queryTTL);
            sleep(10000).then(() => {
                return response
            }).then(data => {
                expect(data).to.have.property("fields");
                const index = data.fields.filter(f => f.name === "index")[0];
                expect(index).to.not.be.undefined;
                expect(data).to.have.property("results").that.is.an("array").that.is.not.empty;
            }).catch(err => {
                assert.fail(err)
            })
        });

        it("Dispatch a new search job asynchronously with timeout", () => {
            const response = splunk.search.createJobSync(queryTimeout);
            sleep(10000).then(() => {
                return response
            }).then(data => {
                const index = data.fields.filter(f => f.name === "index")[0];
                expect(index).to.not.be.undefined;
                expect(data).to.have.property("results").that.is.an("array").that.is.not.empty;
            }).catch(err => {
                assert.fail(err)
            })
        });
    });
});

