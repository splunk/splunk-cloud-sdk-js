/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import { ServiceClient } from './client';

/**
 * Base class for each of the API proxies
 * @deprecated ServiceClient Constructor signature with three arguments, future support for constructor with only ServiceClientArgs object - constructor(args: ServiceClientArgs)
 */
export default class BaseApiService {
    // TODO: Document when we have a final auth story
    protected client: ServiceClient;

    constructor(client: ServiceClient) {
        if (client instanceof ServiceClient) {
            this.client = client;
        } else {
            throw new Error('Argument not of type ServiceClient');
        }
    }
}
