// tslint:disable
/**
 * Copyright 2019 Splunk, Inc.
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
 * With the Splunk Cloud Identity Service, you can authenticate and authorize Splunk API users.
 *
 * OpenAPI spec version: v2beta1.12 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import {
    AddGroupMemberBody,
    AddGroupRoleBody,
    AddMemberBody,
    CreateGroupBody,
    CreateRoleBody,
    Group,
    GroupMember,
    GroupRole,
    Member,
    Principal,
    Role,
    RolePermission,
    ValidateInfo,
} from '../models';
import BaseApiService from "../../../../baseapiservice";
import { IdentityServiceExtensions } from "../../../../service_extensions/identity";
import { SplunkError } from '../../../../client';

export const IDENTITY_SERVICE_PREFIX: string = '/identity/v2beta1';
export const IDENTITY_SERVICE_CLUSTER: string = 'api';

/**
 * Identity
 * Version: v2beta1.12
 * With the Splunk Cloud Identity Service, you can authenticate and authorize Splunk API users.
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
     * @return GroupMember
     */
    public addGroupMember = (group: string, addGroupMemberBody: AddGroupMemberBody): Promise<GroupMember> => {
        const path_params = {
            group: group
        };
        const path = this.template`/identity/v2beta1/groups/${'group'}/members`(path_params);
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), addGroupMemberBody)
            .then(response => response.body as GroupMember);
    }
    /**
     * Adds a role to a given group.
     * @param group The group name.
     * @param addGroupRoleBody The role to add to a group.
     * @return GroupRole
     */
    public addGroupRole = (group: string, addGroupRoleBody: AddGroupRoleBody): Promise<GroupRole> => {
        const path_params = {
            group: group
        };
        const path = this.template`/identity/v2beta1/groups/${'group'}/roles`(path_params);
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), addGroupRoleBody)
            .then(response => response.body as GroupRole);
    }
    /**
     * Adds a member to a given tenant.
     * @param addMemberBody The member to associate with a tenant.
     * @return Member
     */
    public addMember = (addMemberBody: AddMemberBody): Promise<Member> => {
        const path = `/identity/v2beta1/members`;
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), addMemberBody)
            .then(response => response.body as Member);
    }
    /**
     * Adds permissions to a role in a given tenant.
     * @param role The role name.
     * @param body The permission to add to a role.
     * @return RolePermission
     */
    public addRolePermission = (role: string, body: string): Promise<RolePermission> => {
        const path_params = {
            role: role
        };
        const path = this.template`/identity/v2beta1/roles/${'role'}/permissions`(path_params);
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), body)
            .then(response => response.body as RolePermission);
    }
    /**
     * Creates a new group in a given tenant.
     * @param createGroupBody The group definition.
     * @return Group
     */
    public createGroup = (createGroupBody: CreateGroupBody): Promise<Group> => {
        const path = `/identity/v2beta1/groups`;
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), createGroupBody)
            .then(response => response.body as Group);
    }
    /**
     * Creates a new authorization role in a given tenant.
     * @param createRoleBody Role definition
     * @return Role
     */
    public createRole = (createRoleBody: CreateRoleBody): Promise<Role> => {
        const path = `/identity/v2beta1/roles`;
        return this.client.post(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), createRoleBody)
            .then(response => response.body as Role);
    }
    /**
     * Deletes a group in a given tenant.
     * @param group The group name.
     */
    public deleteGroup = (group: string): Promise<object> => {
        const path_params = {
            group: group
        };
        const path = this.template`/identity/v2beta1/groups/${'group'}`(path_params);
        return this.client.delete(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as object);
    }
    /**
     * Deletes a defined role for a given tenant.
     * @param role The role name.
     */
    public deleteRole = (role: string): Promise<object> => {
        const path_params = {
            role: role
        };
        const path = this.template`/identity/v2beta1/roles/${'role'}`(path_params);
        return this.client.delete(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as object);
    }
    /**
     * Returns information about a given group within a tenant.
     * @param group The group name.
     * @return Group
     */
    public getGroup = (group: string): Promise<Group> => {
        const path_params = {
            group: group
        };
        const path = this.template`/identity/v2beta1/groups/${'group'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Group);
    }
    /**
     * Returns information about a given member within a given group.
     * @param group The group name.
     * @param member The member name.
     * @return GroupMember
     */
    public getGroupMember = (group: string, member: string): Promise<GroupMember> => {
        const path_params = {
            group: group,
            member: member
        };
        const path = this.template`/identity/v2beta1/groups/${'group'}/members/${'member'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as GroupMember);
    }
    /**
     * Returns information about a given role within a given group.
     * @param group The group name.
     * @param role The role name.
     * @return GroupRole
     */
    public getGroupRole = (group: string, role: string): Promise<GroupRole> => {
        const path_params = {
            group: group,
            role: role
        };
        const path = this.template`/identity/v2beta1/groups/${'group'}/roles/${'role'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as GroupRole);
    }
    /**
     * Returns a member of a given tenant.
     * @param member The member name.
     * @return Member
     */
    public getMember = (member: string): Promise<Member> => {
        const path_params = {
            member: member
        };
        const path = this.template`/identity/v2beta1/members/${'member'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Member);
    }
    /**
     * Returns the details of a principal, including its tenant membership.
     * @param principal The principal name.
     * @return Principal
     */
    public getPrincipal = (principal: string): Promise<Principal> => {
        const path_params = {
            principal: principal
        };
        const path = this.template`/system/identity/v2beta1/principals/${'principal'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Principal);
    }
    /**
     * Returns a role for a given tenant.
     * @param role The role name.
     * @return Role
     */
    public getRole = (role: string): Promise<Role> => {
        const path_params = {
            role: role
        };
        const path = this.template`/identity/v2beta1/roles/${'role'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Role);
    }
    /**
     * Gets a permission for the specified role.
     * @param role The role name.
     * @param permission The permission string.
     * @return RolePermission
     */
    public getRolePermission = (role: string, permission: string): Promise<RolePermission> => {
        const path_params = {
            role: role,
            permission: permission
        };
        const path = this.template`/identity/v2beta1/roles/${'role'}/permissions/${'permission'}`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as RolePermission);
    }
    /**
     * Returns a list of the members within a given group.
     * @param group The group name.
     * @return Array<string>
     */
    public listGroupMembers = (group: string): Promise<Array<string>> => {
        const path_params = {
            group: group
        };
        const path = this.template`/identity/v2beta1/groups/${'group'}/members`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Array<string>);
    }
    /**
     * Returns a list of the roles that are attached to a group within a given tenant.
     * @param group The group name.
     * @return Array<string>
     */
    public listGroupRoles = (group: string): Promise<Array<string>> => {
        const path_params = {
            group: group
        };
        const path = this.template`/identity/v2beta1/groups/${'group'}/roles`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Array<string>);
    }
    /**
     * List the groups that exist in a given tenant.
     * @return Array<string>
     */
    public listGroups = (): Promise<Array<string>> => {
        const path = `/identity/v2beta1/groups`;
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Array<string>);
    }
    /**
     * Returns a list of groups that a member belongs to within a tenant.
     * @param member The member name.
     * @return Array<string>
     */
    public listMemberGroups = (member: string): Promise<Array<string>> => {
        const path_params = {
            member: member
        };
        const path = this.template`/identity/v2beta1/members/${'member'}/groups`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Array<string>);
    }
    /**
     * Returns a set of permissions granted to the member within the tenant. 
     * @param member The member name.
     * @return Array<string>
     */
    public listMemberPermissions = (member: string): Promise<Array<string>> => {
        const path_params = {
            member: member
        };
        const path = this.template`/identity/v2beta1/members/${'member'}/permissions`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Array<string>);
    }
    /**
     * Returns a set of roles that a given member holds within the tenant. 
     * @param member The member name.
     * @return Array<string>
     */
    public listMemberRoles = (member: string): Promise<Array<string>> => {
        const path_params = {
            member: member
        };
        const path = this.template`/identity/v2beta1/members/${'member'}/roles`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Array<string>);
    }
    /**
     * Returns a list of members in a given tenant.
     * @return Array<string>
     */
    public listMembers = (): Promise<Array<string>> => {
        const path = `/identity/v2beta1/members`;
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Array<string>);
    }
    /**
     * Returns the list of principals that the Identity service knows about.
     * @return Array<string>
     */
    public listPrincipals = (): Promise<Array<string>> => {
        const path = `/system/identity/v2beta1/principals`;
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Array<string>);
    }
    /**
     * Gets a list of groups for a role in a given tenant.
     * @param role The role name.
     * @return Array<string>
     */
    public listRoleGroups = (role: string): Promise<Array<string>> => {
        const path_params = {
            role: role
        };
        const path = this.template`/identity/v2beta1/roles/${'role'}/groups`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Array<string>);
    }
    /**
     * Gets the permissions for a role in a given tenant.
     * @param role The role name.
     * @return Array<string>
     */
    public listRolePermissions = (role: string): Promise<Array<string>> => {
        const path_params = {
            role: role
        };
        const path = this.template`/identity/v2beta1/roles/${'role'}/permissions`(path_params);
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Array<string>);
    }
    /**
     * Returns all roles for a given tenant.
     * @return Array<string>
     */
    public listRoles = (): Promise<Array<string>> => {
        const path = `/identity/v2beta1/roles`;
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as Array<string>);
    }
    /**
     * Removes the member from a given group.
     * @param group The group name.
     * @param member The member name.
     */
    public removeGroupMember = (group: string, member: string): Promise<object> => {
        const path_params = {
            group: group,
            member: member
        };
        const path = this.template`/identity/v2beta1/groups/${'group'}/members/${'member'}`(path_params);
        return this.client.delete(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as object);
    }
    /**
     * Removes a role from a given group.
     * @param group The group name.
     * @param role The role name.
     */
    public removeGroupRole = (group: string, role: string): Promise<object> => {
        const path_params = {
            group: group,
            role: role
        };
        const path = this.template`/identity/v2beta1/groups/${'group'}/roles/${'role'}`(path_params);
        return this.client.delete(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as object);
    }
    /**
     * Removes a member from a given tenant
     * @param member The member name.
     */
    public removeMember = (member: string): Promise<object> => {
        const path_params = {
            member: member
        };
        const path = this.template`/identity/v2beta1/members/${'member'}`(path_params);
        return this.client.delete(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as object);
    }
    /**
     * Removes a permission from the role.
     * @param role The role name.
     * @param permission The permission string.
     */
    public removeRolePermission = (role: string, permission: string): Promise<object> => {
        const path_params = {
            role: role,
            permission: permission
        };
        const path = this.template`/identity/v2beta1/roles/${'role'}/permissions/${'permission'}`(path_params);
        return this.client.delete(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as object);
    }
    /**
     * Validates the access token obtained from the authorization header and returns the principal name and tenant memberships. 
     * @param args All other arguments.
     * @param args.include Include additional information to return when validating tenant membership. Valid parameters [tenant, principal]
     * @return ValidateInfo
     */
    public validateToken = (args?: { include?: Array<string> }): Promise<ValidateInfo> => {
        const path = `/identity/v2beta1/validate`;
        return this.client.get(IDENTITY_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as ValidateInfo);
    }
}
export type IdentityService = GeneratedIdentityService & IdentityServiceExtensions;
export const IdentityService = IdentityServiceExtensions(GeneratedIdentityService);
