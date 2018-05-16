const config = require('../config');
const SplunkSSC = require('../../src/splunk');
const {assert} = require('chai');

const token = process.env.BEARER_TOKEN;
const tenantID = process.env.TENANT_ID;

const splunk = new SplunkSSC(`https://${config.novaHost}:443`, token, tenantID);
const splunkWithIncorrectCredentials = new SplunkSSC(`https://${config.novaHost}:443`, config.invalidAuthToken, config.testTenant);

// Scenario 1:
// Integration test for Tenant User endpoints
// 1. Add new users to the tenant using Patch method
// 2. Get and validate the newly added users
// 3. Add an already present user to the tenant, should throw 405 Method Not Allowed error
// 4. Add a user list with duplicate entries, should throw 405 Method Not Allowed error
// 5. Delete one of the users and validate the deletion process
// 6. Delete a user that is currently not present in the tenant, should throw 405 Method Not Allowed error
// 7. Replace the existing list with new list of users
// 8. Get and validate the replaced set of users
// 9. Retrieve user list with an invalid token, should throw 401 Unauthorized error
// 10. Replace current tenant user list with a list containing duplicate records, should throw 500 Internal error
describe('integration tests for Identity Tenant User Endpoints', () => {
    const testReplaceUserList1 =
        [
            {
                "id": "integration_test@bofa.com"
            }
        ];

    describe('Add new users to the tenant using the Patch API and validate', () => {
        const testPostUserList1 =
            [
                {
                    "id": "integration_test@amex.com"
                },
                {
                    "id": "integration_test@chase.com"
                },
                {
                    "id": "integration_test@bofa.com"
                },
                {
                    "id": "integration_test@discover.com"
                },
                {
                    "id": "integration_test@citi.com"
                }
            ];

        it('should add a list of new users to the tenant', () => splunk.identity.addTenantUsers(tenantID, testPostUserList1).then(response => {
            assert(!response)
        }));

        it('should return the list of newly added tenants', () => splunk.identity.getTenantUsers(tenantID).then(data => {
            assert.typeOf(data, 'Array', 'response should be an array');
            assert.isAtLeast(data.length, 5);
            data.forEach(user => {
                assert('id' in user, 'Returned user should contain an ID')
            });
        }));
    });

    describe('Add new users to the tenant using the Patch API - Error cases', () => {
        const testPostUserListError1 =
            [
                {
                    "id": "integration_test@amex.com"
                }
            ];

        const testPostUserListError2 =
            [
                {
                    "id": "integration_test@db.com"
                },
                {
                    "id": "integration_test@db.com"
                }
            ];

        it('should throw a 405 Method Not Allowed response when adding an already present user to the tenant', () => splunk.identity.addTenantUsers(tenantID, testPostUserListError1).then(success =>
            assert.fail(success), err => assert.equal(err.code, "405")
        ));

        it('should throw a 405 Method Not Allowed response when the user list to be added has duplicate entries', () => splunk.identity.addTenantUsers(tenantID, testPostUserListError2).then(success =>
            assert.fail(success), err => assert.equal(err.code, "405")
        ));
    });

    describe('Delete selected users from the tenant using the Delete API', () => {
        const testDeleteUserList1 =
            [
                {
                    "id": "integration_test@bofa.com"
                },
                {
                    "id": "integration_test@discover.com"
                },
                {
                    "id": "integration_test@citi.com"
                }
            ];

        it('should delete the selected users from the tenant', () => splunk.identity.deleteTenantUsers(tenantID, testDeleteUserList1).then(response => {
            assert(!response)
        }));

        it('should return a list of users excluding the deleted records', () => splunk.identity.getTenantUsers(tenantID).then(data => {
            assert.typeOf(data, 'Array', 'response should be an array');
            assert.isAtLeast(data.length, 2);
            data.forEach(user => {
                assert('id' in user, 'Returned user should contain an ID')
            });
        }));
    });

    describe('Delete selected users from the tenant using the Delete API - Error case', () => {
        const testDeleteUserListError1 =
            [
                {
                    "id": "integration_test@pnb.com"
                },
                {
                    "id": "integration_test@chase.com"
                }
            ];

        it('should throw a 405 Method Not Allowed response when deleting a user not currently a part of the tenant', () => splunk.identity.deleteTenantUsers(tenantID, testDeleteUserListError1).then(success =>
            assert.fail(success), err => assert.equal(err.code, "405")
        ));
    });

    describe('Replace the current users from the tenant using the Put API', () => {
        it('should replace the current users with the new users', () => splunk.identity.replaceTenantUsers(tenantID, testReplaceUserList1).then(response => {
            assert(!response)
        }));

        it('should return a new list of users that replaced the existing users', () => splunk.identity.getTenantUsers(tenantID).then(data => {
            assert.typeOf(data, 'Array', 'response should be an array');
            assert.isAtLeast(data.length, 1);
            data.forEach(user => {
                assert('id' in user, 'Returned user should contain an ID')
            });
        }));
    });

    describe('Get the current users from the tenant using the Get API - Error case, unauthorized user', () => {
        it('should throw a 401 Unauthorized response when retrieving users list due to invalid auth Token', () => splunkWithIncorrectCredentials.identity.getTenantUsers(tenantID).then(success =>
            assert.fail(success), err => assert.equal(err.code, "401")
        ));
    });

    describe('Replace the current users from the tenant using the Put API - Error case', () => {
        const testReplaceUserListError1 =
            [
                {
                    "id": "integration_test@cf.com"
                },
                {
                    "id": "integration_test@cf.com"
                }
            ];
        it('should throw a 500 Internal server error when trying to replace current tenant user list with a list containing duplicate records', () => splunk.identity.replaceTenantUsers(tenantID, testReplaceUserListError1).then(success =>
            assert.fail(success), err => assert.equal(err.code, "500")
        ));
    });

    // clean up the test tenant users else would get 405 method not allowed error
    after(() => {
        splunk.identity.deleteTenantUsers(tenantID, testReplaceUserList1)
    });
});

