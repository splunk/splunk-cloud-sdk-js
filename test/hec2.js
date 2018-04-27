const config = require("./config");
const SplunkSSC = require("../src/splunk");
const { HEC2Service } = require("../src/hec2");
const { assert } = require("chai");

const splunk = new SplunkSSC(`http://${config.host}:8882`, config.authToken, 'TEST_TENANT');
const event1 = {'sourcetype':'splunkd','source':'mysource','time':1524599658,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.251 -0700 INFO  ServerConfig - Will generate GUID, as none found on this server.'};
const event2 = {'sourcetype':'splunkd','source':'mysource','time':1524599659,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.252 -0700 INFO  ServerConfig - My newly generated GUID is 6F386D83-ADB2-4BAB-A7AA-634B0BEA2C6A'};
const event3 = {'sourcetype':'splunkd','source':'mysource','time':1524599660,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.258 -0700 INFO  ServerConfig - My server name is "9765f1bebdb4".'};

describe('Events Formation', () => {

    describe('Output', () => {
        it('should output to expected concatenated string of JSON', () => {
            var events = [event1, event2, event3];

            const expectedJSONs = '{"sourcetype":"splunkd","source":"mysource","time":1524599658,"index":"main","fields":{"fieldkey1":"fieldval1","fieldkey2":"fieldkey2"},"host":"myhost","event":"04-24-2018 12:32:23.251 -0700 INFO  ServerConfig - Will generate GUID, as none found on this server."}{"sourcetype":"splunkd","source":"mysource","time":1524599659,"index":"main","fields":{"fieldkey1":"fieldval1","fieldkey2":"fieldkey2"},"host":"myhost","event":"04-24-2018 12:32:23.252 -0700 INFO  ServerConfig - My newly generated GUID is 6F386D83-ADB2-4BAB-A7AA-634B0BEA2C6A"}{"sourcetype":"splunkd","source":"mysource","time":1524599660,"index":"main","fields":{"fieldkey1":"fieldval1","fieldkey2":"fieldkey2"},"host":"myhost","event":"04-24-2018 12:32:23.258 -0700 INFO  ServerConfig - My server name is \\"9765f1bebdb4\\"."}';
            assert.equal(HEC2Service.eventsToJSONs(events), expectedJSONs, 'HEC2Service.eventsToJSONs() output should match expected result');
        });
    });

});

describe('Events Endpoint', () => {
    const successResponse = {'code':0,'text':'Success'};

    describe('Post event', () => {
        it('should return a successful response', () => {
            return splunk.hec2.createEvent(event1).then(response => {
                assert.deepEqual(response, successResponse, 'response should be expected success response.')
            });
        });
    });

    describe('Post events', () => {
        it('should return a successful response', () => {
            var events = [event1, event2, event3];

            return splunk.hec2.createEvents(events).then(response => {
                assert.deepEqual(response, successResponse, 'response should be expected success response.')
            });
        });
    });

});
