require('isomorphic-fetch');
const { NovaProxy } = require('./nova');
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
 * @property {IdentityProxy} catalog - Proxies for the identity APIs
 */
class Splunk {
    constructor(url, userOrToken, pass) {
        const client = new SSCProxy(url, userOrToken, pass);
        this.nova = new NovaProxy(client);
        this.search = new SearchProxy(client);
        this.catalog = new CatalogProxy(client);
        this.identity = new IdentityProxy(client);
    }

}

module.exports = Splunk;

