const config = require("../config");
const SplunkSSC = require("../../splunk");
const EventBatcher = require("../../hec2_event_batcher");
const { assert } = require("chai");

const token = process.env.BEARER_TOKEN;
const tenantID = process.env.TENANT_ID;

const splunk = new SplunkSSC(`https://${config.novaHost}:443`, token, tenantID);
const splunkBadToken = new SplunkSSC(`https://${config.novaHost}:443`, config.invalidAuthToken, config.testTenant);

describe('integration tests for HEC2 Endpoints', () => {

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
                return splunk.hec2.createEvent(event1).then(response => {
                    assert.deepEqual(response, successResponse, 'response should be expected success response.');
                });
            });
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

        describe('Post batch 10 events', () => {

            it('should create 10 batched events and send them when event10 is added', () => {
                const events = [event1, event2, event3, event4, event5, event6, event7, event8, event9, event10];

                // 10 total events, batch size 5, batch count 10, 3000 ms
                let  eb = new EventBatcher(splunk.hec2, 5, 10, 3000);
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
                let eb = new EventBatcher(splunk.hec2, 5, 10, 3000);
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
                let eb = new EventBatcher(splunk.hec2, 50000, 10, 3000);
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
                return splunk.hec2.createRawEvent(event1).then(response => {
                    assert.deepEqual(response, successResponse, 'response should be expected success response.');
                }).catch(err => {
                    assert.fail('request should not have failed');
                });
            });
        });

});


});