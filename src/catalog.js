const BaseApiService = require('./baseapiservice');
const {CATALOG_SERVICE_PREFIX} = require('./common/service_prefixes');

/**
 * Encapsulates catalog endpoints
 */
class CatalogService extends BaseApiService {
    /**
     * Returns a list of datasets, optionally filtered by the given query parameters.
     * @param {string} [filter] A SPL filter string
     * @return {Promise<Array<CatalogService~DatasetInfo>>}
     */
    getDatasets(filter) {
        const query = {};
        if (filter) {
            query.filter = filter;
        }
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), query);
    }

    /**
     * Create a new dataset.
     * @param {Object|CatalogService~DatasetInfo} dataset
     * @return {Promise<CatalogService~DatasetInfo>}
     */
    createDataset(dataset) {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), dataset);
    }

    /**
     * Returns the dataset resource with the specified `id`.
     * @param {string} datasetId
     * @return {Promise<CatalogService~DatasetInfo>}
     */
    getDataset(datasetId) {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]));
    }

    /**
     * Delete the DatasetInfo and its dependencies with the specified id
     * @param {string} datasetId id of the DatasetInfo to delete
     */
    deleteDataset(datasetId) {
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]));
    }

    /**
     * Delete the DatasetInfo and its dependencies with the specified id
     * @param {string} name of the DatasetInfo to delete
     */
    deleteDatasetByName(name) {
        return this.getDatasets(`name=="${name}"`).then(
            ret => {
                if (ret.length !== 1) {
                    throw new Error("There are more than 1 dataset with the input name");
                }
                return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ["datasets", ret[0].id]));
            });
    }

    /**
     * Updates the supplied dataset
     * @param {string} datasetId
     * @param {CatalogService~PartialDatasetInfo} partialDataset
     * @returns {Promise<CatalogService~DatasetInfo>}
     */
    updateDataset(datasetId, partialDataset) {
        return this.client.patch(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]), partialDataset);
    }

    // rules
    /**
     * Create a new Rule
     * @param {CatalogService~Rule} rule
     * @returns {Promise<CatalogService~Rule>}
     */
    createRule(rule) {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), rule);
    }

    /**
     * Get the matching list of Rules
     * @param {string} [filter] An SPL filter string
     * @returns {Promise<CatalogService~Rule>}
     */
    getRules(filter) {
        const query = {};
        if (filter) {
            query.filter = filter;
        }
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), query);
    }

    /**
     * Return the Rule with the specified id
     * @param ruleId
     * @returns {Promise<CatalogService~Rule>}
     */
    getRule(ruleId) {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleId]));
    }

    /**
     * Delete the Rule and its dependencies with the specified id
     * @param ruleId
     * @returns {Promise<Object>}
     */
    deleteRule(ruleId) {
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleId]));
    }

    /**
     * Get the list of dataset fields for the given datasetID
     * @param datasetID
     * @param {string} [filter] An SPL filter string
     * @returns {Promise<CatalogService~Field>}
     */
    getDatasetFields(datasetID, filter) {
        const query = {};
        if (filter) {
            query.filter = filter;
        }
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields']), query);
    }

    /**
     * Gets the Field with the specified datasetID and datasetFieldID
     * @param datasetID
     * @param datasetFieldID
     * @returns {Promise<CatalogService~Field>}
     */
    getDatasetField(datasetID, datasetFieldID) {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]));
    }

    /**
     * Creates a new Dataset Field
     * @param datasetID
     * @param {CatalogService~Field} datasetField
     * @returns {Promise<CatalogService~Field>}
     */
    postDatasetField(datasetID, datasetField) {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields']), datasetField);
    }

    /**
     * Updates an existing dataset field
     * @param datasetID
     * @param datasetFieldID
     * @param {CatalogService~Field} datasetField
     * @returns {Promise<CatalogService~Field>}
     */
    patchDatasetField(datasetID, datasetFieldID, datasetField) {
        return this.client.patch(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]), datasetField);
    }

    /**
     * Deletes the dataset field with the specified datasetID and datasetFieldID
     * @param datasetID
     * @param datasetFieldID
     * @returns {Promise<Object>}
     */
    deleteDatasetField(datasetID, datasetFieldID) {
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]));
    }
}

/**
 * DatasetInfo
 * @typedef {object} CatalogService~DatasetInfo
 * @property {string} [id]
 * @property {string} name
 * @property {string} kind
 * @property {string} owner
 * @property {string} [created]
 * @property {string} [modified]
 * @property {string} [createdBy]
 * @property {string} [modifiedBy]
 * @property {string} [capabilities]
 * @property {number} [version]
 * @property {Array<String>} [readroles]
 * @property {Array<String>} [writeroles]
 * @property {Array<Field>} fields
 */

/**
 * PartialDatasetInfo
 * @typedef {object} CatalogService~PartialDatasetInfo
 * @property {string} [name]
 * @property {string} [kind]
 * @property {string} [owner]
 * @property {string} [created]
 * @property {string} [modified]
 * @property {string} [createdBy]
 * @property {string} [modifiedBy]
 * @property {string} [capabilities]
 * @property {number} [version]
 * @property {Array<String>} [readroles]
 * @property {Array<String>} [writeroles]
 */

/**
 * Field
 * @typedef {object} CatalogService~Field
 * @property {string} [id]
 * @property {string} [name]
 * @property {string} [datasetId]
 * @property {string} [dataType] DATE | NUMBER | OBJECT_ID | STRING | UNKNOWN
 * @property {string} [fieldType] DIMENSION | MEASURE | UNKNOWN
 * @property {string} [prevalence] ALL | SOME | UNKNOWN
 * @property {string} [created]
 * @property {string} [modified]
 */

/**
 * Rule
 * @typedef {object} CatalogService~Rule
 * @property {string} id
 * @property {string} name
 * @property {string} module
 * @property {string} match
 * @property {string} owner
 * @property {Array<CatalogService~Action>} actions
 * @property {string} created
 * @property {string} modified
 * @property {string} createdBy
 * @property {string} modifiedBy
 * @property {number} version
 */


/**
 * Action
 * @typedef {object} CatalogService~Action
 * @property {string} id
 * @property {string} ruleid
 * @property {string} kind
 * @property {string} owner
 * @property {string} created
 * @property {string} modified
 * @property {string} createdBy
 * @property {string} modifiedBy
 * @property {number} version
 */

module.exports = CatalogService;
