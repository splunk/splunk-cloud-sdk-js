/* eslint-disable import/prefer-default-export */
import { ApiProxy } from './apiproxy';
import { CATALOG_SERVICE_PREFIX } from './common/constants';
import { buildPath } from './common/utils';


/**
 * Encapsulates catalog endpoints
 */
export class CatalogProxy extends ApiProxy {
  /**
  * Returns a list of datasets, optionally filtered by the given query parameters.
  * @param {Object} query
  * @return {Promise<CatalogProxy~Datasets>}
  */
  getDatasets(query) {
    return this.client.get(buildPath(CATALOG_SERVICE_PREFIX, '/datasets'), query);
  }

  /**
   * Create a new dataset.
   * @param {Object|CatalogProxy~Dataset} dataset
   * @return {Promise<CatalogProxy~Dataset>}
   */
  createDataset(dataset) {
    return this.client.post(buildPath(CATALOG_SERVICE_PREFIX, '/datasets', dataset));
  }

  /**
   * Returns the dataset resource with the given `id`.
   * @param {string} datasetId
   * @return {Promise<CatalogProxy~Dataset>}
   */
  getDataset(datasetId) {
    return this.client.get(buildPath(CATALOG_SERVICE_PREFIX, `/datasets/${datasetId}`));
  }

  getDatasetConf(datasetId) {
    return this.client.get(buildPath(CATALOG_SERVICE_PREFIX, `/datasets/${datasetId}/conf`));
  }

  /**
   * Updates the dataset resource with the given `id`.
   * @param {string} datasetId
   * @return {Promise<CatalogProxy~Dataset>}
   */
  patchDataset(datasetId) {
    return this.client.patch(buildPath(CATALOG_SERVICE_PREFIX, `/datasets/${datasetId}`));
  }

  /**
   * Delete the dataset resource with the given `id`.
   * @param {string} datasetId
   */
  deleteDataset(datasetId) {
    return this.client.delete(buildPath(CATALOG_SERVICE_PREFIX, `/datasets/${datasetId}`));
  }

  /**
   * Returns a list of search time rule definitions, optionally filtered by
   * the given query parameters.
   * @param {Object} query - supported params are:
   * path {string}: Returns rule definitions that match the given path prefix. If the
   * path is fully qualified, returns the single matching rule.
   * kind {string}: Return rule definitions that match the given kind.
   * match {string}: Return rule definitions that match the given match clause.
   * @return {Promise<CatalogProxy~Rules>}
   */
  getRules(query) {
    return this.client.get(buildPath(CATALOG_SERVICE_PREFIX, '/rules'), query);
  }

  /**
   * Create a new search time rule definition.
   * @param {Object|CatalogProxy~Rule} rule
   * @return {Promise<CatalogProxy~Rule>}
   */
  createRule(rule) {
    return this.client.post(buildPath(CATALOG_SERVICE_PREFIX, '/rules', rule));
  }

  /**
   * Returns the rule identified by the given path.
   * The path must be fully qualified, if the path is a prefix the request returns 404
   * because it does identify a rule resource.
   * @param {string} rulePath
   * @return {Promise<CatalogProxy~Rule>}
   */
  getRule(rulePath) {
    return this.client.get(buildPath(CATALOG_SERVICE_PREFIX, `/rules/${rulePath}`));
  }

  getRuleConf(name) {
    return this.client.get(buildPath(CATALOG_SERVICE_PREFIX, `/rules/${name}/conf`));
  }

  /**
   * Updates the rule by the given path.
   * @param {string} rulePath
   * @return {Promise<CatalogProxy~Rule>}
   */
  patchRule(rulePath) {
    return this.client.patch(buildPath(CATALOG_SERVICE_PREFIX, `/rules/${rulePath}`));
  }

  /**
   * Delete the rule by the given path.
   * @param {string} rulePath
   */
  deleteRule(rulePath) {
    return this.client.delete(buildPath(CATALOG_SERVICE_PREFIX, `/rules/${rulePath}`));
  }
}

/**
 * The supported dataset kind in the system.
 * One of "catalog", "EXTERN", "INDEX", "KVSTORE", "TOPIC"," VIEW"
 * @typedef {string} CatalogProxy~DatasetKind
 */

/**
 * Datasets
 * @typedef {Dataset[]} CatalogProxy~Datasets
 */

