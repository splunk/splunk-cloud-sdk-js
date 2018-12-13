/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import BaseApiService from './baseapiservice';
import { QueryArgs } from './client';
import { CATALOG_SERVICE_PREFIX, SERVICE_CLUSTER_MAPPING } from './service_prefixes';

/**
 * Encapsulates catalog endpoints
 */
export class CatalogService extends BaseApiService {
    /**
     * Returns a list of datasets, optionally filtered by a filter string.
     * @param filter An SPL filter string
     * @return Array of dataset descriptors
     */
    public getDatasets = (filter?: string): Promise<DatasetResponse[]> => {
        const query: QueryArgs = {};
        if (filter) {
            query.filter = filter;
        }
        return this.listDatasets(query);
    }

    /**
     * Returns a list of datasets, optionally filtered by a filter string, count, or orderby criteria
     * @param query QueryArgs
     */
    public listDatasets = (query: QueryArgs = {}): Promise<DatasetResponse[]> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), { query })
            .then(response => response.body as DatasetResponse[]);
    }

    /**
     * Return a list of modules that match a filter query if it is given,
     *  otherwise return all modules.
     *  @param filter a filter to apply to the Modules
     *  @return Array of module names
     */
    public getModules = (filter?: string): Promise<Module[]> => {
        const query: QueryArgs = {};
        if (filter) {
            query.filter = filter;
        }
        return this.client.get(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['modules']), { query })
            .then(response => response.body as Module[]);
    }

    /**
     * Create a new dataset.
     * @param dataset The dataset to create
     * @return description of the new dataset
     */
    public createDataset (dataset: Dataset): Promise<DatasetResponse> {
        return this.client.post(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), dataset)
            .then(response => response.body as DatasetResponse);
    }

    /**
     * Returns the dataset resource with the specified `id` or `resourceName`.
     * @param datasetIdOrResourceName
     * @return description of the dataset
     */
    public getDataset = (datasetIdOrResourceName: string): Promise<DatasetResponse> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetIdOrResourceName]))
            .then(response => response.body as DatasetResponse);
    }

    /**
     * Delete the Dataset and its dependencies with the specified `id`
     * @param datasetIdOrResourceName
     * @return A promise that will be resolved when deletion is complete
     */
    public deleteDataset = (datasetIdOrResourceName: string): Promise<object> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetIdOrResourceName]))
            .then(response => response.body as object);
    }

    /**
     * Delete the Dataset
     * @param name of the Dataset to delete
     * @return A promise that will be resolved when deletion is complete
     */
    public deleteDatasetByName = (name: string): Promise<object> => {
        return this.getDatasets(`name=="${name}"`).then(
            ret => {
                if (ret.length > 1) {
                    throw new Error('There are more than 1 dataset with the input name');
                } else if (ret.length === 1) {
                    return this.deleteDataset(ret[0].id).then(response => response);
                } else {
                    return Promise.reject(new Error(`No dataset found with name: ${name}`));
                }
            });
    }

    /**
     * Updates the supplied dataset
     * @param datasetIdOrResourceName
     * @param partial
     * @return information about the updated dataset
     */
    // TODO: add lint check for xxxID vs. xxxId consistency
    public updateDataset = (datasetIdOrResourceName: string, partial: Partial<Dataset>): Promise<DatasetResponse> => {
        return this.client.patch(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetIdOrResourceName]), partial)
            .then(response => response.body as DatasetResponse);
    }

    // rules

    /**
     * Create a new Rule
     * @param rule The rule to create
     * @return a description of the new rule
     */
    public createRule = (rule: CreateRule): Promise<Rule> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), rule)
            .then(response => response.body as Rule);
    }

    /**
     * Get the matching list of Rules
     * @param filter An SPL filter string
     * @return description of defined rules (optionally matching SPL query)
     */
    public getRules = (filter?: string): Promise<Rule[]> => {
        const query: QueryArgs = {};
        if (filter) {
            query.filter = filter;
        }
        return this.client.get(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), { query })
            .then(response => response.body as Rule[]);
    }

    /**
     * Return the Rule with the specified `id`
     * @param ruleIdOrResourceName
     * @return description of the rule
     */
    public getRule = (ruleIdOrResourceName: string): Promise<Rule> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleIdOrResourceName]))
            .then(response => response.body as Rule);
    }

    /**
     * Delete the Rule and its dependencies with the specified `id`
     * @param ruleIdOrResourceName
     * @return Promise that will be resolved when the rule is deleted
     */
    public deleteRule = (ruleIdOrResourceName: string): Promise<object> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleIdOrResourceName]))
            .then(response => response.body as object);
    }

    /**
     * Get the list of dataset fields for the given `id`
     * @param datasetID
     * @param filter An SPL filter string
     * @return array of field descriptions for fields defined on the dataset
     */
    public getDatasetFields = (datasetID: string, filter?: string): Promise<Field[]> => {
        const query = { filter };
        return this.client.get(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields']), { query })
            .then(response => response.body as Field[]);
    }

    /**
     * Gets the Field with the specified datasetID and datasetFieldID
     * @param datasetID
     * @param datasetFieldID
     * @return field description
     */
    public getDatasetField = (datasetID: string, datasetFieldID: string): Promise<Field> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]))
            .then(response => response.body as Field);
    }

    /**
     * Creates a new dataset field
     * @param datasetID
     * @param datasetField
     * @return description of the new field defined on the dataset
     */
    public postDatasetField = (datasetID: string, datasetField: Field): Promise<Field> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields']), datasetField)
            .then(response => response.body as Field);
    }

    /**
     * Updates an existing dataset field
     * @param datasetID
     * @param datasetFieldID
     * @param datasetField
     * @return updated description of the field
     */
    public patchDatasetField = (datasetID: string, datasetFieldID: string, datasetField: Field): Promise<Field> => {
        return this.client.patch(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]), datasetField)
            .then(response => response.body as Field);
    }

    /**
     * Deletes the dataset field with the specified datasetID and datasetFieldID
     * @param datasetID
     * @param datasetFieldID
     * @return promise that will be resolved when field is deleted
     */
    public deleteDatasetField = (datasetID: string, datasetFieldID: string): Promise<object> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]))
            .then(response => response.body as object);
    }

    /**
     * Gets the list of fields
     * @param filter An SPL filter string
     * @return fields
     */
    public getFields = (filter?: string): Promise<Field[]> => {
        const query = { filter };
        return this.client.get(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['fields']), { query })
            .then(response => response.body as Field[]);
    }

    /**
     * Get the matching field
     * @param fieldID
     * @return description of the field
     */
    public getField = (fieldID: string): Promise<Field> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['fields', fieldID]))
            .then(response => response.body as Field);
    }

    /**
     * Create a new Rule Action
     * @param ruleID
     * @param action The rule action to create
     * @return a description of the new rule action
     */
    public createRuleAction = (ruleID: Rule['id'], action: AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction):
        Promise<AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions']), action)
            .then(response => response.body as AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction);
    }

    /**
     * Gets the list of rule actions
     * @param ruleID
     * @param filter An SPL filter string
     * @return rule actions
     */
    public getRuleActions = (ruleID: Rule['id'], filter?: string): Promise<AliasAction[] | AutoKVAction[] | EvalAction[] | LookupAction[] | RegexAction[]> => {
        const query = { filter };
        return this.client.get(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions']), { query })
            .then(response => response.body as AliasAction[] | AutoKVAction[] | EvalAction[] | LookupAction[] | RegexAction[]);
    }

    /**
     * Gets the rule action with the specified ruleID and actionID
     * @param ruleID
     * @param actionID
     * @return a rule action
     */
    public getRuleAction = (ruleID: Rule['id'], actionID: string): Promise<AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions', actionID]))
            .then(response => response.body as AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction);
    }

    /**
     * Updates the supplied rule action
     * @param ruleID
     * @param actionID
     * @param action
     * @return information about the updated rule action
     */
    public updateRuleAction = (ruleID: Rule['id'], actionID: string, action: AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction):
        Promise<AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction> => {
        return this.client.patch(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions', actionID]), action)
            .then(response => response.body as AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction);
    }

    /**
     * Deletes the rule action with the specified ruleID and actionID
     * @param ruleID
     * @param actionID
     * @return promise that will be resolved when rule action is deleted
     */
    public deleteRuleAction = (ruleID: Rule['id'], actionID: string): Promise<object> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.catalog, this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions', actionID]))
            .then(response => response.body as object);
    }
}

