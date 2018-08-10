/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import BaseApiService from './baseapiservice';
import { IDENTITY_SERVICE_PREFIX } from './service_prefixes';

/**
 * Encapsulates Identity endpoints
 */
export class IdentityService extends BaseApiService {
    /**
     * Authenticate the user by the access token obtained from authorization header and return user profile data,
     * including tenant memberships
     * @param tenantId
     */
    public getUserProfile = (tenantId: Tenant['tenantId'] = 'system'): Promise<UserProfile> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['userprofile'], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as UserProfile);
    }

    /**
     * Adds a tenant
     * @param tenantId
     */
    public createTenant = (tenantId: Tenant['tenantId']): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants'], 'system'), tenantId)
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Deletes a tenant
     * @param tenantId
     */
    public deleteTenant = (tenantId: Tenant['tenantId']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants', tenantId], 'system'))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Reads a list of users in the given tenant
     * @param tenantId
     */
    public getTenantUsers = (tenantId: Tenant['tenantId']): Promise<User[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['users'], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as User[]);
    }

    /**
     * Replaces current tenant users with new users
     * @param tenantId
     * @param users
     */
    public replaceTenantUsers = (tenantId: Tenant['tenantId'], users: User[]): Promise<any> => {
        return this.client.put(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['users'], tenantId), users)
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Adds a list of users to the tenant
     * @param tenantId
     * @param users
     */
    public addTenantUsers = (tenantId: Tenant['tenantId'], users: User[]): Promise<any> => {
        return this.client.patch(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['users'], tenantId), users)
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Deletes a list of users from the tenant
     * @param tenantId
     * @param users
     */
    public deleteTenantUsers = (tenantId: Tenant['tenantId'], users: User[]): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['users'], tenantId), users)
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Creates a new authorization role in the given tenant
     * @param tenantId
     * @param roleInput
     */
    public createRole = (tenantId: Tenant["tenantId"], roleInput: RoleInput): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles'], tenantId), roleInput);
    }

    /**
     * Get all roles for the given tenant
     * @param tenantId
     * @returns roles
     */
    public getRoles = (tenantId: Tenant["tenantId"]): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles'], tenantId))
            .then(response => response as string[]);
    }

    /**
     * Get a role for the given tenant
     * @param tenantId
     * @param roleName
     * @returns Role
     */
    public getRole = (tenantId: Tenant["tenantId"], roleName: Role["name"]): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName], tenantId))
            .then(response => response as Role);
    }

    /**
     * Delete an authorization role in the given tenant
     * @param tenantId
     * @param roleName
     */
    public deleteRole = (tenantId: Tenant["tenantId"], roleName: Role["name"]): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName], tenantId));
    }

    /**
     * Get all the permissions for a given tenant and role name
     * @param tenantId
     * @param roleName
     * @returns permissions
     */
    public getRolePermissions = (tenantId: Tenant["tenantId"], roleName: Role["name"]): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions'], tenantId))
            .then(response => response as string[]);
    }

    /**
     * Adds permissions to an existing role in this tenant
     * @param tenantId
     * @param roleName
     * @param permissions
     */
    public createRolePermissons = (tenantId: Tenant["tenantId"], roleName: Role["name"], permissions: string[]): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions'], tenantId), permissions);
    }

    /**
     * Get a permission for the given tenant, role name, and permission name
     * @param tenantId
     * @param roleName
     * @param permissionName
     * @returns Permission
     */
    public getRolePermission = (tenantId: Tenant["tenantId"], roleName: Role["name"], permissionName: Permission["name"]): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions', encodeURIComponent(permissionName)], tenantId))
            .then(response => response as Permission);
    }

    /**
     * Delete an authorization role in the given tenant
     * @param tenantId
     * @param roleName
     * @param permissionName
     */
    public deleteRolePermission = (tenantId: Tenant["tenantId"], roleName: Role["name"], permissionName: Permission["name"]): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions', permissionName], tenantId));
    }

    /**
     * Deletes all permisisons for a role defined in this tenant
     * @param tenantId
     * @param roleName
     */
    public deleteAllRolePermissions = (tenantId: Tenant["tenantId"], roleName: Role["name"]): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions'], tenantId));
    }

    /**
     * Creates a new group in the given tenant
     * @param tenantId
     * @param groupInput
     */
    public createGroup = (tenantId: Tenant["tenantId"], groupInput: GroupInput): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups'], tenantId), groupInput);
    }

    /**
     * Defines a group in the given tenant
     * @param tenantId
     * @param groupName
     * @returns Group
     */
    public getGroup = (tenantId: Tenant["tenantId"], groupName: Group["name"]): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName], tenantId));
    }

    /**
     * Lists the groups in the given tenant
     * @param tenantId
     * @returns groups
     */
    public getGroups = (tenantId: Tenant["tenantId"]): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups'], tenantId));
    }

    /**
     * Deletes a group in the given tenant
     * @param tenantId
     * @param groupName
     */
    public deleteGroup = (tenantId: Tenant["tenantId"], groupName: Group["name"]): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName], tenantId));
    }

    /**
     * Adds a role to the group
     * @param tenantId
     * @param groupName
     * @param roleName
     * @returns GroupRole
     */
    public createGroupRole = (tenantId: Tenant["tenantId"], groupName: Group["name"], roleName: RoleName): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles'], tenantId), roleName);
    }

    /**
     * Returns group-role relationship details
     * @param tenantId
     * @param groupName
     * @param roleName
     * @returns GroupRole
     */
    public getGroupRole = (tenantId: Tenant["tenantId"], groupName: Group["name"], roleName: Role["name"]): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles', roleName], tenantId));
    }

    /**
     * Lists the roles attached to the group
     * @param tenantId
     * @param groupName
     * @returns groupRoles
     */
    public getGroupRoles = (tenantId: Tenant["tenantId"], groupName: Group["name"]): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles'], tenantId));
    }

    /**
     * Removes the role from the group
     * @param tenantId
     * @param groupName
     * @param roleName
     */
    public deleteGroupRole = (tenantId: Tenant["tenantId"], groupName: Group["name"], roleName: Role["name"]): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles', roleName], tenantId));
    }

    /**
     * Adds a member to the group
     * @param tenantId
     * @param groupName
     * @param groupMemberName
     */
    public createGroupMember = (tenantId: Tenant["tenantId"], groupName: Group["name"], groupMemberName: GroupMemberName): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members'], tenantId), groupMemberName);
    }

    /**
     * Returns group-member relationship details
     * @param  tenantId
     * @param  groupName
     * @param  groupMemberName
     */
    public getGroupMember = (tenantId: Tenant["tenantId"], groupName: Group["name"], groupMemberName: GroupMemberName["name"]): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members', groupMemberName], tenantId));
    }

    /**
     * Lists the members in the given group
     * @param  tenantId
     * @param  groupName
     */
    public getGroupMembers = (tenantId: Tenant["tenantId"], groupName: Group["name"]): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members'], tenantId));
    }

    /**
     * Removes the member from the group
     * @param  tenantId
     * @param  groupName
     * @param  groupMemberName
     */
    public deleteGroupMember = (tenantId: Tenant["tenantId"], groupName: Group["name"], groupMemberName: GroupMemberName["name"]): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members', groupMemberName], tenantId));
    }
}