// Scenario 2:
// Integration test for Tenant endpoints
// 1. Create a new test tenant and validate
// 2. Post a tenant in invalid format and validate that a 422 error is thrown
// 3. Delete the newly created test tenant and validate
// 4. Delete a tenant which is currently not present in the user-profile and validate that a 404 error is thrown
describe('integration tests for Identity Tenant Endpoints', () => {
    const integrationTestTenantID = "integration_test_tenant"

    describe('Create a new tenant using the Post API and validate - Good and Bad cases', () => {
        const testPostTenant1 =
            {
                "tenantId": integrationTestTenantID
            }

        const testPostTenantError1 =
            {
                "tenantId1": integrationTestTenantID
            }

        it('should create a new tenant', () => splunk.identity.createTenant(testPostTenant1).then(response => {
            assert(!response)
        }));

        it('should return the list of newly added test tenant', () => splunk.identity.getUserProfile().then(data => {
            assert.typeOf(data, 'Object', 'response should be an object');
            assert(data.tenantMemberships.includes(integrationTestTenantID))
        }));

        it('should throw a 422 Unprocessable entry error response when the tenant creation request is in bad format', () => splunk.identity.createTenant(testPostTenantError1).then(success =>
            assert.fail(success), err => assert.equal(err.code, "422")
        ));
    });

    describe('Delete the test tenant using the Delete API and validate - Good and Bad cases', () => {
        const testDeleteTenant = "integration_test_delete_tenant"

        it('should delete the selected test tenant from user', () => splunk.identity.deleteTenant(integrationTestTenantID).then(response => {
            assert(!response)
        }));

        it('should return a user profile with test tenant deleted from the tenant memberships list', () => splunk.identity.getUserProfile().then(data => {
            assert.typeOf(data, 'Object', 'response should be an object');
            assert(!data.tenantMemberships.includes(integrationTestTenantID))
        }));

        it('should throw a 404 Not Found error response when deleting a tenant currently not present in a user profile', () => splunk.identity.deleteTenant(testDeleteTenant).then(success =>
            assert.fail(success), err => assert.equal(err.code, "404")
        ));
    });
});
