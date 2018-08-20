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
     * @param tenantId The unique identifier of the tenant
     * @returns userProfile The profile associated with the given tenant
     */
    public getUserProfile = (tenantId: Tenant['tenantId'] = 'system'): Promise<UserProfile> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['userprofile'], tenantId))
            .then(response => response as UserProfile);
    }

    /**
     * Adds a tenant
     * @param tenantId The unique identifier of the tenant
     * @returns Status information of the request upon success
     */
    public createTenant = (tenantId: Tenant['tenantId']): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants'], 'system'), tenantId);
    }

    /**
     * Deletes a tenant
     * @param tenantId The unique identifier of the tenant
     * @returns Empty response upon success
     */
    public deleteTenant = (tenantId: Tenant['tenantId']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants', tenantId], 'system'));
    }

    /**
     * Reads a list of users in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @returns List of tenant members
     */
    public getTenantUsers = (tenantId: Tenant['tenantId']): Promise<User[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['users'], tenantId))
            .then(response => response as User[]);
    }

    /**
     * Replaces current tenant users with new users
     * @param tenantId The unique identifier of the tenant
     * @param users List of user associated with the given tenant
     * @returns Empty response upon success
     */
    public replaceTenantUsers = (tenantId: Tenant['tenantId'], users: User[]): Promise<any> => {
        return this.client.put(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['users'], tenantId), users);
    }

    /**
     * Adds a list of users to the tenant
     * @param tenantId The unique identifier of the tenant
     * @param users List of user associated with the given tenant
     * @returns Empty response upon success
     */
    public addTenantUsers = (tenantId: Tenant['tenantId'], users: User[]): Promise<any> => {
        return this.client.patch(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['users'], tenantId), users);
    }

    /**
     * Deletes a list of users from the tenant
     * @param tenantId The unique identifier of the tenant
     * @param users List of user associated with the given tenant
     */
    public deleteTenantUsers = (tenantId: Tenant['tenantId'], users: User[]): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['users'], tenantId), users);
    }

    /**
     * Adds a member to the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param memberName input object of a member
     * @returns a Member object
     */
    public createMember = (tenantId: Tenant['tenantId'], memberName: MemberName): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members'], tenantId), memberName)
            .then(response => response as Member);
    }

    /**
     * Get a member of the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param memberName input object of a member
     * @returns a Member object
     */
    public getMember = (tenantId: Tenant['tenantId'], memberName: MemberName['name']): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members', memberName], tenantId))
            .then(response => response as Member);
    }

    /**
     * Returns the list of members in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @returns a list of Members
     */
    public getMembers = (tenantId: Tenant['tenantId']): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members'], tenantId))
            .then(response => response as string[]);
    }

    /**
     * Removes a member from the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param memberName input object of a member
     * @returns  Empty response upon success
     */
    public deleteMember = (tenantId: Tenant['tenantId'], memberName: MemberName['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members', memberName], tenantId));
    }

    /**
     * Creates a new authorization role in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param roleInput The role params for creating a new role
     * @returns a Role object
     */
    public createRole = (tenantId: Tenant['tenantId'], roleInput: RoleInput): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles'], tenantId), roleInput)
            .then(response => response as Role);
    }

    /**
     * Get all roles for the given tenant
     * @param tenantId The unique identifier of the tenant
     * @returns A list of roles
     */
    public getRoles = (tenantId: Tenant['tenantId']): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles'], tenantId))
            .then(response => response as string[]);
    }

    /**
     * Get a role for the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param roleName String name of a role
     * @returns a Role object
     */
    public getRole = (tenantId: Tenant['tenantId'], roleName: Role['name']): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName], tenantId))
            .then(response => response as Role);
    }

    /**
     * Delete an authorization role in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param roleName String name of a role
     * @returns Empty response on success
     */
    public deleteRole = (tenantId: Tenant['tenantId'], roleName: Role['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName], tenantId));
    }

    /**
     * Get all the permissions for a given tenant and role name
     * @param tenantId The unique identifier of the tenant
     * @param roleName String name of a role
     * @returns A list of permissions
     */
    public getRolePermissions = (tenantId: Tenant['tenantId'], roleName: Role['name']): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions'], tenantId))
            .then(response => response as string[]);
    }

    /**
     * Adds permissions to an existing role in this tenant
     * @param tenantId The unique identifier of the tenant
     * @param roleName String name of a role
     * @param permissions A list of permissions
     * @returns Empty response upon success
     */
    public createRolePermissons = (tenantId: Tenant['tenantId'], roleName: Role['name'], permissions: string[]): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions'], tenantId), permissions)
            .then(response => response as RolePermission);
    }

    /**
     * Get a permission for the given tenant, role name, and permission name
     * @param tenantId The unique identifier of the tenant
     * @param roleName String name of a role
     * @param permissionName String name of a permission
     * @returns a RolePermission object
     */
    public getRolePermission = (tenantId: Tenant['tenantId'], roleName: Role['name'], permissionName: Permission['name']): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions', permissionName], tenantId))
            .then(response => response as RolePermission);
    }

    /**
     * Delete an authorization role in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param roleName String name of a role
     * @param permissionName
     * @returns Empty response upon success
     */
    public deleteRolePermission = (tenantId: Tenant['tenantId'], roleName: Role['name'], permissionName: Permission['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions', permissionName], tenantId));
    }

    /**
     * Deletes all permissions for a role defined in this tenant
     * @param tenantId The unique identifier of the tenant
     * @param roleName String name of a role
     * @returns Empty response upon success
     */
    public deleteAllRolePermissions = (tenantId: Tenant['tenantId'], roleName: Role['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions'], tenantId));
    }

    /**
     * Creates a new group in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param groupInput The group params for creating a new group
     * @returns Empty response upon success
     */
    public createGroup = (tenantId: Tenant['tenantId'], groupInput: GroupInput): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups'], tenantId), groupInput)
            .then(response => response as Group);
    }

    /**
     * Defines a group in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @returns a Group object
     */
    public getGroup = (tenantId: Tenant['tenantId'], groupName: Group['name']): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName], tenantId))
            .then(response => response as Group);
    }

    /**
     * Lists the groups in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @returns a list of groups
     */
    public getGroups = (tenantId: Tenant['tenantId']): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups'], tenantId))
            .then(response => response as string[]);
    }

    /**
     * Deletes a group in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @returns Empty response upon success
     */
    public deleteGroup = (tenantId: Tenant['tenantId'], groupName: Group['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName], tenantId));
    }

    /**
     * Adds a role to the group
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @param roleName String name of a role
     * @returns GroupRole
     */
    public createGroupRole = (tenantId: Tenant['tenantId'], groupName: Group['name'], roleName: RoleName): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles'], tenantId), roleName)
            .then(response => response as GroupRole);
    }

    /**
     * Returns group-role relationship details
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @param roleName String name of a role
     * @returns a GroupRole object
     */
    public getGroupRole = (tenantId: Tenant['tenantId'], groupName: Group['name'], roleName: Role['name']): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles', roleName], tenantId))
            .then(response => response as GroupRole);
    }

    /**
     * Lists the roles attached to the group
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @returns a list of groupRoles
     */
    public getGroupRoles = (tenantId: Tenant['tenantId'], groupName: Group['name']): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles'], tenantId))
            .then(response => response as string[]);
    }

    /**
     * Removes the role from the group
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @param roleName String name of a role
     * @returns Empty response upon success
     */
    public deleteGroupRole = (tenantId: Tenant['tenantId'], groupName: Group['name'], roleName: Role['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles', roleName], tenantId));
    }

    /**
     * Adds a member to the group
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @param groupMemberName String name of group member
     * @returns a GroupMember object
     */
    public createGroupMember = (tenantId: Tenant['tenantId'], groupName: Group['name'], groupMemberName: GroupMemberName): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members'], tenantId), groupMemberName)
            .then(response => response as GroupMember);
    }

    /**
     * Returns group-member relationship details
     * @param  tenantId The unique identifier of the tenant
     * @param  groupName String name of a group
     * @param  groupMemberName String name of group member
     * @returns a GroupMember object
     */
    public getGroupMember = (tenantId: Tenant['tenantId'], groupName: Group['name'], groupMemberName: GroupMemberName['name']): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members', groupMemberName], tenantId))
            .then(response => response as GroupMember);
    }

    /**
     * Lists the members in the given group
     * @param  tenantId The unique identifier of the tenant
     * @param  groupName String name of a group
     * @returns a list of group members
     */
    public getGroupMembers = (tenantId: Tenant['tenantId'], groupName: Group['name']): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members'], tenantId))
            .then(response => response as string[]);
    }

    /**
     * Removes the member from the group
     * @param  tenantId The unique identifier of the tenant
     * @param  groupName String name of a group
     * @param  groupMemberName String name of group member
     * @returns Empty response upon success
     */
    public deleteGroupMember = (tenantId: Tenant['tenantId'], groupName: Group['name'], groupMemberName: GroupMemberName['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members', groupMemberName], tenantId));
    }

    /**
     * Create a new principal
     * @param principalInput
     * @returns a Principal object
     */
    public createPrincipal = (principalInput: PrincipalInput): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['principals'], 'system'), principalInput)
            .then(response => response as Principal);
    }

    /**
     * Returns the principal details
     * @param principalName
     * @returns a Principal object
     */
    public getPrincipal = (principalName: PrincipalInput['name']): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['principals', principalName], 'system'))
            .then(response => response as Principal);
    }

    /**
     * Returns the list of principals known to IAC
     * @returns a list of principals
     */
    public getPrincipals = (): Promise<any> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['principals'], 'system'))
            .then(response => response as string[]);
    }

    /**
     * Deletes a principal
     * @param principalName
     * @returns Empty response upon success
     */
    public deletePrincipal = (principalName: PrincipalInput['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['principals', principalName], 'system'));
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
    tenant: string
    name: string
    createdAt: Date
    createdBy: string
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
 * RolePermission - The object that represents a tenant role permission
 */
interface RolePermission {
    tenant: string
    role: string
    permission: string
    addedAt: Date
    addedBy: string
}

/**
 * Permission - Permission on a Role
 */
interface Permission {
    name: string
    addedAt: Date
    addedBy: string
}

/**
 * GroupInput - Inputs for a Group
 */
interface GroupInput {
    name: string
    roles: string[]
    members: string[]
}

/**
 * Group - Association of tenants, members
 */
interface Group {
    tenant: string
    name: string
    createdAt: Date
    createdBy: string
}

/**
 * GroupRole - Represents a role that is assigned to a group
 */
interface GroupRole {
    tenant: string
    group: string
    role: string
    addedAt: Date
    addedBy: string
}

/**
 * MemberName -member name
 */
interface MemberName {
    name: string
}


/**
 * Represents a member that belongs to a tenant.
 */
interface Member {
    tenant: string
    name: string
    addedAt: Date
    addedBy: string
}

/**
 * GroupMemberName - Group member name
 */
interface GroupMemberName {
    name: string
}

/**
 * Represents a member that belongs to a group
 */
interface GroupMember {
    tenant: string
    group: string
    principal: string
    addedAt: string
    addedBy: string
}

/**
 * PrincipalInput - Input object for creating a new Principal
 */
interface PrincipalInput {
    name: string
    kind: string
}

/**
 * Principal - Principal member
 */
interface Principal {
    name: string
    kind: string
    tenants: string[]
    createdAt: Date
    createdBy: Date
    profile: {}
}
