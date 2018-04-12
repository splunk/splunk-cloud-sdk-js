const { SSCProxy } = require("./client");

/**
 * Base class for each of the API proxies
 */
class ApiProxy {
    // TODO: Document when we have a final auth story
    constructor(clientOrUrl, userOrToken, pass) {
        if (clientOrUrl instanceof SSCProxy) {
            this.client = clientOrUrl;
        } else {
            this.client = new SSCProxy(clientOrUrl, userOrToken, pass);
        }
    }
}

module.exports = ApiProxy;
