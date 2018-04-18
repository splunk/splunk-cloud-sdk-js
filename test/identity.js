/* eslint-disable */
const config = require('./config');
const { SSCProxy } = require('../client');
const Splunk = require('../splunk');
let assert = require('chai').assert;

let splunk = new Splunk(
    `http://${config.host}:8882`,
    'eyJraWQiOiJTVGR3WXFCVnFQZlpkeXNNUTQyOElEWTQ5VzRZQzN5MzR2ajNxSl9LRjlvIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULkRaRHJwZkwzZFBQRnMzXzc2b2ZERlB3WUFLTGo1QzgzNmptczQ0Rmh0RlEiLCJpc3MiOiJodHRwczovL3NwbHVuay1jaWFtLm9rdGEuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTUyNDAwNTEyOCwiZXhwIjoxNTI0MDA4NzI4LCJjaWQiOiIwb2FwYmcyem1MYW1wV2daNDJwNiIsInVpZCI6IjAwdTEwYW14MWxJck9ZbGtnMnA3Iiwic2NwIjpbInByb2ZpbGUiLCJvcGVuaWQiLCJlbWFpbCJdLCJzdWIiOiJkbmd1eWVuQHNwbHVuay5jb20ifQ.DQI7rj_3q9GvRKp-LgJ130p64bhEOnjAOFIUzu7VN7chFH645Pu5IJ--ucxTyOIO2JbY3pd5LoX7AFe7XMGvYWeHkreg3-JucDwMMdKIiwIEcjcTL0i4KpDjtaIkaE6KEgtPDR5vDlrhEM0capK2LQnceCC3RY8Md_BGLNuotHuwPCw0OnXVdoqQkfkyIoCt8ncow0XpUS6hnWEuBSqew-I6nxrw8Z6v8tg-zmx-2r6QeiQJBcLCkOz7U2ViC3hmCARch37uMcc8lRSGGn0eq8dcl3Bfo66U88vzb4moOJe40cCPhjoXPLFuUlzgM5AlvXdIhvkd4i9u2so2CrCNpQ'
);

describe('Identity Endpoints', () => {
    describe('Get', () => {
        it('should return a user profile', () => {
            return splunk.identity.getUserProfile().then(data => {
                assert.typeOf(data, 'object', 'response should be an object');
                assert('email' in data, 'devtest@splunk.com');
                assert('firstName' in data, 'Dev');
                assert('id' in data, 'devtest@splunk.com');
                assert('lastName' in data, 'Test');
                assert('locale' in data, 'en-US');
                assert('name' in data, 'Dev Test');
                assert('tenantMemberships' in data, ['devtestTenant']);
            });
        });
    });

    describe('Post', () => {
        it('should return no response body', () => {
            const postBody = { tenantId: 'devtestTenant' };
            return splunk.identity.createTenant(postBody).then(response => {
                assert(!response);
            });
        });
    });
});
