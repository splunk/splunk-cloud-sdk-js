const config = require('../config');
const SplunkCloud = require('../../splunk');
const { assert } = require('chai');

const splunkCloudHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;
const splunk = new SplunkCloud(splunkCloudHost, token, tenantID);

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
    const testMember = 'test3@splunk.com';

    describe('Test Roles and Permissions Management', () => {

        const roleInput = {
            'name': testRole,
        };

        it('should return the validate info for the principal member', () =>
            splunk.identity.validate().then(info => {
                assert.typeOf(info, 'Object', 'data should be an obj');
                assert.equal(info.name, testPrincipal);
            }));

        it('should create a new role', () =>
            splunk.identity.createRole(roleInput)
                .then(response => {
                    assert.equal(response.tenant, tenantID);
                    assert.equal(response.name, testRole);
            }));

        it('should return the roles for the tenant', () =>
            splunk.identity.getRoles().then(roles => {
                assert.typeOf(roles, 'Array', 'data should be an array');
                assert(roles.indexOf(testRole) > -1);
            }));

        it('should return the role for the tenant and role name', () =>
            splunk.identity.getRole(testRole).then(response => {
                assert.typeOf(response, 'Object', 'response should be an object');
                assert.equal(response.name, testRole);
                assert.equal(response.tenant, tenantID);
            }));

        it('should create new permissions for an existing role', () =>
            splunk.identity.addRolePermission(testRole, testPerm1).then(rolePermission => {
                assert.typeOf(rolePermission,'Object', 'response should be an object');
                assert.equal(rolePermission.permission, testPerm1);
                assert.equal(rolePermission.role, testRole);
                assert.equal(rolePermission.tenant, tenantID);
            }));

        it('should return the permissions for the tenant and role name', () =>
            splunk.identity.getRolePermissions(testRole).then(perms => {
                assert.typeOf(perms, 'Array', 'data should be an array');
                assert.equal(perms[0], testPerm1);
            }));

        it('should return the permission for the tenant, role name, and permissionName', () =>
            splunk.identity.getRolePermission(testRole, testPerm1).then(perm => {
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
            splunk.identity.createGroup(groupInput).then(group => {
                assert.typeOf(group, 'Object', 'data should be an object');
                assert.equal(group.createdBy, 'test1@splunk.com');
                assert.equal(group.name, testGroupName);
                assert.equal(group.tenant, tenantID);
            }));

        it('should return the Group for the tenant and groupName', () =>
            splunk.identity.getGroup(testGroupName).then(group => {
                assert.typeOf(group, 'Object', 'data should be an object');
                assert.equal(group.createdBy, 'test1@splunk.com');
                assert.equal(group.name, testGroupName);
                assert.equal(group.tenant, tenantID);
            }));

        it('should return the Groups for the tenant', () =>
            splunk.identity.getGroups().then(data => {
                assert.typeOf(data, 'Array', 'data should be an array');
                assert(data.indexOf(testGroupName) > -1);
            }));

        it('should add a Role to the Group', () =>
            splunk.identity.addRoleToGroup(testGroupName, {'name': testRole}).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data.group, testGroupName);
                assert.equal(data.role, testRole);
                assert.equal(data.tenant, tenantID);
                assert.equal(data.addedBy, 'test1@splunk.com');
            }));

        it('should return the Group for the tenant and groupName', () =>
            splunk.identity.getGroupRole(testGroupName, testRole).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data.group, testGroupName);
                assert.equal(data.role, testRole);
                assert.equal(data.tenant, tenantID);
                assert.equal(data.addedBy, 'test1@splunk.com');
            }));

        it('should return the Groups for the tenant', () =>
            splunk.identity.getGroupRoles(testGroupName).then(data => {
                assert.typeOf(data, 'Array', 'data should be an array');
                assert(data.indexOf(testRole) > -1);
            }));

        it('should create a Member', () =>
            splunk.identity.addMember({'name': testMember}).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data.name, testMember);
                assert.equal(data.tenant, tenantID);
                assert.equal(data.addedBy, 'test1@splunk.com');
            }));

        it('should get a Member', () =>
            splunk.identity.getMember(testMember).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data.name, testMember);
                assert.equal(data.tenant, tenantID);
                assert.equal(data.addedBy, 'test1@splunk.com');
            }));

        it('should return the Members for the tenant', () =>
            splunk.identity.getMembers().then(data => {
                assert.typeOf(data, 'Array', 'data should be an array');
                assert(data.indexOf(testMember) > -1);
            }));

        it('should add a Member to the Group', () =>
            splunk.identity.addGroupMember(testGroupName, {'name': testPrincipal}).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data.group, testGroupName);
                assert.equal(data.principal, testPrincipal);
                assert.equal(data.tenant, tenantID);
            }));

        it('should retrieve the Member from the Group', () =>
            splunk.identity.getGroupMember(testGroupName, testPrincipal).then(data => {
                assert.typeOf(data, 'Object', 'data should be an object');
                assert.equal(data.group, testGroupName);
                assert.equal(data.principal, testPrincipal);
                assert.equal(data.tenant, tenantID)
            }));

        it('should retrieve all the Members from the Group', () =>
            splunk.identity.getGroupMembers(testGroupName).then(data => {
                assert.typeOf(data, 'Array', 'data should be an array');
                assert(data.indexOf(testPrincipal) > -1);
            }));

        it('should retrieve all the Groups for the given Member', () =>
            splunk.identity.getMemberGroups(testPrincipal).then(data => {
                assert.typeOf(data, 'Array', 'data should be an array');
                assert(data.indexOf('admins') > -1);
                assert(data.indexOf(testGroupName) > -1);
            }));

    });

    describe('Delete the test roles, permissions, group, tenant and validate - Good and Bad cases', () => {

        it('should delete the member from the tenant and group', () =>
            splunk.identity.removeGroupMember(testGroupName, testPrincipal).then(response => {
                assert(!response);
            }));

        it('should delete the selected test member', () =>
            splunk.identity.removeMember(testMember).then(response => {
                assert(!response);
            }));

        it('should delete the selected test permission from the role', () =>
            splunk.identity.removeRolePermission(testRole, testPerm1).then(response => {
                assert(!response);
            }));

        it('should delete the role for the tenant and group', () =>
            splunk.identity.removeGroupRole(testGroupName, testRole).then(response => {
                assert(!response);
            }));

        it('should delete the group for the tenant', () =>
            splunk.identity.deleteGroup(testGroupName).then(response => {
                assert(!response);
            }));

        it('should delete the test role from the tenant', () =>
            splunk.identity.deleteRole(testRole).then(response => {
                assert(!response);
            }));

    });

});
