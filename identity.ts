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
     * Validates the access token obtained from authorization header and returns the principal name and tenant memberships
     * @param tenantId The unique identifier of the tenant
     * @returns a ValidateInfo object
     */
    public validate = (tenantId: Tenant['tenantId']) : Promise<ValidateInfo> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['validate'], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as ValidateInfo);
    }

    /**
     * Adds a member to the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param memberName input object of a member
     * @returns a Member object
     */
    public addMember = (tenantId: Tenant['tenantId'], memberName: MemberName): Promise<Member> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members'], tenantId), memberName)
            .then(response => response.Body)
            .then(responseBody => responseBody as Member);
    }

    /**
     * Get a member of the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param memberName input object of a member
     * @returns a Member object
     */
    public getMember = (tenantId: Tenant['tenantId'], memberName: MemberName['name']): Promise<Member> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members', memberName], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as Member);
    }

    /**
     * Returns the list of members in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @returns a list of Members
     */
    public getMembers = (tenantId: Tenant['tenantId']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members'], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Removes a member from the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param memberName input object of a member
     * @returns  A promise that resolves upon deletion
     */
    public deleteMember = (tenantId: Tenant['tenantId'], memberName: MemberName['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members', memberName], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Returns the list of the member's groups in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param memberName input object of a member
     * @returns a list of Groups
     */
    public getMemberGroups = (tenantId: Tenant['tenantId'], memberName: MemberName['name']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members', memberName, 'groups'], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Creates a new authorization role in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param roleInput The role params for creating a new role
     * @returns a Role object
     */
    public createRole = (tenantId: Tenant['tenantId'], roleInput: RoleInput): Promise<Role> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles'], tenantId), roleInput)
            .then(response => response.Body)
            .then(responseBody => responseBody as Role);
    }

    /**
     * Get all roles for the given tenant
     * @param tenantId The unique identifier of the tenant
     * @returns A list of roles
     */
    public getRoles = (tenantId: Tenant['tenantId']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles'], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Get a role for the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param roleName String name of a role
     * @returns a Role object
     */
    public getRole = (tenantId: Tenant['tenantId'], roleName: Role['name']): Promise<Role> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as Role);
    }

    /**
     * Delete an authorization role in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param roleName String name of a role
     * @returns A promise that resolves upon deletion
     */
    public deleteRole = (tenantId: Tenant['tenantId'], roleName: Role['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Get all the permissions for a given tenant and role name
     * @param tenantId The unique identifier of the tenant
     * @param roleName String name of a role
     * @returns A list of permissions
     */
    public getRolePermissions = (tenantId: Tenant['tenantId'], roleName: Role['name']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions'], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Adds permissions to an existing role in this tenant
     * @param tenantId The unique identifier of the tenant
     * @param roleName String name of a role
     * @param permission String name of a permission
     * @returns A promise that resolves upon deletion
     */
    public addRolePermissions = (tenantId: Tenant['tenantId'], roleName: Role['name'], permission: string): Promise<RolePermission> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions'], tenantId), JSON.stringify(permission))
            .then(response => response.Body)
            .then(responseBody => responseBody as RolePermission);
    }

    /**
     * Get a permission for the given tenant, role name, and permission name
     * @param tenantId The unique identifier of the tenant
     * @param roleName String name of a role
     * @param permissionName String name of a permission
     * @returns a RolePermission object
     */
    public getRolePermission = (tenantId: Tenant['tenantId'], roleName: Role['name'], permissionName: Permission['name']): Promise<RolePermission> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions', permissionName], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as RolePermission);
    }

    /**
     * Delete an authorization role in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param roleName String name of a role
     * @param permissionName
     * @returns A promise that resolves upon deletion
     */
    public deleteRolePermission = (tenantId: Tenant['tenantId'], roleName: Role['name'], permissionName: Permission['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions', permissionName], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Creates a new group in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param groupInput The group params for creating a new group
     * @returns A promise that resolves upon deletion
     */
    public createGroup = (tenantId: Tenant['tenantId'], groupInput: GroupInput): Promise<Group> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups'], tenantId), groupInput)
            .then(response => response.Body)
            .then(responseBody => responseBody as Group);
    }

    /**
     * Defines a group in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @returns a Group object
     */
    public getGroup = (tenantId: Tenant['tenantId'], groupName: Group['name']): Promise<Group> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as Group);
    }

    /**
     * Lists the groups in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @returns a list of groups
     */
    public getGroups = (tenantId: Tenant['tenantId']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups'], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Deletes a group in the given tenant
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @returns A promise that resolves upon deletion
     */
    public deleteGroup = (tenantId: Tenant['tenantId'], groupName: Group['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Adds a role to the group
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @param roleName String name of a role
     * @returns GroupRole
     */
    public addGroupRole = (tenantId: Tenant['tenantId'], groupName: Group['name'], roleName: RoleName): Promise<GroupRole> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles'], tenantId), roleName)
            .then(response => response.Body)
            .then(responseBody => responseBody as GroupRole);
    }

    /**
     * Returns group-role relationship details
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @param roleName String name of a role
     * @returns a GroupRole object
     */
    public getGroupRole = (tenantId: Tenant['tenantId'], groupName: Group['name'], roleName: Role['name']): Promise<GroupRole> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles', roleName], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as GroupRole);
    }

    /**
     * Lists the roles attached to the group
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @returns a list of groupRoles
     */
    public getGroupRoles = (tenantId: Tenant['tenantId'], groupName: Group['name']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles'], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Removes the role from the group
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @param roleName String name of a role
     * @returns A promise that resolves upon deletion
     */
    public deleteGroupRole = (tenantId: Tenant['tenantId'], groupName: Group['name'], roleName: Role['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles', roleName], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Adds a member to the group
     * @param tenantId The unique identifier of the tenant
     * @param groupName String name of a group
     * @param groupMemberName String name of group member
     * @returns a GroupMember object
     */
    public addGroupMember = (tenantId: Tenant['tenantId'], groupName: Group['name'], groupMemberName: GroupMemberName): Promise<GroupMember> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members'], tenantId), groupMemberName)
            .then(response => response.Body)
            .then(responseBody => responseBody as GroupMember);
    }

    /**
     * Returns group-member relationship details
     * @param  tenantId The unique identifier of the tenant
     * @param  groupName String name of a group
     * @param  groupMemberName String name of group member
     * @returns a GroupMember object
     */
    public getGroupMember = (tenantId: Tenant['tenantId'], groupName: Group['name'], groupMemberName: GroupMemberName['name']): Promise<GroupMember> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members', groupMemberName], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as GroupMember);
    }

    /**
     * Lists the members in the given group
     * @param  tenantId The unique identifier of the tenant
     * @param  groupName String name of a group
     * @returns a list of group members
     */
    public getGroupMembers = (tenantId: Tenant['tenantId'], groupName: Group['name']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members'], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Removes the member from the group
     * @param  tenantId The unique identifier of the tenant
     * @param  groupName String name of a group
     * @param  groupMemberName String name of group member
     * @returns A promise that resolves upon deletion
     */
    public deleteGroupMember = (tenantId: Tenant['tenantId'], groupName: Group['name'], groupMemberName: GroupMemberName['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members', groupMemberName], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Create a new principal
     * @param principalInput
     * @returns a Principal object
     */
    public createPrincipal = (principalInput: PrincipalInput): Promise<Principal> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['principals'], 'system'), principalInput)
            .then(response => response.Body)
            .then(responseBody => responseBody as Principal);
    }

    /**
     * Returns the principal details
     * @param principalName
     * @returns a Principal object
     */
    public getPrincipal = (principalName: PrincipalInput['name']): Promise<Principal> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['principals', principalName], 'system'))
            .then(response => response.Body)
            .then(responseBody => responseBody as Principal);
    }

    /**
     * Returns the list of principals known to IAC
     * @returns a list of principals
     */
    public getPrincipals = (): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['principals'], 'system'))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Deletes a principal
     * @param principalName
     * @returns A promise that resolves upon deletion
     */
    public deletePrincipal = (principalName: PrincipalInput['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['principals', principalName], 'system'))
            .then(response => response.Body)
            .then(responseBody => responseBody);
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
    createdAt: Date
    createdBy: string
    name: string
    tenant: string
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
 * MemberName - Member name
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

/**
 * ValidateInfo - Info object for a valid member
 */
interface ValidateInfo {
    name: string
    tenants: string[]
}
