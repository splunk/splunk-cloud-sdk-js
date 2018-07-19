const config = require('../config');
const SplunkSSC = require('../../splunk');
const { assert } = require('chai');

const sscHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const splunk_ssc_client = new SplunkSSC(sscHost, token, tenantID);

console.log('TESTING KVStore integration');
console.log('SSC Host: ' + sscHost);
console.log('Token: ' + token);
console.log('Tenant ID: ' + tenantID);

describe('Integration tests for KVStore Admin Endpoints', () => {
    describe('Ping Endpoint', () => {
        it('Should return a "healty" response', () => {
            return splunk_ssc_client.kvstore.getHealthStatus().then(response => {
                assert.equal(response.status, 'healthy', 'response status should be `healthy`');
            });
        });
    });
});
