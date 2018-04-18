const ApiProxy = require('./apiproxy');
const { IDENTITY_SERVICE_PREFIX } = require('./common/service_prefixes');
const { buildPath } = require('./common/utils');

class IdentityProxy extends ApiProxy {
    /**
     * Authenticate the user by the access token obtained from authorization header and return user profile data,
     * including tenant memberships
     * @returns {Promise<Object>}
     */
    getUserProfile() {
        return this.client.get(buildPath(IDENTITY_SERVICE_PREFIX, '/userprofile'));
    }

    /**
     * Adds a tenant
     * @param {string} tenant
     * @returns {Promise<Object>}
     */
    createTenant(tenant) {
        return this.client.post(buildPath(IDENTITY_SERVICE_PREFIX, '/tenants'), tenant);
    }
}

module.exports = IdentityProxy;
