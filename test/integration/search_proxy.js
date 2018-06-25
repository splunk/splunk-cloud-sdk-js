const SplunkSSC = require("../../splunk");

const { assert } = require("chai");
const { expect } = require("chai");

const token = process.env.BEARER_TOKEN;
const tenantID = process.env.TENANT_ID;

const splunk = new SplunkSSC(process.env.SSC_HOST, token, tenantID);

const standardQuery = {
    "query": "| from index:main | head 5",
};

const moduleQuery = {
    "query": "| from index:main | head 5",
    "module": "testing",
};

describe("integration tests Using Search APIs", () => {
    before(() => {
        const events = [];
        for (let i = 0; i < 10; i += 1) {
            events.push({ event: `Test event no ${i}` });
        }
        splunk.hec2.createEvents(events);
    });

    describe("Search", () => {


        it("should allow submitting a search and getting results", () => splunk.search.createJob(standardQuery)
            .then((sid) => splunk.search.getJob(sid))
            .then(searchObj => { // Check the state of the job
                expect(searchObj).to.have.property('sid');
                expect(searchObj).to.have.property('dispatchState');
                return splunk.search.waitForJob(searchObj.sid);
            }).then(searchObj => { // Ensure we have events when done
                expect(searchObj).to.have.property('dispatchState', 'DONE');
                expect(searchObj).to.have.property('eventCount', 5);
                return Promise.all([
                    splunk.search.getResults(searchObj.sid)
                        .then(resultResponse => {
                            expect(resultResponse).to.have.property('results').with.lengthOf(5);
                            expect(resultResponse).to.have.property('preview', false);
                            expect(resultResponse).to.have.property('init_offset', 0);
                        }),
                    splunk.search.getEvents(searchObj.sid)
                        .then(eventsResponse => {
                            // TODO: determine why we have two endpoints that seem the same
                            expect(eventsResponse).to.have.property('results').with.lengthOf(5);
                            expect(eventsResponse).to.have.property('preview', false);
                            expect(eventsResponse).to.have.property('init_offset', 0);
                        })
                ]);
            }));

        it("should allow submitting a search with module field and getting results", () => splunk.search.createJob(moduleQuery)
            .then((sid) => splunk.search.getJob(sid))
            .then(searchObj => { // Check the state of the job
                expect(searchObj).to.have.property('sid');
                expect(searchObj).to.have.property('dispatchState');
                return splunk.search.waitForJob(searchObj.sid);
            }).then(searchObj => { // Ensure we have events when done
                expect(searchObj).to.have.property('dispatchState', 'DONE');
                expect(searchObj).to.have.property('eventCount', 5);
                return Promise.all([
                    splunk.search.getResults(searchObj.sid)
                        .then(resultResponse => {
                            expect(resultResponse).to.have.property('results').with.lengthOf(5);
                            expect(resultResponse).to.have.property('preview', false);
                            expect(resultResponse).to.have.property('init_offset', 0);
                        }),
                    splunk.search.getEvents(searchObj.sid)
                        .then(eventsResponse => {
                            // TODO: determine why we have two endpoints that seem the same
                            expect(eventsResponse).to.have.property('results').with.lengthOf(5);
                            expect(eventsResponse).to.have.property('preview', false);
                            expect(eventsResponse).to.have.property('init_offset', 0);
                        })
                ]);
            }));

        it("should allow control of a job", () => splunk.search.createJob(standardQuery)
            .then(sid => splunk.search.getJob(sid)
                .then((job) => {
                    assert(job.dispatchState !== 'PAUSED');
                    return splunk.search.createJobControlAction(sid, 'pause');
                }).then((response) => {
                    expect(response).to.have.property('messages'); // DP: I expect this one to change
                    assert(response.messages[0].text === 'Search job paused.');
                    return splunk.search.createJobControlAction(sid, 'cancel');
                }).then((response) => {
                    expect(response).to.have.property('messages'); // DP: I expect this one to change
                    assert(response.messages[0].text === 'Search job cancelled.');
                    return splunk.search.getJob(sid);
                }).then(() => assert.fail("Should have thrown"), err => assert(err.code === 404, "Job should not exist"))));

        it("should allow pagination of results", () => splunk.search.createJob(standardQuery)
            .then(sid => splunk.search.waitForJob(sid)
                .then(job => { // As a child to keep sid in the closure
                    expect(job).to.have.property('eventCount', 5);
                    return splunk.search.getResults(sid, { offset: 0, count: 3 });
                }).then(result => {
                    assert(result.results.length === 3);
                    return splunk.search.getResults(sid, { offset: 3, count: 5 });
                }).then(result => {
                    assert(result.results.length === 2, "Only two events should remain");
                    return splunk.search.getResults(sid, { offset: 10, count: 10 });
                }).then(result => {
                    assert(result.results.length === 0);
                })));

        it("should allow pagination of events", () => splunk.search.createJob(standardQuery)
            .then(sid => splunk.search.waitForJob(sid)
                .then(job => { // As a child to keep sid in the closure
                    expect(job).to.have.property('eventCount', 5);
                    return splunk.search.getEvents(sid, { offset: 0, count: 3 });
                }).then(result => {
                    assert(result.results.length === 3, "Should have gotten three events in the first batch, got: ", JSON.stringify(result));
                    return splunk.search.getEvents(sid, { offset: 3, count: 5 });
                }).then(result => {
                    assert(result.results.length === 2, "Only two events should remain");
                })));

        it("should allow retrieval of jobs", () => splunk.search.getJobs()
            .then(results => {
                expect(results).to.be.an('array');
                expect(results[0]).to.have.property('content');
                expect(results[0].content).to.have.property('sid');
                expect(results[0].content).to.have.property('eventCount');
                expect(results[0].content).to.have.property('optimizedSearch');
                expect(results[0].content).to.have.property('dispatchState');
            }))

    });

    describe("Search composite", () => {
        it("should allow for easy job status", () => {
            return splunk.search.submitSearch(standardQuery).then(search => {
                search.status()
                    .then(status => expect(status).to.have.property('dispatchState'));
            });
        });

        it("should allow for easy cancellation", () => {
            return splunk.search.submitSearch(standardQuery).then(search => {
                search.cancel()
                    .then(() => splunk.search.getJob(search.sid))
                    .then(() => assert.fail("Should have thrown"), (err) => expect(err).to.have.property('code', 404));
            });
        });

        it("should throw a cancellation message when cancelled", () => {
            return splunk.search.submitSearch(standardQuery).then(search => {
                return search.cancel()
                    .then(() => search.wait())
                    .then(() => assert.fail("should have received error"), (err) => {
                        expect(err).to.have.property('message').and.match(/cancelled/);
                    })
            });
        });

        it("should allow for easy search", () => {
            return splunk.search.submitSearch(standardQuery).then(search => {
                return new Promise((resolve, reject) => {
                    let counter = 0;
                    search.eventObservable({ batchSize: 2 }).subscribe(() => counter += 1, (err) => reject(err), () => {
                        if (counter === 5) {
                            resolve(counter);
                        } else {
                            reject(new Error(`Expected 5, got ${counter}`));
                        }
                    });
                });
            });

        });

        describe("Get results via promise", () => {
            it("should allow retrieving all results", () => {
                return splunk.search.submitSearch(standardQuery).then(search => {
                    return search.wait()
                        .then(() => search.getResults().then((results) => {
                            expect(results).to.be.an('array').and.have.property('length', 5);
                        }));
                });
            });

            it("should allow retrieving result window", () => {
                return splunk.search.submitSearch(standardQuery).then(search => {
                    return search.wait()
                        .then(() => search.getResults({ offset: 0, batchSize: 2 }).then((results) => {
                            expect(results).to.be.an('array').and.have.property('length', 2);
                        }));
                });
            });
        });

        describe("Results Observable", () => {
            it("should allow results observable", () => {
                return splunk.search.submitSearch(standardQuery).then(search => {
                    return new Promise((resolve, reject) => {
                        let results = null;
                        search.resultObservable().subscribe(r => { results = r }, reject, () => {
                            try {
                                expect(results).to.be.an('array').and.have.property('length', 5);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        });
                    });
                });
            });

            it("should allow results observable with window", () => {
                return splunk.search.submitSearch(standardQuery).then(search => {
                    return new Promise((resolve, reject) => {
                        let results = null;
                        search.resultObservable({ offset: 0, batchSize: 2 }).subscribe(r => { results = r }, reject, () => {
                            try {
                                expect(results).to.be.an('array').and.have.property('length', 2);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        });
                    });
                });
            });
        });

        it("should allow status subscription", () => {
            return splunk.search.submitSearch(standardQuery).then(search => {
                return new Promise((resolve, reject) => {
                    let count = 0;
                    search.statusObservable(10).subscribe(
                        status => {
                            count += 1;
                            try {
                                expect(status).to.have.property('sid');
                                expect(status).to.have.property('eventCount');
                                expect(status).to.have.property('dispatchState');
                            } catch (e) {
                                reject(e);
                            }
                        },
                        reject,
                        () => {
                            try {
                                assert(count > 0, "We should have gotten at least one status");
                            } catch (e) {
                                reject(e);
                            }
                            resolve();
                        });
                });
            });

        });
    });

});

