import BaseApiService from './baseapiservice';
import {IDENTITY_SERVICE_PREFIX} from './common/service_prefixes';

/**
 * Encapsulates Identity endpoints
 */
export class IdentityService extends BaseApiService {
    /**
     * Authenticate the user by the access token obtained from authorization header and return user profile data,
     * including tenant memberships
     * @returns {Promise<UserProfile>}
     */
    public getUserProfile(): Promise<object> {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['userprofile'], 'system'));
    }

    /**
     * Adds a tenant
     */
    public createTenant(tenantId: string): Promise<object> {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants'], 'system'), tenantId);
    }

    /**
     * Deletes a tenant
     * @param {string} tenantId
     */
    public deleteTenant(tenantId: string): Promise<object> {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants', tenantId], 'system'));
    }

    /**
     * Reads a list of users in the given tenant
     * @param {string} tenantId
     * @returns {Promise<User[]>}
     */
    public getTenantUsers(tenantId: string): Promise<object> {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants', tenantId, 'users'], 'system'));
    }

    /**
     * Replaces current tenant users with new users
     * @param {string} tenantId
     * @param {User[]} users
     */
    public replaceTenantUsers(tenantId: string, users: User[]): Promise<object> {
        return this.client.put(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants', tenantId, 'users'], 'system'), users);
    }

    /**
     * Adds a list of users to the tenant
     * @param {string} tenantId
     * @param {User[]} users
     */
    public addTenantUsers(tenantId: string, users: User[]): Promise<object> {
        return this.client.patch(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants', tenantId, 'users'], 'system'), users);
    }

    /**
     * Deletes a list of users from the tenant
     * @param {string} tenantId
     * @param {User[]} users
     */
    public deleteTenantUsers(tenantId: string, users: User[]): Promise<object> {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants', tenantId, 'users'], 'system'), users);
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
