import {ApiProxy} from "./apiproxy"
import {CATELOG_SERVICE_PREFIX} from "./common/constants"
import {buildPath} from "./common/utils"
import {NovaDatasets} from "./models/catelog"

/**
 * Encapsulates catelog endpoints
 */
export class CatelogProxy extends ApiProxy {
  constructor(client) {
    super(client)
  }

 /**
  * Returns a list of datasets, optionally filtered by the given query parameters.
  * @param {string} name 
  * @param {string} kind 
  * @return {Promise<CatelogProxy~Datasets>}
  */
  getDatasets(name, kind) {
    return this.client.get(buildPath(CATELOG_SERVICE_PREFIX, '/datasets'), {'name': name, "kind": kind});
  }
  /**
   * Create a new dataset.
   * @param {Object|CatelogProxy~Dataset} dataset
   * @return {Promise<CatelogProxy~Dataset>}
   */
  createDataset(dataset) {
    return this.client.post(buildPath(CATELOG_SERVICE_PREFIX,`/datasets`, dataset));
  }
  /**
   * Returns the dataset resource with the given `id`.
   * @param {string} datasetId
   * @return {Promise<CatelogProxy~Dataset>}
   */
  getDataset(datasetId) {
    return this.client.get(buildPath(CATELOG_SERVICE_PREFIX,`/datasets/${datasetId}`));
  }
  getDatasetConf(datasetId) {
    return this.client.get(buildPath(CATELOG_SERVICE_PREFIX,`/datasets/${datasetId}/conf`));
  }
  /**
   * Updates the dataset resource with the given `id`.
   * @param {string} datasetId
   * @return {Promise<CatelogProxy~Dataset>}
   */
  patchDataset(datasetId) {
    return this.client.patch(buildPath(CATELOG_SERVICE_PREFIX,`/datasets/${datasetId}`));
  }
  /**
   * Delete the dataset resource with the given `id`.
   * @param {string} datasetId 
   */
  deleteDataset(datasetId) {
    return this.client.delete(buildPath(CATELOG_SERVICE_PREFIX,`/datasets/${datasetId}`));
  }
  /**
   * Returns a list of search time rule definitions, optionally filtered by
        the given query parameters.
   * @param {string} path 
   * @param {string} kind 
   * @param {string} match 
   * @return {Promise<CatelogProxy~Rules>}
   */
  getRules(path, kind, match) {
    return this.client.get(buildPath(CATELOG_SERVICE_PREFIX, '/rules'), {'path': path, 'kind': kind, 'match': match});
  }
  /**
   * Create a new search time rule definition.
   * @param {Object|CatelogProxy~Rule} rule 
   * @return {Promise<CatelogProxy~Rule>}
   */
  createRule(rule) {
    return this.client.post(buildPath(CATELOG_SERVICE_PREFIX,`/rules`, rule));
  }
  /**
   * Returns the rule identified by the given path. The path must be fully qualified, if the path is a prefix the request returns 404
     because it does identify a rule resource.
   * @param {string} rulePath 
   * @return {Promise<CatelogProxy~Rule>}
   */
  getRule(rulePath) {
    return this.client.get(buildPath(CATELOG_SERVICE_PREFIX,`/rules/${rulePath}`));
  }
  getRuleConf(name) {
    return this.client.get(buildPath(CATELOG_SERVICE_PREFIX,`/rules/${name}/conf`));
  }
  /**
   * Updates the rule by the given path.
   * @param {string} rulePath 
   * @return {Promise<CatelogProxy~Rule>}
   */
  patchRule(rulePath) {
    return this.client.patch(buildPath(CATELOG_SERVICE_PREFIX,`/rules/${rulePath}`));
  }
  /**
   * Delete the rule by the given path.
   * @param {string} rulePath 
   */
  deleteRule(rulePath) {
    return this.client.delete(buildPath(CATELOG_SERVICE_PREFIX,`/rules/${rulePath}`));
  }
}

/**
 * The supported dataset kind in the system. 
 * One of "CATELOG", "EXTERN", "INDEX", "KVSTORE", "TOPIC"," VIEW"
 * @typedef {string} CatelogProxy~DatasetKind
 */

/**
 * Datasets
 * @typedef {Dataset[]} CatelogProxy~Datasets
 */

/**
 * Dataset
 * @typedef {CatelogProxy~Catelog|CatelogProxy~Extern|CatelogProxy~Index} CatelogProxy~Dataset
 */

