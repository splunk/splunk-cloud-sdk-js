/**
 * Copyright 2019 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { assert } from 'chai';
import 'mocha';
import { searchModels } from '../../search';
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

const searchJobWithEventSummary = {
    query: '| from index:main | head 5',
    collectEventSummary: true
};

const searchJobWithFieldSummary = {
    query: '| from index:main | head 5',
    collectFieldSummary: true
};

const searchJobWithTimeBucket = {
    query: '| from index:main | head 5',
    collectTimeBuckets: true
};

describe('integration tests Using Search APIs', () => {
    before(() => {
        const events = [];
        for (let i = 0; i < 10; i++) {
            events.push({ body: { message:`Test event #${i}` } });
        }
        return splunk.ingest.postEvents(events);
    });

    describe('Search', () => {
        it('should allow submitting a search and getting results', () => splunk.search.createJob(standardQuery)
            .then(searchObj => { // Check the state of the job
                assert.property(searchObj, 'sid');
                assert.property(searchObj, 'status');
                return splunk.search.waitForJob(searchObj.sid as string);
            }).then(searchObj => { // Ensure we have events when done
                assert.equal(searchObj.status, searchModels.SearchStatus.Done );
                assert.equal(searchObj.resultsAvailable, 5);
                return splunk.search.listResults(searchObj.sid as string)
                    .then(resultResponse => {
                        const response = resultResponse as searchModels.ListSearchResultsResponse;
                        assert.equal(response.results.length, 5);
                        assert.property(response, 'fields');
                    });
            }));

        it('should allow submitting a search with module field and getting results', () => splunk.search.createJob(moduleQuery)
            .then(searchObj => { // Check the state of the job
                assert.property(searchObj, 'sid');
                assert.property(searchObj, 'status');
                return splunk.search.waitForJob(searchObj.sid as string);
            }).then(searchObj => { // Ensure we have events when done
                assert.equal(searchObj.status, searchModels.SearchStatus.Done);
                assert.equal(searchObj.resultsAvailable, 5);
                return splunk.search.listResults(searchObj.sid as string)
                    .then(resultResponse => {
                        const response = resultResponse as searchModels.ListSearchResultsResponse;
                        assert.equal(response.results.length, 5);
                        assert.property(response, 'fields');
                    });
            }));

        it('should return a wait request if the job is not ready', () => splunk.search.createJob(moduleQuery)
            .then(searchObj => { // Check the state of the job
                assert.property(searchObj, 'sid');
                assert.property(searchObj, 'status');
                return splunk.search.listResults(searchObj.sid as string)
                    .then(res => {
                        if ((res as searchModels.ListSearchResultsResponse).nextLink) {
                            const resultsNotReady = res as searchModels.ListSearchResultsResponse;
                            assert.property(resultsNotReady, 'nextLink');
                            assert.property(resultsNotReady, 'wait');
                        } else {
                            const resultsResponse = res as searchModels.ListSearchResultsResponse;
                            assert.property(resultsResponse, 'results');
                            assert.property(resultsResponse, 'fields');
                        }
                    });
            }));

        it('should allow pagination of results', () => splunk.search.createJob(standardQuery)
            .then(createdJob => splunk.search.waitForJob(createdJob.sid as string)
                .then(job => { // As a child to keep sid in the closure
                    assert.equal(job.resultsAvailable, 5);
                    return splunk.search.listResults(job.sid as string, { offset: 0, count: 3 });
                }).then(res => {
                    const results = res as searchModels.ListSearchResultsResponse;
                    assert.equal(results.results.length, 3);
                    return splunk.search.listResults(createdJob.sid as string, { offset: 3, count: 5 });
                }).then(res => {
                    const results = res as searchModels.ListSearchResultsResponse;
                    assert.equal(results.results.length, 2, 'Only two events should remain');
                    return splunk.search.listResults(createdJob.sid as string, { offset: 10, count: 10 });
                }).then(res => {
                    const results = res as searchModels.ListSearchResultsResponse;
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

        it('should allow retrieval of jobs with query single status', () => splunk.search.listJobs()
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

        it('should allow retrieval of jobs with query multiple status', () => splunk.search.listJobs()
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

        it('should allow query params for listing search results', () => splunk.search.createJob(standardQuery)
            .then(searchObj => {
                assert.property(searchObj, 'sid');
                assert.property(searchObj, 'status');
                return splunk.search.waitForJob(searchObj.sid as string);
            }).then(searchObj => { // Ensure we have events when done
                assert.equal(searchObj.status, searchModels.SearchStatus.Done );
                assert.equal(searchObj.resultsAvailable, 5);
                return splunk.search.listResults(searchObj.sid as string, { field: 'host' })
                    .then(resultResponse => {
                        const response = resultResponse as searchModels.ListSearchResultsResponse;
                        assert.equal(response.results.length, 5);
                        assert.property(response, 'fields');
                        // should only return host field in results
                        assert.equal(Object.keys(response.results[0]).length, 1);
                        assert.isTrue(Object.keys(response.results[0]).indexOf('host') > -1);
                    });
            }));

        it('should allow listing events summary', () => splunk.search.createJob(searchJobWithEventSummary)
            .then(searchObj => {
                assert.property(searchObj, 'sid');
                assert.property(searchObj, 'status');
                return splunk.search.waitForJob(searchObj.sid as string);
            }).then(searchObj => { // Ensure we have events when done
                assert.equal(searchObj.status, searchModels.SearchStatus.Done );
                return splunk.search.listEventsSummary(searchObj.sid as string, { field: '_raw' })
                    .then(resultResponse => {
                        const response = resultResponse as searchModels.ListSearchResultsResponse;
                        assert.equal(response.results.length, 5);
                        assert.property(response, 'fields');
                        assert.property(response, 'messages');
                        // should only return host field in results
                        assert.equal(Object.keys(response.results[0]).length, 1);
                        assert.isTrue(Object.keys(response.results[0]).indexOf('_raw') > -1);
                    });
            }));

        it('should allow listing fields summary', () => splunk.search.createJob(searchJobWithFieldSummary)
            .then(searchObj => {
                assert.property(searchObj, 'sid');
                assert.property(searchObj, 'status');
                return splunk.search.waitForJob(searchObj.sid as string);
            }).then(searchObj => { // Ensure we have events when done
                assert.equal(searchObj.status, searchModels.SearchStatus.Done );
                return splunk.search.listFieldsSummary(searchObj.sid as string, { earliest: '-1m' })
                    .then(resultResponse => {
                        const response = resultResponse as searchModels.FieldsSummary;
                        assert.equal(response.eventCount, 5);
                        assert.property(response, 'earliestTime');
                        assert.property(response, 'latestTime');
                        assert.property(response, 'fields');
                    });
            }));

        it('should allow listing time buckets', () => splunk.search.createJob(searchJobWithTimeBucket)
            .then(searchObj => {
                assert.property(searchObj, 'sid');
                assert.property(searchObj, 'status');
                return splunk.search.waitForJob(searchObj.sid as string);
            }).then(searchObj => { // Ensure we have events when done
                assert.equal(searchObj.status, searchModels.SearchStatus.Done );
                return splunk.search.listTimeBuckets(searchObj.sid as string)
                    .then(resultResponse => {
                        const response = resultResponse as searchModels.TimeBucketsSummary;
                        assert.equal(response.eventCount, 5);
                        assert.property(response, 'buckets');
                        assert.property(response, 'isTimeCursored');
                        assert.property(response, 'cursorTime');
                        assert.isArray(response.buckets);
                        assert.isTrue(response.buckets!.length > 0);
                        const firstBucket = response.buckets![0] as searchModels.SingleTimeBucket;
                        assert.property(firstBucket, 'availableCount');
                        assert.property(firstBucket, 'duration');
                        assert.property(firstBucket, 'earliestTime');
                        assert.property(firstBucket, 'earliestStrfTime');
                        assert.property(firstBucket, 'isFinalized');
                        assert.property(firstBucket, 'totalCount');
                    });
            }));
    });

    // describe('Search composite', () => {
        // it('should allow for easy job status', () => {
        //     return splunk.search.submitSearch(standardQuery).then(search => {
        //         return search.status()
        //             .then(status => assert.property(status, 'status'));
        //     });
        // });

        // it('should allow for easy cancellation', () => {
        //     return splunk.search.submitSearch(standardQuery).then(search => {
        //         return search.cancel()
        //             .then(() => splunk.search.getJob(search.jobId))
        //             .then(() => assert.fail('Should have thrown'), (err) => assert.equal(err.httpStatusCode, 404));
        //     });
        // });

        // it('should throw a cancellation message when cancelled', () => {
        //     return splunk.search.submitSearch(standardQuery).then(search => {
        //         return search.cancel()
        //             .then(() => search.wait())
        //             .then(() => assert.fail('should have received error'), (err) => {
        //                 assert.property(err, 'message');
        //             });
        //     });
        // });


        // describe('Get results via promise', () => {
        //     it('should allow retrieving all results', () => {
        //         return splunk.search.submitSearch(standardQuery).then(search => {
        //             return search.wait()
        //                 .then(() => search.getResults().then((res) => {
        //                     const results = res as searchModels.SearchResults;
        //                     assert.typeOf(results.results, 'array');
        //                     assert.equal(results.results.length, 5);
        //                 }));
        //         });
        //     });

        //     it('should allow retrieving result window', () => {
        //         return splunk.search.submitSearch(standardQuery).then(search => {
        //             return search.wait()
        //                 .then(() => search.getResults({ offset: 0, count: 2 }).then((res) => {
        //                     const results = res as searchModels.SearchResults;
        //                     assert.typeOf(results.results, 'array');
        //                     assert.equal(results.results.length, 2);
        //                 }));
        //         });
        //     });
        // });

        // describe('Results Observable', () => {
        //     it('should allow results observable', () => {
        //         return splunk.search.submitSearch(standardQuery).then(search => {
        //             return new Promise((resolve, reject) => {
        //                 let results: searchModels.SearchResults;
        //                 search.resultObservable().subscribe(r => {
        //                     results = r;
        //                 }, reject, () => {
        //                     try {
        //                         assert.typeOf(results.results, 'array');
        //                         assert.equal(results.results.length, 5);
        //                         resolve();
        //                     } catch (e) {
        //                         reject(e);
        //                     }
        //                 });
        //             });
        //         });
        //     });

        //     it('should allow results observable with window', () => {
        //         return splunk.search.submitSearch(standardQuery).then(search => {
        //             return new Promise((resolve, reject) => {
        //                 let results: searchModels.SearchResults;
        //                 search.resultObservable({ offset: 0, count: 2 }).subscribe(r => {
        //                     results = r;
        //                 }, reject, () => {
        //                     try {
        //                         assert.typeOf(results.results, 'array');
        //                         assert.equal(results.results.length, 2);
        //                         resolve();
        //                     } catch (e) {
        //                         reject(e);
        //                     }
        //                 });
        //             });
        //         });
        //     });
        //     it('should allow results observable with polling rate', () => {
        //         return splunk.search.submitSearch(standardQuery).then(search => {
        //             return new Promise((resolve, reject) => {
        //                 let results: searchModels.SearchResults;
        //                 search.resultObservable({ pollInterval: 150 }).subscribe(r => {
        //                     results = r;
        //                 }, reject, () => {
        //                     try {
        //                         assert.typeOf(results.results, 'array');
        //                         assert.equal(results.results.length, 5);
        //                         resolve();
        //                     } catch (e) {
        //                         reject(e);
        //                     }
        //                 });
        //             });
        //         });
        //     });
        // });

        // it('should allow status subscription', () => {
        //     // Ensure we can pass functions around but they still have access to
        //     // their embedded client.
        //     const fun = splunk.search.submitSearch;
        //     return fun(standardQuery).then(search => {
        //         return new Promise((resolve, reject) => {
        //             let count = 0;
        //             search.statusObservable(10).subscribe(
        //                 status => {
        //                     count += 1;
        //                     try {
        //                         assert.containsAllKeys(status, ['sid', 'resultsAvailable', 'status']);
        //                     } catch (e) {
        //                         reject(e);
        //                     }
        //                 },
        //                 reject,
        //                 () => {
        //                     try {
        //                         assert.isAtLeast(count, 1, 'We should have gotten at least one status');
        //                     } catch (e) {
        //                         reject(e);
        //                     }
        //                     resolve();
        //                 });
        //         });
        //     });
        // });
    // });

});

