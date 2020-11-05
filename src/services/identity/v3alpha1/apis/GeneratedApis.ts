// tslint:disable
/**
 * Copyright 2020 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Identity
 * With the Identity service in Splunk Cloud Services, you can authenticate and authorize Splunk Cloud Services users.
 *
 * OpenAPI spec version: v3alpha1.0 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import {
    AddGroupMemberBody,
    AddGroupRoleBody,
    AddInvisibleMemberBody,
    AddMemberBody,
    AddRolePermissionBody,
    CreateGroupBody,
    CreateRoleBody,
    ECJwk,
    Group,
    GroupList,
    GroupMember,
    GroupRole,
    Member,
    MemberList,
    PermissionList,
    Principal,
    PrincipalList,
    PrincipalPublicKey,
    PrincipalPublicKeyStatusBody,
    PrincipalPublicKeys,
    Role,
    RoleList,
    RolePermission,
    RolePermissionList,
    ValidateInfo,
} from '../models';
import BaseApiService from "../../../../baseapiservice";
import { IdentityServiceExtensions } from "../../../../service_extensions/identity";
import { SplunkError, RequestStatus } from '../../../../client';

export const IDENTITY_SERVICE_PREFIX: string = '/identity/v3alpha1';
export const IDENTITY_SERVICE_CLUSTER: string = 'api';
/**
  * @export
  */
 export enum AccessEnum {
     Write = 'write'
 }/**
  * @export
  */
 export enum KindEnum {
     User = 'user',
     ServiceAccount = 'service_account',
     Service = 'service'
 }

// VersionEnum (manual fix, need to be fixed in codegen)
export enum VersionEnum {
    V2beta1 = "v2beta1",
    V2alpha1 = "v2alpha1",
    V3alpha1 = "v3alpha1"
}

/**
 * Identity
 * Version: v3alpha1.0
 * With the Identity service in Splunk Cloud Services, you can authenticate and authorize Splunk Cloud Services users.
 */
export class GeneratedIdentityService extends BaseApiService {
    getServiceCluster() : string {
        return IDENTITY_SERVICE_CLUSTER
    }