export type Dataset = Import | Metric | Index | View | Lookup | KVCollection;
export type DatasetResponse = ImportResponse | MetricResponse | IndexResponse | JobResponse | ViewResponse | LookupResponse | KVCollectionResponse;

export interface DatasetBase {
    // A unique dataset ID. Random ID used if not provided. Not valid for PATCH method.
    id?: string;
    // The name of the module to create the new dataset in.
    module?: string;
    // The dataset name. Dataset names must be unique within each module.
    name: string;
    // The dataset kind.
    kind: string;
}

export interface DatasetBaseResponse extends DatasetBase {
    // A unique dataset ID. Random ID used if not provided. Not valid for PATCH method.
    id: string;
    // The name of the module to create the new dataset in.
    module: string;
    // The catalog version.
    version: number;
    // The date and time object was created.
    created: string;
    // The date and time object was modified.
    modified: string;
    // The name of the user who created the object. This value is obtained from the bearer token and may not be changed.
    createdBy: string;
    // The name of the user who most recently modified the object.
    modifiedBy: string;
    // The name of the object's owner.
    owner: string;
    // The dataset name qualified by the module name.
    resourceName: string;
}

export interface Import extends DatasetBase {
    kind: 'import';
    // The dataset module being imported.
    sourceModule: string;
    // The dataset name being imported.
    sourceName: string;
    // The dataset ID being imported.
    originalDatasetId?: string;
    // The dataset ID being imported.
    // TODO: sourceId is only used for POST operations, all others use originalDatasetId.
    // This should be fixed by the Catalog service in the future.
    sourceId?: string;
}
export type ImportResponse = Import & DatasetBaseResponse;

