import { assert } from 'chai';
import 'mocha';
import sleep = require('sleep-promise');
import { identityModels } from '../../identity';
import { SplunkCloud } from '../../splunk';
import config from '../config';

const tenantID = config.stagingTenant;

const splunk = new SplunkCloud({
    urls: {
        api: config.stagingApiHost,
        app: config.stagingAppsHost,
    },
    tokenSource: config.stagingAuthToken,
    defaultTenant: tenantID,
});

// Scenario:
// Integration test for Tenant endpoints
// 1. Create Roles and Permissions
// 2. Create Groups and Members
// 3. Deletes Roles, Permissions, Groups, Members
// 4. Delete the newly created test tenant using deleteTenant() method and validate using getUserProfile() method
describe('integration tests for Identity Tenant Endpoints', () => {
    const testRole = `js_role_${Date.now()}`;
    const testPerm1 = `${tenantID}:*:jsperm.${Date.now()}`;
    const testPerm2 = `${testPerm1}?foo=bar`;
    const testGroupName = `jsgroup_${Date.now()}`;
    const testPrincipal = config.testUsername;
    const testMember = 'test1@splunk.com';

    describe('Test Roles and Permissions Management', () => {
        const roleInput: identityModels.CreateRoleBody = {
            name: testRole,
        };

        afterEach(() => {
            return sleep(2000);
        });

        it('should return the validate info for the principal member', () =>
            splunk.identity.validateToken().then(info => {
                assert.typeOf(info, 'Object');
                assert.equal(info.name, testPrincipal);
                assert.doesNotHaveAllKeys(info, ['principal', 'tenant']);
            }));

        it('should return the validate info including tenant and principal', () =>
            splunk.identity.validateToken({ include: ['tenant', 'principal'] }).then(info => {
                assert.typeOf(info, 'Object');
                assert.equal(info.name, testPrincipal);
                assert.containsAllKeys(info, ['name', 'principal', 'tenant']);
            }));

        it('should get the principal details', () =>
            splunk.identity.getPrincipal(testPrincipal).then(info => {
                assert.typeOf(info, 'Object');
                assert.equal(info.name, testPrincipal);
                assert.doesNotHaveAllKeys(info, ['principal', 'tenant']);
                assert.containsAllKeys(info, ['name', 'createdAt', 'tenants']);
            }));

        it('should create a new role', () =>
            splunk.identity.createRole(roleInput).then(response => {
                assert.equal(response.tenant, tenantID);
                assert.equal(response.name, testRole);
            }));

        it('should return the roles for the tenant', () =>
            splunk.identity.listRoles().then(roles => {
                assert.typeOf(roles, 'Array');
                assert.include(roles, testRole);
            }));

        it('should return the role for the tenant and role name', () =>
            splunk.identity.getRole(testRole).then(response => {
                assert.typeOf(response, 'Object');
                assert.equal(response.name, testRole);
                assert.equal(response.tenant, tenantID);
            }));

        it('should create new permissions for an existing role', () =>
            splunk.identity.addRolePermission(testRole, testPerm1).then(rolePermission => {
                assert.typeOf(rolePermission, 'Object');
                assert.equal(rolePermission.permission, testPerm1);
                assert.equal(rolePermission.role, testRole);
                assert.equal(rolePermission.tenant, tenantID);
            }));

        it('should create new escaped permissions for an existing role', () =>
            splunk.identity.addRolePermission(testRole, testPerm2).then(rolePermission => {
                assert.typeOf(rolePermission, 'Object');
                assert.equal(rolePermission.permission, testPerm2);
                assert.equal(rolePermission.role, testRole);
                assert.equal(rolePermission.tenant, tenantID);
            }));

        it('should return the permissions for the role name', () =>
            splunk.identity.listRolePermissions(testRole).then(perms => {
                assert.typeOf(perms, 'Array');
                assert.equal(perms[0], testPerm1);
            }));

        it('should return the groups for the role name', () =>
            splunk.identity.listRoleGroups(testRole).then(perms => {
                assert.typeOf(perms, 'Array');
            }));

        it('should return the permission for the tenant, role name, and permissionName', () =>
            splunk.identity.getRolePermission(testRole, testPerm1).then(perm => {
                assert.typeOf(perm, 'Object');
                assert.equal(perm.permission, testPerm1);
                assert.equal(perm.role, testRole);
                assert.equal(perm.tenant, tenantID);
            }));

        // We don't have permissions to modify other tenants, and this isn't really a useful test
        // it('should update tenant state', () => {
        //     return Promise.resolve(splunk.identity.updateTenantState(config.stagingMLTenant, { state: identityModels.UpdateTenantBodyStateEnum.Suspend })
        //         .then(body => {
        //             assert.isEmpty(body);
        //             return splunk.identity.updateTenantState(config.stagingMLTenant, { state: identityModels.UpdateTenantBodyStateEnum.Resume });
        //         }).then(body => {
        //             assert.isEmpty(body);
        //         })
        //     ).catch(err => {
        //         assert.fail(err);
        //     });
        // });
    });

    describe('Test Group Member Management', () => {
        const groupInput = {
            name: testGroupName,
            roles: ['roles.test_user'],
            members: ['sdk_test@splunk.com'],
        };

        afterEach(() => {
            return sleep(2000);
        });

        it('should create a new Group', () =>
            splunk.identity.createGroup(groupInput).then(group => {
                assert.typeOf(group, 'Object');
                assert.equal(group.createdBy, testPrincipal);
                assert.equal(group.name, testGroupName);
                assert.equal(group.tenant, tenantID);
            }));

        it('should return the Group for the tenant and groupName', () =>
            splunk.identity.getGroup(testGroupName).then(group => {
                assert.typeOf(group, 'Object');
                assert.equal(group.createdBy, testPrincipal);
                assert.equal(group.name, testGroupName);
                assert.equal(group.tenant, tenantID);
            }));

        it('should return the Groups for the tenant', () =>
            splunk.identity.listGroups().then(data => {
                assert.typeOf(data, 'Array');
                assert.include(data, testGroupName);
            }));

        it('should add a Role to the Group', () =>
            splunk.identity.addGroupRole(testGroupName, { name: testRole }).then(data => {
                assert.typeOf(data, 'Object');
                assert.equal(data.group, testGroupName);
                assert.equal(data.role, testRole);
                assert.equal(data.tenant, tenantID);
                assert.equal(data.addedBy, testPrincipal);
            }));

        it('should return the Group for the tenant and groupName', () =>
            splunk.identity.getGroupRole(testGroupName, testRole).then(data => {
                assert.typeOf(data, 'Object');
                assert.equal(data.group, testGroupName);
                assert.equal(data.role, testRole);
                assert.equal(data.tenant, tenantID);
                assert.equal(data.addedBy, testPrincipal);
            }));

        it('should return the Groups for the tenant', () =>
            splunk.identity.listGroupRoles(testGroupName).then(data => {
                assert.typeOf(data, 'Array');
                assert.include(data, testRole);
            }));

        it('should create a Member', () =>
            splunk.identity.addMember({ name: testMember } as identityModels.AddGroupMemberBody).then(data => {
                assert.typeOf(data, 'Object');
                assert.equal(data.name, testMember);
                assert.equal(data.tenant, tenantID);
                assert.equal(data.addedBy, testPrincipal);
            }));

        it('should get a Member', () =>
            splunk.identity.getMember(testMember).then(data => {
                assert.typeOf(data, 'Object');
                assert.equal(data.name, testMember);
                assert.equal(data.tenant, tenantID);
                assert.equal(data.addedBy, testPrincipal);
            }));

        it('should return the Members for the tenant', () =>
            splunk.identity.listMembers().then(data => {
                assert.typeOf(data, 'Array');
                assert.include(data, testMember);
            }));

        it('should return the Members for the tenant', () =>
            splunk.identity.listMembers().then(data => {
                assert.typeOf(data, 'Array');
                assert.include(data, testMember);
            }));

        it('should delete the member from the tenant and group ignore response', () =>
            splunk.identity.removeGroupMember(testGroupName, testPrincipal).then(response => {
                assert.isEmpty(response);
            }));

        it('should add a Member to the Group', () =>
            splunk.identity.addGroupMember(testGroupName, { name: testPrincipal }).then(data => {
                assert.typeOf(data, 'Object');
                assert.equal(data.group, testGroupName);
                assert.equal(data.principal, testPrincipal);
                assert.equal(data.tenant, tenantID);
            }));

        it('should retrieve the Member from the Group', () =>
            splunk.identity.getGroupMember(testGroupName, testPrincipal).then(data => {
                assert.typeOf(data, 'Object');
                assert.equal(data.group, testGroupName);
                assert.equal(data.principal, testPrincipal);
                assert.equal(data.tenant, tenantID);
            }));

        it('should retrieve all the Members from the Group', () =>
            splunk.identity.listGroupMembers(testGroupName).then(data => {
                assert.typeOf(data, 'Array');
                assert.include(data, testPrincipal);
            }));

        it('should retrieve all the Groups for the given Member', () =>
            splunk.identity.listMemberGroups(testPrincipal).then(data => {
                assert.typeOf(data, 'Array');
                assert.include(data, 'identity.members', JSON.stringify(data));
                assert.include(data, testGroupName);
            }));

        it('should retrieve all the permission for the given Member', () =>
            splunk.identity.listMemberPermissions(testPrincipal).then(data => {
                assert.typeOf(data, 'Array');
                assert.include(data, 'testsdks:*:*', JSON.stringify(data));
            }));

        it('should retrieve all the roles for the given Member', () =>
            splunk.identity.listMemberRoles(testPrincipal).then(data => {
                assert.typeOf(data, 'Array');
                assert.include(data, 'tenant.admin', JSON.stringify(data));
            }));
    });

    describe('Delete the test roles, permissions, group, tenant and validate - Good and Bad cases', () => {
        afterEach(() => {
            return sleep(2000);
        });

        it('should delete the member from the tenant and group', () =>
            splunk.identity.removeGroupMember(testGroupName, testPrincipal).then(response => {
                assert.isEmpty(response);
            }));

        it('should delete the selected test member', () =>
            splunk.identity.removeMember(testMember).then(response => {
                assert.isEmpty(response);
            }));

        it('should delete the selected test permission from the role', () =>
            splunk.identity.removeRolePermission(testRole, testPerm1).then(response => {
                assert.isEmpty(response);
            }));

        it('should delete the escaped test permission from the role', () =>
            splunk.identity.removeRolePermission(testRole, testPerm2).then(response => {
                assert.isEmpty(response);
            }));

        it('should delete the role for the tenant and group', () =>
            splunk.identity.removeGroupRole(testGroupName, testRole).then(response => {
                assert.isEmpty(response);
            }));

        it('should delete the group for the tenant', () =>
            splunk.identity.deleteGroup(testGroupName).then(response => {
                assert.isEmpty(response);
            }));

        it('should delete the test role from the tenant', () =>
            splunk.identity.deleteRole(testRole).then(response => {
                assert.isEmpty(response);
            }));
    });
});
