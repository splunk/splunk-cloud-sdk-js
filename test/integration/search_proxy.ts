import { assert } from 'chai';
import 'mocha';
import { ResultsNotReadyResponse, SearchResults } from '../../search';
import { SplunkCloud } from '../../splunk';
import config from '../config';

const splunk = new SplunkCloud({ urls: { api: config.stagingApiHost, app: config.stagingAppsHost }, tokenSource: config.stagingAuthToken, defaultTenant: config.stagingTenant });

const standardQuery = {
    query: '| from index:main | head 5'
};

const moduleQuery = {
    query: '| from index:main | head 5',
    // catalog service isn't ready for handling module
    module: ''
};

describe('integration tests Using Search APIs', () => {
    before(() => {
        const events = [];
        for (let i = 0; i < 10; i++) {
            events.push({ body: `Test event #${i}` });
        }
        return splunk.ingest.postEvents(events);
    });

    describe('Search', () => {
        it('should allow submitting a search and getting results', () => splunk.search.createJob(standardQuery)
            .then(searchObj => { // Check the state of the job
                assert.property(searchObj, 'sid');
                assert.property(searchObj, 'status');
                return splunk.search.waitForJob(searchObj.sid);
            }).then(searchObj => { // Ensure we have events when done
                assert.equal(searchObj.status, 'done');
                assert.equal(searchObj.resultsAvailable, 5);
                return splunk.search.listResults(searchObj.sid)
                    .then(resultResponse => {
                        const response = resultResponse as SearchResults;
                        assert.equal(response.results.length, 5);
                        assert.property(response, 'fields');
                    });
            }));

        it('should allow submitting a search with module field and getting results', () => splunk.search.createJob(moduleQuery)
            .then(searchObj => { // Check the state of the job
                assert.property(searchObj, 'sid');
                assert.property(searchObj, 'status');
                return splunk.search.waitForJob(searchObj.sid);
            }).then(searchObj => { // Ensure we have events when done
                assert.equal(searchObj.status, 'done');
                assert.equal(searchObj.resultsAvailable, 5);
                return splunk.search.listResults(searchObj.sid)
                    .then(resultResponse => {
                        const response = resultResponse as SearchResults;
                        assert.equal(response.results.length, 5);
                        assert.property(response, 'fields');
                    });
            }));

        it('should return a wait request if the job is not ready', () => splunk.search.createJob(moduleQuery)
            .then(searchObj => { // Check the state of the job
                assert.property(searchObj, 'sid');
                assert.property(searchObj, 'status');
                return splunk.search.listResults(searchObj.sid)
                    .then(res => {
                        if ((res as ResultsNotReadyResponse).nextLink) {
                            const resultsNotReady = res as ResultsNotReadyResponse;
                            assert.property(resultsNotReady, 'nextLink');
                            assert.property(resultsNotReady, 'wait');
                        } else {
                            const resultsResponse = res as SearchResults;
                            assert.property(resultsResponse, 'results');
                            assert.property(resultsResponse, 'fields');
                        }
                    });
            }));

        it('should allow pagination of results', () => splunk.search.createJob(standardQuery)
            .then(createdJob => splunk.search.waitForJob(createdJob.sid)
                .then(job => { // As a child to keep sid in the closure
                    assert.equal(job.resultsAvailable, 5);
                    return splunk.search.listResults(job.sid, { offset: 0, count: 3 });
                }).then(res => {
                    const results = res as SearchResults;
                    assert.equal(results.results.length, 3);
                    return splunk.search.listResults(createdJob.sid, { offset: 3, count: 5 });
                }).then(res => {
                    const results = res as SearchResults;
                    assert.equal(results.results.length, 2, 'Only two events should remain');
                    return splunk.search.listResults(createdJob.sid, { offset: 10, count: 10 });
                }).then(res => {
                    const results = res as SearchResults;
                    assert.equal(results.results.length, 0);
                })));


        it('should allow retrieval of jobs', () => splunk.search.listJobs()
            .then(results => {
                assert.typeOf(results, 'array');
                assert.ok(results.length > 0);
                assert.property(results[0], 'sid');
                assert.property(results[0], 'query');
                assert.property(results[0], 'status');
                assert.property(results[0], 'module');
                assert.property(results[0], 'resultsAvailable');
                assert.property(results[0], 'percentComplete');
            }));

        it('should allow retrieval of jobs with query single status', () => splunk.search.listJobs({ status: 'running' })
            .then(results => {
                assert.typeOf(results, 'array');
                assert.ok(results.length > 0);
                assert.property(results[0], 'sid');
                assert.property(results[0], 'query');
                assert.property(results[0], 'status');
                assert.property(results[0], 'module');
                assert.property(results[0], 'resultsAvailable');
                assert.property(results[0], 'percentComplete');
            }));

        it('should allow retrieval of jobs with query multiple status', () => splunk.search.listJobs({ status: 'running,done' })
            .then(results => {
                assert.typeOf(results, 'array');
                assert.ok(results.length > 0);
                assert.property(results[0], 'sid');
                assert.property(results[0], 'query');
                assert.property(results[0], 'status');
                assert.property(results[0], 'module');
                assert.property(results[0], 'resultsAvailable');
                assert.property(results[0], 'percentComplete');
            }));

    });

    describe('Search composite', () => {
        it('should allow for easy job status', () => {
            return splunk.search.submitSearch(standardQuery).then(search => {
                return search.status()
                    .then(status => assert.property(status, 'status'));
            });
        });

        it('should allow for easy cancellation', () => {
            return splunk.search.submitSearch(standardQuery).then(search => {
                return search.cancel()
                    .then(() => splunk.search.getJob(search.jobId))
                    .then(() => assert.fail('Should have thrown'), (err) => assert.equal(err.httpStatusCode, 404));
            });
        });

        it('should throw a cancellation message when cancelled', () => {
            return splunk.search.submitSearch(standardQuery).then(search => {
                return search.cancel()
                    .then(() => search.wait())
                    .then(() => assert.fail('should have received error'), (err) => {
                        assert.property(err, 'message');
                    });
            });
        });


        describe('Get results via promise', () => {
            it('should allow retrieving all results', () => {
                return splunk.search.submitSearch(standardQuery).then(search => {
                    return search.wait()
                        .then(() => search.getResults().then((res) => {
                            const results = res as SearchResults;
                            assert.typeOf(results.results, 'array');
                            assert.equal(results.results.length, 5);
                        }));
                });
            });

            it('should allow retrieving result window', () => {
                return splunk.search.submitSearch(standardQuery).then(search => {
                    return search.wait()
                        .then(() => search.getResults({ offset: 0, count: 2 }).then((res) => {
                            const results = res as SearchResults;
                            assert.typeOf(results.results, 'array');
                            assert.equal(results.results.length, 2);
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
                                assert.typeOf(results.results, 'array');
                                assert.equal(results.results.length, 5);
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
                                assert.typeOf(results.results, 'array');
                                assert.equal(results.results.length, 2);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        });
                    });
                });
            });
            it('should allow results observable with polling rate', () => {
                return splunk.search.submitSearch(standardQuery).then(search => {
                    return new Promise((resolve, reject) => {
                        let results: SearchResults;
                        search.resultObservable({ pollInterval: 150 }).subscribe(r => {
                            results = r;
                        }, reject, () => {
                            try {
                                assert.typeOf(results.results, 'array');
                                assert.equal(results.results.length, 5);
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
                                assert.containsAllKeys(status, ['sid', 'resultsAvailable', 'status']);
                            } catch (e) {
                                reject(e);
                            }
                        },
                        reject,
                        () => {
                            try {
                                assert.isAtLeast(count, 1, 'We should have gotten at least one status');
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

