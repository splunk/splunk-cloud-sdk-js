import BaseApiService from "./baseapiservice";
import {CATALOG_SERVICE_PREFIX} from "./common/service_prefixes";
import { QueryArgs } from "./client";

/**
 * Encapsulates catalog endpoints
 */
export class CatalogService extends BaseApiService {
    /**
     * Returns a list of datasets, optionally filtered by the given query parameters.
     * @param [filter] An SPL filter string
     */
    public getDatasets(filter?: string): Promise<DatasetInfo[]> {
        const query: QueryArgs = {};
        if (filter) {
            query.filter = filter;
        }
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), query)
            .catch(response => response as DatasetInfo[]);
    }

    /**
     * Create a new dataset.
     * @param dataset
     */
    public createDataset(dataset: DatasetInfo): Promise<DatasetInfo> {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), dataset)
            .then(response => response as DatasetInfo);
    }

    /**
     * Returns the dataset resource with the specified `id`.
     * @param datasetId
     */
    public getDataset(datasetId: DatasetInfo["id"]): Promise<DatasetInfo> {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]))
            .then(response => response as DatasetInfo);
    }

    /**
     * Delete the DatasetInfo and its dependencies with the specified id
     * @param datasetId id of the DatasetInfo to delete
     */
    public deleteDataset(datasetId: DatasetInfo["id"]): Promise<any> { // TODO: can we add stricter return typing?
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]));
    }

    /**
     * Delete the DatasetInfo and its dependencies with the specified id
     * @param name of the DatasetInfo to delete
     */
    public deleteDatasetByName(name: DatasetInfo["name"]): Promise<any> { // TODO: can we add stricter return typing?
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
     * @param {DatasetInfo} dataset
     */
    public updateDataset(dataset: DatasetInfo): Promise<DatasetInfo> {
        return this.client.patch(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', dataset.id]), dataset)
            .then(response => response as DatasetInfo);
    }

    // rules

    /**
     * Create a new Rule
     * @param {Rule} rule
     */
    public createRule(rule: Rule): Promise<Rule> {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), rule)
            .then(response => response as Rule);
    }

    /**
     * Get the matching list of Rules
     * @param [filter] An SPL filter string
     */
    public getRules(filter?: string): Promise<Rule> {
        const query: QueryArgs = {};
        if (filter) {
            query.filter = filter;
        }
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), query)
            .then(response => response as Rule);
    }

    /**
     * Return the Rule with the specified id
     */
    public getRule(ruleId: Rule["id"]): Promise<Rule> {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleId]))
            .then(response => response as Rule);
    }

    /**
     * Delete the Rule and its dependencies with the specified id
     */
    public deleteRule(ruleId: Rule["id"]): Promise<any> { // TODO: can we add stricter return typing?
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleId]));
    }

}

export interface DatasetInfo {
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

export interface Field {
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

export enum DataType {
    DATE,
    NUMBER,
    OBJECT_ID,
    STRING,
    UNKNOWN,
}

export enum FieldType {
    DIMENSION,
    MEASURE,
    UNKNOWN,
}

export enum Prevalence {
    ALL,
    SOME,
    UNKNOWN,
}

export interface Rule {
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

export interface Action {
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
