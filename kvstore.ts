import BaseApiService from './baseapiservice';
import { QueryArgs } from './client';
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
     * @param namespace The namespace to insert the record to
     * @param collection The collection to insert the record to
     * @param record The data tuples to insert
     * Returns a promise that contains an object with the unique _key of the added record
     */
    // TODO: Change return type
    public insertRecord = (
        namespace: string,
        collection: string,
        record: Map<string, string>
    ): Promise<any> => {
        const insertRecordURL = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            namespace,
            'collections',
            collection,
        ]);
        return this.client.post(insertRecordURL, record);
    };

    /**
     * Inserts new records to the collection.
     * @param namespace The namespace where the new index will be created
     * @param collection The collection where the new index will be created
     * @param records The data tuples to insert
     */
    public insertRecords = (
        namespace: string,
        collection: string,
        records: Array<Map<string, string>>
    ): Promise<string[]> => {
        return this.client.post(
            this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
                namespace,
                'collections',
                collection,
                'batch',
            ]),
            records
        );
    };

    /**
     * Queries records present in a given collection.
     * @param namespace The namespace whose indexes should be listed
     * @param collection The collection whose indexes should be listed
     * @param filter Filter string to target specific records
     */
    public queryRecords = (
        namespace: string,
        collection: string,
        filter: QueryArgs = {},
    ): Promise<Map<string, string>> => {
        const url = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
                    namespace,
                    'collections',
                    collection,
                    'query',
                ]);
        return this.client
            .get(url, filter).then(response => response as Map<string, string>);
    };

    /**
     * Queries a particular record present in a given collection based on the key value provided by the user.
     * @param namespace The namespace whose indexes should be listed
     * @param collection The collection whose indexes should be listed
     * @param key The record key used to query a specific record
     */
    public getRecordByKey = (
        namespace: string,
        collection: string,
        key: string
    ): Promise<Map<string, string>> => {
        return this.client
            .get(
                this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
                    namespace,
                    'collections',
                    collection,
                    key,
                ])
            )
            .then(response => response as Map<string, string>);
    };

    /**
     * Lists the records present in a given collection based on the provided
     * @param namespace The namespace to retrieve the records from
     * @param collection The collection to retrieve the records from
     * @param filter Filter string to target specific records
     * Returns a promise that is a list of the records
     */
    public listRecords = (
        namespace: string,
        collection: string,
        filter: QueryArgs = {}
    ): Promise<Map<string, string>> => {
        const url: string = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            namespace,
            'collections',
            collection,
        ]);
        return this.client.get(url, filter);
    };

    /**
     * Deletes records present in a given collection based on the provided query.
     * @param namespace The namespace where the new index will be created
     * @param collection The collection where the new index will be created
     * @param filter Filter string to target specific records
     */
    public deleteRecords = (
        namespace: string,
        collection: string,
        filter?: string
    ): Promise<any> => {
        const queryArgs: QueryArgs = {};
        if (filter) {
            queryArgs.query = filter;
        }
        return this.client.delete(
            this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
                namespace,
                'collections',
                collection,
                'query',
            ]),
            queryArgs
        );
    };

    /**
     * Deletes a particular record present in a given collection based on the key value provided by the user.
     * @param namespace The namespace where the new index will be created
     * @param collection The collection where the new index will be created
     * @param key The key of the record used for deletion
     */
    public deleteRecordByKey = (
        namespace: string,
        collection: string,
        key: string
    ): Promise<any> => {
        return this.client.delete(
            this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
                namespace,
                'collections',
                collection,
                key,
            ])
        );
    };
}

export interface PingOKBody {
    errorMessage?: string;
    status: string;
}

export interface CollectionDefinition {
    collection: string;
    namespace: string;
}

export interface CollectionDescription {
    indexes: IndexDescription[];
    name: string;
    namespace: string;
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
