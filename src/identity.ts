/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import BaseApiService from './baseapiservice';
import { IDENTITY_SERVICE_PREFIX, SERVICE_CLUSTER_MAPPING } from './service_prefixes';


/**
 * Encapsulates Identity endpoints
 */
export class IdentityService extends BaseApiService {
    /**
     * Validates the access token obtained from authorization header and returns the principal name and tenant memberships
     * @returns a ValidateInfo object
     */
    public validate = (): Promise<ValidateInfo> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['validate']))
            .then(response => response.body as ValidateInfo);
    }

    /**
     * Creates a tenant and default roles/groups
     * @param tenantName unique identifier of the tenant
     * @returns a Tenant object
     */
    public createTenant = (tenantName: TenantName): Promise<Tenant> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants'], 'system'), tenantName)
            .then(response => response.body as Tenant);
    }

    /**
     * Returns the tenant details
     * @param tenantName unique identifier of the tenant
     * @returns a Tenant object
     */
    public getTenant = (tenantName: Tenant['name']): Promise<Tenant> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants', tenantName],'system'))
            .then(response => response.body as Tenant);
    }

    /**
     * Returns the list of tenants in the system
     * @returns a list of tenant names
     */
    public getTenants = (): Promise<string[]> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants'],'system'))
            .then(response => response.body as string[]);
    }

    /**
     * Delete the tenant
     * @param tenantName unique identifier of the tenant
     * @returns A promise that resolves upon deletion
     */
    public deleteTenant = (tenantName: Tenant['name']): Promise<object> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants', tenantName],'system'))
            .then(response => response.body as object);
    }

    /**
     * Adds a member to the current tenant
     * @param memberName input object of a member
     * @returns a Member object
     */
    public addMember = (memberName: MemberName): Promise<Member> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members']), memberName)
            .then(response => response.body as Member);
    }

    /**
     * Get a member of the current tenant
     * @param memberName input object of a member
     * @returns a Member object
     */
    public getMember = (memberName: MemberName['name']): Promise<Member> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members', memberName]))
            .then(response => response.body as Member);
    }

    /**
     * Returns the list of members in the current tenant
     * @returns a list of Members
     */
    public getMembers = (): Promise<string[]> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members']))
            .then(response => response.body as string[]);
    }

    /**
     * Removes a member from the current tenant
     * @param memberName input object of a member
     * @returns  A promise that resolves upon deletion
     */
    public removeMember = (memberName: MemberName['name']): Promise<object> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members', memberName]))
            .then(response => response.body as object);
    }

    /**
     * Returns the list of the member's groups in the current tenant
     * @param memberName input object of a member
     * @returns a list of Groups
     */
    public listMemberGroups = (memberName: MemberName['name']): Promise<string[]> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['members', memberName, 'groups']))
            .then(response => response.body as string[]);
    }

    /**
     * Creates a new authorization role in the current tenant
     * @param roleInput The role params for creating a new role
     * @returns a Role object
     */
    public createRole = (roleInput: RoleInput): Promise<Role> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles']), roleInput)
            .then(response => response.body as Role);
    }

    /**
     * Get all roles for the current tenant
     * @returns A list of roles
     */
    public listRoles = (): Promise<string[]> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles']))
            .then(response => response.body as string[]);
    }

    /**
     * Get a role for the current tenant
     * @param roleName String name of a role
     * @returns a Role object
     */
    public getRole = (roleName: Role['name']): Promise<Role> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName]))
            .then(response => response.body as Role);
    }

    /**
     * Delete an authorization role in the current tenant
     * @param roleName String name of a role
     * @returns A promise that resolves upon deletion
     */
    public deleteRole = (roleName: Role['name']): Promise<object> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName]))
            .then(response => response.body as object);
    }

    /**
     * Get all the permissions for a current tenant and role name
     * @param roleName String name of a role
     * @returns A list of permissions
     */
    public listRolePermissions = (roleName: Role['name']): Promise<string[]> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions']))
            .then(response => response.body as string[]);
    }

    /**
     * Adds permissions to an existing role in this tenant
     * @param roleName String name of a role
     * @param permission String name of a permission
     * @returns A promise that resolves upon deletion
     */
    public addRolePermission = (roleName: Role['name'], permission: PostPermissionBody): Promise<RolePermission> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions']), JSON.stringify(permission))
            .then(response => response.body as RolePermission);
    }

    /**
     * Get a permission for the current tenant, role name, and permission name
     * @param roleName String name of a role
     * @param permissionName String name of a permission
     * @returns a RolePermission object
     */
    public getRolePermission = (roleName: Role['name'], permissionName: Permission['name']): Promise<RolePermission> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions', permissionName]))
            .then(response => response.body as RolePermission);
    }

    /**
     * Remove an authorization role in the current tenant
     * @param roleName String name of a role
     * @param permissionName
     * @returns A promise that resolves upon deletion
     */
    public removeRolePermission = (roleName: Role['name'], permissionName: Permission['name']): Promise<object> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['roles', roleName, 'permissions', permissionName]))
            .then(response => response.body as object);
    }

    /**
     * Creates a new group in the current tenant
     * @param postGroupBody The group params for creating a new group
     * @returns A promise that resolves upon deletion
     */
    public createGroup = (postGroupBody: PostGroupBody): Promise<Group> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups']), postGroupBody)
            .then(response => response.body as Group);
    }

    /**
     * Defines a group in the current tenant
     * @param groupName String name of a group
     * @returns a Group object
     */
    public getGroup = (groupName: Group['name']): Promise<Group> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName]))
            .then(response => response.body as Group);
    }

    /**
     * Lists the groups in the current tenant
     * @returns a list of groups
     */
    public listGroups = (): Promise<string[]> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups']))
            .then(response => response.body as string[]);
    }

    /**
     * Deletes a group in the current tenant
     * @param groupName String name of a group
     * @returns A promise that resolves upon deletion
     */
    public deleteGroup = (groupName: Group['name']): Promise<object> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName]))
            .then(response => response.body as object);
    }

    /**
     * Adds a role to the group
     * @param groupName String name of a group
     * @param roleName String name of a role
     * @returns GroupRole
     */
    public addGroupRole = (groupName: Group['name'], roleName: PostGroupRoleBody): Promise<GroupRole> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles']), roleName)
            .then(response => response.body as GroupRole);
    }

    /**
     * Returns group-role relationship details
     * @param groupName String name of a group
     * @param roleName String name of a role
     * @returns a GroupRole object
     */
    public getGroupRole = (groupName: Group['name'], roleName: Role['name']): Promise<GroupRole> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles', roleName]))
            .then(response => response.body as GroupRole);
    }

    /**
     * Lists the roles attached to the group
     * @param groupName String name of a group
     * @returns a list of groupRoles
     */
    public listGroupRoles = (groupName: Group['name']): Promise<string[]> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles']))
            .then(response => response.body as string[]);
    }

    /**
     * Removes the role from the group
     * @param groupName String name of a group
     * @param roleName String name of a role
     * @returns A promise that resolves upon deletion
     */
    public removeGroupRole = (groupName: Group['name'], roleName: Role['name']): Promise<object> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'roles', roleName]))
            .then(response => response.body as object);
    }

    /**
     * Adds a member to the group
     * @param groupName String name of a group
     * @param groupMemberName String name of group member
     * @returns a GroupMember object
     */
    public addGroupMember = (groupName: Group['name'], groupMemberName: GroupMemberName): Promise<GroupMember> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members']), groupMemberName)
            .then(response => response.body as GroupMember);
    }

    /**
     * Returns group-member relationship details
     * @param  groupName String name of a group
     * @param  groupMemberName String name of group member
     * @returns a GroupMember object
     */
    public getGroupMember = (groupName: Group['name'], groupMemberName: MemberName['name']): Promise<GroupMember> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members', groupMemberName]))
            .then(response => response.body as GroupMember);
    }

    /**
     * Lists the members in the given group
     * @param  groupName String name of a group
     * @returns a list of group members
     */
    public listGroupMembers = (groupName: Group['name']): Promise<string[]> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members']))
            .then(response => response.body as string[]);
    }

    /**
     * Removes the member from the group
     * @param  groupName String name of a group
     * @param  groupMemberName String name of group member
     * @returns A promise that resolves upon deletion
     */
    public removeGroupMember = (groupName: Group['name'], groupMemberName: MemberName['name']): Promise<object> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['groups', groupName, 'members', groupMemberName]))
            .then(response => response.body as object);
    }

    /**
     * Create a new principal
     * @param postPrincipalBody
     * @returns a Principal object
     */
    public createPrincipal = (postPrincipalBody: PostPrincipalBody): Promise<Principal> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['principals'], 'system'), postPrincipalBody)
            .then(response => response.body as Principal);
    }

    /**
     * Returns the principal details
     * @param principalName
     * @returns a Principal object
     */
    public getPrincipal = (principalName: Principal['name']): Promise<Principal> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['principals', principalName], 'system'))
            .then(response => response.body as Principal);
    }

    /**
     * Returns the list of principals known to IAC
     * @returns a list of principals
     */
    public listPrincipals = (): Promise<string[]> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['principals'], 'system'))
            .then(response => response.body as string[]);
    }

    /**
     * Deletes a principal
     * @param principalName
     * @returns A promise that resolves upon deletion
     */
    public deletePrincipal = (principalName: Principal['name']): Promise<object> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.identity, this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['principals', principalName], 'system'))
            .then(response => response.body as object);
    }

}

