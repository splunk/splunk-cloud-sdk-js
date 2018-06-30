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
    public getUserProfile(tenantId: string): Promise<UserProfile> {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['userprofile'], tenantId))
            .then(response => response as UserProfile);
    }

    /**
     * Adds a tenant
     * @param tenantId
     */
    public createTenant(tenantId: object): Promise<any> { // TODO: change param to string, breaking change
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants'], 'system'), tenantId);
    }

    /**
     * Deletes a tenant
     * @param tenantId
     */
    public deleteTenant(tenantId: string): Promise<any> {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['tenants', tenantId], 'system'));
    }

    /**
     * Reads a list of users in the given tenant
     * @param tenantId
     */
    public getTenantUsers(tenantId: string): Promise<User[]> {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['users'], tenantId))
            .then(response => response as User[]);
    }

    /**
     * Replaces current tenant users with new users
     * @param tenantId
     * @param users
     */
    public replaceTenantUsers(tenantId: string, users: User[]): Promise<any> {
        return this.client.put(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['users'], tenantId), users);
    }

    /**
     * Adds a list of users to the tenant
     * @param tenantId
     * @param users
     */
    public addTenantUsers(tenantId: string, users: User[]): Promise<any> {
        return this.client.patch(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['users'], tenantId), users);
    }

    /**
     * Deletes a list of users from the tenant
     * @param {string} tenantId
     * @param {User[]} users
     */
    public deleteTenantUsers(tenantId: string, users: User[]): Promise<any> {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, ['users'], tenantId), users);
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
