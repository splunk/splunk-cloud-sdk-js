const { ServiceClient } = require("./client");

/**
 * Base class for each of the API proxies
 */
class BaseApiService {
    // TODO: Document when we have a final auth story
    constructor(clientOrUrl, userOrToken, pass) {
        if (clientOrUrl instanceof ServiceClient) {
            this.client = clientOrUrl;
        } else {
            this.client = new ServiceClient(clientOrUrl, userOrToken, pass);
        }
    }
}

module.exports = BaseApiService;
