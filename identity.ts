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
     * @param tenantName unique identifier of the tenant
     * @returns a ValidateInfo object
     */
    public validate = (tenantName: Tenant['name']) : Promise<ValidateInfo> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['validate'], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as ValidateInfo);
    }

    /**
     * Creates a tenant and default roles/groups
     * @param tenantName unique identifier of the tenant
     * @returns a Tenant object
     */
    public createTenant = (tenantName: Tenant['name']): Promise<Tenant> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants'], 'system'), tenantName)
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Returns the tenant details
     * @param tenantName unique identifier of the tenant
     * @returns a Tenant object
     */
    public getTenant = (tenantName: Tenant['name']): Promise<Tenant> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants', tenantName], 'system'))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Returns the list of tenants in the system
     * @param tenantName unique identifier of the tenant
     * @returns a list of tenant names
     */
    public getTenants = (tenantName: Tenant['name']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants'], 'system'))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Adds a member to the given tenant
     * @param tenantName unique identifier of the tenant
     * @param memberName input object of a member
     * @returns a Member object
     */
    public addMember = (tenantName: Tenant['name'], memberName: MemberName): Promise<Member> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members'], tenantName), memberName)
            .then(response => response.Body)
            .then(responseBody => responseBody as Member);
    }

    /**
     * Get a member of the given tenant
     * @param tenantName unique identifier of the tenant
     * @param memberName input object of a member
     * @returns a Member object
     */
    public getMember = (tenantName: Tenant['name'], memberName: MemberName['name']): Promise<Member> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members', memberName], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as Member);
    }

    /**
     * Returns the list of members in the given tenant
     * @param tenantName unique identifier of the tenant
     * @returns a list of Members
     */
    public getMembers = (tenantName: Tenant['name']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members'], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Removes a member from the given tenant
     * @param tenantName unique identifier of the tenant
     * @param memberName input object of a member
     * @returns  A promise that resolves upon deletion
     */
    public deleteMember = (tenantName: Tenant['name'], memberName: MemberName['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members', memberName], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Returns the list of the member's groups in the given tenant
     * @param tenantName unique identifier of the tenant
     * @param memberName input object of a member
     * @returns a list of Groups
     */
    public getMemberGroups = (tenantName: Tenant['name'], memberName: MemberName['name']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members', memberName, 'groups'], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Creates a new authorization role in the given tenant
     * @param tenantName unique identifier of the tenant
     * @param roleInput The role params for creating a new role
     * @returns a Role object
     */
    public createRole = (tenantName: Tenant['name'], roleInput: RoleInput): Promise<Role> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles'], tenantName), roleInput)
            .then(response => response.Body)
            .then(responseBody => responseBody as Role);
    }

    /**
     * Get all roles for the given tenant
     * @param tenantName unique identifier of the tenant
     * @returns A list of roles
     */
    public getRoles = (tenantName: Tenant['name']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles'], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Get a role for the given tenant
     * @param tenantName unique identifier of the tenant
     * @param roleName String name of a role
     * @returns a Role object
     */
    public getRole = (tenantName: Tenant['name'], roleName: Role['name']): Promise<Role> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as Role);
    }

    /**
     * Delete an authorization role in the given tenant
     * @param tenantName unique identifier of the tenant
     * @param roleName String name of a role
     * @returns A promise that resolves upon deletion
     */
    public deleteRole = (tenantName: Tenant['name'], roleName: Role['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Get all the permissions for a given tenant and role name
     * @param tenantName unique identifier of the tenant
     * @param roleName String name of a role
     * @returns A list of permissions
     */
    public getRolePermissions = (tenantName: Tenant['name'], roleName: Role['name']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions'], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Adds permissions to an existing role in this tenant
     * @param tenantName unique identifier of the tenant
     * @param roleName String name of a role
     * @param permission String name of a permission
     * @returns A promise that resolves upon deletion
     */
    public addRolePermissions = (tenantName: Tenant['name'], roleName: Role['name'], permission: string): Promise<RolePermission> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions'], tenantName), JSON.stringify(permission))
            .then(response => response.Body)
            .then(responseBody => responseBody as RolePermission);
    }

    /**
     * Get a permission for the given tenant, role name, and permission name
     * @param tenantName unique identifier of the tenant
     * @param roleName String name of a role
     * @param permissionName String name of a permission
     * @returns a RolePermission object
     */
    public getRolePermission = (tenantName: Tenant['name'], roleName: Role['name'], permissionName: Permission['name']): Promise<RolePermission> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions', permissionName], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as RolePermission);
    }

    /**
     * Remove an authorization role in the given tenant
     * @param tenantName unique identifier of the tenant
     * @param roleName String name of a role
     * @param permissionName
     * @returns A promise that resolves upon deletion
     */
    public removeRolePermission = (tenantName: Tenant['name'], roleName: Role['name'], permissionName: Permission['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions', permissionName], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Creates a new group in the given tenant
     * @param tenantName unique identifier of the tenant
     * @param groupInput The group params for creating a new group
     * @returns A promise that resolves upon deletion
     */
    public createGroup = (tenantName: Tenant['name'], groupInput: GroupInput): Promise<Group> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups'], tenantName), groupInput)
            .then(response => response.Body)
            .then(responseBody => responseBody as Group);
    }

    /**
     * Defines a group in the given tenant
     * @param tenantName unique identifier of the tenant
     * @param groupName String name of a group
     * @returns a Group object
     */
    public getGroup = (tenantName: Tenant['name'], groupName: Group['name']): Promise<Group> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as Group);
    }

    /**
     * Lists the groups in the given tenant
     * @param tenantName unique identifier of the tenant
     * @returns a list of groups
     */
    public getGroups = (tenantName: Tenant['name']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups'], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Deletes a group in the given tenant
     * @param tenantName unique identifier of the tenant
     * @param groupName String name of a group
     * @returns A promise that resolves upon deletion
     */
    public deleteGroup = (tenantName: Tenant['name'], groupName: Group['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Adds a role to the group
     * @param tenantName unique identifier of the tenant
     * @param groupName String name of a group
     * @param roleName String name of a role
     * @returns GroupRole
     */
    public addGroupRole = (tenantName: Tenant['name'], groupName: Group['name'], roleName: RoleName): Promise<GroupRole> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles'], tenantName), roleName)
            .then(response => response.Body)
            .then(responseBody => responseBody as GroupRole);
    }

    /**
     * Returns group-role relationship details
     * @param tenantName unique identifier of the tenant
     * @param groupName String name of a group
     * @param roleName String name of a role
     * @returns a GroupRole object
     */
    public getGroupRole = (tenantName: Tenant['name'], groupName: Group['name'], roleName: Role['name']): Promise<GroupRole> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles', roleName], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as GroupRole);
    }

    /**
     * Lists the roles attached to the group
     * @param tenantName unique identifier of the tenant
     * @param groupName String name of a group
     * @returns a list of groupRoles
     */
    public getGroupRoles = (tenantName: Tenant['name'], groupName: Group['name']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles'], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Removes the role from the group
     * @param tenantName unique identifier of the tenant
     * @param groupName String name of a group
     * @param roleName String name of a role
     * @returns A promise that resolves upon deletion
     */
    public removeGroupRole = (tenantName: Tenant['name'], groupName: Group['name'], roleName: Role['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles', roleName], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Adds a member to the group
     * @param tenantName unique identifier of the tenant
     * @param groupName String name of a group
     * @param groupMemberName String name of group member
     * @returns a GroupMember object
     */
    public addGroupMember = (tenantName: Tenant['name'], groupName: Group['name'], groupMemberName: GroupMemberName): Promise<GroupMember> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members'], tenantName), groupMemberName)
            .then(response => response.Body)
            .then(responseBody => responseBody as GroupMember);
    }

    /**
     * Returns group-member relationship details
     * @param  tenantName unique identifier of the tenant
     * @param  groupName String name of a group
     * @param  groupMemberName String name of group member
     * @returns a GroupMember object
     */
    public getGroupMember = (tenantName: Tenant['name'], groupName: Group['name'], groupMemberName: GroupMemberName['name']): Promise<GroupMember> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members', groupMemberName], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as GroupMember);
    }

    /**
     * Lists the members in the given group
     * @param  tenantName unique identifier of the tenant
     * @param  groupName String name of a group
     * @returns a list of group members
     */
    public getGroupMembers = (tenantName: Tenant['name'], groupName: Group['name']): Promise<string[]> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members'], tenantName))
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    }

    /**
     * Removes the member from the group
     * @param  tenantName unique identifier of the tenant
     * @param  groupName String name of a group
     * @param  groupMemberName String name of group member
     * @returns A promise that resolves upon deletion
     */
    public removeGroupMember = (tenantName: Tenant['name'], groupName: Group['name'], groupMemberName: GroupMemberName['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members', groupMemberName], tenantName))
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
 * Tenant - The unique tenant account within the Identity Service
 */
interface Tenant {
    name: string
    status: string
    createdAt: Date
    createdBy: string
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
