const config = require("../config");
const SplunkSSC = require("../../src/splunk");
const { expect } = require("chai");

describe("Using Search APIs", () => {
    // TODO:(dp) Commenting until I build new stubby responses
    // const splk = new SplunkSSC(`http://${config.host}:8882`, config.authToken, 'TEST_TENANT');

    // describe("Submit a search", () => {
    //     it("should allow submission of a search", () => {
    //         const response = splk.search.createJob({query: "search index=*"});
    //         return response.then((json) => {
    //             expect(json).to.have.property("searchId", "SEARCH_ID");
    //         });
    //     });

    //     it("should allow retrieval of results", () => splk.search.getResults("SEARCH_ID").then((json) => {
    //         expect(json).to.have.property("fields");
    //     }))
    // });

    // describe("Search synchronously", () => {
    //     // Undespecified- format will change
    //     it("should allow posting a search and getting results", () => splk.search.createJobSync({query: "search index=*"}).then((data) => {
    //         expect(data).to.have.property("fields");
    //         const index = data.fields.filter(f => f.name === "index")[0];
    //         expect(index).to.not.be.undefined;
    //         expect(data).to.have.property("results").that.is.an("array").that.is.not.empty;
    //     }));
    // });

    // describe("Easy-to-use APIs", () => {
    //     it("should allow search by Rx.Observable", (done) => {
    //         const observable = splk.search.searchObserver({query: "search index=*"});
    //         let count = 0;
    //         observable.subscribe({
    //             next(evt) {
    //                 count += 1;
    //                 expect(evt).to.have.property("index");
    //             },
    //             error: err => done(err),
    //             complete() {
    //                 try {
    //                     expect(count).to.equal(5);
    //                     done();
    //                 } catch (err) {
    //                     done(err);
    //                 }
    //             }
    //         });
    //     });
    // });

});

// describe("Should be able to import only search", () => {
//     it("should allow import of a single module", () => {
//         const SearchClient = require("../../src/search");
//         const search = new SearchClient(`http://${config.host}:8882`, config.authToken, 'TEST_TENANT');
//         return search.createJobSync({ query: "search index=*" });
//     });
// });