/**
 * Catelog - Represents the metadata catalog as a dataset.
 * @typedef {Object} CatelogProxy~Catelog
 * @property {string} id
 * @property {string} name
 * @property {CatelogProxy~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * Extern - Represents an extern REST API based dataset.
 * @typedef {Object} CatelogProxy~Extern
 * @property {string} id
 * @property {string} name
 * @property {CatelogProxy~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * Index - Represents a Splunk events or metrics index.
 * @typedef {Object} CatelogProxy~Index
 * @property {string} id
 * @property {string} name
 * @property {CatelogProxy~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * KVStore - Represents an instance of the KV storage service as a dataset.
 * @typedef {Object} CatelogProxy~KVStore
 * @property {string} id
 * @property {string} name
 * @property {CatelogProxy~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * Topic - Represents a message bus topic as a dataset.
 * @typedef {Object} CatelogProxy~Topic
 * @property {string} id
 * @property {string} name
 * @property {CatelogProxy~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} todo
 */

/**
 * View - Represents a view over base data in some other dataset. 
   The view consists of a Splunk query (with at least a generating command) and
   an optional collection of search time transformation rules.
 * @typedef {Object} CatelogProxy~View
 * @property {string} id
 * @property {string} name
 * @property {CatelogProxy~DatasetKind} kind
 * @property {array} [rules]
 * @property {string} query
 */


/**
 * The kinds of search time transformation action known by the service.
 * One of "ALIAS", "AUTOKV", "REGEX", "EVAL", "LOOKUP"
 * @typedef {string} CatelogProxy~ActionKind.
 */

/**
 * Rule - Represents a rule for transforming results at search time. 
 * A rule consits of a `match` clause and a collection of transformation actions.
 * @typedef {Object} CatelogProxy~Rule
 * @property {string} name
 * @property {string} match
 * @property {number} [priority]
 * @property {string} [description]
 * @property {CatelogProxy~AliasAction[]|CatelogProxy~AutoKVAction[]|CatelogProxy~EvalAction[]|CatelogProxy~LookupAction[]|CatelogProxy~RegexAction[]} [actions]
 */

/**
 * Rules
 * @typedef {CatelogProxy~Rule[]} CatelogProxy~Rules
 */

/**
 * ExtractOptions. One of "ADD_VALUE", "CLEAN_KEYS", "KEEP_EMPTY"
 * @typedef {string} CatelogProxy~ExtractOptions
 */

/**
 * AutoMode - Enumerates the automatic key/value extraction modes.
 * One of "NONE", "AUTO", "MULTIKV", "XML", "JSON".
 * @typedef {string} CatelogProxy~AutoMode
 */


/**
  * AliasAction - Represents a field name alias.
  * @typedef {Object} CatelogProxy~AliasAction
  * @property {CatelogProxy~ActionKind} kind="ALIAS"
  * @property {string} field
  * @property {string} alias
  */

/**
 * AutoKVAction - Represents the definition of an automatic key/value extraction rule.
 * @typedef {Object} CatelogProxy~AutoKVAction
 * @property {CatelogProxy~ActionKind} kind="AUTOKV"
 * @property {CatelogProxy~ExtractOptions[]} options
 * @property {CatelogProxy~AutoMode} [mode="AUTO"]
 * @property {boolean} [trim=true]
 */

/**
 * RegexAction - Represents a regular expression action.
 * @typedef {Object} CatelogProxy~RegexAction
 * @property {CatelogProxy~ActionKind} kind="REGEX"
 * @property {CatelogProxy~ExtractOptions[]} options
 * @property {string} expression
 * @property {string} [pattern]
 * @property {string} [field="_raw"]
 * @property {string} [format=""]
 * @property {number} [limit=100000]
 */

/**
 * EvalAction - Represents an action based on an eval expression.
 * @typedef {Object} CatelogProxy~EvalAction
 * @property {CatelogProxy~ActionKind} kind="EVAL"
 * @property {CatelogProxy~ExtractOptions[]} options
 * @property {string} expression
 * @property {string} result
 */

/**
 * LookupAction - Represents a lookup action.
 * @typedef {Object} CatelogProxy~LookupAction
 * @property {CatelogProxy~ActionKind} kind="LOOKUP"
 * @property {CatelogProxy~ExtractOptions[]} options
 * @property {string} expression
 */