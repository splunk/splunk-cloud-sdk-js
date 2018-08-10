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
// 3. Create Roles and Permissions
// 4. Create Groups and Members
// 5. Deletes Roles, Groups, Members
// 6. Delete the newly created test tenant using deleteTenant() method and validate using getUserProfile() method
// 7. Delete a tenant which is currently not present in the user-profile and validate that a 404 error is thrown
describe('integration tests for Identity Tenant Endpoints', () => {
    if (config.tenantCreationOn) {
    const integrationTestTenantID = `${Date.now()}-sdk-integration`;
    const testRole = 'roles.test_user';
    const testPermission = integrationTestTenantID + "-simple";
    const testGroupName = "mygroup";
    const testMember = "int_test_user";

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

    describe('Test Roles and Permissions Management', () => {
        const testPermissions = [integrationTestTenantID + "-mytest", integrationTestTenantID + "-inttest"];

        const roleInput = {
            "name": testRole,
            "permissions": [testPermission]
        };

        it('should create a new role with permissions', () =>
            splunk.identity.createRole(integrationTestTenantID, roleInput).then(response => {
                assert(!response)
            }));

        it('should return the roles for the tenant', () =>
            splunk.identity.getRoles(integrationTestTenantID).then(roles => {
                assert.typeOf(roles, 'Array', 'data should be an array');
                const role = roles.pop();
                assert.equal(role, testRole);
            }));

        it('should return the role for the tenant and role name', () =>
            splunk.identity.getRole(integrationTestTenantID, testRole).then(role => {
                assert.typeOf(role, 'Object', 'role should be an object');
                assert.equal(role["name"], testRole);
                assert.equal(role["kind"],'identity.role');
                assert.equal(role["tenant"], integrationTestTenantID);
            }));

        it('should return the permissions for the tenant and role name', () =>
            splunk.identity.getRolePermissions(integrationTestTenantID, testRole).then(perms => {
                assert.typeOf(perms, 'Array', 'data should be an array');
                const permName = perms.pop();
                assert.typeOf(permName, 'String', 'permission should be a string')
            }));

        it('should return the permission for the tenant, role name, and permissionName', () =>
            splunk.identity.getRolePermission(integrationTestTenantID, testRole, testPermission).then(perm => {
                assert.typeOf(perm, 'Object', 'data should be an object');
                assert.equal(perm["name"], testPermission);
                assert.equal(perm["addedAt"], null);
                assert.equal(perm["addedBy"], null);
            }));

        it('should create new permissions for an existing role', () =>
            splunk.identity.createRolePermissons(integrationTestTenantID, testRole, testPermissions).then(response => {
                assert.lengthOf(response, 3, 'response has a length of 3 permissions');
            }));
    });

    describe('Test Groups Management', () => {
        const groupInput = {
            "name": testGroupName,
            "roles": [
                "roles.test_user"
            ],
            "members": [
                "sdk_test@splunk.com"
            ]
        };

        it('should create a new Group', () =>
            splunk.identity.createGroup(integrationTestTenantID, groupInput).then(response => {
                assert(!response)
            }));

        it('should return the Group for the tenant and groupName', () =>
            splunk.identity.getGroup(integrationTestTenantID, testGroupName).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data["name"], testGroupName);
                assert.equal(data["kind"], "identity.group");
                assert.equal(data["tenant"], integrationTestTenantID);
            }));

        it('should return the Groups for the tenant', () =>
            splunk.identity.getGroups(integrationTestTenantID).then(data => {
                assert.typeOf(data, 'Array', 'data should be an array');
                const group = data.pop();
                assert.typeOf(group, 'String', 'group should be a string')
            }));

        it('should add a Role to the Group', () =>
            splunk.identity.createGroupRole(integrationTestTenantID, testGroupName, {"name": "somerole"}).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data["group"], testGroupName);
                assert.equal(data["role"], "somerole");
                assert.equal(data["tenant"], integrationTestTenantID)
            }));

        it('should return the Group for the tenant and groupName', () =>
            splunk.identity.getGroupRole(integrationTestTenantID, testGroupName, "somerole").then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data["group"], testGroupName);
                assert.equal(data["role"], "somerole");
                assert.equal(data["tenant"], integrationTestTenantID)
            }));

        it('should return the Groups for the tenant', () =>
            splunk.identity.getGroupRoles(integrationTestTenantID, testGroupName).then(data => {
                assert.typeOf(data, 'Array', 'data should be an array');
                const gRole = data.pop();
                assert.typeOf(gRole, 'String', 'group role should be a string')
            }));

        it('should add a Member to the Group', () =>
            splunk.identity.createGroupMember(integrationTestTenantID, testGroupName, {"name": "int_test_user"}).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data["group"], testGroupName);
                assert.equal(data["name"], "int_test_user");
                assert.equal(data["tenant"], integrationTestTenantID)
            }));

        it('should retrieve the Member from the Group', () =>
            splunk.identity.getGroupMember(integrationTestTenantID, testGroupName, testMember).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data["group"], testGroupName);
                assert.equal(data["name"], testMember);
                assert.equal(data["tenant"], integrationTestTenantID)
            }));

        it('should retrieve all the Members from the Group', () =>
            splunk.identity.getGroupMembers(integrationTestTenantID, testGroupName).then(data => {
                assert.typeOf(data, 'Array', 'data should be an array');
                const member = data.pop();
                assert.typeOf(member, 'String', 'group member should be a string')
            }));

    });


    describe('Delete the test roles, permissions, group, tenant and validate - Good and Bad cases', () => {
        const testDeleteTenant = 'integration_test_delete_tenant';

        it('should delete the role for the tenant and group', () =>
            splunk.identity.deleteGroupRole(integrationTestTenantID, testGroupName, testRole).then(response => {
                assert(!response);
            }));

        it('should delete the member from the tenant and group', () =>
            splunk.identity.deleteGroupMember(integrationTestTenantID, testGroupName, testMember).then(response => {
                assert(!response);
            }));

        it('should delete the selected test permission from the role', () =>
            splunk.identity.deleteRolePermission(integrationTestTenantID, testRole, testPermission).then(response => {
                assert(!response);
            }));

        it('should delete all the permissions from the role', () =>
            splunk.identity.deleteAllRolePermissions(integrationTestTenantID, testRole).then(response => {
                assert(!response);
            }));

        it('should delete the test role from the tenant', () =>
            splunk.identity.deleteRole(integrationTestTenantID, testRole).then(response => {
                assert(!response);
            }));

        it('should delete the group for the tenant', () =>
            splunk.identity.deleteGroup(integrationTestTenantID, testGroupName).then(response => {
                assert(!response);
            }));

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
