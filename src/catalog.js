const BaseApiService = require('./baseapiservice');
const { CATALOG_SERVICE_PREFIX } = require('./common/service_prefixes');

/**
 * Encapsulates catalog endpoints
 */
class CatalogService extends BaseApiService {
    /**
     * Returns a list of datasets, optionally filtered by the given query parameters.
     * @param {Object} query
     * @return {Promise<CatalogService~Datasets>}
     */
    getDatasets(query) {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), query);
    }

    /**
     * Create a new dataset.
     * @param {Object|CatalogService~Dataset} dataset
     * @return {Promise<CatalogService~Dataset>}
     */
    createDataset(dataset) {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), dataset);
    }

    /**
     * Returns the dataset resource with the given `id`.
     * @param {string} datasetId
     * @return {Promise<CatalogService~Dataset>}
     */
    getDataset(datasetId) {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]));
    }
    /**
     * @private
     * @param {string} datasetId
     * TODO: Remove this method as it's only for testing
     */
    getDatasetConf(datasetId) {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId, 'conf']));
    }

    /**
     * Updates the dataset resource with the given `id`.
     * @param {string} datasetId
     * @return {Promise<CatalogService~Dataset>}
     */
    patchDataset(datasetId) {
        return this.client.patch(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]));
    }

    /**
     * Delete the dataset resource with the given `id`.
     * @param {string} datasetId
     */
    deleteDataset(datasetId) {
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]));
    }

    /**
     * Returns a list of search time rule definitions, optionally filtered by
     * the given query parameters.
     * @param {Object} query - supported params are:
     * path {string}: Returns rule definitions that match the given path prefix. If the
     * path is fully qualified, returns the single matching rule.
     * kind {string}: Return rule definitions that match the given kind.
     * match {string}: Return rule definitions that match the given match clause.
     * @return {Promise<CatalogService~Rules>}
     */
    getRules(query) {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), query);
    }

    /**
     * Create a new search time rule definition.
     * @param {Object|CatalogService~Rule} rule
     * @return {Promise<CatalogService~Rule>}
     */
    createRule(rule) {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), rule);
    }

    /**
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
     */
    getRuleConf(name) {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', name, 'conf']));
    }

    /**
     * Updates the rule by the given path.
     * @param {string} rulePath
     * @return {Promise<CatalogService~Rule>}
     */
    patchRule(rulePath) {
        return this.client.patch(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', rulePath]));
    }

    /**
     * Delete the rule by the given path.
     * @param {string} rulePath
     */
    deleteRule(rulePath) {
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', rulePath]));
    }
}

/**
 * The supported dataset kind in the system.
 * One of "catalog", "EXTERN", "INDEX", "KVSTORE", "TOPIC"," VIEW"
 * @typedef {string} CatalogService~DatasetKind
 */

/**
 * Datasets
 * @typedef {CatalogService~Dataset[]} CatalogService~Datasets
 */

/**
 * Dataset
 * @typedef {
 *  CatalogService~Catalog|CatalogService~Extern|CatalogService~Index|
 *  CatalogService~KVStore|CatalogService~Topic|CatalogService~View
 * } CatalogService~Dataset
 */

/**
 * Catalog - Represents the metadata catalog as a dataset.
 * @typedef {Object} CatalogService~Catalog
 * @property {string} id
 * @property {string} name
 * @property {CatalogService~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * Extern - Represents an extern REST API based dataset.
 * @typedef {Object} CatalogService~Extern
 * @property {string} id
 * @property {string} name
 * @property {CatalogService~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * Index - Represents a Splunk events or metrics index.
 * @typedef {Object} CatalogService~Index
 * @property {string} id
 * @property {string} name
 * @property {CatalogService~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * KVStore - Represents an instance of the KV storage service as a dataset.
 * @typedef {Object} CatalogService~KVStore
 * @property {string} id
 * @property {string} name
 * @property {CatalogService~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * Topic - Represents a message bus topic as a dataset.
 * @typedef {Object} CatalogService~Topic
 * @property {string} id
 * @property {string} name
 * @property {CatalogService~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * View - Represents a view over base data in some other dataset.
 * The view consists of a Splunk query (with at least a generating command) and
 * an optional collection of search time transformation rules.
 * @typedef {Object} CatalogService~View
 * @property {string} id
 * @property {string} name
 * @property {CatalogService~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} query
 */

/**
 * The kinds of search time transformation action known by the service.
 * One of "ALIAS", "AUTOKV", "REGEX", "EVAL", "LOOKUP"
 * @typedef {string} CatalogService~ActionKind.
 */

/**
 * Rule - Represents a rule for transforming results at search time.
 * A rule consits of a `match` clause and a collection of transformation actions.
 * @typedef {Object} CatalogService~Rule
 * @property {string} name
 * @property {string} match
 * @property {number} [priority]
 * @property {string} [description]
 * @property {
 *  CatalogService~AliasAction[]|CatalogService~AutoKVAction[]|CatalogService~EvalAction[]|
 *  CatalogService~LookupAction[]|CatalogService~RegexAction[]
 * } [actions]
 */

/**
 * Rules
 * @typedef {CatalogService~Rule[]} CatalogService~Rules
 */

/**
 * ExtractOptions. One of "ADD_VALUE", "CLEAN_KEYS", "KEEP_EMPTY"
 * @typedef {string} CatalogService~ExtractOptions
 */

/**
 * AutoMode - Enumerates the automatic key/value extraction modes.
 * One of "NONE", "AUTO", "MULTIKV", "XML", "JSON".
 * @typedef {string} CatalogService~AutoMode
 */

/**
 * AliasAction - Represents a field name alias.
 * @typedef {Object} CatalogService~AliasAction
 * @property {CatalogService~ActionKind} kind="ALIAS"
 * @property {string} field
 * @property {string} alias
 */

/**
 * AutoKVAction - Represents the definition of an automatic key/value extraction rule.
 * @typedef {Object} CatalogService~AutoKVAction
 * @property {CatalogService~ActionKind} kind="AUTOKV"
 * @property {CatalogService~ExtractOptions[]} options
 * @property {CatalogService~AutoMode} [mode="AUTO"]
 * @property {boolean} [trim=true]
 */

/**
 * RegexAction - Represents a regular expression action.
 * @typedef {Object} CatalogService~RegexAction
 * @property {CatalogService~ActionKind} kind="REGEX"
 * @property {CatalogService~ExtractOptions[]} options
 * @property {string} expression
 * @property {string} [pattern]
 * @property {string} [field="_raw"]
 * @property {string} [format=""]
 * @property {number} [limit=100000]
 */

/**
 * EvalAction - Represents an action based on an eval expression.
 * @typedef {Object} CatalogService~EvalAction
 * @property {CatalogService~ActionKind} kind="EVAL"
 * @property {CatalogService~ExtractOptions[]} options
 * @property {string} expression
 * @property {string} result
 */

/**
 * LookupAction - Represents a lookup action.
 * @typedef {Object} CatalogService~LookupAction
 * @property {CatalogService~ActionKind} kind="LOOKUP"
 * @property {CatalogService~ExtractOptions[]} options
 * @property {string} expression
 */

module.exports = CatalogService;
