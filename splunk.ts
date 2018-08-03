import { CatalogService } from './catalog';
import { ServiceClient } from './client';
import { IdentityService } from './identity';
import { IngestService } from './ingest';
import { KVStoreService } from './kvstore';
import { SearchService } from './search';
import { Action, ActionService } from "./action";

/**
 * This class is a Splunk SSC client.
 * @property search Proxies for the search APIs
 * @property catalog Proxies for the catalog APIs
 * @property identity Proxies for the identity APIs
 * @property ingest Proxies for the ingest APIs
 */
class SplunkSSC {
    public search: SearchService;
    public catalog: CatalogService;
    public identity: IdentityService;
    public ingest: IngestService;
    public kvstore: KVStoreService;
    public action: ActionService;

    /**
     * Build a Splunk SSC Client
     * @param url URL to Splunk SSC environment TODO: SSC name
     * @param token Auth token
     * @param defaultTenant Default tenant to use for requests
     */
    constructor(url: string, token: string, defaultTenant?: string) {
        const client = new ServiceClient(url, token, defaultTenant);
        this.search = new SearchService(client);
        this.catalog = new CatalogService(client);
        this.identity = new IdentityService(client);
        this.ingest = new IngestService(client);
        this.kvstore = new KVStoreService(client);
        this.action = new ActionService(client);
    }
}

export = SplunkSSC;
