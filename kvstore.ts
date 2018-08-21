/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import BaseApiService from './baseapiservice';
import { ContentType, HTTPResponse, QueryArgs, RequestHeaders } from './client';
import { KVSTORE_SERVICE_PREFIX } from './service_prefixes';

/**
 * Encapsulates kvstore service endpoints
 */
export class KVStoreService extends BaseApiService {
    /**
     * Gets the KVStore's status.
     * @returns A Promise of KVStore's response
     */
    public getHealthStatus = (): Promise<any> => {
        const url = this.client.buildPath(KVSTORE_SERVICE_PREFIX, ['ping']);
        return this.client.get(url)
            .then(response => response.Body)
            .then(responseBody => responseBody as PingOKBody);

    };

    /**
     * Gets the the KVStore collections stats.
     * @param collection the collection to retrieve
     * @returns A Promise of KVStore's response
     */
    public getCollectionStats = (collection: string): Promise<CollectionStats> => {
        const url = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            'collections',
            collection,
            'stats',
        ]);

        return this.client.get(url)
            .then(response => response.Body)
            .then(responseBody => responseBody as CollectionStats);
    };

    /**
     * Gets all the collections.
     * @returns A Promise of an array of collections
     */
    public getCollections = (): Promise<CollectionDefinition[]> => {
        return this.client
            .get(this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
                'collections'
            ]))
            .then(response => response.Body)
            .then(responseBody => responseBody as CollectionDefinition[]);
    };

    /**
     * Gets all the records of the collection in a file.
     * @param collection The name of the collection whose records need to be exported
     * @param contentType The contentType (csv or gzip) of the records file to be exported
     * @returns A Promise of all the records present in the collection in string format
     */
    public exportCollection = (collection: string, contentType: ContentType): Promise<string> => {
        let requestHeaders: RequestHeaders = {};
        if (contentType === ContentType.CSV) {
            requestHeaders = { 'Accept': ContentType.CSV }
        } else {
            requestHeaders = { 'Accept': ContentType.GZIP }
        }

        return this.client
            .get(this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
                'collections',
                collection,
                'export',
            ]), {}, requestHeaders)
            .then(response => response.Body)
            .then(responseBody => responseBody as string);
    };

    /**
     * Lists all the indexes in a given collection.
     * @param collection The name of the collection whose indexes should be listed
     * @returns A Promise of an array of indexes
     */
    public listIndexes = (collection: string): Promise<IndexDescription[]> => {
        const url = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            'collections',
            collection,
            'indexes',
        ]);
        return this.client.get(url)
            .then(response => response.Body)
            .then(responseBody => responseBody as IndexDescription[]);
    };

    /**
     * Creates a new index to be added to the collection.
     * @param index The index to create
     * @param collection The name of the collection where the new index will be created
     * @returns A Promise of an index
     */
    public createIndex = (index: IndexDescription, collection: string): Promise<IndexDescription> => {
        const url = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            'collections',
            collection,
            'indexes',
        ]);
        return this.client.post(url, index)
            .then(response => response.Body)
            .then(responseBody => responseBody as IndexDescription);
    };

    /**
     * Deletes an index in a given collection.
     * @param indexName The name of the index to delete
     * @param collection The name of the collection whose index should be deleted
     * @returns A Promise object
     */
    public deleteIndex = (indexName: string, collection: string): Promise<any> => {
        return this.client.delete(
            this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
                'collections',
                collection,
                'indexes',
                indexName,
            ])
        )
            .then(response => response.Body)
            .then(responseBody => responseBody);
    };

    /**
     * Inserts a new record to the collection.
     * @param collection The name of the collection where the record should be inserted
     * @param record The record to add to the collection
     * @returns A promise that contains an object with the unique _key of the added record
     */
    public insertRecord = (collection: string, record: Map<string, string>): Promise<Key> => {
        const insertRecordURL = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            'collections',
            collection,
        ]);
        return this.client.post(insertRecordURL, record)
            .then(response => response.Body)
            .then(responseBody => responseBody as Key);
    };

    /**
     * Inserts multiple new records to the collection in a single request.
     * @param collection The name of the collection where the new records should be inserted
     * @param records The data tuples to insert
     * @returns A Promise of an array of keys of the inserted records
     */
    public insertRecords = (
        collection: string,
        records: Array<Map<string, string>>
    ): Promise<string[]> => {
        return this.client.post(
            this.client.buildPath(KVSTORE_SERVICE_PREFIX, ['collections', collection, 'batch']),
            records
        )
            .then(response => response.Body)
            .then(responseBody => responseBody as string[]);
    };

    /**
     * Queries records present in a given collection based on the query parameters provided by the user.
     * @param collection The name of the collection whose records should be fetched
     * @param filter Filter string to target specific records
     * @returns A Promise of an array of records
     */
    public queryRecords = (
        collection: string,
        filter: QueryArgs = {}
    ): Promise<Map<string, string>> => {
        const url = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            'collections',
            collection,
            'query',
        ]);
        return this.client.get(url, filter)
            .then(response => response.Body)
            .then(responseBody => responseBody  as Map<string, string>);
    };

    /**
     * Gets the record present in a given collection based on the key value provided by the user.
     * @param collection The name of the collection whose record should be fetched
     * @param key The record key used to query a specific record
     * @returns A Promise of a record
     */
    public getRecordByKey = (collection: string, key: string): Promise<Map<string, string>> => {
        return this.client
            .get(this.client.buildPath(KVSTORE_SERVICE_PREFIX, ['collections', collection, key]))
            .then(response => response.Body)
            .then(responseBody => responseBody  as Map<string, string>);
    };

    /**
     * Lists the records present in a given collection based on the query parameters provided by the user.
     * @param collection The name of the collection whose records should be fetched
     * @param filter Filter string to target specific records
     * @return A Promise of an array of records
     */
    public listRecords = (
        collection: string,
        filter: QueryArgs = {}
    ): Promise<Map<string, string>> => {
        const url: string = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            'collections',
            collection,
        ]);
        return this.client.get(url, filter)
            .then(response => response.Body)
            .then(responseBody => responseBody as Map<string, string>);
    };

    /**
     * Deletes records present in a given collection based on the query parameters provided by the user.
     * @param collection The name of the collection whose records should be deleted
     * @param filter Query JSON expression to target specific records
     * @returns A Promise object
     */
    public deleteRecords = (collection: string, filter?: QueryArgs): Promise<any> => {
        return this.client.delete(
            this.client.buildPath(KVSTORE_SERVICE_PREFIX, ['collections', collection, 'query']),
            filter
        )
            .then(response => response.Body)
            .then(responseBody => responseBody);
    };

    /**
     * Deletes a record present in a given collection based on the key value provided by the user.
     * @param collection The name of the collection whose record should be deleted
     * @param key The key of the record used for deletion
     * @returns A Promise object
     */
    public deleteRecordByKey = (collection: string, key: string): Promise<any> => {
        return this.client.delete(
            this.client.buildPath(KVSTORE_SERVICE_PREFIX, ['collections', collection, key])
        )
            .then(response => response.Body)
            .then(responseBody => responseBody);
    };
}

export interface PingOKBody {
    errorMessage?: string;
    status: string;
}

export interface CollectionDefinition {
    collection: string;
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
    collection: string;
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

export interface Key {
    _key: string;
}
