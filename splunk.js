require('isomorphic-fetch');
const SearchService = require('./search');
const CatalogService = require('./catalog');
const IdentityService = require('./identity');
const { ServiceClient } = require('./client');
const { Debug } = require('./debug');

/* eslint-disable import/prefer-default-export */
/**
 * This class is a Splunk SSC client.
 * @property {SearchService} search - Proxies for the search APIs
 * @property {CatalogService} catalog - Proxies for the catalog APIs
 * @property {IdentityService} identity - Proxies for the identity APIs
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
        this.debug = Debug;

        // Commented out because it doesn't work, but maybe someday
        this.configure_logger();
    }

    configure_logger() {
        // This is actually what I want to do with the "fetch" function. Simply
        // wrap it with another function that will log the request so that we
        // don't have to mark every fetch function with a debug
        // --------
        let log_request = function(function_to_wrap) {
            return function() {
                console.log(arguments);
                return function_to_wrap.apply(this, arguments);
            };
        };
        fetch = log_request(fetch);
    }
}

module.exports = SplunkSSC;
