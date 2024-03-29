// tslint:disable
/**
 * Copyright 2022 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Splunk Search service
 * Use the Search service in Splunk Cloud Services to dispatch, review, and manage searches and search jobs. You can finalize or cancel jobs, retrieve search results, and request search-related configurations from the Metadata Catalog service in Splunk Cloud Services.
 *
 * OpenAPI spec version: v2 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */



import {
    Dataset,
    DatasetPATCH,
    DatasetPOST,
    DeleteSearchJob,
    FederatedConnection,
    FederatedConnectionInput,
    FieldsSummary,
    ListDatasets,
    ListFederatedConnections,
    ListPreviewResultsResponse,
    ListSearchResultsResponse,
    SearchJob,
    SearchStatus,
    TimeBucketsSummary,
    UpdateJob,
} from '../models';
import BaseApiService from "../../../../baseapiservice";
import { SearchServiceExtensions } from "../../../../service_extensions/search";
import { SplunkError, RequestStatus } from '../../../../client';

export const SEARCH_SERVICE_PREFIX: string = '/search/v2';
export const SEARCH_SERVICE_CLUSTER: string = 'api';
/**
  * @export
  */
 export enum OutputModeEnum {
     Csv = 'csv',
     Json = 'json'
 }
/**
 * Splunk Search service
 * Version: v2
 * Use the Search service in Splunk Cloud Services to dispatch, review, and manage searches and search jobs. You can finalize or cancel jobs, retrieve search results, and request search-related configurations from the Metadata Catalog service in Splunk Cloud Services.
 */
export class GeneratedSearchService extends BaseApiService {
    getServiceCluster() : string {
        return SEARCH_SERVICE_CLUSTER
    }

