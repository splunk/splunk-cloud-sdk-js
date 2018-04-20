const config = require('./config');
const SplunkSSC = require('../splunk');
const {assert} = require('chai');

const splunk = new SplunkSSC(`http://${config.host}:8882`, config.authToken, 'TEST_TENANT');

describe('Identity Endpoints', () => {

    describe('Get', () => {
        it('should return a user profile', () => splunk.identity.getUserProfile().then(data => {
            assert.typeOf(data, 'object', 'response should be an object');
            assert('email' in data, 'devtest@splunk.com');
            assert('firstName' in data, 'Dev');
            assert('id' in data, 'devtest@splunk.com');
            assert('lastName' in data, 'Test');
            assert('locale' in data, 'en-US');
            assert('name' in data, 'Dev Test');
            assert('tenantMemberships' in data, ['devtestTenant']);
        }));
    });

    describe('Post', () => {
        it('should return no response body', () => {
            const postBody = { tenantId: 'devtestTenant' };
            return splunk.identity.createTenant(postBody).then(response => {
                assert(!response);
            });
        });
    });

    describe('Delete', () => {
        it('should return no response body', () => {
            return splunk.identity.deleteTenant('devtestTenant').then(response => {
                assert(!response);
            });
        });
    });




});
