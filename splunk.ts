import "isomorphic-fetch";
import { CatalogService } from "./catalog";
import { ServiceClient } from "./client";
import { IngestService } from "./ingest";
import { IdentityService } from "./identity";
import { SearchService } from "./search";

/**
 * This class is a Splunk SSC client.
 * @property {SearchService} search - Proxies for the search APIs
 * @property {CatalogService} catalog - Proxies for the catalog APIs
 * @property {IdentityService} identity - Proxies for the identity APIs
 * @property {IngestService} ingest - Proxies for the HEC2 APIs
 */
export class SplunkSSC {
    public search: SearchService;
    public catalog: CatalogService;
    public identity: IdentityService;
    public ingest: IngestService;
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
        this.ingest = new IngestService(client);
    }
}
