require('isomorphic-fetch');
const SearchService = require('./search');
const CatalogService = require('./catalog');
const IdentityService = require('./identity');
const { HEC2Service } = require('./hec2');
const { ServiceClient } = require('./client');

/* eslint-disable import/prefer-default-export */
/**
 * This class is a Splunk SSC client.
 * @property {SearchService} search - Proxies for the search APIs
 * @property {CatalogService} catalog - Proxies for the catalog APIs
 * @property {IdentityService} identity - Proxies for the identity APIs
 * @property {HEC2Service} hec2 - Proxies for the HEC2 APIs
 */
class SplunkSSC {
    /**
     * Build a Splunk SSC Client
     * @param {string} url URL to Splunk SSC environment TODO: SSC name
     * @param {string} token Auth token
     * @param {string} [defaultTenant] Default tenant to use for requests
     */
    constructor(url, token, defaultTenant) {
        const client = new ServiceClient(url, token, defaultTenant);
        this.search = new SearchService(client);
        this.catalog = new CatalogService(client);
        this.identity = new IdentityService(client);
        this.hec2 = new HEC2Service(client);
    }
}

// TODO(shakeel): commented out TS refactor
// module.exports = SplunkSSC;
