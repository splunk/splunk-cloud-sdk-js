const config = require('../config');
const SplunkSSC = require('../../ts_src/splunk');
const {EventBatcher} = require('../../ts_src/ingest_event_batcher');
const { assert, expect } = require('chai');

const sscHost = config.playgroundHost;
const invalidToken = config.invalidAuthToken;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const splunk = new SplunkSSC(sscHost, token, tenantID);
const splunkBadToken = new SplunkSSC(sscHost, invalidToken, tenantID);

describe('integration tests for Ingest Endpoints', () => {

    const successResponse = {'code':0,'text':'Success'};
    const event1 = {'sourcetype':'splunkd','source':'mysource','time':1524599658,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.251 -0700 INFO  ServerConfig - Will generate GUID, as none found on this server.'};
    const event2 = {'sourcetype':'splunkd','source':'mysource','time':1524599659,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.252 -0700 INFO  ServerConfig - My newly generated GUID is 6F386D83-ADB2-4BAB-A7AA-634B0BEA2C6A'};
    const event3 = {'sourcetype':'splunkd','source':'mysource','time':1524599660,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.258 -0700 INFO  ServerConfig - My server name is "9765f1bebdb4".'};
    const event4 = {'sourcetype':'splunkd','source':'mysource','time':1524599661,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.259 -0700 INFO  ServerConfig - My server name is "9765f1bebdb5".'};
    const event5 = {'sourcetype':'splunkd','source':'mysource','time':1524599662,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.260 -0700 INFO  ServerConfig - My server name is "9765f1bebdb6".'};
    const event6 = {'sourcetype':'splunkd','source':'mysource','time':1524599663,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.261 -0700 INFO  ServerConfig - My server name is "9765f1bebdb7".'};
    const event7 = {'sourcetype':'splunkd','source':'mysource','time':1524599664,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.262 -0700 INFO  ServerConfig - My server name is "9765f1bebdb8".'};
    const event8 = {'sourcetype':'splunkd','source':'mysource','time':1524599665,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.263 -0700 INFO  ServerConfig - My server name is "9765f1bebdb9".'};
    const event9 = {'sourcetype':'splunkd','source':'mysource','time':1524599666,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.264 -0700 INFO  ServerConfig - My server name is "9765f1bebdc0".'};
    const event10 = {'sourcetype':'splunkd','source':'mysource','time':1524599667,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.265 -0700 INFO  ServerConfig - My server name is "9765f1bebdc1".'};

    describe('Events Endpoint', () => {

        describe('Post event', () => {
            it('should return a successful response', () => {
                return splunk.ingest.createEvent(event1).then(response => {
                    assert.deepEqual(response, successResponse, 'response should be expected success response.');
                });
            });
        });

        describe('Post events', () => {
            it('should return a successful response', () => {
                const events = [event1, event2, event3];

                return splunk.ingest.createEvents(events).then(response => {
                    assert.deepEqual(response, successResponse, 'response should be expected success response.');
                });
            });
        });

        describe('Post events with bad auth token', () => {
            it('should return a 401 response', () => {
                const events = [event1, event2, event3];

                splunkBadToken.ingest.createEvents(events).then(response => {
                    assert.fail('request with bad auth should not succeed');
                }).catch(err => {
                    assert.equal(err.code, 401, 'response status should be 401');
                });
            });
        });

        describe('Post batch 10 events', () => {

            it('should create 10 batched events and send them when event10 is added', () => {
                const events = [event1, event2, event3, event4, event5, event6, event7, event8, event9, event10];

                // 10 total events, batch size 5, batch count 10, 3000 ms
                let  eb = new EventBatcher(splunk.ingest, 5, 10, 3000);
                try {
                    for (let i=0; i < events.length; i+=1) {
                        eb.add(events[i]).then(response => {
                            assert.deepEqual(response, successResponse, 'response should be expected success response.');
                        });
                    }

                } finally {
                    eb.stop();
                    eb = null;
                }
            });
        });

        describe('Post batch 7 events', () => {

            it('should create 7 batched events and wait for timer to send them', () => {
                const events = [event1, event2, event3, event4, event5, event6, event7];

                // 7 total events, batch size 5, batch count 10, 3000 ms
                let eb = new EventBatcher(splunk.ingest, 5, 10, 3000);
                try {
                    for (let i=0; i < events.length; i+=1) {
                        eb.add(events[i]).then(response => {
                            assert.deepEqual(response, successResponse, 'response should be expected success response.');
                        });
                    }

                } finally {
                    eb.stop();
                    eb = null;
                }
            });
        });

        describe('Post batch 1 events', () => {

            it('should create 1 batch event and wait for timer to send it', () => {

                // 1 total events, batch size 50000, batch count 10, 3000 ms
                let eb = new EventBatcher(splunk.ingest, 50000, 10, 3000);
                try {
                    const result = eb.add(event1);
                    assert.isNull(result);
                } finally {
                    eb.stop();
                    eb = null;
                }
            });
        });
    });

    describe('Raw Endpoint', () => {

        describe('Post raw event', () => {
            it('should return a successful response', () => {
                return splunk.ingest.createRawEvent(event1).then(response => {
                    assert.deepEqual(response, successResponse, 'response should be expected success response.');
                }).catch(err => {
                    assert.fail(`request should not have failed ${err}`);
                });
            });
        });

    });

    describe('Metrics Endpoint', () => {

        const metrics = [
            {
                'dimensions': {'Server': 'ubuntu'},
                'name': 'CPU',
                'unit': 'percentage',
                'value': 33.89
            },
            {
                'dimensions': {'Region': 'us-east-1'},
                'name': 'Memory',
                'type': 'g',
                'value': 2.27
            },
            {
                'name': 'Disk',
                'unit': 'GB',
                'value': 10.444
            }
        ];

        const metricEvent1 = {
            'attributes': {
                'defaultDimensions': {},
                'defaultType': 'g',
                'defaultUnit': 'MB'
            },
            'body': metrics,
            'host': 'myhost',
            'id': 'metric0001',
            'nanos': 1,
            'source': 'mysource',
            'sourcetype': 'mysourcetype',
            'timestamp': 1529020697
        };

        const metricEventNoDefaults = JSON.parse(JSON.stringify(metricEvent1));
        metricEventNoDefaults.attributes = {};

        const metricEvent2 = JSON.parse(JSON.stringify(metricEvent1));
        metricEvent2.id = 'metric0002';
        metricEvent2.nanos = 2;

        describe('Post metrics', () => {
            it('should return a successful response', () => splunk.ingest.createMetrics([metricEvent1]).then(response => {
                expect(response).to.have.property('message').and.equal('Success', 'response should be expected success response.');
            }).catch(err => {
                assert.fail(`request should not have failed ${err}`);
            }));
        });

        describe('Post metrics with no defaults', () => {
            it('should return a successful response', () => splunk.ingest.createMetrics([metricEventNoDefaults]).then(response => {
                expect(response).to.have.property('message').and.equal('Success', 'response should be expected success response.');
            }).catch(err => {
                assert.fail(`request should not have failed ${err}`);
            }));
        });

        describe('Post metrics, two events', () => {
            it('should return a successful response', () => splunk.ingest.createMetrics([metricEvent1, metricEvent2]).then(response => {
                expect(response).to.have.property('message').and.equal('Success', 'response should be expected success response.');
            }).catch(err => {
                assert.fail(`request should not have failed ${err}`);
            }));
        });

        describe('Post metrics bad format', () => {
            it('should return a 400 response', () => splunk.ingest.createMetrics({'invalid': 'data format'}).then(
                () => {
                    assert.fail('request with bad data format should not succeed')
                },
                err => {
                    assert.equal(err.code, 400, 'response status should be 400');

                    // {'code':'INVALID_DATA','message':'Invalid data format'}
                    const errorBody = err.source;
                    expect(errorBody).to.have.property("code");
                    expect(errorBody.code).to.match(/INVALID_DATA/);
                    expect(errorBody).to.have.property("message");
                    expect(errorBody.message).to.match(/Invalid/);
                }
            ));
        });

    });

});
