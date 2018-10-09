/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import BaseApiService from './baseapiservice';
import { ContentType, HTTPResponse, QueryArgs, RequestHeaders, RequestOptions } from './client';
import { KVSTORE_SERVICE_PREFIX } from './service_prefixes';

/**
 * Encapsulates kvstore service endpoints
 */
export class KVStoreService extends BaseApiService {
    /**
     * Gets the KVStore's status.
     * @returns KVStore health status
     */
    public getHealthStatus = (): Promise<any> => {
        const url = this.client.buildPath(KVSTORE_SERVICE_PREFIX, ['ping']);
        return this.client.get(url)
            .then(response => response.body as PingOKBody);
    };

    /**
     * Lists all the indexes in a given collection.
     * @param collection The name of the collection whose indexes should be listed
     * @returns A list of indexes on the specified collection
     */
    public listIndexes = (collection: string): Promise<IndexDescription[]> => {
        const url = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            'collections',
            collection,
            'indexes',
        ]);
        return this.client.get(url)
            .then(response => response.body as IndexDescription[]);
    };

    /**
     * Creates a new index to be added to the collection.
     * @param index The index to create
     * @param collection The name of the collection where the new index will be created
     * @returns A definition of the created index
     */
    public createIndex = (collection: string, index: IndexDescription): Promise<IndexDescription> => {
        const url = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            'collections',
            collection,
            'indexes',
        ]);
        return this.client.post(url, index)
            .then(response => response.body as IndexDescription);
    };

    /**
     * Deletes an index in a given collection.
     * @param indexName The name of the index to delete
     * @param collection The name of the collection whose index should be deleted
     * @returns A promise that will be resolved when the index is deleted
     */
    public deleteIndex = (collection: string, indexName: string): Promise<any> => {
        return this.client.delete(
            this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
                'collections',
                collection,
                'indexes',
                indexName,
            ])
        )
            .then(response => response.body);
    };

    /**
     * Inserts a new record to the collection.
     * @param collection The name of the collection where the record should be inserted
     * @param record The record to add to the collection
     * @returns An object with the unique _key of the added record
     */
    public insertRecord = (collection: string, record: Map<string, string>): Promise<Key> => {
        const insertRecordURL = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            'collections',
            collection,
        ]);
        return this.client.post(insertRecordURL, record)
            .then(response => response.body as Key);
    };

    /**
     * Inserts multiple new records to the collection in a single request.
     * @param collection The name of the collection where the new records should be inserted
     * @param records The data tuples to insert
     * @returns A list of keys of the inserted records
     */
    public insertRecords = (
        collection: string,
        records: Array<Map<string, string>>
    ): Promise<string[]> => {
        return this.client.post(
            this.client.buildPath(KVSTORE_SERVICE_PREFIX, ['collections', collection, 'batch']),
            records
        )
            .then(response => response.body as string[]);
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
        const requestOptions: RequestOptions = {
            query: filter
        }
        return this.client.get(url, requestOptions)
            .then(response => response.body as Map<string, string>);
    };

    /**
     * Gets the record present in a given collection based on the key value provided by the user.
     * @param collection The name of the collection whose record should be fetched
     * @param key The record key used to query a specific record
     * @returns the record associated with the given key
     */
    public getRecordByKey = (collection: string, key: string): Promise<Map<string, string>> => {
        return this.client
            .get(this.client.buildPath(KVSTORE_SERVICE_PREFIX, ['collections', collection, 'records', key]))
            .then(response => response.body as Map<string, string>);
    };

    /**
     * Lists the records present in a given collection based on the query parameters provided by the user.
     * @param collection The name of the collection whose records should be fetched
     * @param filter Filter string to target specific records
     * @return A list of records in the collection
     */
    public listRecords = (
        collection: string,
        filter: QueryArgs = {}
    ): Promise<Map<string, string>> => {
        const url: string = this.client.buildPath(KVSTORE_SERVICE_PREFIX, [
            'collections',
            collection,
        ]);
        const requestOptions: RequestOptions = {
            query: filter
        }
        return this.client.get(url, requestOptions)
            .then(response => response.body as Map<string, string>);
    };

    /**
     * Deletes records present in a given collection based on the query parameters provided by the user.
     * @param collection The name of the collection whose records should be deleted
     * @param filter Query JSON expression to target specific records
     * @returns A promise that will be resolved when the matching records are deleted
     */
    public deleteRecords = (collection: string, filter?: QueryArgs): Promise<any> => {
        const url = this.client.buildPath(KVSTORE_SERVICE_PREFIX, ['collections', collection, 'query'])
        const requestOptions: RequestOptions = {
            query: filter
        }
        return this.client.delete(url, requestOptions).then(response => response.body);
    };

    /**
     * Deletes a record present in a given collection based on the key value provided by the user.
     * @param collection The name of the collection whose record should be deleted
     * @param key The key of the record used for deletion
     * @returns A promise that will be resolved when the record matching the supplied key is deleted
     */
    public deleteRecordByKey = (collection: string, key: string): Promise<any> => {
        return this.client.delete(
            this.client.buildPath(KVSTORE_SERVICE_PREFIX, ['collections', collection, key])
        )
            .then(response => response.body);
    };
}

export interface PingOKBody {
    errorMessage?: string;
    status: string;
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