export enum TenantStatus {
    PROVISIONING = 'provisioning',
    FAILED = 'failed',
    READY = 'ready',
    DELETING = 'deleting',
    DELETED = 'deleted',
}

/**
 * TenantName - Name of a Tenant
 */
export interface TenantName {
    name: string;
}

/**
 * Tenant - The unique tenant account within the Identity Service
 */
export interface Tenant {
    name: TenantName['name'];
    status: TenantStatus;
    createdAt: Date;
    createdBy: string;
}

/**
 * Role - A unique role associated with a tenant within the Identity Service
 */
export interface Role {
    createdAt: string;
    createdBy: string;
    name: string;
    tenant: string;
}

/**
 * RoleInput - The input object for creating a new Role
 */
export interface RoleInput {
    name: string;
}

/**
 * RoleName - Name of a Role to add to Group
 */
export interface RoleName {
    name: string;
}

/**
 * PostPermissionBody - Permission to add to a role
 */
export type PostPermissionBody = string;

/**
 * RolePermission - The object that represents a tenant role permission
 */
export interface RolePermission {
    tenant: string;
    role: string;
    permission: string;
    addedAt: string;
    addedBy: string;
}

/**
 * Permission - Permission on a Role
 */
export interface Permission {
    name: string;
}

/**
 * PostGroupBody - Group definition
 */
