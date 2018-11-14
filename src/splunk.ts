/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import { ActionService } from './action';
import { CatalogService } from './catalog';
import { ServiceClient, ServiceClientArgs } from './client';
import { IdentityService } from './identity';
import { IngestService } from './ingest';
import { KVStoreService } from './kvstore';
import { SearchService } from './search';
import { StreamsService } from './streams';

/**
 * This class is a Splunk Cloud client.
 * @property search Proxies for the search APIs
 * @property catalog Proxies for the catalog APIs
 * @property identity Proxies for the identity APIs
 * @property ingest Proxies for the ingest APIs
 * @property kvstore Proxies for the kvstore APIs
 * @property action Proxies for the action APIs
 * @property streams Proxies for the streams APIs
 */
export class SplunkCloud {
    public search: SearchService;
    public catalog: CatalogService;
    public identity: IdentityService;
    public ingest: IngestService;
    public kvstore: KVStoreService;
    public action: ActionService;
    public streams: StreamsService;
    public client: ServiceClient;

    /**
     * Build a Splunk Cloud Client
     * @param args URL to Splunk Cloud environment or a ServiceClientArgs object
     * @param token Auth token
     * @param defaultTenant Default tenant to use for requests
     */
    constructor(args: ServiceClientArgs | string, token?: string, defaultTenant?: string) {
        this.client = new ServiceClient(args, token, defaultTenant);
        this.search = new SearchService(this.client);
        this.catalog = new CatalogService(this.client);
        this.identity = new IdentityService(this.client);
        this.ingest = new IngestService(this.client);
        this.kvstore = new KVStoreService(this.client);
        this.action = new ActionService(this.client);
        this.streams = new StreamsService(this.client);
    }

}


