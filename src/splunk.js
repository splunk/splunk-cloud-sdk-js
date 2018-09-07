"use strict";
/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/
var action_1 = require("./action");
var catalog_1 = require("./catalog");
var client_1 = require("./client");
var identity_1 = require("./identity");
var ingest_1 = require("./ingest");
var kvstore_1 = require("./kvstore");
var search_1 = require("./search");
/**
 * This class is a Splunk Cloud client.
 * @property search Proxies for the search APIs
 * @property catalog Proxies for the catalog APIs
 * @property identity Proxies for the identity APIs
 * @property ingest Proxies for the ingest APIs
 */
var SplunkCloud = /** @class */ (function () {
    /**
     * Build a Splunk Cloud Client
     * @param url URL to Splunk Cloud environment
     * @param token Auth token
     * @param defaultTenant Default tenant to use for requests
     */
    function SplunkCloud(url, token, defaultTenant) {
        var client = new client_1.ServiceClient(url, token, defaultTenant);
        this.search = new search_1.SearchService(client);
        this.catalog = new catalog_1.CatalogService(client);
        this.identity = new identity_1.IdentityService(client);
        this.ingest = new ingest_1.IngestService(client);
        this.kvstore = new kvstore_1.KVStoreService(client);
        this.action = new action_1.ActionService(client);
    }
    return SplunkCloud;
}());
module.exports = SplunkCloud;
//# sourceMappingURL=splunk.js.map