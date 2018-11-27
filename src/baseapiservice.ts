/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import { ServiceClient } from './client';

/**
 * Base class for each of the API proxies
 * @deprecated BaseApiService Constructor signature with three arguments, future support for constructor with only ServiceClient object - constructor(client: ServiceClient)
 */
export default class BaseApiService {
    // TODO: Document when we have a final auth story
    protected client: ServiceClient;
    constructor(clientOrUrl: string | ServiceClient, token?: string, defaultTenant?: string) {
        if (clientOrUrl instanceof ServiceClient) {
            this.client = clientOrUrl;
        } else if (token) {
            this.client = new ServiceClient(clientOrUrl, token, defaultTenant);
        } else {
            throw new Error('Missing token argument to service constructor');
        }
    }
}
