const ApiProxy = require('./apiproxy');
const {IDENTITY_SERVICE_PREFIX} = require('./common/service_prefixes');

class IdentityProxy extends ApiProxy {
    /**
     * Authenticate the user by the access token obtained from authorization header and return user profile data,
     * including tenant memberships
     * @returns {Promise<IdentityProxy~UserProfile>}
     */
    getUserProfile() {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, '/userprofile', 'system'));
    }

    /**
     * Adds a tenant
     * @param {IdentityProxy~Tenant} tenant
     * @returns {Promise<Object>}
     */
    createTenant(tenant) {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, '/tenants', 'system'), tenant);
    }

    /**
     * Deletes a tenant
     * @param {string} tenantId
     * @returns {Promise<Object>}
     */
    deleteTenant(tenantId) {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, `/tenants/${tenantId}`, 'system'));
    }

    /**
     * Reads a list of users in the given tenant
     * @param {string} tenantId
     * @returns {Promise<Array>}
     */
    getTenantUsers(tenantId) {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, `/tenants/${tenantId}/users`));
    }

    // TODO(Parul): Currently PUT and PATCH are both same - raise a JIRA with Cliff's team
    /**
     * Replaces tenant users with new users
     * @param {string} tenantId
     * @param {object} usersList
     * @returns {Promise<Object>}
     */
    replaceTenantUsers(tenantId, users) {
        return this.client.put(this.client.buildPath(IDENTITY_SERVICE_PREFIX, `/tenants/${tenantId}/users`), users);
    }

    /**
     * Adds a list of users to the tenant
     * @param {string} tenantId
     * @param {object} usersList
     * @returns {Promise<Object>}
     */
    addTenantUsers(tenantId, users) {
        return this.client.patch(this.client.buildPath(IDENTITY_SERVICE_PREFIX, `/tenants/${tenantId}/users`), users);
    }

    /**
     * Deletes a list of users from the tenant
     * @param {string} tenantId
     * @param {object} usersList
     * @returns {Promise<Object>}
     */
    deleteTenantUsers(tenantId, users) {
        return this.client.delete(this.client.buildPath(IDENTITY_SERVICE_PREFIX, `/tenants/${tenantId}/users`), users);
    }
}

/**
 * UserProfile - Represents the User recogized by the Identity Service.
 * @typedef {Object} IdentityProxy~UserProfile
 * @property {string} email
 * @property {string} firstName
 * @property {string} id
 * @property {string} lastName
 * @property {string} locale
 * @property {string} name
 * @property {array} [email] tenantMemberships
 */

/**
 * Tenant - The unique account within the Identity Service
 * @typedef {Object} IdentityProxy~Tenant
 * @property {string} tenantId
 */

module.exports = IdentityProxy;