/**
 * Dataset
 * @typedef {CatalogProxy~Catalog|CatalogProxy~Extern|CatalogProxy~Index} CatalogProxy~Dataset
 */

/**
 * Catalog - Represents the metadata catalog as a dataset.
 * @typedef {Object} CatalogProxy~Catalog
 * @property {string} id
 * @property {string} name
 * @property {CatalogProxy~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * Extern - Represents an extern REST API based dataset.
 * @typedef {Object} CatalogProxy~Extern
 * @property {string} id
 * @property {string} name
 * @property {CatalogProxy~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * Index - Represents a Splunk events or metrics index.
 * @typedef {Object} CatalogProxy~Index
 * @property {string} id
 * @property {string} name
 * @property {CatalogProxy~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * KVStore - Represents an instance of the KV storage service as a dataset.
 * @typedef {Object} CatalogProxy~KVStore
 * @property {string} id
 * @property {string} name
 * @property {CatalogProxy~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * Topic - Represents a message bus topic as a dataset.
 * @typedef {Object} CatalogProxy~Topic
 * @property {string} id
 * @property {string} name
 * @property {CatalogProxy~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * View - Represents a view over base data in some other dataset.
 * The view consists of a Splunk query (with at least a generating command) and
 * an optional collection of search time transformation rules.
 * @typedef {Object} CatalogProxy~View
 * @property {string} id
 * @property {string} name
 * @property {CatalogProxy~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} query
 */


/**
 * The kinds of search time transformation action known by the service.
 * One of "ALIAS", "AUTOKV", "REGEX", "EVAL", "LOOKUP"
 * @typedef {string} CatalogProxy~ActionKind.
 */

/**
 * Rule - Represents a rule for transforming results at search time.
 * A rule consits of a `match` clause and a collection of transformation actions.
 * @typedef {Object} CatalogProxy~Rule
 * @property {string} name
 * @property {string} match
 * @property {number} [priority]
 * @property {string} [description]
 * @property {CatalogProxy~AliasAction[]|CatalogProxy~AutoKVAction[]|
 * CatalogProxy~EvalAction[]|CatalogProxy~LookupAction[]|CatalogProxy~RegexAction[]} [actions]
 */

/**
 * Rules
 * @typedef {CatalogProxy~Rule[]} CatalogProxy~Rules
 */

/**
 * ExtractOptions. One of "ADD_VALUE", "CLEAN_KEYS", "KEEP_EMPTY"
 * @typedef {string} CatalogProxy~ExtractOptions
 */

/**
 * AutoMode - Enumerates the automatic key/value extraction modes.
 * One of "NONE", "AUTO", "MULTIKV", "XML", "JSON".
 * @typedef {string} CatalogProxy~AutoMode
 */


/**
 * AliasAction - Represents a field name alias.
 * @typedef {Object} CatalogProxy~AliasAction
 * @property {CatalogProxy~ActionKind} kind="ALIAS"
 * @property {string} field
 * @property {string} alias
 */

/**
 * AutoKVAction - Represents the definition of an automatic key/value extraction rule.
 * @typedef {Object} CatalogProxy~AutoKVAction
 * @property {CatalogProxy~ActionKind} kind="AUTOKV"
 * @property {CatalogProxy~ExtractOptions[]} options
 * @property {CatalogProxy~AutoMode} [mode="AUTO"]
 * @property {boolean} [trim=true]
 */

/**
 * RegexAction - Represents a regular expression action.
 * @typedef {Object} CatalogProxy~RegexAction
 * @property {CatalogProxy~ActionKind} kind="REGEX"
 * @property {CatalogProxy~ExtractOptions[]} options
 * @property {string} expression
 * @property {string} [pattern]
 * @property {string} [field="_raw"]
 * @property {string} [format=""]
 * @property {number} [limit=100000]
 */

/**
 * EvalAction - Represents an action based on an eval expression.
 * @typedef {Object} CatalogProxy~EvalAction
 * @property {CatalogProxy~ActionKind} kind="EVAL"
 * @property {CatalogProxy~ExtractOptions[]} options
 * @property {string} expression
 * @property {string} result
 */

/**
 * LookupAction - Represents a lookup action.
 * @typedef {Object} CatalogProxy~LookupAction
 * @property {CatalogProxy~ActionKind} kind="LOOKUP"
 * @property {CatalogProxy~ExtractOptions[]} options
 * @property {string} expression
 */
