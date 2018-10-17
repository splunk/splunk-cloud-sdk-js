/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import BaseApiService from './baseapiservice';
import { QueryArgs } from './client';
import { CATALOG_SERVICE_PREFIX } from './service_prefixes';
import { not } from "rxjs/internal-compatibility";

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
        return this.listDatasets(query);
    }

    /**
     * Returns a list of datasets, optionally filtered by a filter string, count, or orderby criteria
     * @param query QueryArgs
     */
    public listDatasets = (query: QueryArgs = {}): Promise<DatasetInfo[]> => {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), { query })
            .then(response => response.body as DatasetInfo[]);
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
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['modules']), { query })
            .then(response => response.body as Module[]);
    }

    /**
     * Create a new dataset.
     * @param dataset The dataset to create
     * @return description of the new dataset
     */
    public createDataset = (dataset: DatasetInfo): Promise<DatasetInfo> => {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets']), dataset)
            .then(response => response.body as DatasetInfo);
    }

    /**
     * Returns the dataset resource with the specified `id` or `resourceName`.
     * @param datasetIdOrResourceName
     * @return description of the dataset
     */
    public getDataset = (datasetIdOrResourceName: string): Promise<DatasetInfo> => {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetIdOrResourceName]))
            .then(response => response.body as DatasetInfo);
    }

    /**
     * Delete the DatasetInfo and its dependencies with the specified `id`
     * @param datasetIdOrResourceName
     * @return A promise that will be resolved when deletion is complete
     */
    public deleteDataset = (datasetIdOrResourceName: string): Promise<any> => { // TODO: can we add stricter return typing?
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetIdOrResourceName]))
            .then(response => response.body);
    }

    /**
     * Delete the Dataset
     * @param name of the Dataset to delete
     * @return A promise that will be resolved when deletion is complete
     */
    public deleteDatasetByName = (name: DatasetInfo['name']): Promise<any> => { // TODO: can we add stricter return typing?
        return this.getDatasets(`name=="${name}"`).then(
            ret => {
                if (ret.length > 1) {
                    throw new Error('There are more than 1 dataset with the input name');
                } else if (ret.length === 1) {
                    return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', ret[0].id]))
                        .then(response => response.body);
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
    public updateDataset = (datasetIdOrResourceName: string, partial: PartialDatasetInfo): Promise<DatasetInfo> => {
        return this.client.patch(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetIdOrResourceName]), partial)
            .then(response => response.body as DatasetInfo);
    }

    // rules

    /**
     * Create a new Rule
     * @param rule The rule to create
     * @return a description of the new rule
     */
    public createRule = (rule: Rule): Promise<Rule> => {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), rule)
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
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules']), { query })
            .then(response => response.body as Rule[]);
    }

    /**
     * Return the Rule with the specified `id`
     * @param ruleIdOrResourceName
     * @return description of the rule
     */
    public getRule = (ruleIdOrResourceName: string): Promise<Rule> => {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleIdOrResourceName]))
            .then(response => response.body as Rule);
    }

    /**
     * Delete the Rule and its dependencies with the specified `id`
     * @param ruleIdOrResourceName
     * @return Promise that will be resolved when the rule is deleted
     */
    public deleteRule = (ruleIdOrResourceName: string): Promise<any> => { // TODO: can we add stricter return typing?
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleIdOrResourceName]))
            .then(response => response.body);
    }

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
    }

    /**
     * Gets the Field with the specified datasetID and datasetFieldID
     * @param datasetID
     * @param datasetFieldID
     * @return field description
     */
    public getDatasetField = (datasetID: DatasetInfo['id'], datasetFieldID: Field['id']): Promise<Field> => {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]))
            .then(response => response.body as Field);
    }

    /**
     * Creates a new dataset field
     * @param datasetID
     * @param datasetField
     * @return description of the new field defined on the dataset
     */
    public postDatasetField = (datasetID: DatasetInfo['id'], datasetField: Field): Promise<Field> => {
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields']), datasetField)
            .then(response => response.body as Field);
    }

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
    }

    /**
     * Deletes the dataset field with the specified datasetID and datasetFieldID
     * @param datasetID
     * @param datasetFieldID
     * @return promise that will be resolved when field is deleted
     */
    public deleteDatasetField = (datasetID: DatasetInfo['id'], datasetFieldID: Field['id']): Promise<object> => {
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['datasets', datasetID, 'fields', datasetFieldID]))
            .then(response => response.body as object);
    }

    /**
     * Gets the list of fields
     * @param filter An SPL filter string
     * @return fields
     */
    public getFields = (filter?: string): Promise<Field[]> => {
        const query = { filter };
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['fields']), { query })
            .then(response => response.body as Field[]);
    }

    /**
     * Get the matching field
     * @param fieldID
     * @return description of the field
     */
    public getField = (fieldID: Field['id']): Promise<Field> => {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['fields', fieldID]))
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
        return this.client.post(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions']), action)
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
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions']), { query })
            .then(response => response.body as AliasAction[] | AutoKVAction[] | EvalAction[] | LookupAction[] | RegexAction[]);
    }

    /**
     * Gets the rule action with the specified ruleID and actionID
     * @param ruleID
     * @param actionID
     * @return a rule action
     */
    public getRuleAction = (ruleID: Rule['id'], actionID: string): Promise<AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction> => {
        return this.client.get(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions', actionID]))
            .then(response => response.body as AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction);
    }

    /**
     * Updates the supplied rule action
     * @param ruleID
     * @param actionID
     * @return information about the updated rule action
     */
    public updateRuleAction = (ruleID: Rule['id'], actionID: string, action: AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction):
        Promise<AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction> => {
        return this.client.patch(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions', actionID]), action)
            .then(response => response.body as AliasAction | AutoKVAction | EvalAction | LookupAction | RegexAction);
    }

    /**
     * Deletes the rule action with the specified ruleID and actionID
     * @param ruleID
     * @param actionID
     * @return promise that will be resolved when rule action is deleted
     */
    public deleteRuleAction = (ruleID: Rule['id'], actionID: string): Promise<object> => {
        return this.client.delete(this.client.buildPath(CATALOG_SERVICE_PREFIX, ['rules', ruleID, 'actions', actionID]))
            .then(response => response.body as object);
    }
}

export interface DatasetInfo {
    id: string;
    name: string;
    kind: string;
    owner: string;
    module: string;
    created?: string;
    modified?: string;
    createdBy?: string;
    modifiedBy?: string;
    capabilities?: string;
    version?: number;
    sourceName?: string;
    sourceModule?: string;
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

export interface Module {
    /**
     * The name of a module
     */
    name: string;
}
