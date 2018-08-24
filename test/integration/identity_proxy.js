const config = require('../config');
const SplunkSSC = require('../../splunk');
const { assert } = require('chai');

const sscHost = config.playgroundHost;
const invalidToken = config.invalidAuthToken;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;
const splunk = new SplunkSSC(sscHost, token, tenantID);

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

    const integrationTestTenantID = tenantID;
    const testRole = 'jssdk_role';
    const testPerm1 = 'jssdk_perm';

    const testPermissions = [
        tenantID + "catalog",
        tenantID + "ingest",
        tenantID + "search"
    ];
    const testGroupName = "mygroup";
    const testMember = "int_test_user";

    describe('Test Roles and Permissions Management', () => {

        const roleInput = {
            "name": testRole,
        };

        it('should create a new role', () =>
            splunk.identity.createRole(integrationTestTenantID, roleInput)
                .then(response => {
                    assert.equal(response.tenant, integrationTestTenantID);
                    assert.equal(response.name, testRole);
            }));

        it('should return the roles for the tenant', () =>
            splunk.identity.getRoles(integrationTestTenantID).then(roles => {
                assert.typeOf(roles, 'Array', 'data should be an array');
                assert(roles.indexOf(testRole) > -1);
            }));

        it('should return the role for the tenant and role name', () =>
            splunk.identity.getRole(integrationTestTenantID, testRole).then(response => {
                assert.typeOf(response, 'Object', 'response should be an object');
                assert.equal(response.name, testRole);
                assert.equal(response.tenant, integrationTestTenantID);
            }));

        it('should create new permissions for an existing role', () =>
            splunk.identity.createRolePermissions(integrationTestTenantID, testRole, testPerm1).then(rolePermission => {
                assert.typeOf(rolePermission,'Object', 'response should be an object');
                assert.equal(rolePermission.permission, testPerm1);
                assert.equal(rolePermission.role, testRole);
                assert.equal(rolePermission.tenant, integrationTestTenantID);
            }));

        it('should return the permissions for the tenant and role name', () =>
            splunk.identity.getRolePermissions(integrationTestTenantID, testRole).then(perms => {
                assert.typeOf(perms, 'Array', 'data should be an array');
                assert.equal(perms[0], testPerm1);
            }));

        it('should return the permission for the tenant, role name, and permissionName', () =>
            splunk.identity.getRolePermission(integrationTestTenantID, testRole, testPerm1).then(perm => {
                assert.typeOf(perm, 'Object', 'data should be an object');
                assert.equal(perm.permission, testPerm1);
                assert.equal(perm.role, testRole);
                assert.equal(perm.tenant, tenantID);
            }));

    });

    //     describe('Test Groups Management', () => {
    //         const groupInput = {
    //             "name": testGroupName,
    //             "roles": [
    //                 "roles.test_user"
    //             ],
    //             "members": [
    //                 "sdk_test@splunk.com"
    //             ]
    //         };
    //
    //         it('should create a new Group', () =>
    //             splunk.identity.createGroup(integrationTestTenantID, groupInput).then(response => {
    //                 assert(!response)
    //             }));
    //
    //         it('should return the Group for the tenant and groupName', () =>
    //             splunk.identity.getGroup(integrationTestTenantID, testGroupName).then(data => {
    //                 assert.typeOf(data, 'Object', 'data should be an object');
    //                 assert.equal(data.name, testGroupName);
    //                 assert.equal(data.kind, "identity.group");
    //                 assert.equal(data.tenant, integrationTestTenantID);
    //             }));
    //
    //         it('should return the Groups for the tenant', () =>
    //             splunk.identity.getGroups(integrationTestTenantID).then(data => {
    //                 assert.typeOf(data, 'Array', 'data should be an array');
    //                 const group = data.pop();
    //                 assert.typeOf(group, 'String', 'group should be a string')
    //             }));
    //
    //         it('should add a Role to the Group', () =>
    //             splunk.identity.createGroupRole(integrationTestTenantID, testGroupName, {"name": "somerole"}).then(data => {
    //                 assert.typeOf(data, 'Object', 'data should be an object');
    //                 assert.equal(data.group, testGroupName);
    //                 assert.equal(data.role, "somerole");
    //                 assert.equal(data.tenant, integrationTestTenantID)
    //             }));
    //
    //         it('should return the Group for the tenant and groupName', () =>
    //             splunk.identity.getGroupRole(integrationTestTenantID, testGroupName, "somerole").then(data => {
    //                 assert.typeOf(data, 'Object', 'data should be an object');
    //                 assert.equal(data.group, testGroupName);
    //                 assert.equal(data.role, "somerole");
    //                 assert.equal(data.tenant, integrationTestTenantID)
    //             }));
    //
    //         it('should return the Groups for the tenant', () =>
    //             splunk.identity.getGroupRoles(integrationTestTenantID, testGroupName).then(data => {
    //                 assert.typeOf(data, 'Array', 'data should be an array');
    //                 const gRole = data.pop();
    //                 assert.typeOf(gRole, 'String', 'group role should be a string')
    //             }));
    //
    //         it('should add a Member to the Group', () =>
    //             splunk.identity.createGroupMember(integrationTestTenantID, testGroupName, {"name": "int_test_user"}).then(data => {
    //                 assert.typeOf(data, 'Object', 'data should be an object');
    //                 assert.equal(data.group, testGroupName);
    //                 assert.equal(data.name, "int_test_user");
    //                 assert.equal(data.tenant, integrationTestTenantID)
    //             }));
    //
    //         it('should retrieve the Member from the Group', () =>
    //             splunk.identity.getGroupMember(integrationTestTenantID, testGroupName, testMember).then(data => {
    //                 assert.typeOf(data, 'Object', 'data should be an object');
    //                 assert.equal(data.group, testGroupName);
    //                 assert.equal(data.name, testMember);
    //                 assert.equal(data.tenant, integrationTestTenantID)
    //             }));
    //
    //         it('should retrieve all the Members from the Group', () =>
    //             splunk.identity.getGroupMembers(integrationTestTenantID, testGroupName).then(data => {
    //                 assert.typeOf(data, 'Array', 'data should be an array');
    //                 assert(data.indexOf(testMember) > -1)
    //             }));
    //
    // });


        describe('Delete the test roles, permissions, group, tenant and validate - Good and Bad cases', () => {
            // const testDeleteTenant = 'integration_test_delete_tenant';

            // it('should delete the role for the tenant and group', () =>
            //     splunk.identity.deleteGroupRole(integrationTestTenantID, testGroupName, testRole).then(response => {
            //         assert(!response);
            //     }));
            //
            // it('should delete the member from the tenant and group', () =>
            //     splunk.identity.deleteGroupMember(integrationTestTenantID, testGroupName, testMember).then(response => {
            //         assert(!response);
            //     }));
            //
            // it('should delete the selected test permission from the role', () =>
            //     splunk.identity.deleteRolePermission(integrationTestTenantID, testRole, testPermission).then(response => {
            //         assert(!response);
            //     }));
            //
            // it('should delete all the permissions from the role', () =>
            //     splunk.identity.deleteAllRolePermissions(integrationTestTenantID, testRole).then(response => {
            //         assert(!response);
            //     }));
            //
            // it('should delete the group for the tenant', () =>
            //     splunk.identity.deleteGroup(integrationTestTenantID, testGroupName).then(response => {
            //         assert(!response);
            //     }));

            it('should delete the test role from the tenant', () =>
                splunk.identity.deleteRole(integrationTestTenantID, testRole).then(response => {
                    assert(!response);
                }));


        });

});
