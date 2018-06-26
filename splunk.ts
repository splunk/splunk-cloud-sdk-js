import "isomorphic-fetch";
import { CatalogService } from "./catalog";
import { ServiceClient } from "./client";
import { HEC2Service } from "./hec2";
import { IdentityService } from "./identity";
import { SearchService } from "./search";

/**
 * This class is a Splunk SSC client.
 * @property {SearchService} search - Proxies for the search APIs
 * @property {CatalogService} catalog - Proxies for the catalog APIs
 * @property {IdentityService} identity - Proxies for the identity APIs
 * @property {HEC2Service} hec2 - Proxies for the HEC2 APIs
 */
class SplunkSSC {
    private search: SearchService;
    private catalog: CatalogService;
    private identity: IdentityService;
    private hec2: HEC2Service;
    /**
     * Build a Splunk SSC Client
     * @param url URL to Splunk SSC environment TODO: SSC name
     * @param token Auth token
     * @param [defaultTenant] Default tenant to use for requests
     */
    constructor(url: string, token: string, defaultTenant?: string) {
        const client = new ServiceClient(url, token, defaultTenant);
        this.search = new SearchService(client);
        this.catalog = new CatalogService(client);
        this.identity = new IdentityService(client);
        this.hec2 = new HEC2Service(client);
    }
}

module.exports = SplunkSSC;
