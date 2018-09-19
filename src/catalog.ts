/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import BaseApiService from './baseapiservice';
import { QueryArgs } from './client';
import { CATALOG_SERVICE_PREFIX } from './service_prefixes';

/**
 * Encapsulates catalog endpoints
 */
export class CatalogService extends BaseApiService {
    /**
     * Returns a list of datasets, optionally filtered by a filter string.
     * @param filter An SPL filter string
     * @return Array of dataset descriptors
     */
    public getDatasets = (filter?: string): Promise<DatasetInfo[]> => {
        const query: QueryArgs = {};
        if (filter) {
            query.filter = filter;
        }
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), { query })
            .then(response => response.body as DatasetInfo[]);
    };

    /**
     * Create a new dataset.
     * @param dataset The dataset to create
     * @return description of the new dataset
     */
    public createDataset = (dataset: DatasetInfo): Promise<DatasetInfo> => {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), dataset)
            .then(response => response.body as DatasetInfo);
    };

    /**
     * Returns the dataset resource with the specified `id`.
     * @param datasetId
     * @return description of the dataset
     */
    public getDataset = (datasetId: string): Promise<DatasetInfo> => {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]))
            .then(response => response.body as DatasetInfo);
    };

    /**
     * Delete the DatasetInfo and its dependencies with the specified `id`
     * @param datasetId `id` of the dataset to delete
     * @return A promise that will be resolved when deletion is complete
     */
    public deleteDataset = (datasetId: string): Promise<any> => { // TODO: can we add stricter return typing?
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]))
            .then(response => response.body);
    };

    /**
     * Updates the supplied dataset
     * @param datasetId
     * @param partial
     * @return information about the updated dataset
     */
        // TODO: add lint check for xxxID vs. xxxId consistency
    public updateDataset = (datasetId: string, partial: PartialDatasetInfo): Promise<DatasetInfo> => {
        return this.client.patch(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetId]), partial)
            .then(response => response.body as DatasetInfo);
    };

    // rules

    /**
     * Create a new Rule
     * @param rule The rule to create
     * @return a description of the new rule
     */
    public createRule = (rule: Rule): Promise<Rule> => {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), rule)
            .then(response => response.body as Rule);
    };

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
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), { query })
            .then(response => response.body as Rule[]);
    };

    /**
     * Return the Rule with the specified `id`
     * @param ruleId
     * @return description of the rule
     */
    public getRule = (ruleId: string): Promise<Rule> => {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleId]))
            .then(response => response.body as Rule);
    };

    /**
     * Delete the Rule and its dependencies with the specified `id`
     * @param ruleId
     * @return Promise that will be resolved when the rule is deleted
     */
    public deleteRule = (ruleId: string): Promise<any> => { // TODO: can we add stricter return typing?
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleId]))
            .then(response => response.body);
    };

    /**
     * Get the list of dataset fields for the given `id`
     * @param datasetID
     * @param filter An SPL filter string
     * @return array of field descriptions for fields defined on the dataset
     */
    public getDatasetFields = (datasetID: DatasetInfo['id'], filter?: string): Promise<Field[]> => {
        const query = { filter };
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields']), { query })
            .then(response => response.body as Field[]);
    };

    /**
     * Gets the Field with the specified datasetID and datasetFieldID
     * @param datasetID
     * @param datasetFieldID
     * @return field description
     */
    public getDatasetField = (datasetID: DatasetInfo['id'], datasetFieldID: Field['id']): Promise<Field> => {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]))
            .then(response => response.body as Field);
    };

    /**
     * Creates a new dataset field
     * @param datasetID
     * @param datasetField
     * @return description of the new field defined on the dataset
     */
    public postDatasetField = (datasetID: DatasetInfo['id'], datasetField: Field): Promise<Field> => {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields']), datasetField)
            .then(response => response.body as Field);
    };

    /**
     * Updates an existing dataset field
     * @param datasetID
     * @param datasetFieldID
     * @param datasetField
     * @return updated description of the field
     */
    public patchDatasetField = (datasetID: DatasetInfo['id'], datasetFieldID: Field['id'], datasetField: Field): Promise<Field> => {
        return this.client.patch(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]), datasetField)
            .then(response => response.body as Field);
    };

    /**
     * Deletes the dataset field with the specified datasetID and datasetFieldID
     * @param datasetID
     * @param datasetFieldID
     * @return promise that will be resolved when field is deleted
     */
    public deleteDatasetField = (datasetID: DatasetInfo['id'], datasetFieldID: Field['id']): Promise<object> => {
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]))
            .then(response => response.body as object);
    };

    /**
     * Gets the list of fields
     * @param filter An SPL filter string
     * @return fields
     */
    public getFields = (filter?: string): Promise<Field[]> => {
        const query = { filter };
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['fields']), { query })
            .then(response => response.body as Field[]);
    };

    /**
     * Get the matching field
     * @param fieldID
     * @return description of the field
     */
    public getField = (fieldID: Field['id']): Promise<Field> => {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['fields', fieldID]))
            .then(response => response.body as Field);
    };

    /**
     * Create a new Rule Action
     * @param rule The rule to create
     * @return a description of the new rule
     */
    public createRuleAction = (ruleID: Rule['id'], action: AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction):
        Promise<AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction> => {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions']), action)
            .then(response => response.body as AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction);
    };

    /**
     * Gets the list of fields
     * @param filter An SPL filter string
     * @return fields
     */
    public getRuleActions = (ruleID: Rule['id'], filter?: string): Promise<AliasAction[] | AutoKVAction[] | EvalAction[] | LookupAction[] | RegexAction[]> => {
        const query = { filter };
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions']), { query })
            .then(response => response.body as AliasAction[] | AutoKVAction[] | EvalAction[] | LookupAction[] | RegexAction[]);
    };

    /**
     * Gets the list of fields
     * @param filter An SPL filter string
     * @return fields
     */
    public getRuleAction = (ruleID: Rule['id'], actionID: string, filter?: string): Promise<AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction> => {
        const query = { filter };
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions', actionID]), { query })
            .then(response => response.body as AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction);
    };

    /**
     * Updates the supplied dataset
     * @param datasetId
     * @param partial
     * @return information about the updated dataset
     */
    public updateRuleAction = (ruleID: Rule['id'], actionID: string, action: AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction):
        Promise<AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction> => {
        return this.client.patch(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions', actionID]), action)
            .then(response => response.body as AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction);
    };

    /**
     * Deletes the dataset field with the specified datasetID and datasetFieldID
     * @param datasetID
     * @param datasetFieldID
     * @return promise that will be resolved when field is deleted
     */
    public deleteRuleAction = (ruleID: Rule['id'], actionID: string): Promise<object> => {
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions', actionID]))
            .then(response => response.body as object);
    };
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
    readroles?: string[];
    writeroles?: string[];
    fields: Field[];
}