export interface Metric extends DatasetBase {
    kind: 'metric';
    // Specifies whether or not the Splunk index is disabled.
    disabled?: boolean;
    // The frozenTimePeriodInSecs to use for the index
    frozenTimePeriodInSecs?: number;
}
export type MetricResponse = Metric & DatasetBaseResponse;

export interface Index extends DatasetBase {
    kind: 'index';
    // Specifies whether or not the Splunk index is disabled.
    disabled?: boolean;
    // The frozenTimePeriodInSecs to use for the index
    frozenTimePeriodInSecs?: number;
}
export type IndexResponse = Index & DatasetBaseResponse;

// Job is ONLY a response, cannot be created by POST
export interface JobResponse extends DatasetBaseResponse {
    kind: 'job';

    // The time the dataset will be available.
    deleteTime: string;
    // Should the search produce all fields (including those not explicitly mentioned in the SPL)?
    extractAllFields?: boolean;
    // The number of seconds to run this search before finishing.
    maxTime?: number;
    // Parameters for the search job, mainly earliest and latest.
    parameters: object;
    // An estimate of how complete the search job is.
    percentComplete?: number;
    // The SPL query string for the search job.
    query: string;
    // The instantaneous number of results produced by the search job.
    resultsAvailable?: number;
    // The ID assigned to the search job.
    sid: string;
    // The SPLv2 version of the search job query string.
    spl: string;
    // The current status of the search job.
    status: string;
    // Converts a formatted time string from into UTC seconds.
    timeFormat: string;
    // The system time at the time the search job was created
    timeOfSearch: string;
}

export interface View extends DatasetBase {
    kind: 'view';
    // A valid SPL-defined search.
    search: string;
}
export type ViewResponse = View & DatasetBaseResponse;

export interface Lookup extends DatasetBase {
    kind: 'lookup';
    // Match case-sensitively against the lookup.
    caseSensitiveMatch?: boolean;
    // The type of the external lookup, this should always be `kvcollection`
    externalKind: string;
    // The name of the external lookup.
    externalName: string;
    // A query that filters results out of the lookup before those results are returned.
    filter?: string;
}
export type LookupResponse = Lookup & DatasetBaseResponse;

export interface KVCollection extends DatasetBase {
    kind: 'kvcollection';
}
export type KVCollectionResponse = KVCollection & DatasetBaseResponse;

export interface Field {
    id?: string; // TODO: come back and make a CreateField type
    name: string;
    datasetid?: string;
    datatype?: Datatype;
    fieldtype?: Fieldtype;
    prevalence?: Prevalence;
    created?: string;
    modified?: string;
    versionAdded?: string;
    versionRemoved?: string;
}

// TODO: verify that these str values conform to the spec
export enum Datatype {
    DATE = 'D',
    NUMBER = 'N',
    OBJECT_ID = 'O',
    STRING = 'S',
    UNKNOWN = 'U',
}

// TODO: verify that these str values conform to the spec
export enum Fieldtype {
    DIMENSION = 'D',
    MEASURE = 'M',
    UNKNOWN = 'U',
}

// TODO: verify that these str values conform to the spec
export enum Prevalence {
    ALL = 'A',
    SOME = 'S',
    UNKNOWN = 'U',
}

// TODO: audit fields for validity
export interface CreateRule {
    name?: string;
    module?: string;
    match?: string;
    owner?: string;
    actions?: Action[];
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

// TODO: add CreateXAction interfaces, or a generic CreateAction map<string,string>
// this will take an enum for kind

export interface Action {
    id?: string;
    ruleid?: string;
    kind?: string;
    owner?: string;
    created?: string;
    modified?: string;
    createdBy?: string;
    modifiedBy?: string;
    version?: number;
}

export interface AliasAction {
    id?: string;
    ruleid?: string;
    kind?: 'ALIAS';
    owner?: string;
    created?: string;
    modified?: string;
    createdBy?: string;
    modifiedBy?: string;
    version?: number;
    alias: string;
    field: Field['name'];
}

export interface AutoKVAction {
    id?: string;
    ruleid?: string;
    kind?: 'AUTOKV';
    owner?: string;
    created?: string;
    modified?: string;
    createdBy?: string;
    modifiedBy?: string;
    version?: number;
    mode?: string;
}

export interface EvalAction {
    id?: string;
    ruleid?: string;
    kind?: 'EVAL';
    owner?: string;
    created?: string;
    modified?: string;
    createdBy?: string;
    modifiedBy?: string;
    version?: number;
    expression?: string;
    field?: Field['name'];
}

export interface LookupAction {
    id?: string;
    ruleid?: string;
    kind?: 'LOOKUP';
    owner?: string;
    created?: string;
    modified?: string;
    createdBy?: string;
    modifiedBy?: string;
    version?: number;
    expression?: string;
}

export interface RegexAction {
    id?: string;
    ruleid?: string;
    kind?: 'REGEX';
    owner?: string;
    created?: string;
    modified?: string;
    createdBy?: string;
    modifiedBy?: string;
    version?: number;
    pattern?: string;
    field?: Field['name'];
    limit?: number;
}

export interface Module {
    /**
     * The name of a module
     */
    name: string;
}
