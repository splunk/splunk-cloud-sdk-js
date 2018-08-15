const config = require('../config');
const SplunkSSC = require('../../splunk');
const { assert } = require('chai');

const sscHost = config.playgroundHost;
const invalidToken = config.invalidAuthToken;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const splunk = new SplunkSSC(sscHost, token, tenantID);
const splunkWithIncorrectCredentials = new SplunkSSC(sscHost, invalidToken, tenantID);

function waitForStatusToEnd(tenant, currentStatus) {
    return new Promise((resolve, reject) => {
        try {
            splunk.identity.getUserProfile().then((profile) => {
                const tenantStatus = profile.tenantDetails.find((obj) => obj.tenantId === tenant);
                if (tenantStatus.status === currentStatus) {
                    setTimeout(() => resolve(waitForStatusToEnd(tenant, currentStatus)), 500);
                } else {
                    resolve(tenantStatus.status);
                }
            });
        } catch (e) {
            console.warn(`Error in waitForStatusToEnd(), err: ${e}`);
            reject(currentStatus);
        }
    });
}
// Scenario 1:
// Integration test for Tenant User endpoints
// 1. Add new users to the tenant using addTenantUsers() method
// 2. Get and validate the newly added users using getTenantUsers() method
// 3. Add an already present user to the tenant, should throw 405 Method Not Allowed error
// 4. Add a user list with duplicate entries, should throw 405 Method Not Allowed error
// 5. Delete one of the users and validate the deletion process using deleteTenantUsers() method
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

    describe('Add new users to the tenant and validate', () => {
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

    describe('Add new users to the tenant - Error cases', () => {
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

    describe('Delete selected users from the tenant', () => {
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

    describe('Delete selected users from the tenant - Error case', () => {
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

    describe('Replace the current users from the tenant', () => {
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

    describe('Get the current users from the tenant - Error case, unauthorized user', () => {
        it('should throw a 401 Unauthorized response when retrieving users list due to invalid auth Token', () => splunkWithIncorrectCredentials.identity.getTenantUsers(tenantID).then(success =>
            assert.fail(success), err => assert.equal(err.code, "401")
        ));
    });

    describe('Replace the current users from the tenant - Error case', () => {
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
// 1. Create a new test tenant using createTenant() method and validate using getUserProfile() method
// 2. Post a tenant in invalid format and validate that a 422 error is thrown
// 3. Delete the newly created test tenant using deleteTenant() method and validate using getUserProfile() method
// 4. Delete a tenant which is currently not present in the user-profile and validate that a 404 error is thrown
describe('integration tests for Identity Tenant Endpoints', () => {
    const integrationTestTenantID = `${Date.now()}-sdk-integration`;

    describe('Create a new tenant and validate - Good and Bad cases', () => {
        const testPostTenant1 = {
            tenantId: integrationTestTenantID,
        };

        const testPostTenantError1 = {
            tenantId1: integrationTestTenantID,
        };

        it('should create a new tenant', () =>
            splunk.identity.createTenant(testPostTenant1).then(response => {
                assert(response.status === 'provisioning');
            }));

        it('should return the list of newly added test tenant using the tenantId scope', () =>
            splunk.identity.getUserProfile(integrationTestTenantID).then(data => {
                assert.typeOf(data, 'Object', 'response should be an object');
                assert(data.tenantMemberships.includes(integrationTestTenantID));
            }));

        it('should return the list of newly added test tenant using the system scope', () =>
            splunk.identity.getUserProfile().then(data => {
                assert.typeOf(data, 'Object', 'response should be an object');
                assert(data.tenantMemberships.includes(integrationTestTenantID));
            }));

        it('should throw a 422 Unprocessable entry error response when the tenant creation request is in bad format', () =>
            splunk.identity
                .createTenant(testPostTenantError1)
                .then(success => assert.fail(success), err => assert.equal(err.code, '422')));
    });

    describe('Delete the test tenant and validate - Good and Bad cases', () => {
        const testDeleteTenant = 'integration_test_delete_tenant';

        it('should delete the selected test tenant from user', () => 
            waitForStatusToEnd(integrationTestTenantID, 'provisioning').then((tenantStatus) => {
                assert.notEqual(tenantStatus, 'provisioning');
                splunk.identity.deleteTenant(integrationTestTenantID).then(response => {
                    assert(!response);
                }, (err) => {
                    console.warn(`Failed to delete tenant during test, err: ${err}`);
                });
            })
        );
        
        it('should return a user profile with the test tenant in the "deleting" state', () =>
            splunk.identity.getUserProfile(tenantID).then(data => {
                assert.typeOf(data, 'Object', 'response should be an object');

                let tenantDetails = data['tenantDetails'];

                assert.typeOf(tenantDetails, 'Array', 'tenantDetails should be an array');

                let matchingArray = tenantDetails.filter(element => {
                    return element['tenantId'] == integrationTestTenantID;
                });

                assert.equal(
                    matchingArray.length,
                    1,
                    `there should only be one ${integrationTestTenantID}`,
                );

                let testTenantDetails = matchingArray[0];

                assert.typeOf(
                    testTenantDetails,
                    'Object',
                    'the tenant information should be an object',
                );
                assert.equal(
                    testTenantDetails['status'],
                    'deleting',
                    'the tenant should be in the process of deleting',
                );
            }));

        it('should throw a 422 Unprocessable Entity error response when deleting a tenant currently not present in a user profile', () =>
            splunk.identity
                .deleteTenant(testDeleteTenant)
                .then(success => assert.fail(success), err => assert.equal(err.code, '422')));
    });

    after(() => {
        // Delete tenant (if not deleted above) after all tests in this block have run
        splunk.identity.getUserProfile().then((profile) => {
            const tenantStatus = profile.tenantDetails.find((obj) => obj.tenantId === integrationTestTenantID);
            if (tenantStatus.status === 'provisioning') {
                console.warn(`Integration tenant ${integrationTestTenantID} still in provisioning status after tests have run. Attempting to delete now...`);
                return waitForStatusToEnd(integrationTestTenantID, 'provisioning')
                    .then(response => response, err => err)
                    .then((status) => {
                        if (status === 'provisioning') {
                            throw new Error(`UNABLE TO DELETE TENANT: ${integrationTestTenantID} - stuck in provisioning status.`);
                        }
                        // If not deleting, attempt to delete tenant
                        if (status !== 'deleting') {
                            splunk.identity.deleteTenant(integrationTestTenantID).then(() => {}, err => {
                                console.log(`WARNING: Tenant ${integrationTestTenantID} was not successfully deleted, after testing err: ${err}`);
                            });
                        }
                    });
            }
        });
    });

});
