"use strict";
/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var baseapiservice_1 = require("./baseapiservice");
var client_1 = require("./client");
var service_prefixes_1 = require("./service_prefixes");
/**
 * Encapsulates kvstore service endpoints
 */
var KVStoreService = /** @class */ (function (_super) {
    __extends(KVStoreService, _super);
    function KVStoreService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Gets the KVStore's status.
         * @returns KVStore health status
         */
        _this.getHealthStatus = function () {
            var url = _this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, ['ping']);
            return _this.client.get(url)
                .then(function (response) { return response.body; });
        };
        /**
         * Gets the the KVStore collections stats.
         * @param collection the collection to retrieve
         * @returns Statistics for the collection
         */
        _this.getCollectionStats = function (collection) {
            var url = _this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, [
                'collections',
                collection,
                'stats',
            ]);
            return _this.client.get(url)
                .then(function (response) { return response.body; });
        };
        /**
         * Gets all the collections.
         * @returns A list of defined collections
         */
        _this.getCollections = function () {
            return _this.client
                .get(_this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, [
                'collections'
            ]))
                .then(function (response) { return response.body; });
        };
        /**
         * Gets all the records of the collection in a file.
         * @param collection The name of the collection whose records need to be exported
         * @param contentType The contentType ('text/csv' or 'application/gzip') of the records file to be exported
         * @returns The records in the collection in string format
         */
        _this.exportCollection = function (collection, contentType) {
            var requestHeaders = {};
            if (contentType === client_1.ContentType.CSV) {
                requestHeaders = { 'Accept': client_1.ContentType.CSV };
            }
            else {
                requestHeaders = { 'Accept': client_1.ContentType.GZIP };
            }
            return _this.client
                .get(_this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, [
                'collections',
                collection,
                'export',
            ]), {}, requestHeaders)
                .then(function (response) { return response.body; });
        };
        /**
         * Lists all the indexes in a given collection.
         * @param collection The name of the collection whose indexes should be listed
         * @returns A list of indexes on the specified collection
         */
        _this.listIndexes = function (collection) {
            var url = _this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, [
                'collections',
                collection,
                'indexes',
            ]);
            return _this.client.get(url)
                .then(function (response) { return response.body; });
        };
        /**
         * Creates a new index to be added to the collection.
         * @param index The index to create
         * @param collection The name of the collection where the new index will be created
         * @returns A definition of the created index
         */
        _this.createIndex = function (index, collection) {
            var url = _this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, [
                'collections',
                collection,
                'indexes',
            ]);
            return _this.client.post(url, index)
                .then(function (response) { return response.body; });
        };
        /**
         * Deletes an index in a given collection.
         * @param indexName The name of the index to delete
         * @param collection The name of the collection whose index should be deleted
         * @returns A promise that will be resolved when the index is deleted
         */
        _this.deleteIndex = function (indexName, collection) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, [
                'collections',
                collection,
                'indexes',
                indexName,
            ]))
                .then(function (response) { return response.body; });
        };
        /**
         * Inserts a new record to the collection.
         * @param collection The name of the collection where the record should be inserted
         * @param record The record to add to the collection
         * @returns An object with the unique _key of the added record
         */
        _this.insertRecord = function (collection, record) {
            var insertRecordURL = _this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, [
                'collections',
                collection,
            ]);
            return _this.client.post(insertRecordURL, record)
                .then(function (response) { return response.body; });
        };
        /**
         * Inserts multiple new records to the collection in a single request.
         * @param collection The name of the collection where the new records should be inserted
         * @param records The data tuples to insert
         * @returns A list of keys of the inserted records
         */
        _this.insertRecords = function (collection, records) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, ['collections', collection, 'batch']), records)
                .then(function (response) { return response.body; });
        };
        /**
         * Queries records present in a given collection based on the query parameters provided by the user.
         * @param collection The name of the collection whose records should be fetched
         * @param filter Filter string to target specific records
         * @returns A Promise of an array of records
         */
        _this.queryRecords = function (collection, filter) {
            if (filter === void 0) { filter = {}; }
            var url = _this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, [
                'collections',
                collection,
                'query',
            ]);
            return _this.client.get(url, filter)
                .then(function (response) { return response.body; });
        };
        /**
         * Gets the record present in a given collection based on the key value provided by the user.
         * @param collection The name of the collection whose record should be fetched
         * @param key The record key used to query a specific record
         * @returns the record associated with the given key
         */
        _this.getRecordByKey = function (collection, key) {
            return _this.client
                .get(_this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, ['collections', collection, key]))
                .then(function (response) { return response.body; });
        };
        /**
         * Lists the records present in a given collection based on the query parameters provided by the user.
         * @param collection The name of the collection whose records should be fetched
         * @param filter Filter string to target specific records
         * @return A list of records in the collection
         */
        _this.listRecords = function (collection, filter) {
            if (filter === void 0) { filter = {}; }
            var url = _this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, [
                'collections',
                collection,
            ]);
            return _this.client.get(url, filter)
                .then(function (response) { return response.body; });
        };
        /**
         * Deletes records present in a given collection based on the query parameters provided by the user.
         * @param collection The name of the collection whose records should be deleted
         * @param filter Query JSON expression to target specific records
         * @returns A promise that will be resolved when the matching records are deleted
         */
        _this.deleteRecords = function (collection, filter) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, ['collections', collection, 'query']), filter)
                .then(function (response) { return response.body; });
        };
        /**
         * Deletes a record present in a given collection based on the key value provided by the user.
         * @param collection The name of the collection whose record should be deleted
         * @param key The key of the record used for deletion
         * @returns A promise that will be resolved when the record matching the supplied key is deleted
         */
        _this.deleteRecordByKey = function (collection, key) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.KVSTORE_SERVICE_PREFIX, ['collections', collection, key]))
                .then(function (response) { return response.body; });
        };
        return _this;
    }
    return KVStoreService;
}(baseapiservice_1["default"]));
exports.KVStoreService = KVStoreService;
//# sourceMappingURL=kvstore.js.map