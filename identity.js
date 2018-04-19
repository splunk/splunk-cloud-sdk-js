const ApiProxy = require('./apiproxy');
const { IDENTITY_SERVICE_PREFIX } = require('./common/service_prefixes');
const { buildPath } = require('./common/utils');

class IdentityProxy extends ApiProxy {
    /**
     * Authenticate the user by the access token obtained from authorization header and return user profile data,
     * including tenant memberships
     * @returns {Promise<IdentityProxy~UserProfile>}
     */
    getUserProfile() {
        return this.client.get(buildPath(IDENTITY_SERVICE_PREFIX, '/userprofile'));
    }

    /**
     * Adds a tenant
     * @param {IdentityProxy~Tenant} tenant
     * @returns {Promise<Object>}
     */
    createTenant(tenant) {
        return this.client.post(buildPath(IDENTITY_SERVICE_PREFIX, '/tenants'), tenant);
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
