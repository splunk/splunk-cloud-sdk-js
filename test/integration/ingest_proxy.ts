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
import { EventBatcher } from '../../src/ingest_event_batcher';
import { Event, HTTPResponse, Metric, MetricEvent } from '../../src/services/ingest';
import { SplunkCloud } from '../../src/splunk';
import config from '../config';

const splunk = new SplunkCloud({ urls: { api: config.stagingApiHost, app: config.stagingAppsHost }, tokenSource: config.stagingAuthToken, defaultTenant: config.stagingTenant });
const splunkBadToken = new SplunkCloud({ urls: { api: config.stagingApiHost, app: config.stagingAppsHost }, tokenSource: config.invalidAuthToken, defaultTenant: config.stagingTenant });


describe('integration tests for Ingest Endpoints', () => {

    const successResponse: HTTPResponse = { code: 'SUCCESS', message: 'The event was sent successfully.' };
    const event1: Event = { sourcetype: 'splunkd', source: 'mysource', timestamp: 1536174774569, attributes: { fieldkey1: 'fieldval1', fieldkey2: 'fieldkey2' }, host: 'myhost', body: { body: 'INFO  ServerConfig - Will generate GUID, as none found on this server.' } };
    const event2: Event = { sourcetype: 'splunkd', source: 'mysource', timestamp: 1536174774570, attributes: { fieldkey1: 'fieldval1', fieldkey2: 'fieldkey2' }, host: 'myhost', body: { body: 'INFO  ServerConfig - My newly generated GUID is 6F386D83-ADB2-4BAB-A7AA-634B0BEA2C6A' } };
    const event3: Event = { sourcetype: 'splunkd', source: 'mysource', timestamp: 1536174774571, attributes: { fieldkey1: 'fieldval1', fieldkey2: 'fieldkey2' }, host: 'myhost', body: { body: 'INFO  ServerConfig - My server name is "9765f1bebdb4".' } };
    const event4: Event = { sourcetype: 'splunkd', source: 'mysource', timestamp: 1536174774572, attributes: { fieldkey1: 'fieldval1', fieldkey2: 'fieldkey2' }, host: 'myhost', body: { body: 'INFO  ServerConfig - My server name is "9765f1bebdb5".' } };
    const event5: Event = { sourcetype: 'splunkd', source: 'mysource', timestamp: 1536174774573, attributes: { fieldkey1: 'fieldval1', fieldkey2: 'fieldkey2' }, host: 'myhost', body: { body: 'INFO  ServerConfig - My server name is "9765f1bebdb6".' } };
    const event6: Event = { sourcetype: 'splunkd', source: 'mysource', timestamp: 1536174774574, attributes: { fieldkey1: 'fieldval1', fieldkey2: 'fieldkey2' }, host: 'myhost', body: { body: 'INFO  ServerConfig - My server name is "9765f1bebdb7".' } };
    const event7: Event = { sourcetype: 'splunkd', source: 'mysource', timestamp: 1536174774575, attributes: { fieldkey1: 'fieldval1', fieldkey2: 'fieldkey2' }, host: 'myhost', body: { body: 'INFO  ServerConfig - My server name is "9765f1bebdb8".' } };
    const event8: Event = { sourcetype: 'splunkd', source: 'mysource', timestamp: 1536174774576, attributes: { fieldkey1: 'fieldval1', fieldkey2: 'fieldkey2' }, host: 'myhost', body: { body: 'INFO  ServerConfig - My server name is "9765f1bebdb9".' } };
    const event9: Event = { sourcetype: 'splunkd', source: 'mysource', timestamp: 1536174774577, attributes: { fieldkey1: 'fieldval1', fieldkey2: 'fieldkey2' }, host: 'myhost', body: { body: 'INFO  ServerConfig - My server name is "9765f1bebdc0".' } };
    const event10: Event = { sourcetype: 'splunkd', source: 'mysource', timestamp: 1536174774578, attributes: { fieldkey1: 'fieldval1', fieldkey2: 'fieldkey2' }, host: 'myhost', body: { body: 'INFO  ServerConfig - My server name is "9765f1bebdc1".' } };
    const event11 = { sourcetype: 'splunkd', source: 'mysource', timestamp: 1536174774578, attributes: { fieldkey1: 'fieldval1', fieldkey2: 'fieldkey2' }, hostUnknown: 'myhost', body: { body: 'INFO  ServerConfig - My server name is "9765f1bebdc1".' } };


    describe('Events Endpoint', () => {

        describe('Post events', () => {
            it('should return a successful response', () => {
                const events = [event1, event2, event3];

                return splunk.ingest.postEvents(events).then((response: HTTPResponse) => {
                    assert.deepEqual(response, successResponse, 'response should be expected success response.');
                });
            });
        });

        describe('Post events with bad auth token', () => {
            it('should return a 401 response', () => {
                const events = [event1, event2, event3];

                return splunkBadToken.ingest.postEvents(events).then(() => {
                    assert.fail('request with bad auth should not succeed');
                }).catch(err => {
                    assert.equal(err.httpStatusCode, 401, 'response httpStatusCode should be 401');
                });
            });
        });

        describe('Post events with unknown field name', () => {
            it('should return a 400 response', () => {
                const events = [event11];
                return splunk.ingest.postEvents(events).then(() => {
                    assert.fail('request with unknown field name should not succeed');
                }).catch(err => {
                    /**
                     * {
                     *  code: 'INVALID_DATA',
                     *  "message": "Invalid data format",
                     *  details: "json: unknown field \"unknown\""
                     * }
                     */
                    assert.equal(err.httpStatusCode, 400);
                    assert.containsAllKeys(err, ['code', 'details']);
                    assert.include(err.message, 'The request isn\'t valid.');
                    assert.include(err.details, 'unknown field');
                });
            });
        });

        describe('Post batch 10 events', () => {

            it('should create 10 batched events and send them when event10 is added', () => {
                const events: Event[] = [event1, event2, event3, event4, event5, event6, event7, event8, event9, event10];

                // 10 total events, batch size 5, batch count 10, 3000 ms
                const eb: EventBatcher = new EventBatcher(splunk.ingest, 5, 10, 3000);
                try {
                    for (const e of events) {
                        const event = e as Event;
                        const addPromise = eb.add(event) as Promise<HTTPResponse | {}>;
                        addPromise.then(response => {
                            console.log(response);
                            assert.deepEqual(response, successResponse);
                        }).catch(err => {
                            console.log(err);
                            assert.fail(err);
                        });
                    }
                } finally {
                    eb.stop().then(response => {
                        console.log('Stopping the event batcher (flushing pending events in the queue, if any):', response);
                    }).catch(err => console.log(err));
                }
            });
        });

        describe('Post batch 7 events', () => {
            it('should create 7 batched events and wait for timer to send them', () => {
                const events = [event1, event2, event3, event4, event5, event6, event7];
                // 7 total events, batch size 5, batch count 10, 3000 ms
                const eb: EventBatcher = new EventBatcher(splunk.ingest, 5, 10, 3000);
                try {
                    for (const e of events) {
                        const event = e as Event;
                        const addPromise = eb.add(event) as Promise<HTTPResponse | {}>;
                        addPromise.then(response => {
                            console.log(response);
                            assert.deepEqual(response, successResponse);
                        }).catch(err => {
                            console.log(err);
                            assert.fail(err);
                        });
                    }
                } finally {
                    eb.stop().then(response => {
                        console.log('Stopping the event batcher (flushing pending events in the queue, if any):', response);
                    }).catch(err => console.log(err));
                }
            });
        });

        describe('Post batch 3 events where batch size is large', () => {
            it('should create 3 batched events and wait for timer to send them', () => {
                const events = [event1, event2, event3];
                // 3 total events, batch size 40000, batch count 10, 3000 ms
                const eb: EventBatcher = new EventBatcher(splunk.ingest, 40000, 10, 3000);
                try {
                    for (const e of events) {
                        const event = e as Event;
                        const addPromise = eb.add(event) as Promise<HTTPResponse | {}>;
                        addPromise.then(response => {
                            console.log(response);
                        }).catch(err => console.log(err));
                    }
                } finally {
                    eb.stop().then(response => {
                        console.log('Stopping the event batcher (flushing pending events in the queue, if any):', response);
                    }).catch(err => console.log(err));
                }
            });
        });

        describe('Post batch 1 events', () => {
            it('should create 1 batch event and wait for timer to send it', () => {
                // 1 total events, batch size 50000, batch count 10, 3000 ms
                const eb: EventBatcher = new EventBatcher(splunk.ingest, 5000, 10, 3000);
                try {
                    const addPromise = eb.add(event1) as Promise<HTTPResponse | {}>;
                    addPromise.then(response => {
                        console.log(response);
                    }).catch(err => console.log(err));
                } finally {
                    eb.stop().then(response => {
                        console.log('Stopping the event batcher (flushing pending events in the queue, if any):', response);
                    }).catch(err => console.log(err));
                }
            });
        });
    });

    describe('Metrics Endpoint', () => {

        const metrics: Metric[] = [
            {
                dimensions: { Server: 'ubuntu' },
                name: 'CPU',
                unit: 'percentage',
                value: 33.89
            },
            {
                dimensions: { Region: 'us-east-1' },
                name: 'Memory',
                type: 'g',
                value: 2.27
            },
            {
                name: 'Disk',
                unit: 'GB',
                value: 10.444
            }
        ];

        const metricEvent1: MetricEvent = {
            attributes: {
                defaultDimensions: {},
                defaultType: 'g',
                defaultUnit: 'MB'
            },
            body: metrics,
            host: 'myhost',
            id: 'metric0001',
            nanos: 1,
            source: 'mysource',
            sourcetype: 'mysourcetype',
            timestamp: Date.now() // Millis since epoch
        };

        const metricEventNoDefaults = JSON.parse(JSON.stringify(metricEvent1));
        metricEventNoDefaults.attributes = {};

        const metricEvent2 = JSON.parse(JSON.stringify(metricEvent1));
        metricEvent2.id = 'metric0002';
        metricEvent2.nanos = 2;

        describe('Post metrics', () => {
            it('should return a successful response', () => splunk.ingest.postMetrics([metricEvent1]).then(response => {
                assert.property(response, 'message');
                assert.deepEqual(response, successResponse);
            }).catch(err => {
                assert.fail(`request should not have failed ${err}`);
            }));
        });

        describe('Post metrics with no defaults', () => {
            it('should return a successful response', () => splunk.ingest.postMetrics([metricEventNoDefaults]).then(response => {
                assert.property(response, 'message');
                assert.deepEqual(response, successResponse);
            }).catch(err => {
                assert.fail(`request should not have failed ${err}`);
            }));
        });

        describe('Post metrics, two events', () => {
            it('should return a successful response', () => splunk.ingest.postMetrics([metricEvent1, metricEvent2]).then(response => {
                assert.property(response, 'message');
                assert.deepEqual(response, successResponse);
            }).catch(err => {
                assert.fail(`request should not have failed ${err}`);
            }));
        });

        describe('Post metrics unknown data fields', () => {
            const metricUnknownFieldEvent = {
                attributes: {
                    defaultDimensions: {},
                    defaultType: 'g',
                    defaultUnit: 'MB'
                },
                body: metrics,
                host: 'myhost',
                id: 'metric0001',
                nanosInvalid: 1,
                source: 'mysource',
                sourcetype: 'mysourcetype',
                timestamp: Date.now() // Millis since epoch
            };
            it('should return a 400 response', () => splunk.ingest.postMetrics([metricUnknownFieldEvent]).then(
                () => {
                    assert.fail('request with unknown data field should not succeed');
                },
                err => {
                    /**
                     * {
                     *  code: 'INVALID_DATA',
                     *  "message": "Invalid data format",
                     *  details: "json: unknown field \"unknown\""
                     * }
                     */
                    assert.equal(err.httpStatusCode, 400);
                    assert.containsAllKeys(err, ['code', 'details']);
                    assert.include(err.message, 'The request isn\'t valid.');
                    assert.include(err.details, 'unknown field');
                }
            ));
        });
    });
});
