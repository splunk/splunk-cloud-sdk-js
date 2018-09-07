"use strict";
/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/
exports.__esModule = true;
var client_1 = require("./client");
/**
 * Base class for each of the API proxies
 */
var BaseApiService = /** @class */ (function () {
    function BaseApiService(clientOrUrl, token, defaultTenant) {
        if (clientOrUrl instanceof client_1.ServiceClient) {
            this.client = clientOrUrl;
        }
        else if (token) {
            this.client = new client_1.ServiceClient(clientOrUrl, token, defaultTenant);
        }
        else {
            throw new Error('Missing token argument to service constructor');
        }
    }
    return BaseApiService;
}());
exports["default"] = BaseApiService;
//# sourceMappingURL=baseapiservice.js.map