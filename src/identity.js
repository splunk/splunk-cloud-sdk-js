"use strict";
/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var baseapiservice_1 = require("./baseapiservice");
var service_prefixes_1 = require("./service_prefixes");
/**
 * Encapsulates Identity endpoints
 */
var IdentityService = /** @class */ (function (_super) {
    __extends(IdentityService, _super);
    function IdentityService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Validates the access token obtained from authorization header and returns the principal name and tenant memberships
         * @returns a ValidateInfo object
         */
        _this.validate = function () {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['validate']))
                .then(function (response) { return response.body; });
        };
        /**
         * Creates a tenant and default roles/groups
         * @param tenantName unique identifier of the tenant
         * @returns a Tenant object
         */
        _this.createTenant = function (tenantName) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['tenants'], 'system'), tenantName)
                .then(function (response) { return response.body; });
        };
        /**
         * Returns the tenant details
         * @param tenantName unique identifier of the tenant
         * @returns a Tenant object
         */
        _this.getTenant = function (tenantName) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['tenants', tenantName], 'system'))
                .then(function (response) { return response.body; });
        };
        /**
         * Returns the list of tenants in the system
         * @returns a list of tenant names
         */
        _this.getTenants = function () {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['tenants'], 'system'))
                .then(function (response) { return response.body; });
        };
        /**
         * Adds a member to the current tenant
         * @param memberName input object of a member
         * @returns a Member object
         */
        _this.addMember = function (memberName) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['members']), memberName)
                .then(function (response) { return response.body; });
        };
        /**
         * Get a member of the current tenant
         * @param memberName input object of a member
         * @returns a Member object
         */
        _this.getMember = function (memberName) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['members', memberName]))
                .then(function (response) { return response.body; });
        };
        /**
         * Returns the list of members in the current tenant
         * @returns a list of Members
         */
        _this.getMembers = function () {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['members']))
                .then(function (response) { return response.body; });
        };
        /**
         * Removes a member from the current tenant
         * @param memberName input object of a member
         * @returns  A promise that resolves upon deletion
         */
        _this.removeMember = function (memberName) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['members', memberName]))
                .then(function (response) { return response.body; });
        };
        /**
         * Returns the list of the member's groups in the current tenant
         * @param memberName input object of a member
         * @returns a list of Groups
         */
        _this.getMemberGroups = function (memberName) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['members', memberName, 'groups']))
                .then(function (response) { return response.body; });
        };
        /**
         * Creates a new authorization role in the current tenant
         * @param roleInput The role params for creating a new role
         * @returns a Role object
         */
        _this.createRole = function (roleInput) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['roles']), roleInput)
                .then(function (response) { return response.body; });
        };
        /**
         * Get all roles for the current tenant
         * @returns A list of roles
         */
        _this.getRoles = function () {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['roles']))
                .then(function (response) { return response.body; });
        };
        /**
         * Get a role for the current tenant
         * @param roleName String name of a role
         * @returns a Role object
         */
        _this.getRole = function (roleName) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['roles', roleName]))
                .then(function (response) { return response.body; });
        };
        /**
         * Delete an authorization role in the current tenant
         * @param roleName String name of a role
         * @returns A promise that resolves upon deletion
         */
        _this.deleteRole = function (roleName) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['roles', roleName]))
                .then(function (response) { return response.body; });
        };
        /**
         * Get all the permissions for a current tenant and role name
         * @param roleName String name of a role
         * @returns A list of permissions
         */
        _this.getRolePermissions = function (roleName) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions']))
                .then(function (response) { return response.body; });
        };
        /**
         * Adds permissions to an existing role in this tenant
         * @param roleName String name of a role
         * @param permission String name of a permission
         * @returns A promise that resolves upon deletion
         */
        _this.addRolePermission = function (roleName, permission) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions']), JSON.stringify(permission))
                .then(function (response) { return response.body; });
        };
        /**
         * Get a permission for the current tenant, role name, and permission name
         * @param roleName String name of a role
         * @param permissionName String name of a permission
         * @returns a RolePermission object
         */
        _this.getRolePermission = function (roleName, permissionName) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions', permissionName]))
                .then(function (response) { return response.body; });
        };
        /**
         * Remove an authorization role in the current tenant
         * @param roleName String name of a role
         * @param permissionName
         * @returns A promise that resolves upon deletion
         */
        _this.removeRolePermission = function (roleName, permissionName) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions', permissionName]))
                .then(function (response) { return response.body; });
        };
        /**
         * Creates a new group in the current tenant
         * @param groupInput The group params for creating a new group
         * @returns A promise that resolves upon deletion
         */
        _this.createGroup = function (groupInput) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['groups']), groupInput)
                .then(function (response) { return response.body; });
        };
        /**
         * Defines a group in the current tenant
         * @param groupName String name of a group
         * @returns a Group object
         */
        _this.getGroup = function (groupName) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['groups', groupName]))
                .then(function (response) { return response.body; });
        };
        /**
         * Lists the groups in the current tenant
         * @returns a list of groups
         */
        _this.getGroups = function () {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['groups']))
                .then(function (response) { return response.body; });
        };
        /**
         * Deletes a group in the current tenant
         * @param groupName String name of a group
         * @returns A promise that resolves upon deletion
         */
        _this.deleteGroup = function (groupName) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['groups', groupName]))
                .then(function (response) { return response.body; });
        };
        /**
         * Adds a role to the group
         * @param groupName String name of a group
         * @param roleName String name of a role
         * @returns GroupRole
         */
        _this.addRoleToGroup = function (groupName, roleName) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles']), roleName)
                .then(function (response) { return response.body; });
        };
        /**
         * Returns group-role relationship details
         * @param groupName String name of a group
         * @param roleName String name of a role
         * @returns a GroupRole object
         */
        _this.getGroupRole = function (groupName, roleName) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles', roleName]))
                .then(function (response) { return response.body; });
        };
        /**
         * Lists the roles attached to the group
         * @param groupName String name of a group
         * @returns a list of groupRoles
         */
        _this.getGroupRoles = function (groupName) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles']))
                .then(function (response) { return response.body; });
        };
        /**
         * Removes the role from the group
         * @param groupName String name of a group
         * @param roleName String name of a role
         * @returns A promise that resolves upon deletion
         */
        _this.removeGroupRole = function (groupName, roleName) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles', roleName]))
                .then(function (response) { return response.body; });
        };
        /**
         * Adds a member to the group
         * @param groupName String name of a group
         * @param groupMemberName String name of group member
         * @returns a GroupMember object
         */
        _this.addGroupMember = function (groupName, groupMemberName) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members']), groupMemberName)
                .then(function (response) { return response.body; });
        };
        /**
         * Returns group-member relationship details
         * @param  groupName String name of a group
         * @param  groupMemberName String name of group member
         * @returns a GroupMember object
         */
        _this.getGroupMember = function (groupName, groupMemberName) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members', groupMemberName]))
                .then(function (response) { return response.body; });
        };
        /**
         * Lists the members in the given group
         * @param  groupName String name of a group
         * @returns a list of group members
         */
        _this.getGroupMembers = function (groupName) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members']))
                .then(function (response) { return response.body; });
        };
        /**
         * Removes the member from the group
         * @param  groupName String name of a group
         * @param  groupMemberName String name of group member
         * @returns A promise that resolves upon deletion
         */
        _this.removeGroupMember = function (groupName, groupMemberName) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members', groupMemberName]))
                .then(function (response) { return response.body; });
        };
        /**
         * Create a new principal
         * @param principalInput
         * @returns a Principal object
         */
        _this.createPrincipal = function (principalInput) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['principals'], 'system'), principalInput)
                .then(function (response) { return response.body; });
        };
        /**
         * Returns the principal details
         * @param principalName
         * @returns a Principal object
         */
        _this.getPrincipal = function (principalName) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['principals', principalName], 'system'))
                .then(function (response) { return response.body; });
        };
        /**
         * Returns the list of principals known to IAC
         * @returns a list of principals
         */
        _this.getPrincipals = function () {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['principals'], 'system'))
                .then(function (response) { return response.body; });
        };
        /**
         * Deletes a principal
         * @param principalName
         * @returns A promise that resolves upon deletion
         */
        _this.deletePrincipal = function (principalName) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.IDENTITY_SERVICE_PREFIX, ['principals', principalName], 'system'))
                .then(function (response) { return response.body; });
        };
        return _this;
    }
    return IdentityService;
}(baseapiservice_1["default"]));
exports.IdentityService = IdentityService;
//# sourceMappingURL=identity.js.map