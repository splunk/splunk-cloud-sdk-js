const config = require("../config");
const SplunkCloud = require("../../splunk");
const { IngestService } = require("../../ingest");
const { EventBatcher } = require("../../ingest_event_batcher");
const { assert, expect } = require("chai");

const splunk = new SplunkCloud(`http://${config.stubbyHost}:8882`, config.stubbyAuthToken, config.stubbyTenant);
const splunkBadToken = new SplunkCloud(`http://${config.stubbyHost}:8882`, config.invalidAuthToken, config.stubbyTenant);
const successResponse = { 'code': 'SUCCESS', 'message': 'Success' };
const event1 = { 'sourcetype': 'splunkd', 'source': 'mysource', 'timestamp': 1536174774569, 'attributes': { 'fieldkey1': 'fieldval1', 'fieldkey2': 'fieldkey2' }, 'host': 'myhost', 'body': 'INFO  ServerConfig - Will generate GUID, as none found on this server.' };
const event2 = { 'sourcetype': 'splunkd', 'source': 'mysource', 'timestamp': 1536174774570, 'attributes': { 'fieldkey1': 'fieldval1', 'fieldkey2': 'fieldkey2' }, 'host': 'myhost', 'body': 'INFO  ServerConfig - My newly generated GUID is 6F386D83-ADB2-4BAB-A7AA-634B0BEA2C6A' };
const event3 = { 'sourcetype': 'splunkd', 'source': 'mysource', 'timestamp': 1536174774571, 'attributes': { 'fieldkey1': 'fieldval1', 'fieldkey2': 'fieldkey2' }, 'host': 'myhost', 'body': 'INFO  ServerConfig - My server name is "9765f1bebdb4".' };
const event4 = { 'sourcetype': 'splunkd', 'source': 'mysource', 'timestamp': 1536174774572, 'attributes': { 'fieldkey1': 'fieldval1', 'fieldkey2': 'fieldkey2' }, 'host': 'myhost', 'body': 'INFO  ServerConfig - My server name is "9765f1bebdb5".' };
const event5 = { 'sourcetype': 'splunkd', 'source': 'mysource', 'timestamp': 1536174774573, 'attributes': { 'fieldkey1': 'fieldval1', 'fieldkey2': 'fieldkey2' }, 'host': 'myhost', 'body': 'INFO  ServerConfig - My server name is "9765f1bebdb6".' };
const event6 = { 'sourcetype': 'splunkd', 'source': 'mysource', 'timestamp': 1536174774574, 'attributes': { 'fieldkey1': 'fieldval1', 'fieldkey2': 'fieldkey2' }, 'host': 'myhost', 'body': 'INFO  ServerConfig - My server name is "9765f1bebdb7".' };
const event7 = { 'sourcetype': 'splunkd', 'source': 'mysource', 'timestamp': 1536174774575, 'attributes': { 'fieldkey1': 'fieldval1', 'fieldkey2': 'fieldkey2' }, 'host': 'myhost', 'body': 'INFO  ServerConfig - My server name is "9765f1bebdb8".' };
const event8 = { 'sourcetype': 'splunkd', 'source': 'mysource', 'timestamp': 1536174774576, 'attributes': { 'fieldkey1': 'fieldval1', 'fieldkey2': 'fieldkey2' }, 'host': 'myhost', 'body': 'INFO  ServerConfig - My server name is "9765f1bebdb9".' };
const event9 = { 'sourcetype': 'splunkd', 'source': 'mysource', 'timestamp': 1536174774577, 'attributes': { 'fieldkey1': 'fieldval1', 'fieldkey2': 'fieldkey2' }, 'host': 'myhost', 'body': 'INFO  ServerConfig - My server name is "9765f1bebdc0".' };
const event10 = { 'sourcetype': 'splunkd', 'source': 'mysource', 'timestamp': 1536174774578, 'attributes': { 'fieldkey1': 'fieldval1', 'fieldkey2': 'fieldkey2' }, 'host': 'myhost', 'body': 'INFO  ServerConfig - My server name is "9765f1bebdc1".' };

describe('Events Endpoint', () => {
    describe('Post events', () => {
        it('should return a successful response', () => {
            const events = [event1, event2, event3];

            return splunk.ingest.postEvents(events).then(response => {
                assert.deepEqual(response, successResponse, 'response should be expected success response.');
            });
        });
    });

    describe('Post events with bad auth token', () => {
        it('should return a 401 response', () => {
            const events = [event1, event2, event3];

            return splunkBadToken.ingest.postEvents(events).then(response => {
                assert.fail('request with bad auth should not succeed');
            }).catch(err => {
                assert.equal(err.httpStatusCode, 401, 'response status should be 401');
            });
        });
    });

    describe('Post batch 10 events', () => {

        it('should create 10 batched events and send them when event10 is added', () => {
            const events = [event1, event2, event3, event4, event5, event6, event7, event8, event9, event10];

            // 10 total events, batch size 5, batch count 10, 3000 ms
            let eb = new EventBatcher(splunk.ingest, 5, 10, 3000);
            try {
                for (let i = 0; i < events.length; i += 1) {
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
                for (let i = 0; i < events.length; i += 1) {
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

describe('Metrics Endpoint', () => {

    const metrics = [
        {
            'dimensions': { 'Server': 'ubuntu' },
            'name': 'CPU',
            'unit': 'percentage',
            'value': 33.89
        },
        {
            'dimensions': { 'Region': 'us-east-1' },
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

    describe('Post metrics', () => {
        it('should return a successful response', () => splunk.ingest.postMetrics([metricEvent1]).then(response => {
            expect(response).to.have.property('message').and.equal('Success', 'response should be expected success response.');
        }).catch(err => {
            assert.fail(`request should not have failed ${err}`);
        }));
    });

});