export interface PostGroupBody {
    name: string;
}

/**
 * Group - Association of tenants, members
 */
export interface Group {
    tenant: string;
    name: string;
    createdAt: string;
    createdBy: string;
}

export interface PostGroupRoleBody {
    name: string;
}
/**
 * GroupRole - Represents a role that is assigned to a group
 */
export interface GroupRole {
    tenant: string;
    group: string;
    role: string;
    addedAt: string;
    addedBy: string;
}

/**
 * MemberName - Member name
 */
export interface MemberName {
    name: string;
}

/**
 * Represents a member that belongs to a tenant.
 */
export interface Member {
    tenant: string;
    name: string;
    addedAt: string;
    addedBy: string;
}

/**
 * GroupMemberName - Group member namet
 */
export interface GroupMemberName {
    name: string;
}

/**
 * Represents a member that belongs to a group
 */
export interface GroupMember {
    tenant: string;
    group: string;
    principal: string;
    addedAt: string;
    addedBy: string;
}

export enum PrincipalKind {
   SERVICE_ACCOUNT = 'service_account',
   USER = 'user',
}

/**
 * PostPrincipalBody - Input object for creating a new Principal
 */
export interface PostPrincipalBody {
    name: string;
    kind: PrincipalKind;
}

/**
 * Principal - Principal member
 */
export interface Principal {
    name: string;
    kind: PrincipalKind;
    tenants: Tenant[];
    createdAt: string;
    createdBy: string;
    profile?: object;
}

/**
 * ValidateInfo - Info object for a valid member
 */
export interface ValidateInfo {
    name: string;
}
