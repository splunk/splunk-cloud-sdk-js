const { ServiceClient } = require("./client");

/**
 * Base class for each of the API proxies
 */
class BaseApiService {
    // TODO: Document when we have a final auth story
    constructor(clientOrUrl, token, defaultTenant) {
        if (clientOrUrl instanceof ServiceClient) {
            this.client = clientOrUrl;
        } else {
            this.client = new ServiceClient(clientOrUrl, token, defaultTenant);
        }
    }
}

module.exports = BaseApiService;