/**
 * UserProfile - Represents the User recognized by the Identity Service.
 */
interface UserProfile {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    locale: string;
    name: string;
    tenantMemberships?: string[];
}

/**
 * Tenant - The unique tenant account within the Identity Service
 */
interface Tenant {
    tenantId: string;
}

/**
 * User - The unique user within the Identity Service
 */
interface User {
    id: string;
}

/**
 * Role - A unique role associated with a tenant within the Identity Service
 */
interface Role {
    tenant:	string
    name: string
    kind: string
    permissions: string[]
    createdAt: Date
    createdBy: string
    modifiedAt:	Date
    modifiedBy: string
}

/**
 * RoleInput - The input object for creating a new Role
 */
interface RoleInput{
    name: string
    permissions: string[]

}

/**
 * RoleName - Name of a Role to add to Group
 */
interface RoleName {
    name: string
}

/**
 * Permission -
 */
interface Permission {
    name: string
    addedAt: Date
    addedBy: String
}

/**
 * GroupInput
 */
interface GroupInput {
    name: string
    roles: string[]
    members: string[]
}

/**
 * Group
 */
interface Group {
    tenant: string
    name: string
    kind: string
    roles: string[]
    members: string[]
    createdAt: Date
    createdBy: string
    modifiedAt: Date
    modifiedBy:	string
}

/**
 * GroupRole - Represents a role that is assigned to a group
 */
interface GroupRole {
    tenant:	string
    group: string
    role: string
    addedAt: Date
    addedBy: string
}

/**
 * GroupMemberName - Group member name
 */
interface GroupMemberName {
    name: string
}
