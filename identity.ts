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
     * @return UserProfile for the current user (as defined by the submitted Bearer token)
     */
    public getUserProfile = (tenantId: Tenant['tenantId'] = 'system'): Promise<UserProfile> => {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['userprofile'], tenantId))
            .then(response => response.Body)
            .then(responseBody => responseBody as UserProfile);
    }

    /**
     * Adds a tenant
     * @param tenantId
     * @return promise that will be resolved when the tenant creation request is accepted
     */
    public createTenant = (tenantId: Tenant['tenantId']): Promise<any> => {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants'], 'system'), tenantId)
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Deletes a tenant
     * @param tenantId
     * @return promise that will be resolved when the tenant deletion request is accepted
     */
    public deleteTenant = (tenantId: Tenant['tenantId']): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants', tenantId], 'system'))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Reads a list of users in the given tenant
     * @param tenantId
     * @return a list of users with access to the tenant
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
     * @return promise that will be resolved when the user replacement request is accepted
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
     * @return promise that will be resolved when the request has been accepted
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
     * @return promise that will be resolved when the request has been accepted
     */
    public deleteTenantUsers = (tenantId: Tenant['tenantId'], users: User[]): Promise<any> => {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['users'], tenantId), users)
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
