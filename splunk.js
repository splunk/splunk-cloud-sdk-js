require('isomorphic-fetch');
const SearchProxy = require('./search');
const CatalogProxy = require('./catalog');
const IdentityProxy = require('./identity');
const { SSCProxy } = require('./client');

/* eslint-disable import/prefer-default-export */
/**
 * This class is a Splunk SSC client.
 * @property {NovaProxy} nova - Proxies for events APIs
 * @property {SearchProxy} search - Proxies for the search APIs
 * @property {CatalogProxy} catalog - Proxies for the catalog APIs
 * @property {IdentityProxy} identity - Proxies for the identity APIs
 */
class Splunk {
    /**
     * Build a Splunk SSC Client
     * @param {string} url URL to Splunk SSC environment TODO: SSC name
     * @param {string} token Auth token
     * @param {string} [defaultTenant] Default tenant to use for requests
     */
    constructor(url, token, defaultTenant) {
        const client = new SSCProxy(url, token, defaultTenant);
        this.search = new SearchProxy(client);
        this.catalog = new CatalogProxy(client);
        this.identity = new IdentityProxy(client);
    }
}

module.exports = Splunk;

