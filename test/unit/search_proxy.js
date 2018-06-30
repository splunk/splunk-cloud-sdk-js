const config = require("../config");
const SplunkSSC = require("../../ts_src/splunk");
const { expect } = require("chai");

describe("Using Search APIs", () => {
    const splk = new SplunkSSC(`http://${config.stubbyHost}:8882`, config.stubbyAuthToken, config.stubbyTenant);

    it("should allow submission of a search", () => splk.search.createJob({ query: "search index=*" })
        .then((sid) => {
            expect(sid).to.equal("SEARCH_ID");
        })
    );

    it("should allow retrieval of results", () => splk.search.getResults("SEARCH_ID")
        .then(results => {
            expect(results).to.have.property('fields');
            expect(results).to.have.property('results');
            expect(results).to.have.property('init_offset'); // Canary- I expect this to change
            expect(results).to.have.property('preview', false);
        })
    );

    it("should allow retrieval of events", () => splk.search.getEvents("SEARCH_ID")
        .then(results => {
            expect(results).to.have.property('fields');
            expect(results).to.have.property('results');
            expect(results).to.have.property('init_offset'); // Canary- I expect this to change
            expect(results).to.have.property('preview', false);
        })
    );

    it("should allow retrieval of a job status", () => splk.search.getJob("SEARCH_ID")
        .then(results => {
            expect(results).to.have.property('sid', 'SEARCH_ID');
            expect(results).to.have.property('dispatchState', 'DONE');
            expect(results).to.have.property('eventCount');
            expect(results).to.have.property('optimizedSearch');
        })
    );

    it("should allow retrieval of the list of jobs", () => splk.search.getJobs()
        .then(results => {
            expect(results).to.be.an("array");
            expect(results[0].content).to.have.property('sid', 'SEARCH_ID');
            expect(results[0].content).to.have.property('dispatchState', 'DONE');
            expect(results[0].content).to.have.property('eventCount');
            expect(results[0].content).to.have.property('optimizedSearch');
        })
    );

    it("should allow job control", () => splk.search.createJobControlAction('SEARCH_ID', 'pause')
        .then(result => {
            expect(result).to.have.property('messages').and.be.an('array');
            expect(result.messages[0]).to.have.property('type', 'INFO');
            expect(result.messages[0]).to.have.property('text').and.match(/paused/);
        })
    );
});
