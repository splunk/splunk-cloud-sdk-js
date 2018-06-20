import { ServiceClient } from "./client";

/**
 * Base class for each of the API proxies
 */
export default class BaseApiService {
    // TODO: Document when we have a final auth story
    protected client: ServiceClient;
    constructor(clientOrUrl: string | ServiceClient, token: string, defaultTenant?: string) {
        if (clientOrUrl instanceof ServiceClient) {
            this.client = clientOrUrl;
        } else {
            this.client = new ServiceClient(clientOrUrl, token, defaultTenant);
        }
    }
}