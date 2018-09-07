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
var service_prefixes_1 = require("./service_prefixes");
/**
 * Encapsulates catalog endpoints
 */
var CatalogService = /** @class */ (function (_super) {
    __extends(CatalogService, _super);
    function CatalogService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Returns a list of datasets, optionally filtered by a filter string.
         * @param filter An SPL filter string
         * @return Array of dataset descriptors
         */
        _this.getDatasets = function (filter) {
            var query = {};
            if (filter) {
                query.filter = filter;
            }
            return _this.client.get(_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['datasets']), query)
                .then(function (response) { return response.body; });
        };
        /**
         * Create a new dataset.
         * @param dataset The dataset to create
         * @return description of the new dataset
         */
        _this.createDataset = function (dataset) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['datasets']), dataset)
                .then(function (response) { return response.body; });
        };
        /**
         * Returns the dataset resource with the specified `id`.
         * @param datasetId
         * @return description of the dataset
         */
        _this.getDataset = function (datasetId) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['datasets', datasetId]))
                .then(function (response) { return response.body; });
        };
        /**
         * Delete the DatasetInfo and its dependencies with the specified `id`
         * @param datasetId `id` of the dataset to delete
         * @return A promise that will be resolved when deletion is complete
         */
        _this.deleteDataset = function (datasetId) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['datasets', datasetId]))
                .then(function (response) { return response.body; });
        };
        /**
         * Delete the Dataset
         * @param name of the Dataset to delete
         * @return A promise that will be resolved when deletion is complete
         */
        _this.deleteDatasetByName = function (name) {
            return _this.getDatasets("name==\"" + name + "\"").then(function (ret) {
                if (ret.length > 1) {
                    throw new Error('There are more than 1 dataset with the input name');
                }
                else if (ret.length === 1) {
                    return _this.client["delete"](_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['datasets', ret[0].id]))
                        .then(function (response) { return response.body; });
                }
                else {
                    return Promise.reject(new Error("No dataset found with name: " + name));
                }
            });
        };
        /**
         * Updates the supplied dataset
         * @param datasetId
         * @param partial
         * @return information about the updated dataset
         */
        // TODO: add lint check for xxxID vs. xxxId consistency
        _this.updateDataset = function (datasetId, partial) {
            return _this.client.patch(_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['datasets', datasetId]), partial)
                .then(function (response) { return response.body; });
        };
        // rules
        /**
         * Create a new Rule
         * @param rule The rule to create
         * @return a description of the new rule
         */
        _this.createRule = function (rule) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['rules']), rule)
                .then(function (response) { return response.body; });
        };
        /**
         * Get the matching list of Rules
         * @param filter An SPL filter string
         * @return description of defined rules (optionally matching SPL query)
         */
        _this.getRules = function (filter) {
            var query = {};
            if (filter) {
                query.filter = filter;
            }
            return _this.client.get(_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['rules']), query)
                .then(function (response) { return response.body; });
        };
        /**
         * Return the Rule with the specified `id`
         * @param ruleId
         * @return description of the rule
         */
        _this.getRule = function (ruleId) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['rules', ruleId]))
                .then(function (response) { return response.body; });
        };
        /**
         * Delete the Rule and its dependencies with the specified `id`
         * @param ruleId
         * @return Promise that will be resolved when the rule is deleted
         */
        _this.deleteRule = function (ruleId) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['rules', ruleId]))
                .then(function (response) { return response.body; });
        };
        /**
         * Get the list of dataset fields for the given `id`
         * @param datasetID
         * @param filter An SPL filter string
         * @return array of field descriptions for fields defined on the dataset
         */
        _this.getDatasetFields = function (datasetID, filter) {
            var query = { filter: filter };
            return _this.client.get(_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields']), query)
                .then(function (response) { return response.body; });
        };
        /**
         * Gets the Field with the specified datasetID and datasetFieldID
         * @param datasetID
         * @param datasetFieldID
         * @return field description
         */
        _this.getDatasetField = function (datasetID, datasetFieldID) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]))
                .then(function (response) { return response.body; });
        };
        /**
         * Creates a new dataset field
         * @param datasetID
         * @param datasetField
         * @return description of the new field defined on the dataset
         */
        _this.postDatasetField = function (datasetID, datasetField) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields']), datasetField)
                .then(function (response) { return response.body; });
        };
        /**
         * Updates an existing dataset field
         * @param datasetID
         * @param datasetFieldID
         * @param datasetField
         * @return updated description of the field
         */
        _this.patchDatasetField = function (datasetID, datasetFieldID, datasetField) {
            return _this.client.patch(_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]), datasetField)
                .then(function (response) { return response.body; });
        };
        /**
         * Deletes the dataset field with the specified datasetID and datasetFieldID
         * @param datasetID
         * @param datasetFieldID
         * @return promise that will be resolved when field is deleted
         */
        _this.deleteDatasetField = function (datasetID, datasetFieldID) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]))
                .then(function (response) { return response.body; });
        };
        return _this;
    }
    return CatalogService;
}(baseapiservice_1["default"]));
exports.CatalogService = CatalogService;
var DataType;
(function (DataType) {
    DataType[DataType["DATE"] = 0] = "DATE";
    DataType[DataType["NUMBER"] = 1] = "NUMBER";
    DataType[DataType["OBJECT_ID"] = 2] = "OBJECT_ID";
    DataType[DataType["STRING"] = 3] = "STRING";
    DataType[DataType["UNKNOWN"] = 4] = "UNKNOWN";
})(DataType = exports.DataType || (exports.DataType = {}));
var FieldType;
(function (FieldType) {
    FieldType[FieldType["DIMENSION"] = 0] = "DIMENSION";
    FieldType[FieldType["MEASURE"] = 1] = "MEASURE";
    FieldType[FieldType["UNKNOWN"] = 2] = "UNKNOWN";
})(FieldType = exports.FieldType || (exports.FieldType = {}));
var Prevalence;
(function (Prevalence) {
    Prevalence[Prevalence["ALL"] = 0] = "ALL";
    Prevalence[Prevalence["SOME"] = 1] = "SOME";
    Prevalence[Prevalence["UNKNOWN"] = 2] = "UNKNOWN";
})(Prevalence = exports.Prevalence || (exports.Prevalence = {}));
//# sourceMappingURL=catalog.js.map