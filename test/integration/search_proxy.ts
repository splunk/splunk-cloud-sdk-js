import { assert, expect } from 'chai';
import 'mocha';
import { ResultsNotReadyResponse, SearchResults } from '../../src/search';
import { SplunkCloud } from '../../src/splunk';
import config from '../config';

const splunkCloudHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const splunk = new SplunkCloud(splunkCloudHost, token, tenantID);

const standardQuery = {
    'query': '| from index:main | head 5'
};

const moduleQuery = {
    'query': '| from index:main | head 5',
    // catalog service isn't ready for handling module
    'module': ''
};

describe('integration tests Using Search APIs', () => {
    before(() => {
        const events = [];
        for (let i = 0; i < 10; i ++) {
            events.push({ body: `Test event #${i}` });
        }
        return splunk.ingest.postEvents(events);
    });

    describe('Search', () => {
        it('should allow submitting a search and getting results', () => splunk.search.createJob(standardQuery)
            .then(searchObj => { // Check the state of the job
                expect(searchObj).to.have.property('sid');
                expect(searchObj).to.have.property('status');
                return splunk.search.waitForJob(searchObj.sid);
            }).then(searchObj => { // Ensure we have events when done
                expect(searchObj).to.have.property('status', 'done');
                expect(searchObj).to.have.property('resultsAvailable', 5);
                return splunk.search.getResults(searchObj.sid)
                    .then(resultResponse => {
                        expect(resultResponse).to.have.property('results').with.lengthOf(5);
                        expect(resultResponse).to.have.property('fields');
                    });
            }));

        it('should allow submitting a search with module field and getting results', () => splunk.search.createJob(moduleQuery)
            .then(searchObj => { // Check the state of the job
                expect(searchObj).to.have.property('sid');
                expect(searchObj).to.have.property('status');
                return splunk.search.waitForJob(searchObj.sid);
            }).then(searchObj => { // Ensure we have events when done
                expect(searchObj).to.have.property('status', 'done');
                expect(searchObj).to.have.property('resultsAvailable', 5);
                return splunk.search.getResults(searchObj.sid)
                    .then(resultResponse => {
                        expect(resultResponse).to.have.property('results').with.lengthOf(5);
                        expect(resultResponse).to.have.property('fields');
                    });
            }));

        it('should return a wait request if the job is not ready', () => splunk.search.createJob(moduleQuery)
            .then(searchObj => { // Check the state of the job
                expect(searchObj).to.have.property('sid');
                expect(searchObj).to.have.property('status');
                return splunk.search.getResults(searchObj.sid)
                    .then(res => {
                        if ((res as ResultsNotReadyResponse).nextLink) {
                            const resultsNotReady = res as ResultsNotReadyResponse;
                            expect(resultsNotReady).to.have.property('nextLink');
                            expect(resultsNotReady).to.have.property('wait');
                        } else {
                            const resultsResponse = res as SearchResults;
                            expect(resultsResponse).to.have.property('results');
                            expect(resultsResponse).to.have.property('fields');
                        }
                    });
            }));

        it('should allow pagination of results', () => splunk.search.createJob(standardQuery)
            .then(createdJob => splunk.search.waitForJob(createdJob.sid)
                .then(job => { // As a child to keep sid in the closure
                    expect(job).to.have.property('resultsAvailable', 5);
                    return splunk.search.getResults(job.sid, { offset: 0, count: 3 });
                }).then(res => {
                    const results = res as SearchResults;
                    assert(results.results.length === 3);
                    return splunk.search.getResults(createdJob.sid, { offset: 3, count: 5 });
                }).then(res => {
                    const results = res as SearchResults;
                    assert(results.results.length === 2, 'Only two events should remain');
                    return splunk.search.getResults(createdJob.sid, { offset: 10, count: 10 });
                }).then(res => {
                    const results = res as SearchResults;
                    assert(results.results.length === 0);
                })));


        it('should allow retrieval of jobs', () => splunk.search.listJobs()
            .then(results => {
                expect(results).to.be.an('array');
                expect(results[0]).to.have.property('sid');
                expect(results[0]).to.have.property('query');
                expect(results[0]).to.have.property('status');
                expect(results[0]).to.have.property('module');
                expect(results[0]).to.have.property('resultsAvailable');
                expect(results[0]).to.have.property('percentComplete');
            }));

        it('should allow retrieval of jobs with query single status', () => splunk.search.listJobs({ status: 'running' })
            .then(results => {
                expect(results).to.be.an('array');
                expect(results).to.have.lengthOf.above(0);
                expect(results[0]).to.have.property('sid');
                expect(results[0]).to.have.property('query');
                expect(results[0]).to.have.property('status');
                expect(results[0]).to.have.property('module');
                expect(results[0]).to.have.property('resultsAvailable');
                expect(results[0]).to.have.property('percentComplete');
            }));

        it('should allow retrieval of jobs with query multiple status', () => splunk.search.listJobs({ status: 'running,done' })
            .then(results => {
                expect(results).to.be.an('array');
                expect(results).to.have.lengthOf.above(0);
                expect(results[0]).to.have.property('sid');
                expect(results[0]).to.have.property('query');
                expect(results[0]).to.have.property('status');
                expect(results[0]).to.have.property('module');
                expect(results[0]).to.have.property('resultsAvailable');
                expect(results[0]).to.have.property('percentComplete');
            }));

    });

    describe('Search composite', () => {
        it('should allow for easy job status', () => {
            return splunk.search.submitSearch(standardQuery).then(search => {
                return search.status()
                    .then(status => expect(status).to.have.property('status'));
            });
        });

        it('should allow for easy cancellation', () => {
            return splunk.search.submitSearch(standardQuery).then(search => {
                return search.cancel()
                    .then(() => splunk.search.getJob(search.jobId))
                    .then(() => assert.fail('Should have thrown'), (err) => expect(err).to.have.property('httpStatusCode', 404));
            });
        });

        it('should throw a cancellation message when cancelled', () => {
            return splunk.search.submitSearch(standardQuery).then(search => {
                return search.cancel()
                    .then(() => search.wait())
                    .then(() => assert.fail('should have received error'), (err) => {
                        expect(err).to.have.property('message');
                    });
            });
        });


        describe('Get results via promise', () => {
            it('should allow retrieving all results', () => {
                return splunk.search.submitSearch(standardQuery).then(search => {
                    return search.wait()
                        .then(() => search.getResults().then((res) => {
                            const results = res as SearchResults;
                            expect(results.results).to.be.an('array').and.have.property('length', 5);
                        }));
                });
            });

            it('should allow retrieving result window', () => {
                return splunk.search.submitSearch(standardQuery).then(search => {
                    return search.wait()
                        .then(() => search.getResults({ offset: 0, count: 2 }).then((res) => {
                            const results = res as SearchResults;
                            expect(results.results).to.be.an('array').and.have.property('length', 2);
                        }));
                });
            });
        });

        describe('Results Observable', () => {
            it('should allow results observable', () => {
                return splunk.search.submitSearch(standardQuery).then(search => {
                    return new Promise((resolve, reject) => {
                        let results: SearchResults;
                        search.resultObservable().subscribe(r => {
                            results = r;
                        }, reject, () => {
                            try {
                                expect(results.results).to.be.an('array').and.have.property('length', 5);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        });
                    });
                });
            });

            it('should allow results observable with window', () => {
                return splunk.search.submitSearch(standardQuery).then(search => {
                    return new Promise((resolve, reject) => {
                        let results: SearchResults;
                        search.resultObservable({ offset: 0, count: 2 }).subscribe(r => {
                            results = r;
                        }, reject, () => {
                            try {
                                expect(results.results).to.be.an('array').and.have.property('length', 2);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        });
                    });
                });
            });
        });

        it('should allow status subscription', () => {
            // Ensure we can pass functions around but they still have access to
            // their embedded client.
            const fun = splunk.search.submitSearch;
            return fun(standardQuery).then(search => {
                return new Promise((resolve, reject) => {
                    let count = 0;
                    search.statusObservable(10).subscribe(
                        status => {
                            count += 1;
                            try {
                                expect(status).to.have.property('sid');
                                expect(status).to.have.property('resultsAvailable');
                                expect(status).to.have.property('status');
                            } catch (e) {
                                reject(e);
                            }
                        },
                        reject,
                        () => {
                            try {
                                assert(count > 0, 'We should have gotten at least one status');
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

