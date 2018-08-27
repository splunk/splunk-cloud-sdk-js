const config = require('../config');
const SplunkSSC = require('../../splunk');
const { assert } = require('chai');

const sscHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;
const splunk = new SplunkSSC(sscHost, token, tenantID);

// Scenario:
// Integration test for Tenant endpoints
// 1. Create Roles and Permissions
// 2. Create Groups and Members
// 3. Deletes Roles, Permissions, Groups, Members
// 4. Delete the newly created test tenant using deleteTenant() method and validate using getUserProfile() method
describe('integration tests for Identity Tenant Endpoints', () => {

    const testRole = `jssdk_role_${Date.now()}`;
    const testPerm1 = `jssdk_perm_${Date.now()}`;

    const testPermissions = [
        tenantID + 'catalog',
        tenantID + 'ingest',
        tenantID + 'search'
    ];
    const testGroupName = `mygroup_${Date.now()}`;
    const testPrincipal = 'test1@splunk.com';
    const testMember = 'test2@splunk.com';

    describe('Test Roles and Permissions Management', () => {

        const roleInput = {
            'name': testRole,
        };

        it('should return the validate info for the principal member', () =>
            splunk.identity.validate(tenantID).then(info => {
                assert.typeOf(info, 'Object', 'data should be an obj');
                assert.equal(info.name, testPrincipal);
            }));

        it('should create a new role', () =>
            splunk.identity.createRole(tenantID, roleInput)
                .then(response => {
                    assert.equal(response.tenant, tenantID);
                    assert.equal(response.name, testRole);
            }));

        it('should return the roles for the tenant', () =>
            splunk.identity.getRoles(tenantID).then(roles => {
                assert.typeOf(roles, 'Array', 'data should be an array');
                assert(roles.indexOf(testRole) > -1);
            }));

        it('should return the role for the tenant and role name', () =>
            splunk.identity.getRole(tenantID, testRole).then(response => {
                assert.typeOf(response, 'Object', 'response should be an object');
                assert.equal(response.name, testRole);
                assert.equal(response.tenant, tenantID);
            }));

        it('should create new permissions for an existing role', () =>
            splunk.identity.addRolePermissions(tenantID, testRole, testPerm1).then(rolePermission => {
                assert.typeOf(rolePermission,'Object', 'response should be an object');
                assert.equal(rolePermission.permission, testPerm1);
                assert.equal(rolePermission.role, testRole);
                assert.equal(rolePermission.tenant, tenantID);
            }));

        it('should return the permissions for the tenant and role name', () =>
            splunk.identity.getRolePermissions(tenantID, testRole).then(perms => {
                assert.typeOf(perms, 'Array', 'data should be an array');
                assert.equal(perms[0], testPerm1);
            }));

        it('should return the permission for the tenant, role name, and permissionName', () =>
            splunk.identity.getRolePermission(tenantID, testRole, testPerm1).then(perm => {
                assert.typeOf(perm, 'Object', 'data should be an object');
                assert.equal(perm.permission, testPerm1);
                assert.equal(perm.role, testRole);
                assert.equal(perm.tenant, tenantID);
            }));

    });

    describe('Test Group Member Management', () => {
        const groupInput = {
            'name': testGroupName,
            'roles': [
                'roles.test_user'
            ],
            'members': [
                'sdk_test@splunk.com'
            ]
        };

        it('should create a new Group', () =>
            splunk.identity.createGroup(tenantID, groupInput).then(group => {
                assert.typeOf(group, 'Object', 'data should be an object');
                assert.equal(group.createdBy, 'test1@splunk.com');
                assert.equal(group.name, testGroupName);
                assert.equal(group.tenant, tenantID);
            }));

        it('should return the Group for the tenant and groupName', () =>
            splunk.identity.getGroup(tenantID, testGroupName).then(group => {
                assert.typeOf(group, 'Object', 'data should be an object');
                assert.equal(group.createdBy, 'test1@splunk.com');
                assert.equal(group.name, testGroupName);
                assert.equal(group.tenant, tenantID);
            }));

        it('should return the Groups for the tenant', () =>
            splunk.identity.getGroups(tenantID).then(data => {
                assert.typeOf(data, 'Array', 'data should be an array');
                assert(data.indexOf(testGroupName) > -1);
            }));

        it('should add a Role to the Group', () =>
            splunk.identity.addGroupRole(tenantID, testGroupName, {'name': testRole}).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data.group, testGroupName);
                assert.equal(data.role, testRole);
                assert.equal(data.tenant, tenantID);
                assert.equal(data.addedBy, 'test1@splunk.com');
            }));

        it('should return the Group for the tenant and groupName', () =>
            splunk.identity.getGroupRole(tenantID, testGroupName, testRole).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data.group, testGroupName);
                assert.equal(data.role, testRole);
                assert.equal(data.tenant, tenantID);
                assert.equal(data.addedBy, 'test1@splunk.com');
            }));

        it('should return the Groups for the tenant', () =>
            splunk.identity.getGroupRoles(tenantID, testGroupName).then(data => {
                assert.typeOf(data, 'Array', 'data should be an array');
                assert(data.indexOf(testRole) > -1);
            }));

        it('should create a Member', () =>
            splunk.identity.addMember(tenantID, {'name': testMember}).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data.name, testMember);
                assert.equal(data.tenant, tenantID);
                assert.equal(data.addedBy, 'test1@splunk.com');
            }));

        it('should get a Member', () =>
            splunk.identity.getMember(tenantID, testMember).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data.name, testMember);
                assert.equal(data.tenant, tenantID);
                assert.equal(data.addedBy, 'test1@splunk.com');
            }));

        it('should return the Members for the tenant', () =>
            splunk.identity.getMembers(tenantID).then(data => {
                assert.typeOf(data, 'Array', 'data should be an array');
                assert(data.indexOf(testMember) > -1);
            }));

        it('should add a Member to the Group', () =>
            splunk.identity.addGroupMember(tenantID, testGroupName, {'name': testPrincipal}).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data.group, testGroupName);
                assert.equal(data.principal, testPrincipal);
                assert.equal(data.tenant, tenantID);
            }));

        it('should retrieve the Member from the Group', () =>
            splunk.identity.getGroupMember(tenantID, testGroupName, testPrincipal).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data.group, testGroupName);
                assert.equal(data.principal, testPrincipal);
                assert.equal(data.tenant, tenantID)
            }));

        it('should retrieve all the Members from the Group', () =>
            splunk.identity.getGroupMembers(tenantID, testGroupName).then(data => {
                assert.typeOf(data, 'Array', 'data should be an array');
                assert(data.indexOf(testPrincipal) > -1);
            }));

        it('should retrieve all the Groups for the given Member', () =>
            splunk.identity.getMemberGroups(tenantID, testPrincipal).then(data => {
                assert.typeOf(data, 'Array', 'data should be an array');
                assert(data.indexOf('admins') > -1);
                assert(data.indexOf(testGroupName) > -1);
            }));

    });

    describe('Delete the test roles, permissions, group, tenant and validate - Good and Bad cases', () => {

        it('should delete the member from the tenant and group', () =>
            splunk.identity.deleteGroupMember(tenantID, testGroupName, testPrincipal).then(response => {
                assert(!response);
            }));

        it('should delete the selected test member', () =>
            splunk.identity.deleteMember(tenantID, testMember).then(response => {
                assert(!response);
            }));

        it('should delete the selected test permission from the role', () =>
            splunk.identity.deleteRolePermission(tenantID, testRole, testPerm1).then(response => {
                assert(!response);
            }));

        it('should delete the role for the tenant and group', () =>
            splunk.identity.deleteGroupRole(tenantID, testGroupName, testRole).then(response => {
                assert(!response);
            }));

        it('should delete the group for the tenant', () =>
            splunk.identity.deleteGroup(tenantID, testGroupName).then(response => {
                assert(!response);
            }));

        it('should delete the test role from the tenant', () =>
            splunk.identity.deleteRole(tenantID, testRole).then(response => {
                assert(!response);
            }));

    });

});
