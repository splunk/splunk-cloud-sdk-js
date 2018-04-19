const ApiProxy = require('./apiproxy');
const { IDENTITY_SERVICE_PREFIX } = require('./common/service_prefixes');

class IdentityProxy extends ApiProxy {
    /**
     * Authenticate the user by the access token obtained from authorization header and return user profile data,
     * including tenant memberships
     * @returns {Promise<Object>}
     */
    getUserProfile() {
        return this.client.get(this.client.buildPath(IDENTITY_SERVICE_PREFIX, '/userprofile', 'system'));
    }

    /**
     * Adds a tenant
     * @param {string} tenant
     * @returns {Promise<Object>}
     */
    createTenant(tenant) {
        return this.client.post(this.client.buildPath(IDENTITY_SERVICE_PREFIX, '/tenants', 'system'), tenant);
    }
}

module.exports = IdentityProxy;