    getServicePrefix() : string {
        return SEARCH_SERVICE_PREFIX;
    }
    /**
     * Creates a dataset.
     * @param datasetPOST
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Dataset
     */
    public createDataset = (datasetPOST?: DatasetPOST, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Dataset> => {
        if (!datasetPOST) {
            throw new SplunkError({ message: `Bad Request: datasetPOST is empty or undefined` });
        }
        const path = `/search/v2/datasets`;
        return this.client.post(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), datasetPOST, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Dataset);
    }
    /**
     * Creates a new federated connection with information about how to connect to a remote index. 
     * @param federatedConnectionInput
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return FederatedConnection
     */
    public createFederatedConnection = (federatedConnectionInput?: FederatedConnectionInput, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<FederatedConnection> => {
        if (!federatedConnectionInput) {
            throw new SplunkError({ message: `Bad Request: federatedConnectionInput is empty or undefined` });
        }
        const path = `/search/v2/connections`;
        return this.client.post(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), federatedConnectionInput, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as FederatedConnection);
    }
    /**
     * Creates a search job.
     * @param searchJob
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return SearchJob
     */
    public createJob = (searchJob?: SearchJob, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<SearchJob> => {
        if (!searchJob) {
            throw new SplunkError({ message: `Bad Request: searchJob is empty or undefined` });
        }
        const path = `/search/v2/jobs`;
        return this.client.post(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), searchJob, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as SearchJob);
    }
    /**
     * Deletes a dataset with a specified dataset ID (datasetid). 
     * @param datasetid The dataset ID.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public deleteDatasetById = (datasetid: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            datasetid: datasetid
        };
        const path = this.template`/search/v2/datasets/${'datasetid'}`(path_params);
        return this.client.delete(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Deletes a federated connection with the specified name (connectionName) 
     * @param connectionName The name of the federated connection.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public deleteFederatedConnection = (connectionName: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            connectionName: connectionName
        };
        const path = this.template`/search/v2/connections/${'connectionName'}`(path_params);
        return this.client.delete(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Creates a search job that deletes events from an index. The events are deleted from the index in the specified module, based on the search criteria as specified by the predicate. 
     * @param deleteSearchJob
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return DeleteSearchJob
     */
    public deleteJob = (deleteSearchJob?: DeleteSearchJob, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<DeleteSearchJob> => {
        if (!deleteSearchJob) {
            throw new SplunkError({ message: `Bad Request: deleteSearchJob is empty or undefined` });
        }
        const path = `/search/v2/jobs/delete`;
        return this.client.post(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), deleteSearchJob, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as DeleteSearchJob);
    }
    /**
     * Exports the search results for the job with the specified search ID (SID). Export the results as a CSV file or JSON file.
     * @param sid The search ID.
     * @param args parameters to be sent with the request
     * @param args.count The maximum number of jobs that you want to return the status entries for. 
     * @param args.filename The export results filename. Default: exportResults 
     * @param args.outputMode Specifies the format for the returned output. 
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return { [key: string]: any; }
     */
    public exportResults = (sid: string, args?: { count?: number, filename?: string, outputMode?: OutputModeEnum, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<{ [key: string]: any; }> => {
        const path_params = {
            sid: sid
        };
        const path = this.template`/search/v2/jobs/${'sid'}/export`(path_params);
        return this.client.get(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as { [key: string]: any; });
    }
    /**
     * Returns all federated connections.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return ListFederatedConnections
     */
    public getAllFederatedConnections = (args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<ListFederatedConnections> => {
        const path = `/search/v2/connections`;
        return this.client.get(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as ListFederatedConnections);
    }
    /**
     * Returns a dataset with a specified dataset ID (datasetid). 
     * @param datasetid The dataset ID.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Dataset
     */
    public getDatasetById = (datasetid: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Dataset> => {
        const path_params = {
            datasetid: datasetid
        };
        const path = this.template`/search/v2/datasets/${'datasetid'}`(path_params);
        return this.client.get(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Dataset);
    }
    /**
     * Returns the federated connection with the specified name (connectionName). 
     * @param connectionName The name of the federated connection.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return FederatedConnection
     */
    public getFederatedConnectionByName = (connectionName: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<FederatedConnection> => {
        const path_params = {
            connectionName: connectionName
        };
        const path = this.template`/search/v2/connections/${'connectionName'}`(path_params);
        return this.client.get(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as FederatedConnection);
    }
    /**
     * Returns the search job with the specified search ID (SID).
     * @param sid The search ID.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return SearchJob
     */
    public getJob = (sid: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<SearchJob> => {
        const path_params = {
            sid: sid
        };
        const path = this.template`/search/v2/jobs/${'sid'}`(path_params);
        return this.client.get(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as SearchJob);
    }
    /**
     * Returns a list of all datasets.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return ListDatasets
     */
    public listDatasets = (args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<ListDatasets> => {
        const path = `/search/v2/datasets`;
        return this.client.get(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as ListDatasets);
    }
    /**
     * Returns an events summary for search ID (SID) search.
     * @param sid The search ID.
     * @param args parameters to be sent with the request
     * @param args.count The maximum number of jobs that you want to return the status entries for. 
     * @param args.earliest The earliest time filter, in absolute time. When specifying an absolute time specify either UNIX time, or UTC in seconds using the ISO-8601 (%FT%T.%Q) format. For example 2021-01-25T13:15:30Z. GMT is the default timezone. You must specify GMT when you specify UTC. Any offset specified is ignored. 
     * @param args.field One or more fields to return for the result set. Use a comma-separated list of field names to specify multiple fields. 
     * @param args.latest The latest time filter in absolute time. When specifying an absolute time specify either UNIX time, or UTC in seconds using the ISO-8601 (%FT%T.%Q) format. For example 2021-01-25T13:15:30Z. GMT is the default timezone. You must specify GMT when you specify UTC. Any offset specified is ignored. Latest time must be after Earliest time. 
     * @param args.offset Index number identifying the location of the first item to return.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return ListSearchResultsResponse
     */
    public listEventsSummary = (sid: string, args?: { count?: number, earliest?: string, field?: string, latest?: string, offset?: number, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<ListSearchResultsResponse> => {
        const path_params = {
            sid: sid
        };
        const path = this.template`/search/v2/jobs/${'sid'}/timeline-metadata/auto/events-summary`(path_params);
        return this.client.get(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as ListSearchResultsResponse);
    }
    /**
     * Returns a fields stats summary of the events to-date, for search ID (SID) search.
     * @param sid The search ID.
     * @param args parameters to be sent with the request
     * @param args.earliest The earliest time filter, in absolute time. When specifying an absolute time specify either UNIX time, or UTC in seconds using the ISO-8601 (%FT%T.%Q) format. For example 2021-01-25T13:15:30Z. GMT is the default timezone. You must specify GMT when you specify UTC. Any offset specified is ignored. 
     * @param args.latest The latest time filter in absolute time. When specifying an absolute time specify either UNIX time, or UTC in seconds using the ISO-8601 (%FT%T.%Q) format. For example 2021-01-25T13:15:30Z. GMT is the default timezone. You must specify GMT when you specify UTC. Any offset specified is ignored. Latest time must be after Earliest time. 
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return FieldsSummary
     */
    public listFieldsSummary = (sid: string, args?: { earliest?: string, latest?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<FieldsSummary> => {
        const path_params = {
            sid: sid
        };
        const path = this.template`/search/v2/jobs/${'sid'}/timeline-metadata/auto/fields-summary`(path_params);
        return this.client.get(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as FieldsSummary);
    }
    /**
     * Returns the matching list of search jobs.
     * @param args parameters to be sent with the request
     * @param args.count The maximum number of jobs that you want to return the status entries for. 
     * @param args.filter Filter the list of jobs by 'sid'. Valid format is  `sid IN ({comma-separated list of SIDs. Each SID must be enclosed in double quotation marks.})`. A maximum of 30 SIDs can be specified in one query. 
     * @param args.status Filter the list of jobs by status. Valid status values are 'running', 'done', 'canceled', or 'failed'. 
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Array<SearchJob>
     */
    public listJobs = (args?: { count?: number, filter?: string, status?: SearchStatus, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Array<SearchJob>> => {
        const path = `/search/v2/jobs`;
        return this.client.get(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Array<SearchJob>);
    }
    /**
     * Returns the preview search results for the job with the specified search ID (SID). Can be used when a job is running to return interim results.
     * @param sid The search ID.
     * @param args parameters to be sent with the request
     * @param args.count The maximum number of jobs that you want to return the status entries for. 
     * @param args.offset Index number identifying the location of the first item to return.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return ListPreviewResultsResponse
     */
    public listPreviewResults = (sid: string, args?: { count?: number, offset?: number, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<ListPreviewResultsResponse> => {
        const path_params = {
            sid: sid
        };
        const path = this.template`/search/v2/jobs/${'sid'}/results-preview`(path_params);
        return this.client.get(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as ListPreviewResultsResponse);
    }
    /**
     * Returns the search results for the job with the specified search ID (SID).
     * @param sid The search ID.
     * @param args parameters to be sent with the request
     * @param args.count The maximum number of jobs that you want to return the status entries for. 
     * @param args.field One or more fields to return for the result set. Use a comma-separated list of field names to specify multiple fields. 
     * @param args.offset Index number identifying the location of the first item to return.
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return ListSearchResultsResponse
     */
    public listResults = (sid: string, args?: { count?: number, field?: string, offset?: number, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<ListSearchResultsResponse> => {
        const path_params = {
            sid: sid
        };
        const path = this.template`/search/v2/jobs/${'sid'}/results`(path_params);
        return this.client.get(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as ListSearchResultsResponse);
    }
    /**
     * Returns the event distribution over time of the untransformed events read to-date, for search ID(SID) search.
     * @param sid The search ID.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return TimeBucketsSummary
     */
    public listTimeBuckets = (sid: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<TimeBucketsSummary> => {
        const path_params = {
            sid: sid
        };
        const path = this.template`/search/v2/jobs/${'sid'}/timeline-metadata/auto/time-buckets`(path_params);
        return this.client.get(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as TimeBucketsSummary);
    }
    /**
     * Creates or updates a federated connection with a specified name (connectionName). 
     * @param connectionName The name of the federated connection.
     * @param federatedConnectionInput
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return FederatedConnection
     */
    public putFederatedConnectionByName = (connectionName: string, federatedConnectionInput?: FederatedConnectionInput, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<FederatedConnection> => {
        if (!federatedConnectionInput) {
            throw new SplunkError({ message: `Bad Request: federatedConnectionInput is empty or undefined` });
        }
        const path_params = {
            connectionName: connectionName
        };
        const path = this.template`/search/v2/connections/${'connectionName'}`(path_params);
        return this.client.put(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), federatedConnectionInput, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as FederatedConnection);
    }
    /**
     * Refresh a federated connection to fetch new remote indexes and add/delete corresponding federated datasets. 
     * @param connectionName The name of the federated connection.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public refreshFederatedConnection = (connectionName: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            connectionName: connectionName
        };
        const path = this.template`/search/v2/connections/${'connectionName'}/refresh`(path_params);
        return this.client.post(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Test connection with remote EC instance using federated connection parameters. 
     * @param connectionName The name of the federated connection.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public testFederatedConnection = (connectionName: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            connectionName: connectionName
        };
        const path = this.template`/search/v2/connections/${'connectionName'}/test`(path_params);
        return this.client.post(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Modifies a dataset with a specified dataset ID (datasetid). 
     * @param datasetid The dataset ID.
     * @param datasetPATCH
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Dataset
     */
    public updateDatasetById = (datasetid: string, datasetPATCH?: DatasetPATCH, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Dataset> => {
        if (!datasetPATCH) {
            throw new SplunkError({ message: `Bad Request: datasetPATCH is empty or undefined` });
        }
        const path_params = {
            datasetid: datasetid
        };
        const path = this.template`/search/v2/datasets/${'datasetid'}`(path_params);
        return this.client.patch(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), datasetPATCH, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Dataset);
    }
    /**
     * Updates the search job with the specified search ID (SID) with an action.
     * @param sid The search ID.
     * @param updateJob
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return SearchJob
     */
    public updateJob = (sid: string, updateJob?: UpdateJob, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<SearchJob> => {
        if (!updateJob) {
            throw new SplunkError({ message: `Bad Request: updateJob is empty or undefined` });
        }
        const path_params = {
            sid: sid
        };
        const path = this.template`/search/v2/jobs/${'sid'}`(path_params);
        return this.client.patch(SEARCH_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), updateJob, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as SearchJob);
    }
}
export type SearchService = GeneratedSearchService & SearchServiceExtensions;
export const SearchService = SearchServiceExtensions(GeneratedSearchService);
