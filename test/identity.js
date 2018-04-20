/* eslint-disable */
const config = require('./config');
const Splunk = require('../splunk');
let assert = require('chai').assert;

let splunk = new Splunk(`http://${config.host}:8882`, config.authToken, 'TEST_TENANT');

describe('Identity Endpoints', () => {

    describe('Get a user profile', () => {
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

    describe('Post a new tenant', () => {
        it('should return no response body', () => {
            const postBody = {tenantId: 'devtestTenant'};
            return splunk.identity.createTenant(postBody).then(response => {
                assert(!response);
            });
        });
    });

    describe('Delete a tenant', () => {
        it('should return no response body', () => {
            return splunk.identity.deleteTenant('devtestTenant').then(response => {
                assert(!response);
            });
        });
    });

    describe('Get a list of users in tenant', () => {
        it('should return a list of users', () => {
            return splunk.identity.getTenantUsers('devtestTenant').then(data => {
                assert.typeOf(data, 'Array', 'response should be an array');
                assert('id' in data[0], 'devtest1@splunk.com');
            });
        });
    });

    // TODO(Parul): Replace isn't working as expected, contact Cliff's team
    describe('Replace current users in tenant with new users', () => {
        it('should return no response body', () => {
            const usersList = [
                {
                    "id": "devtest2@splunk.com"
                },
                {
                    "id": "devtest3@splunk.com"
                },
                {
                    "id": "devtest4@splunk.com"
                },
                {
                    "id": "devtest5@splunk.com"
                }
            ];
            return splunk.identity.replaceTenantUsers('devtestTenant', usersList).then(response => {
                assert(!response);
            });
        });
    });

    describe('Add a list of users in tenant', () => {
        it('should return no response body', () => {
            const usersList = [
                {
                    "id": "devtest7@splunk.com"
                },
                {
                    "id": "devtest8@splunk.com"
                }
            ];
            return splunk.identity.addTenantUsers('devtestTenant', usersList).then(response => {
                assert(!response);
            });
        });
    });

    describe('Delete a list of users in tenant', () => {
        it('should return no response body', () => {
            const usersList = [
                {
                    "id": "devtest4@splunk.com"
                },
                {
                    "id": "devtest5@splunk.com"
                }
            ];
            return splunk.identity.deleteTenantUsers('devtestTenant', usersList).then(response => {
                assert(!response);
            });
        });
    });

    // describe('Delete a user in tenant (user absent in tenant)', () => {
    //     it('should return 405 status code - some users are not members of tenant demoTenant', () => {
    //         const usersList = [
    //             {
    //                 "id": "devtest6@splunk.com"
    //             }
    //         ];
    //         return splunk.identity.deleteTenantUsers('devtestTenant', usersList).then(response => {
    //         });
    //     });
    // });

});
