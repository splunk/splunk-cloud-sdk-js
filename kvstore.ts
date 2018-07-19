import BaseApiService from './baseapiservice';
import { KVSTORE_SERVICE_PREFIX } from './service_prefixes';

/**
 * Encapsulates kvstore service endpoints
 */
export class KVStoreService extends BaseApiService {
    /**
     * Gets the the KVStore's status
     * @returns A promise that contains the KVStore's response
     */
    public getHealthStatus = (): Promise<any> => {
        const url = this.client.buildPath(KVSTORE_SERVICE_PREFIX, ['ping']);
        return this.client.get(url);
    };

    /**
     * Gets the the KVStore collections stats
     * @param {string} namespace - the namespace of the collection to retrieve
     * @param {string} collection - the collection to retrieve
     * @returns A promise that contains the KVStore's response
     */
    public getCollectionStats = (namespace: string, collection: string): Promise<any> => {
        const url = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            namespace,
            'collections',
            collection,
            'stats',
        ]);

        return this.client.get(url);
    };
}
