/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import BaseApiService from './baseapiservice';
import { QueryArgs, RequestOptions } from './client';
import { STREAMS_SERVICE_PREFIX } from './service_prefixes';

/**
 * Encapsulates Streams endpoints
 */
export class StreamsService extends BaseApiService {
    /**
     * Creates a Upl Json from DSL.
     * @param dsl The DSL script that needs to be converted into a UPL pipeline JSON
     * @returns A UPL pipeline in JSON format
     */
    public compileDslToUpl = (
        dsl: DslCompilationRequest
    ): Promise<UplPipeline> => {
        return this.client.post(
            this.client.buildPath(STREAMS_SERVICE_PREFIX, ['pipelines', 'compile-dsl']), dsl)
            .then(response => response.body as UplPipeline);
    }

    /**
     * Gets all the pipelines based on the query parameters provided by the user.
     * @param queryArgs Filter string to target specific pipelines
     * @returns A Promise of a paginated pipeline response (consists of the pipelines and total count)
     */
    public getPipelines = (
        queryArgs: PipelineQueryParams = {}
    ): Promise<PaginatedPipelineResponse> => {
        const url = this.client.buildPath(STREAMS_SERVICE_PREFIX, ['pipelines']);
        const requestOptions: RequestOptions = {
            query: queryArgs as QueryArgs
        };
        return this.client.get(url, requestOptions)
            .then(response => response.body as PaginatedPipelineResponse);
    }

    /**
     * Creates a new pipeline.
     * @param pipeline The new pipeline data to be created
     * @returns A promise of a new pipeline object
     */
    public createPipeline = (
        pipeline: PipelineRequest
    ): Promise<Pipeline> => {
        return this.client.post(
            this.client.buildPath(STREAMS_SERVICE_PREFIX, ['pipelines']), pipeline)
            .then(response => response.body as Pipeline);
    }

    /**
     * Activates a pipeline.
     * @param activatePipelineRequest The activate pipeline request containing the ids of pipeline to be activated
     * @returns A promise of the additional properties defining the current status of the pipelines
     */
    public activatePipeline = (
        activatePipelineRequest: ActivatePipelineRequest
    ): Promise<AdditionalProperties> => {
        return this.client.post(
            this.client.buildPath(STREAMS_SERVICE_PREFIX, ['pipelines', 'activate']), activatePipelineRequest)
            .then(response => response.body as AdditionalProperties);
    }

    /**
     * Deactivates a pipeline.
     * @param deactivatePipelineRequest The deactivate pipeline request containing the ids of pipeline to be deactivated
     * @returns A promise of the additional properties defining the current status of the pipelines
     */
    public deactivatePipeline = (
        deactivatePipelineRequest: ActivatePipelineRequest
    ): Promise<AdditionalProperties> => {
        return this.client.post(
            this.client.buildPath(STREAMS_SERVICE_PREFIX, ['pipelines', 'deactivate']), deactivatePipelineRequest)
            .then(response => response.body as AdditionalProperties);
    }

    /**
     * Get the pipeline based on the pipeline ID provided by the user.
     * @param id The ID of the pipeline that should be fetched
     * @returns A Promise of an individual pipeline
     */
    public getPipeline = (
        id: string
    ): Promise<Pipeline> => {
        const url = this.client.buildPath(STREAMS_SERVICE_PREFIX, ['pipelines', id]);
        return this.client.get(url)
            .then(response => response.body as Pipeline);
    }

    /**
     * Updates an existing pipeline.
     * @param id The ID of the pipeline that should be updated
     * @param pipeline The updated pipeline data
     * @returns A promise of an updated pipeline object
     */
    public updatePipeline = (
        id: string,
        pipeline: PipelineRequest
    ): Promise<Pipeline> => {
        return this.client.put(
            this.client.buildPath(STREAMS_SERVICE_PREFIX, ['pipelines', id]), pipeline)
            .then(response => response.body as Pipeline);
    }

