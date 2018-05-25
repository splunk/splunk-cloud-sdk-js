const BaseApiService = require('./baseapiservice');
const { CATALOG_SERVICE_PREFIX } = require('./common/service_prefixes');

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
<<<<<<< HEAD
=======
    /**
     * @private
     * @param {string} datasetId
     * TODO: Remove this method as it's only for testing
     */
    getDatasetConf(datasetId) {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId, 'conf']));
    }
>>>>>>> origin/changes_for_gateway

    /**
     * Delete the DatasetInfo and its dependencies with the specified id
     * @param {string} datasetId id of the DatasetInfo to delete
     */
    deleteDataset(datasetId) {
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]));
    }

    /**
     * Updates the supplied dataset
     * @param {Promise<CatalogService~DatasetInfo>} dataset
     * @returns {Promise<CatalogService~DatasetInfo>}
     */
    updateDataset(dataset) {
        return this.client.patch(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', dataset.id]), dataset);
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
<<<<<<< HEAD
     * Get the matching list of Rules
     * @param {string} [filter] An SPL filter string
     * @returns {Promise<CatalogService~Rule>}
=======
     * Returns the rule identified by the given path.
     * The path must be fully qualified, if the path is a prefix the request returns 404
     * because it does identify a rule resource.
     * @param {string} rulePath
     * @return {Promise<CatalogService~Rule>}
     */
    getRule(rulePath) {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', rulePath]));
    }
    /**
     * @private
     * @param {string} conf name
     * TODO: Remove this method as it's only for testing
>>>>>>> origin/changes_for_gateway
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
 * @property {Array<Field>} fields
 */

/**
 * Field
 * @typedef {object} CatalogService~Field
 * @property {string} id
 * @property {string} name
 * @property {string} datasetId
 * @property {string} [dataType] DATE | NUMBER | OBJECT_ID | STRING | UNKNOWN
 * @property {string} [fieldType] DIMENSION | MEASURE | UNKNOWN
 * @property {string} [prevalence] ALL | SOME | UNKNOWN
 * @property {string} [created]
 * @property {string} [modified]
 * @property {string} [versionAdded]
 * @property {string} [versionRemoved]
 * @property {CatalogService~DatasetInfo} [dataset]
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
