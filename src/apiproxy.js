const { SSCProxy } = require("./client");

class ApiProxy {
    constructor(clientOrUrl, userOrToken, pass) {
        if (clientOrUrl instanceof SSCProxy) {
            this.client = clientOrUrl;
        } else {
            this.client = new SSCProxy(clientOrUrl, userOrToken, pass);
        }
    }
}

module.exports = ApiProxy;
