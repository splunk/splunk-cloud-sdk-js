/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import BaseApiService from './baseapiservice';
import {ContentType, HTTPResponse, QueryArgs, RequestHeaders} from './client';
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
        return this.client.get(url)
            .then(response => response.Body)
            .then(responseBody => responseBody as PingOKBody);

    };

    /**
     * Gets the the KVStore collections stats
     * @param collection the collection to retrieve
     * @returns A promise that contains the KVStore's response
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
     * Exports the specified collection records to an external file.
     * @param collection The collection whose records should be exported
     * @param contentType The contentType (csv or gzip) of the records file to be exported
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
     * Retrieves all the indexes in a given namespace and collection.
     * @param collection The collection whose indexes should be listed
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
     * @param collection The collection where the new index will be created
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
     * Deletes the specified index in a given namespace and collection.
     * @param indexName the name of the index to delete
     * @param collection The collection where the new index will be created
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
     * Inserts new records to the collection.
     * @param collection The collection to insert the record to
     * @param record The data tuples to insert
     * Returns a promise that contains an object with the unique _key of the added record
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
     * Inserts new records to the collection.
     * @param collection The collection where the new index will be created
     * @param records The data tuples to insert
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
     * Queries records present in a given collection.
     * @param collection The collection whose indexes should be listed
     * @param filter Filter string to target specific records
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
     * Queries a particular record present in a given collection based on the key value provided by the user.
     * @param collection The collection whose indexes should be listed
     * @param key The record key used to query a specific record
     */
    public getRecordByKey = (collection: string, key: string): Promise<Map<string, string>> => {
        return this.client
            .get(this.client.buildPath(KVSTORE_SERVICE_PREFIX, ['collections', collection, key]))
            .then(response => response.Body)
            .then(responseBody => responseBody  as Map<string, string>);
    };

    /**
     * Lists the records present in a given collection based on the provided
     * @param collection The collection to retrieve the records from
     * @param filter Filter string to target specific records
     * @return a promise that is a list of the records
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
     * Deletes records present in a given collection based on the provided query.
     * @param collection The collection where the new index will be created
     * @param filter Filter string to target specific records
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
     * Deletes a particular record present in a given collection based on the key value provided by the user.
     * @param collection The collection where the new index will be created
     * @param key The key of the record used for deletion
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