    getServicePrefix() : string {
        return IDENTITY_SERVICE_PREFIX;
    }
    /**
     * Adds a member to a given group.
     * @param group The group name.
     * @param addGroupMemberBody The member to add to a group.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return GroupMember
     */
    public addGroupMember = (group: string, addGroupMemberBody: AddGroupMemberBody, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<GroupMember> => {
        const path_params = {
            group: group
        };
        const path = this.template`/identity/v3alpha1/groups/${'group'}/members`(path_params);
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), addGroupMemberBody, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as GroupMember);
    }
    /**
     * Adds a role to a given group.
     * @param group The group name.
     * @param addGroupRoleBody The role to add to a group.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return GroupRole
     */
    public addGroupRole = (group: string, addGroupRoleBody: AddGroupRoleBody, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<GroupRole> => {
        const path_params = {
            group: group
        };
        const path = this.template`/identity/v3alpha1/groups/${'group'}/roles`(path_params);
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), addGroupRoleBody, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as GroupRole);
    }
    /**
     * Adds an invisible member in a given tenant.
     * @param version The service API version.
     * @param addInvisibleMemberBody The invisible member to add to the tenant.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Member
     */
    public addInvisibleMember = (version: VersionEnum, addInvisibleMemberBody: AddInvisibleMemberBody, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Member> => {
        const path_params = {
            version: version
        };
        const path = this.template`/identity/${'version'}/admin/escalate`(path_params);
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), addInvisibleMemberBody, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Member);
    }
    /**
     * Adds a member to a given tenant.
     * @param addMemberBody The member to associate with a tenant.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Member
     */
    public addMember = (addMemberBody: AddMemberBody, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Member> => {
        const path = `/identity/v3alpha1/members`;
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), addMemberBody, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Member);
    }
    /**
     * Add service principal public key
     * @param principal The principal name.
     * @param eCJwk Service principal public key
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PrincipalPublicKey
     */
    public addPrincipalPublicKey = (principal: string, eCJwk: ECJwk, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PrincipalPublicKey> => {
        const path_params = {
            principal: principal
        };
        const path = this.template`/system/identity/v3alpha1/principals/${'principal'}/keys`(path_params);
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), eCJwk, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PrincipalPublicKey);
    }
    /**
     * Adds permissions to a role in a given tenant.
     * @param role The role name.
     * @param addRolePermissionBody The permission to add to a role.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return RolePermission
     */
    public addRolePermission = (role: string, addRolePermissionBody: AddRolePermissionBody, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<RolePermission> => {
        const path_params = {
            role: role
        };
        const path = this.template`/identity/v3alpha1/roles/${'role'}/permissions`(path_params);
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), addRolePermissionBody, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as RolePermission);
    }
    /**
     * Creates a new group in a given tenant.
     * @param createGroupBody The group definition.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Group
     */
    public createGroup = (createGroupBody: CreateGroupBody, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Group> => {
        const path = `/identity/v3alpha1/groups`;
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), createGroupBody, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Group);
    }
    /**
     * Creates a new authorization role in a given tenant.
     * @param createRoleBody Role definition
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Role
     */
    public createRole = (createRoleBody: CreateRoleBody, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Role> => {
        const path = `/identity/v3alpha1/roles`;
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), createRoleBody, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Role);
    }
    /**
     * Deletes a group in a given tenant.
     * @param group The group name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public deleteGroup = (group: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            group: group
        };
        const path = this.template`/identity/v3alpha1/groups/${'group'}`(path_params);
        return this.client.delete(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Deletes principal public key
     * @param principal The principal name.
     * @param keyId Identifier of a public key.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public deletePrincipalPublicKey = (principal: string, keyId: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            principal: principal,
            keyId: keyId
        };
        const path = this.template`/system/identity/v3alpha1/principals/${'principal'}/keys/${'keyId'}`(path_params);
        return this.client.delete(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Deletes a defined role for a given tenant.
     * @param role The role name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public deleteRole = (role: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            role: role
        };
        const path = this.template`/identity/v3alpha1/roles/${'role'}`(path_params);
        return this.client.delete(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Returns information about a given group within a tenant.
     * @param group The group name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Group
     */
    public getGroup = (group: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Group> => {
        const path_params = {
            group: group
        };
        const path = this.template`/identity/v3alpha1/groups/${'group'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Group);
    }
    /**
     * Returns information about a given member within a given group.
     * @param group The group name.
     * @param member The member name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return GroupMember
     */
    public getGroupMember = (group: string, member: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<GroupMember> => {
        const path_params = {
            group: group,
            member: member
        };
        const path = this.template`/identity/v3alpha1/groups/${'group'}/members/${'member'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as GroupMember);
    }
    /**
     * Returns information about a given role within a given group.
     * @param group The group name.
     * @param role The role name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return GroupRole
     */
    public getGroupRole = (group: string, role: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<GroupRole> => {
        const path_params = {
            group: group,
            role: role
        };
        const path = this.template`/identity/v3alpha1/groups/${'group'}/roles/${'role'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as GroupRole);
    }
    /**
     * Returns a member of a given tenant.
     * @param member The member name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Member
     */
    public getMember = (member: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Member> => {
        const path_params = {
            member: member
        };
        const path = this.template`/identity/v3alpha1/members/${'member'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Member);
    }
    /**
     * Gets a member in a tenant.
     * @param version The service API version.
     * @param member The member name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Member
     */
    public getMemberAdmin = (version: VersionEnum, member: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Member> => {
        const path_params = {
            version: version,
            member: member
        };
        const path = this.template`/identity/${'version'}/admin/members/${'member'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Member);
    }
    /**
     * Returns the details of a principal, including its tenant membership and any relevant profile information. 
     * @param principal The principal name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Principal
     */
    public getPrincipal = (principal: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Principal> => {
        const path_params = {
            principal: principal
        };
        const path = this.template`/system/identity/v3alpha1/principals/${'principal'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Principal);
    }
    /**
     * Returns principal public key
     * @param principal The principal name.
     * @param keyId Identifier of a public key.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PrincipalPublicKey
     */
    public getPrincipalPublicKey = (principal: string, keyId: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PrincipalPublicKey> => {
        const path_params = {
            principal: principal,
            keyId: keyId
        };
        const path = this.template`/system/identity/v3alpha1/principals/${'principal'}/keys/${'keyId'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PrincipalPublicKey);
    }
    /**
     * Returns principal public keys
     * @param principal The principal name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PrincipalPublicKeys
     */
    public getPrincipalPublicKeys = (principal: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PrincipalPublicKeys> => {
        const path_params = {
            principal: principal
        };
        const path = this.template`/system/identity/v3alpha1/principals/${'principal'}/keys`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PrincipalPublicKeys);
    }
    /**
     * Returns a role for a given tenant.
     * @param role The role name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Role
     */
    public getRole = (role: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Role> => {
        const path_params = {
            role: role
        };
        const path = this.template`/identity/v3alpha1/roles/${'role'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Role);
    }
    /**
     * Gets a permission for the specified role.
     * @param role The role name.
     * @param permission The permission string.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return RolePermission
     */
    public getRolePermission = (role: string, permission: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<RolePermission> => {
        const path_params = {
            role: role,
            permission: permission
        };
        const path = this.template`/identity/v3alpha1/roles/${'role'}/permissions/${'permission'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as RolePermission);
    }
    /**
     * Returns a list of the members within a given group.
     * @param group The group name.
     * @param args parameters to be sent with the request
     * @param args.orderby The sorting order for returning list.
     * @param args.pageSize The maximize return items count of a list.
     * @param args.pageToken The cursor to then next page.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return MemberList
     */
    public listGroupMembers = (group: string, args?: { orderby?: string, pageSize?: number, pageToken?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<MemberList> => {
        const path_params = {
            group: group
        };
        const path = this.template`/identity/v3alpha1/groups/${'group'}/members`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as MemberList);
    }
    /**
     * Returns a list of the roles that are attached to a group within a given tenant.
     * @param group The group name.
     * @param args parameters to be sent with the request
     * @param args.orderby The sorting order for returning list.
     * @param args.pageSize The maximize return items count of a list.
     * @param args.pageToken The cursor to then next page.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return RoleList
     */
    public listGroupRoles = (group: string, args?: { orderby?: string, pageSize?: number, pageToken?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<RoleList> => {
        const path_params = {
            group: group
        };
        const path = this.template`/identity/v3alpha1/groups/${'group'}/roles`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as RoleList);
    }
    /**
     * List the groups that exist in a given tenant.
     * @param args parameters to be sent with the request
     * @param args.access List only the groups with specified access permission.
     * @param args.orderby The sorting order for returning list.
     * @param args.pageSize The maximize return items count of a list.
     * @param args.pageToken The cursor to then next page.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return GroupList
     */
    public listGroups = (args?: { access?: AccessEnum, orderby?: string, pageSize?: number, pageToken?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<GroupList> => {
        const path = `/identity/v3alpha1/groups`;
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as GroupList);
    }
    /**
     * Returns a list of groups that a member belongs to within a tenant.
     * @param member The member name.
     * @param args parameters to be sent with the request
     * @param args.orderby The sorting order for returning list.
     * @param args.pageSize The maximize return items count of a list.
     * @param args.pageToken The cursor to then next page.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return GroupList
     */
    public listMemberGroups = (member: string, args?: { orderby?: string, pageSize?: number, pageToken?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<GroupList> => {
        const path_params = {
            member: member
        };
        const path = this.template`/identity/v3alpha1/members/${'member'}/groups`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as GroupList);
    }
    /**
     * Returns a set of permissions granted to the member within the tenant. 
     * @param member The member name.
     * @param args parameters to be sent with the request
     * @param args.orderby The sorting order for returning list.
     * @param args.pageSize The maximize return items count of a list.
     * @param args.pageToken The cursor to then next page.
     * @param args.scopeFilter List only the permissions matching the scope filter.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PermissionList
     */
    public listMemberPermissions = (member: string, args?: { orderby?: string, pageSize?: number, pageToken?: string, scopeFilter?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PermissionList> => {
        const path_params = {
            member: member
        };
        const path = this.template`/identity/v3alpha1/members/${'member'}/permissions`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PermissionList);
    }
    /**
     * Returns a set of roles that a given member holds within the tenant. 
     * @param member The member name.
     * @param args parameters to be sent with the request
     * @param args.orderby The sorting order for returning list.
     * @param args.pageSize The maximize return items count of a list.
     * @param args.pageToken The cursor to then next page.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return RoleList
     */
    public listMemberRoles = (member: string, args?: { orderby?: string, pageSize?: number, pageToken?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<RoleList> => {
        const path_params = {
            member: member
        };
        const path = this.template`/identity/v3alpha1/members/${'member'}/roles`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as RoleList);
    }
    /**
     * Returns a list of members in a given tenant.
     * @param args parameters to be sent with the request
     * @param args.kind Kind of member, one of: [user, service_account, service]
     * @param args.orderby The sorting order for returning list.
     * @param args.pageSize The maximize return items count of a list.
     * @param args.pageToken The cursor to then next page.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return MemberList
     */
    public listMembers = (args?: { kind?: KindEnum, orderby?: string, pageSize?: number, pageToken?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<MemberList> => {
        const path = `/identity/v3alpha1/members`;
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as MemberList);
    }
    /**
     * Returns the list of principals that the Identity service knows about. 
     * @param args parameters to be sent with the request
     * @param args.orderby The sorting order for returning list.
     * @param args.pageSize The maximize return items count of a list.
     * @param args.pageToken The cursor to then next page.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PrincipalList
     */
    public listPrincipals = (args?: { orderby?: string, pageSize?: number, pageToken?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PrincipalList> => {
        const path = `/system/identity/v3alpha1/principals`;
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PrincipalList);
    }
    /**
     * Gets a list of groups for a role in a given tenant.
     * @param role The role name.
     * @param args parameters to be sent with the request
     * @param args.orderby The sorting order for returning list.
     * @param args.pageSize The maximize return items count of a list.
     * @param args.pageToken The cursor to then next page.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return GroupList
     */
    public listRoleGroups = (role: string, args?: { orderby?: string, pageSize?: number, pageToken?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<GroupList> => {
        const path_params = {
            role: role
        };
        const path = this.template`/identity/v3alpha1/roles/${'role'}/groups`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as GroupList);
    }
    /**
     * Gets the permissions for a role in a given tenant.
     * @param role The role name.
     * @param args parameters to be sent with the request
     * @param args.orderby The sorting order for returning list.
     * @param args.pageSize The maximize return items count of a list.
     * @param args.pageToken The cursor to then next page.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return RolePermissionList
     */
    public listRolePermissions = (role: string, args?: { orderby?: string, pageSize?: number, pageToken?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<RolePermissionList> => {
        const path_params = {
            role: role
        };
        const path = this.template`/identity/v3alpha1/roles/${'role'}/permissions`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as RolePermissionList);
    }
    /**
     * Returns all roles for a given tenant.
     * @param args parameters to be sent with the request
     * @param args.orderby The sorting order for returning list.
     * @param args.pageSize The maximize return items count of a list.
     * @param args.pageToken The cursor to then next page.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return RoleList
     */
    public listRoles = (args?: { orderby?: string, pageSize?: number, pageToken?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<RoleList> => {
        const path = `/identity/v3alpha1/roles`;
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as RoleList);
    }
    /**
     * Removes the member from a given group.
     * @param group The group name.
     * @param member The member name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public removeGroupMember = (group: string, member: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            group: group,
            member: member
        };
        const path = this.template`/identity/v3alpha1/groups/${'group'}/members/${'member'}`(path_params);
        return this.client.delete(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Removes a role from a given group.
     * @param group The group name.
     * @param role The role name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public removeGroupRole = (group: string, role: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            group: group,
            role: role
        };
        const path = this.template`/identity/v3alpha1/groups/${'group'}/roles/${'role'}`(path_params);
        return this.client.delete(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Removes a member from a given tenant
     * @param member The member name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public removeMember = (member: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            member: member
        };
        const path = this.template`/identity/v3alpha1/members/${'member'}`(path_params);
        return this.client.delete(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Removes a permission from the role.
     * @param role The role name.
     * @param permission The permission string.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public removeRolePermission = (role: string, permission: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            role: role,
            permission: permission
        };
        const path = this.template`/identity/v3alpha1/roles/${'role'}/permissions/${'permission'}`(path_params);
        return this.client.delete(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Revoke all existing access tokens issued to a principal. Principals can reset their password by visiting https://login.splunk.com/en_us/page/lost_password 
     * @param principal The principal name.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public revokePrincipalAuthTokens = (principal: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            principal: principal
        };
        const path = this.template`/system/identity/v3alpha1/principals/${'principal'}/revoke`(path_params);
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Update principal public key
     * @param principal The principal name.
     * @param keyId Identifier of a public key.
     * @param principalPublicKeyStatusBody Status of the public key
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PrincipalPublicKey
     */
    public updatePrincipalPublicKey = (principal: string, keyId: string, principalPublicKeyStatusBody: PrincipalPublicKeyStatusBody, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PrincipalPublicKey> => {
        const path_params = {
            principal: principal,
            keyId: keyId
        };
        const path = this.template`/system/identity/v3alpha1/principals/${'principal'}/keys/${'keyId'}`(path_params);
        return this.client.put(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), principalPublicKeyStatusBody, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PrincipalPublicKey);
    }
    /**
     * Validates the access token obtained from the authorization header and returns the principal name and tenant memberships. 
     * @param args parameters to be sent with the request
     * @param args.include Include additional information to return when validating tenant membership. Valid parameters [tenant, principal]
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return ValidateInfo
     */
    public validateToken = (args?: { include?: Array<string>, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<ValidateInfo> => {
        const path = `/identity/v3alpha1/validate`;
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as ValidateInfo);
    }
}
export type IdentityService = GeneratedIdentityService & IdentityServiceExtensions;
export const IdentityService = IdentityServiceExtensions(GeneratedIdentityService);
