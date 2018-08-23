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
                tenantStatus = profile.tenantDetails.find((obj) => obj.tenantId == tenant)
                if (tenantStatus.status === currentStatus) {
                    setTimeout(() => resolve(waitForStatusToEnd(tenant, currentStatus)), 500);
                } else {
                    resolve(tenantStatus);
                }
            });
        } catch (e) {
            reject(e);
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

    describe.skip('Identity service migration to v1 and shim v2 has broken these tests', () => {});

});

// Scenario 2:
// Integration test for Tenant endpoints
// 1. Create a new test tenant using createTenant() method and validate using getUserProfile() method
// 2. Post a tenant in invalid format and validate that a 422 error is thrown
// 3. Delete the newly created test tenant using deleteTenant() method and validate using getUserProfile() method
// 4. Delete a tenant which is currently not present in the user-profile and validate that a 404 error is thrown
describe('integration tests for Identity Tenant Endpoints', () => {
    if (config.tenantCreationOn) {
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
                    return waitForStatusToEnd(response.tenantId, 'provisioning');
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
                    .then(success => assert.fail(success), err => assert.equal(err.errorParams.httpStatusCode, '422')));
        });

        describe('Delete the test tenant and validate - Good and Bad cases', () => {
            const testDeleteTenant = 'integration_test_delete_tenant';

            it('should delete the selected test tenant from user', () =>
                splunk.identity.deleteTenant(integrationTestTenantID).then(response => {
                    assert(!response);
                }));

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
                    .then(success => assert.fail(success), err => assert.equal(err.errorParams.httpStatusCode, '422')));
        });
    } else {
        describe.skip('Tenant creation tests were skipped, to turn them on set the TENANT_CREATION env to 1', () => {});
    }
});
