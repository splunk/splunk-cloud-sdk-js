const config = require("./config");
const SplunkSSC = require("../src/splunk");
const { HEC2Service } = require("../src/hec2");
const { assert } = require("chai");

const splunk = new SplunkSSC(`http://${config.host}:8882`, config.authToken, 'TEST_TENANT');
const splunkBadToken = new SplunkSSC(`http://${config.host}:8882`, "BAD_TOKEN", 'TEST_TENANT');
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
const event11 = {'sourcetype':'splunkd','source':'mysource','time':1524599668,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.266 -0700 INFO  ServerConfig - My server name is "9765f1bebdc2".'};
const event12 = {'sourcetype':'splunkd','source':'mysource','time':1524599669,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.267 -0700 INFO  ServerConfig - My server name is "9765f1bebdc3".'};
const event13 = {'sourcetype':'splunkd','source':'mysource','time':1524599670,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.268 -0700 INFO  ServerConfig - My server name is "9765f1bebdc5".'};
const event14 = {'sourcetype':'splunkd','source':'mysource','time':1524599671,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.269 -0700 INFO  ServerConfig - My server name is "9765f1bebdc6".'};
const event15 = {'sourcetype':'splunkd','source':'mysource','time':1524599672,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.270 -0700 INFO  ServerConfig - My server name is "9765f1bebdc7".'};
const event16 = {'sourcetype':'splunkd','source':'mysource','time':1524599673,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.271 -0700 INFO  ServerConfig - My server name is "9765f1bebdc8".'};
const event17 = {'sourcetype':'splunkd','source':'mysource','time':1524599674,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.272 -0700 INFO  ServerConfig - My server name is "9765f1bebdc9".'};
const event18 = {'sourcetype':'splunkd','source':'mysource','time':1524599675,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.273 -0700 INFO  ServerConfig - My server name is "9765f1bebdd0".'};
const event19 = {'sourcetype':'splunkd','source':'mysource','time':1524599676,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.274 -0700 INFO  ServerConfig - My server name is "9765f1bebdd1".'};
const event20 = {'sourcetype':'splunkd','source':'mysource','time':1524599677,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.275 -0700 INFO  ServerConfig - My server name is "9765f1bebdd2".'};
const event21 = {'sourcetype':'splunkd','source':'mysource','time':1524599678,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.276 -0700 INFO  ServerConfig - My server name is "9765f1bebdd3".'};
const event22 = {'sourcetype':'splunkd','source':'mysource','time':1524599679,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.277 -0700 INFO  ServerConfig - My server name is "9765f1bebdd4".'};
const event23 = {'sourcetype':'splunkd','source':'mysource','time':1524599680,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.278 -0700 INFO  ServerConfig - My server name is "9765f1bebdd5".'};
const event24 = {'sourcetype':'splunkd','source':'mysource','time':1524599681,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.279 -0700 INFO  ServerConfig - My server name is "9765f1bebdd6".'};
const event25 = {'sourcetype':'splunkd','source':'mysource','time':1524599682,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.280 -0700 INFO  ServerConfig - My server name is "9765f1bebdd7".'};
const event26 = {'sourcetype':'splunkd','source':'mysource','time':1524599683,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.281 -0700 INFO  ServerConfig - My server name is "9765f1bebdd8".'};
const event27 = {'sourcetype':'splunkd','source':'mysource','time':1524599684,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.282 -0700 INFO  ServerConfig - My server name is "9765f1bebdd9".'};
const event28 = {'sourcetype':'splunkd','source':'mysource','time':1524599685,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.283 -0700 INFO  ServerConfig - My server name is "9765f1bebde0".'};
const event29 = {'sourcetype':'splunkd','source':'mysource','time':1524599686,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.284 -0700 INFO  ServerConfig - My server name is "9765f1bebde1".'};
const event30 = {'sourcetype':'splunkd','source':'mysource','time':1524599687,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.285 -0700 INFO  ServerConfig - My server name is "9765f1bebde2".'};
const event31 = {'sourcetype':'splunkd','source':'mysource','time':1524599688,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.286 -0700 INFO  ServerConfig - My server name is "9765f1bebde3".'};
const event32 = {'sourcetype':'splunkd','source':'mysource','time':1524599689,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.287 -0700 INFO  ServerConfig - My server name is "9765f1bebde4".'};
const event33 = {'sourcetype':'splunkd','source':'mysource','time':1524599690,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.288 -0700 INFO  ServerConfig - My server name is "9765f1bebde5".'};
const event34 = {'sourcetype':'splunkd','source':'mysource','time':1524599691,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.289 -0700 INFO  ServerConfig - My server name is "9765f1bebde6".'};
const event35 = {'sourcetype':'splunkd','source':'mysource','time':1524599692,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.290 -0700 INFO  ServerConfig - My server name is "9765f1bebde7".'};
const event36 = {'sourcetype':'splunkd','source':'mysource','time':1524599693,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.291 -0700 INFO  ServerConfig - My server name is "9765f1bebde8".'};
const event37 = {'sourcetype':'splunkd','source':'mysource','time':1524599694,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.292 -0700 INFO  ServerConfig - My server name is "9765f1bebde9".'};


describe('Events Formation', () => {

    describe('Output', () => {
        it('should output to expected concatenated string of JSON', () => {
            const events = [event1, event2, event3];

            const expectedJSONs = '{"sourcetype":"splunkd","source":"mysource","time":1524599658,"index":"main","fields":{"fieldkey1":"fieldval1","fieldkey2":"fieldkey2"},"host":"myhost","event":"04-24-2018 12:32:23.251 -0700 INFO  ServerConfig - Will generate GUID, as none found on this server."}{"sourcetype":"splunkd","source":"mysource","time":1524599659,"index":"main","fields":{"fieldkey1":"fieldval1","fieldkey2":"fieldkey2"},"host":"myhost","event":"04-24-2018 12:32:23.252 -0700 INFO  ServerConfig - My newly generated GUID is 6F386D83-ADB2-4BAB-A7AA-634B0BEA2C6A"}{"sourcetype":"splunkd","source":"mysource","time":1524599660,"index":"main","fields":{"fieldkey1":"fieldval1","fieldkey2":"fieldkey2"},"host":"myhost","event":"04-24-2018 12:32:23.258 -0700 INFO  ServerConfig - My server name is \\"9765f1bebdb4\\"."}';
            assert.equal(HEC2Service.eventsToJSONs(events), expectedJSONs, 'HEC2Service.eventsToJSONs() output should match expected result');
        });
    });

});

describe('Events Endpoint', () => {

    describe('Post event', () => {
        it('should return a successful response', () => splunk.hec2.createEvent(event1).then(response => {
            assert.deepEqual(response, successResponse, 'response should be expected success response.');
        }));
    });

    describe('Post events', () => {
        it('should return a successful response', () => {
            const events = [event1, event2, event3];

            return splunk.hec2.createEvents(events).then(response => {
                assert.deepEqual(response, successResponse, 'response should be expected success response.');
            });
        });
    });

    describe('Post events with bad auth token', () => {
        it('should return a 401 response', () => {
            const events = [event1, event2, event3];

            splunkBadToken.hec2.createEvents(events).then(response => {
                assert.fail('request with bad auth should not succeed');
            }).catch(err => {
                assert.equal(err.code, 401, 'response status should be 401');
            });
        });
    });

    describe('Raw Endpoint', () => {

        describe('Post raw event', () => {
            it('should return a successful response', () => splunk.hec2.createRawEvent(event1).then(response => {
                assert.deepEqual(response, successResponse, 'response should be expected success response.');
            }).catch(err => {
                assert.fail('request should not have failed');
            }));
        });

    });

    describe('Post batch 37 events', () => {
        const results = [];

        it('should create batch events and send them periodically.', () => {
            const events = [event1, event2, event3, event4, event5, event6, event7, event8, event9, event10, event11, event12,
                event13, event14, event15, event16, event17, event18, event19, event20, event21, event22, event23, event24,
                event25, event26, event27, event28, event29, event30, event31, event32, event33, event34, event35, event36, event37];

            // 37 total events, batch size 10, 1000 ms
            splunk.hec2.createBatchEvents(events, 10, 3000, results);

            assert.equal(results.length, 4, 'response should return 4 results');
            for (let i = 0; i < results.length; i += 1) {
                results[i].then(response => {
                    assert.deepEqual(response, successResponse, 'response should be expected success response.')
                });
            }

        });
    });

    describe('Post batch 10 events', () => {
        const results = [];

        it('should create 1 batch event and send it right away', () => {
            const events = [event1, event2, event3, event4, event5, event6, event7, event8, event9, event10];

            // 10 total events, batch size 10, 1000 ms
            splunk.hec2.createBatchEvents(events, 10, 1000, results);

            assert.equal(results.length, 1, 'response should return 1 result');
            for (let i = 0; i < results.length; i += 1) {
                results[i].then(response => {
                    assert.deepEqual(response, successResponse, 'response should be expected success response')
                });
            }

        });
    });

    describe('Post batch 7 events', () => {
        const results = [];

        it('should create 1 batch event and send it right away', () => {
            const events = [event1, event2, event3, event4, event5, event6, event7];

            // 7 total events, batch size 10, 1000 ms
            splunk.hec2.createBatchEvents(events, 10, 1000, results);

            assert.equal(results.length, 1, 'response should return 1 result');
            for (let i = 0; i < results.length; i += 1) {
                results[i].then(response => {
                    assert.deepEqual(response, successResponse, 'response should be expected success response')
                });
            }

        });
    });

    describe('Throws error', () => {
        const events = [event1, event2, event3];

        it('should throw an error when events is null', () => {
            assert.throws(() => {
                splunk.hec2.createBatchEvents(null, 10, 3000, [])
            }, Error, 'Invalid arguments for batch event processing');
        });

        it('should throw an error when events is empty', () => {
            assert.throws(() => {
                splunk.hec2.createBatchEvents([], 10, 3000, [])
            }, Error, 'Invalid arguments for batch event processing');
        });

        it('should throw an error when batchSize is negative', () => {
            assert.throws(() => {
                splunk.hec2.createBatchEvents(events, -1, 3000, [])
            }, Error, 'Invalid arguments for batch event processing');
        });

        it('should throw an error when interval is negative', () => {
            assert.throws(() => {
                splunk.hec2.createBatchEvents(events, 10, -5, [])
            }, Error, 'Invalid arguments for batch event processing');
        });

        it('should throw an error when results is null', () => {
            assert.throws(() => {
                splunk.hec2.createBatchEvents(events, 10, 3000, null)
            }, Error, 'Invalid arguments for batch event processing');
        });

    });

});
