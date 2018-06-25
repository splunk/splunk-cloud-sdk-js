import BaseApiService from "./baseapiservice";
import {CATALOG_SERVICE_PREFIX} from "./common/service_prefixes";

/**
 * Encapsulates catalog endpoints
 */
class CatalogService extends BaseApiService {
    /**
     * Returns a list of datasets, optionally filtered by the given query parameters.
     * @param {string} [filter] A SPL filter string
     * @return {Promise<Array<DatasetInfo>>}
     */
    public getDatasets(filter?: string): Promise<object> {
        const query = {filter};
        if (filter) {
            query.filter = filter;
        }
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), query);
    }

    /**
     * Create a new dataset.
     * @param dataset
     * @return {Promise<DatasetInfo>}
     */
    public createDataset(dataset: object|DatasetInfo): Promise<object> {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), dataset);
    }

    /**
     * Returns the dataset resource with the specified `id`.
     * @param datasetId
     * @return {Promise<DatasetInfo>}
     */
    public getDataset(datasetId: string): Promise<object> {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]));
    }

    /**
     * Delete the DatasetInfo and its dependencies with the specified id
     * @param datasetId id of the DatasetInfo to delete
     */
    public deleteDataset(datasetId: string): Promise<object> {
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]));
    }

    /**
     * Updates the supplied dataset
     * @param {DatasetInfo} dataset
     * @returns {Promise<DatasetInfo>}
     */
    public updateDataset(dataset: DatasetInfo): Promise<object> {
        return this.client.patch(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', dataset.id]), dataset);
    }

    // rules

    /**
     * Create a new Rule
     * @param {CatalogService~Rule} rule
     * @returns {Promise<CatalogService~Rule>}
     */
    public createRule(rule: Rule): Promise<object> {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), rule);
    }

    /**
     * Get the matching list of Rules
     * @param {string} [filter] An SPL filter string
     * @returns {Promise<CatalogService~Rule>}
     */
    public getRules(filter?: string): Promise<object> {
        const query = {filter};
        if (filter) {
            query.filter = filter;
        }
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), query);
    }

    /**
     * Return the Rule with the specified id
     * @returns {Promise<CatalogService~Rule>}
     */
    public getRule(ruleId: Rule["id"]): Promise<object> {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleId]));
    }

    /**
     * Delete the Rule and its dependencies with the specified id
     * @returns {Promise<Object>}
     */
    public deleteRule(ruleId: Rule["id"]): Promise<object> {
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleId]));
    }

}

interface DatasetInfo {
    id: string;
    name: string;
    kind: string;
    owner: string;
    created?: string;
    modified?: string;
    createdBy?: string;
    modifiedBy?: string;
    capabilities?: string;
    version?: number;
    fields: Field[];
}

interface Field {
    id: string;
    name: string;
    dataSetId: string;
    dataType?: DataType;
    fieldType?: FieldType;
    prevalence?: Prevalence;
    created?: string;
    modified?: string;
    versionAdded?: string;
    versionRemoved?: string;
    dataset?: DatasetInfo;
}

enum DataType {
    DATE,
    NUMBER,
    OBJECT_ID,
    STRING,
    UNKNOWN,
}

enum FieldType {
    DIMENSION,
    MEASURE,
    UNKNOWN,
}

enum Prevalence {
    ALL,
    SOME,
    UNKNOWN,
}

interface Rule {
    id: string;
    name: string;
    module: string;
    match: string;
    owner: string;
    actions: Action[];
    created: string;
    modified: string;
    createdBy: string;
    modifiedBy: string;
    version: number;
}

interface Action {
    id: string;
    ruleid: string;
    kind: string;
    owner: string;
    created: string;
    modified: string;
    createdBy: string;
    modifiedBy: string;
    version: number;
}

export default CatalogService;
