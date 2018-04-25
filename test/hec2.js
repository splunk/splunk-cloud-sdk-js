const config = require("./config");
const SplunkSSC = require("../splunk");
const { HEC2Events } = require("../hec2");
const { assert } = require("chai");

const splunk = new SplunkSSC(`http://${config.host}:8882`, config.authToken, 'TEST_TENANT');
const event1 = {'sourcetype':'splunkd','source':'mysource','time':1524599658,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.251 -0700 INFO  ServerConfig - Will generate GUID, as none found on this server.'};
const event2 = {'sourcetype':'splunkd','source':'mysource','time':1524599659,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.252 -0700 INFO  ServerConfig - My newly generated GUID is 6F386D83-ADB2-4BAB-A7AA-634B0BEA2C6A'};
const event3 = {'sourcetype':'splunkd','source':'mysource','time':1524599660,'index':'main','fields':{'fieldkey1':'fieldval1','fieldkey2':'fieldkey2'},'host':'myhost','event':'04-24-2018 12:32:23.258 -0700 INFO  ServerConfig - My server name is "9765f1bebdb4".'};
        
describe('Events Formation', () => {

    describe('Add', () => {
        var events = new HEC2Events().add(event1).add(event2).add(event3);
        assert.equal(events.events.length, 3, 'number of events should be 3');
        assert.equal(events.events[0], event1, 'events[0] should be to first added event');
        assert.equal(events.events[1], event2, 'events[1] should be to second added event');
        assert.equal(events.events[2], event3, 'events[2] should be to third added event');
        
        const expectedJSONs = '{"sourcetype":"splunkd","source":"mysource","time":1524599658,"index":"main","fields":{"fieldkey1":"fieldval1","fieldkey2":"fieldkey2"},"host":"myhost","event":"04-24-2018 12:32:23.251 -0700 INFO  ServerConfig - Will generate GUID, as none found on this server."}{"sourcetype":"splunkd","source":"mysource","time":1524599659,"index":"main","fields":{"fieldkey1":"fieldval1","fieldkey2":"fieldkey2"},"host":"myhost","event":"04-24-2018 12:32:23.252 -0700 INFO  ServerConfig - My newly generated GUID is 6F386D83-ADB2-4BAB-A7AA-634B0BEA2C6A"}{"sourcetype":"splunkd","source":"mysource","time":1524599660,"index":"main","fields":{"fieldkey1":"fieldval1","fieldkey2":"fieldkey2"},"host":"myhost","event":"04-24-2018 12:32:23.258 -0700 INFO  ServerConfig - My server name is \\"9765f1bebdb4\\"."}';
        assert.equal(events.toJSONs(), expectedJSONs, 'toJSONs() output should match expected result')
    });

});

describe('Events Endpoint', () => {
    const successResponse = {'code':0,'text':'Success'};
    
    describe('Post event', () => {
        it('should return a successful response', () => {
            return splunk.hec2.sendEvent(event1).then(response => {
                assert.deepEqual(response, successResponse, 'response should be expected success response.')
            });
        });
    });

    describe('Post events', () => {
        it('should return a successful response', () => {
            var events = new HEC2Events().add(event1).add(event2).add(event3);

            return splunk.hec2.sendEvents(events).then(response => {
                assert.deepEqual(response, successResponse, 'response should be expected success response.')
            });
        });
    });

});