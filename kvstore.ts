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
     * Retrieves all the indexes in a given namespace and collection.
     * @param namespace The namespace whose indexes should be listed
     * @param collection The collection whose indexes should be listed
     */
    public listIndexes = (namespace: string, collection: string): Promise<IndexDescription[]> => {
        return this.client.get(this.client.buildPath(KVSTORE_SERVICE_PREFIX, [namespace, 'collections', collection, "indexes"]))
            .then(response => response as IndexDescription[]);
    }

    /**
     * Creates a new index to be added to the collection.
     * @param index The index to create
     * @param namespace The namespace where the new index will be created
     * @param collection The collection where the new index will be created
     */
    public createIndex = (index: IndexDescription, namespace: string, collection: string): Promise<any> => {
        return this.client.post(this.client.buildPath(KVSTORE_SERVICE_PREFIX, [namespace, 'collections', collection, "indexes"]), index)

    }

    /**
     * Deletes the specified index in a given namespace and collection.
     * @param indexName The name of the index to be deleted
     * @param namespace The namespace where the new index will be created
     * @param collection The collection where the new index will be created
     */
    public deleteIndex = (indexName: string, namespace: string, collection: string): Promise<any> => {
        return this.client.delete(this.client.buildPath(KVSTORE_SERVICE_PREFIX, [namespace, 'collections', collection, "indexes", indexName]));
    }
}

export interface IndexFieldDefinition {
    direction: number;
    field: string;
}

export interface IndexDescription {
    collection?: string;
    fields: IndexFieldDefinition[];
    name?: string;
    namespace?: string;
}
