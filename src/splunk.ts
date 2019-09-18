/**
 * Copyright 2019 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { ServiceClient, ServiceClientArgs } from './client';
import { ActionService } from './services/action';
import { AppRegistryService } from './services/app-registry';
import { CatalogService } from './services/catalog';
import { CollectService } from './services/collect';
import { ForwardersService } from './services/forwarders';
import { IdentityService } from './services/identity';
import { IngestService } from './services/ingest';
import { KVStoreService } from './services/kvstore';
import { MLService } from './services/ml';
import { ProvisionerService } from './services/provisioner';
import { SearchService } from './services/search';
import { StreamsService } from './services/streams';

/**
 * This class is a Splunk Cloud client.
 */
export class SplunkCloud {
    /**
     * Proxies for the Search service APIs.
     */
    public search: SearchService;
    /**
     * Proxies for the Catalog service APIs.
     */
    public catalog: CatalogService;
    /**
     * Proxies for the Collect service APIs.
     */
    public collect: CollectService;
    /**
     * Proxies for the Identity service APIs.
     */
    public identity: IdentityService;
    /**
     * Proxies for the Ingest service APIs.
     */
    public ingest: IngestService;
    /**
     * Proxies for the KV Store service APIs.
     */
    public kvstore: KVStoreService;
    /**
     * Proxies for the Action service APIs.
     */
    public action: ActionService;
    /**
     * Proxies for the Streams service APIs.
     */
    public streams: StreamsService;
    /**
     * Proxies for the Provisioner service APIs.
     */
    public provisioner: ProvisionerService;
    /**
     * Proxies for the Machine Learning service APIs.
     */
    public ml: MLService;
    /**
     * Proxies for the Forwarders service APIs.
     */
    public forwarders: ForwardersService;
    /**
     * Proxies for the App Registry service APIs.
     */
    public appreg: AppRegistryService;
    /**
     * General proxy for Splunk Cloud service APIs.
     */
    public client: ServiceClient;
    /**
     * Builds a Splunk Cloud client.
     * @param args A `ServiceClientArgs` object.
     */
    constructor(args: ServiceClientArgs) {
        this.client = new ServiceClient(args);
        this.search = new SearchService(this.client);
        this.catalog = new CatalogService(this.client);
        this.collect = new CollectService(this.client);
        this.identity = new IdentityService(this.client);
        this.ingest = new IngestService(this.client);
        this.kvstore = new KVStoreService(this.client);
        this.action = new ActionService(this.client);
        this.streams = new StreamsService(this.client);
        this.ml = new MLService(this.client);
        this.forwarders = new ForwardersService(this.client);
        this.appreg = new AppRegistryService(this.client);
        this.provisioner = new ProvisionerService(this.client);
    }
}