export interface PartialDatasetInfo {
    name?: string;
    kind?: string;
    owner?: string;
    created?: string;
    modified?: string;
    createdBy?: string;
    modifiedBy?: string;
    capabilities?: string;
    version?: number;
    readroles?: string[];
    writeroles?: string[];
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

export interface AliasAction {
    id: string;
    ruleid: string;
    kind: 'ALIAS';
    owner: string;
    created: string;
    modified: string;
    createdBy: string;
    modifiedBy: string;
    version: number;
    alias: string;
    field: Field;
}

export interface AutoKVAction {
    id: string;
    ruleid: string;
    kind: 'AUTOKV';
    owner: string;
    created: string;
    modified: string;
    createdBy: string;
    modifiedBy: string;
    version: number;
    mode: string;
}

export interface EvalAction {
    id: string;
    ruleid: string;
    kind: 'EVAL';
    owner: string;
    created: string;
    modified: string;
    createdBy: string;
    modifiedBy: string;
    version: number;
    expression: string;
    field: Field;
}

export interface LookupAction {
    id: string;
    ruleid: string;
    kind: 'LOOKUP';
    owner: string;
    created: string;
    modified: string;
    createdBy: string;
    modifiedBy: string;
    version: number;
    expression: string;
}


export interface RegexAction {
    id: string;
    ruleid: string;
    kind: 'REGEX';
    owner: string;
    created: string;
    modified: string;
    createdBy: string;
    modifiedBy: string;
    version: number;
    pattern: string;
    field: Field;
    limit: number;
}
