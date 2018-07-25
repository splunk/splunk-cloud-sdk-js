import BaseApiService from './baseapiservice';
import {KVSTORE_SERVICE_PREFIX} from './service_prefixes';
import {QueryArgs} from "./client";

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
        return this.client.get(url).then(response => response as PingOKBody);
    };

    /**
     * Gets the the KVStore collections stats
     * @param the namespace of the collection to retrieve
     * @param the collection to retrieve
     * @returns A promise that contains the KVStore's response
     */
    public getCollectionStats = (
        namespace: string,
        collection: string
    ): Promise<CollectionStats> => {
        const url = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            namespace,
            'collections',
            collection,
            'stats',
        ]);

        return this.client.get(url).then(response => response as CollectionStats);
    };

    /**
     * Retrieves all the indexes in a given namespace and collection.
     * @param namespace The namespace whose indexes should be listed
     * @param collection The collection whose indexes should be listed
     */
    public listIndexes = (namespace: string, collection: string): Promise<IndexDescription[]> => {
        return this.client
            .get(
                this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
                    namespace,
                    'collections',
                    collection,
                    'indexes',
                ])
            )
            .then(response => response as IndexDescription[]);
    };

    /**
     * Creates a new index to be added to the collection.
     * @param index The index to create
     * @param namespace The namespace where the new index will be created
     * @param collection The collection where the new index will be created
     */
    public createIndex = (
        index: IndexDescription,
        namespace: string,
        collection: string
    ): Promise<any> => {
        return this.client.post(
            this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
                namespace,
                'collections',
                collection,
                'indexes',
            ]),
            index
        );
    };

    /**
     * Deletes the specified index in a given namespace and collection.
     * @param indexName The name of the index to be deleted
     * @param namespace The namespace where the new index will be created
     * @param collection The collection where the new index will be created
     */
    public deleteIndex = (
        indexName: string,
        namespace: string,
        collection: string
    ): Promise<any> => {
        return this.client.delete(
            this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
                namespace,
                'collections',
                collection,
                'indexes',
                indexName,
            ])
        );
    };

    /**
     * Inserts new records to the collection.
     * @param namespace The namespace where the new index will be created
     * @param collection The collection where the new index will be created
     * @param records The data tuples to insert
     */
    public insertRecords = (namespace: string, collection: string, records: Map<string, string>[]): Promise<string[]> => {
        return this.client.post(this.client.buildPath(KVSTORE_SERVICE_PREFIX, [namespace, 'collections', collection, "batch"]), records);
    }

    /**
     * Queries records present in a given collection.
     * @param namespace The namespace whose indexes should be listed
     * @param collection The collection whose indexes should be listed
     * @param filter Filter string to target specific records
     */
    public queryRecords = (namespace: string, collection: string, filter?: string): Promise<Map<string, string>[]> => {
        const queryArgs: QueryArgs = {};
        if (filter) {
            queryArgs.query = filter;
        }
        return this.client.get(this.client.buildPath(KVSTORE_SERVICE_PREFIX, [namespace, 'collections', collection, "query"]), queryArgs)
            .then(response => response as Map<string, string>[]);
    }

    /**
     * Queries a particular record present in a given collection based on the key value provided by the user.
     * @param namespace The namespace whose indexes should be listed
     * @param collection The collection whose indexes should be listed
     * @param key The record key used to query a specific record
     */
    public getRecordByKey = (namespace: string, collection: string, key: string): Promise<Map<string, string>> => {
        return this.client.get(this.client.buildPath(KVSTORE_SERVICE_PREFIX, [namespace, 'collections', collection, key]))
            .then(response => response as Map<string, string>);
    }

    /**
     * Deletes records present in a given collection based on the provided query.
     * @param namespace The namespace where the new index will be created
     * @param collection The collection where the new index will be created
     * @param filter Filter string to target specific records
     */
    public deleteRecords = (namespace: string, collection: string, filter?: string): Promise<any> => {
        const queryArgs: QueryArgs = {};
        if (filter) {
            queryArgs.query = filter;
        }
        return this.client.delete(this.client.buildPath(KVSTORE_SERVICE_PREFIX, [namespace, 'collections', collection, "query"]), {}, queryArgs);
    }

    /**
     * Deletes a particular record present in a given collection based on the key value provided by the user.
     * @param namespace The namespace where the new index will be created
     * @param collection The collection where the new index will be created
     * @param key The key of the record used for deletion
     */
    public deleteRecordByKey = (namespace: string, collection: string, key: string): Promise<any> => {
        return this.client.delete(this.client.buildPath(KVSTORE_SERVICE_PREFIX, [namespace, 'collections', collection, key]));
    }
}

export interface PingOKBody {
    errorMessage?: string;
    status: string;
}

export interface CollectionStats {
    count: number;
    indexSizes: object;
    nindexes: number;
    ns: string;
    size: number;
    totalIndexSize: number;
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
