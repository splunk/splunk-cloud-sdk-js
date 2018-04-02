import {ApiProxy} from "./apiproxy"
import {CATELOG_SERVICE_PREFIX} from "./common/constants"
import {buildPath} from "./common/utils"
import {NovaDatasets} from "./models/catelog"

export class CatelogProxy extends ApiProxy {
  constructor(client) {
    super(client)
  }

  /**
   * datasets endpoints
   */
  getDatasets(query) {
    return this.client.get(buildPath(CATELOG_SERVICE_PREFIX, '/datasets'), query);
  }
  createDatasets(datasetObject) {
    return this.client.post(buildPath(CATELOG_SERVICE_PREFIX,`/datasets`, datasetObject));
  }
  /**
   * dataset endpoint
   */
  getDataset(name) {
    return this.client.get(buildPath(CATELOG_SERVICE_PREFIX,`/datasets/${name}`));
  }
  getDatasetConf(name) {
    return this.client.get(buildPath(CATELOG_SERVICE_PREFIX,`/datasets/${name}/conf`));
  }
  patchDataset(name) {
    return this.client.patch(buildPath(CATELOG_SERVICE_PREFIX,`/datasets/${name}`));
  }
  deleteDataset(name) {
    return this.client.delete(buildPath(CATELOG_SERVICE_PREFIX,`/datasets/${name}`));
  }
  /**
   * rules endpoints
   */
  getRules(query) {
    return this.client.get(buildPath(CATELOG_SERVICE_PREFIX, '/rules'), query);
  }
  createRules(ruleObj) {
    return this.client.post(buildPath(CATELOG_SERVICE_PREFIX,`/rules`, ruleObj));
  }
  /**
   * rule endpoint
   */
  getRule(name) {
    return this.client.get(buildPath(CATELOG_SERVICE_PREFIX,`/rules/${name}`));
  }
  getRuleConf(name) {
    return this.client.get(buildPath(CATELOG_SERVICE_PREFIX,`/rules/${name}/conf`));
  }
  patchRule(name) {
    return this.client.patch(buildPath(CATELOG_SERVICE_PREFIX,`/rules/${name}`));
  }
  deleteRule(name) {
    return this.client.delete(buildPath(CATELOG_SERVICE_PREFIX,`/rules/${name}`));
  }
}