    /**
     * Deletes the pipeline based on the ID provided by the user.
     * @param id The ID of the pipeline that should be deleted
     * @returns A promise pf a pipeline delete response containing details on the deleted pipeline
     */
    public deletePipeline = (id: string): Promise<PipelineDeleteResponse> => {
        return this.client.delete(
            this.client.buildPath(STREAMS_SERVICE_PREFIX, ['pipelines', id]))
            .then(response => response.body as PipelineDeleteResponse);
    }
}

// TODO (Parul): Find more details on other fields and include comments and optional fiel information
/**
 * ActivatePipelineRequest -  Request to activate the pipeline
 */
export interface ActivatePipelineRequest {
    /**
     * A list of pipeline IDs.
     */
    ids: string[];
    /**
     * Skips checkpointing.
     */
    skipSavePoint: boolean;
}

/**
 * AdditionalProperties - Properties in an activate/deactivate response
 */
export interface AdditionalProperties {
    /**
     * A list of pipeline IDs.
     */
    [key: string]: string[];
}

/**
 * DslCompilationRequest - The DSL that needs to be compiled into a valid UPL JSON
 */
export interface DslCompilationRequest {
    /**
     * DSL script text.
     */
    dsl: string;
}

/**
 * Pipeline - A pipeline object
 */
export interface Pipeline {
    /**
     * Epoch time in milliseconds.
     */
    activatedDate: number;
    activatedUserId: string;
    activatedVersion: number;
    /**
     * Epoch time in milliseconds.
     */
    createDate: number;
    createUserId: string;
    currentVersion: number;
    data: UplPipeline;
    description: string;
    id: string;
    jobId: string;
    /**
     * Epoch time in milliseconds.
     */
    lastUpdateDate: number;
    lastUpdateUserId: string;
    /**
     * Name of the pipeline.
     */
    name: string;
    /**
     * Current status of the pipeline (Created, Activated, etc).
     */
    status: PipelineStatus;
    statusMessage: string;
    streamingConfigurationId: number;
    tenantId: string;
    validationMessages: string[];
    version: number;
}

/**
 * PaginatedPipelineResponse - The pipeline response containing a list of all the pipelines associated with the tenant and the total count
 */
export interface PaginatedPipelineResponse {
    /**
     * A list of all the pipelines associated with the tenant.
     */
    items: Pipeline[];
    /**
     * The total count of the pipelines.
     */
    total: number;
}

/**
 * PipelineDeleteResponse - The response returned as a result of a delete pipeline call
 */
export interface PipelineDeleteResponse {
    couldDeactivate: boolean;
    running: boolean;
}

/**
 * PipelineRequest - The pipeline data
 */
export interface PipelineRequest {
    bypassValidation: boolean;
    createUserId: string;
    /**
     * Upl Pipeline data containing the nodes and edges of the pipeline.
     */
    data: UplPipeline;
    /**
     * Description of the pipeline.
     */
    description: string;
    /**
     * Name of the pipeline.
     */
    name: string;
    streamingConfigurationId?: number;
}

/**
 * PipelineStatus - The status of a pipeline
 */
export enum PipelineStatus {
    Created = 'CREATED',
    Activated = 'ACTIVATED'
}

/**
 * UplPipeline - Pipeline Data
 */
export interface UplPipeline {
    edges: UplEdge[];
    nodes: UplNode[];
    'root-node': string[];
    version: number;
}

/**
 * UplNode - Nodes forming a pipeline
 */
export interface UplNode {
    attributes: {};
    id: string[];
    op: string[];
}

/**
 * UplEdge - Edges between two pipeline nodes
 */
export interface UplEdge {
    attributes: {};
    sourceNode: string;
    sourcePort: string;
    targetNode: string;
    targetPort: string;
}

/**
 * PipelineQueryParams - Query parameters for Pipeline
 */
export interface PipelineQueryParams {
    offset?: number;
    pageSize?: number;
    sortField?: string;
    sortDir?: string;
    activated?: boolean;
    createUserId?: string;
    name?: string;
    includeData?: boolean;
}
