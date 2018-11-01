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

    /**
     * Build a Splunk Cloud Client
     * @param args URL to Splunk Cloud environment or a ServiceClientArgs object
     * @param token Auth token
     * @param defaultTenant Default tenant to use for requests
     */
    constructor(args: ServiceClientArgs | string, token?: string, defaultTenant?: string) {
        this.search = new SearchService(new ServiceClient(args, serviceClusterMapping.search, token, defaultTenant));
        this.catalog = new CatalogService(new ServiceClient(args, serviceClusterMapping.catalog, token, defaultTenant));
        this.identity = new IdentityService(new ServiceClient(args, serviceClusterMapping.identity, token, defaultTenant));
        this.ingest = new IngestService(new ServiceClient(args, serviceClusterMapping.ingest, token, defaultTenant));
        this.kvstore = new KVStoreService(new ServiceClient(args, serviceClusterMapping.kvstore, token, defaultTenant));
        this.action = new ActionService(new ServiceClient(args, serviceClusterMapping.action, token, defaultTenant));
        this.streams = new StreamsService(new ServiceClient(args, serviceClusterMapping.streams, token, defaultTenant));
    }

}

const serviceClusterMapping = {
    search: 'api',
    catalog: 'api',
    identity: 'api',
    ingest: 'api',
    kvstore: 'api',
    action: 'api',
    streams: 'api'
};


