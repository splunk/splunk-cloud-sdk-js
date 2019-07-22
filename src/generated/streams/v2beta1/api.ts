// tslint:disable
/**
 * Copyright 2019 Splunk, Inc.
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
 * Data Stream Processing REST API
 * With the Splunk Cloud Data Stream Processing service, you can perform create, read, update, and delete (CRUD) operations on your data pipeline. The Streams API also has metrics and preview session endpoints and gives you full control over your data pipeline
 *
 * OpenAPI spec version: v2beta1.1
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import BaseApiService from '../../../baseapiservice';
import {
    ActivatePipelineRequest,
    ConnectionPatchRequest,
    ConnectionPutRequest,
    ConnectionRequest,
    ConnectionSaveResponse,
    DeactivatePipelineRequest,
    DslCompilationRequest,
    GetInputSchemaRequest,
    GetOutputSchemaRequest,
    GroupExpandRequest,
    GroupPatchRequest,
    GroupPutRequest,
    GroupRequest,
    GroupResponse,
    MetricsResponse,
    PaginatedResponseOfConnectionResponse,
    PaginatedResponseOfConnectorResponse,
    PaginatedResponseOfPipelineJobStatus,
    PaginatedResponseOfPipelineResponse,
    PaginatedResponseOfTemplateResponse,
    PipelineDeleteResponse,
    PipelinePatchRequest,
    PipelineReactivateResponse,
    PipelineRequest,
    PipelineResponse,
    PipelinesMergeRequest,
    PreviewData,
    PreviewSessionStartRequest,
    PreviewStartResponse,
    PreviewState,
    Response,
    TemplatePatchRequest,
    TemplatePutRequest,
    TemplateRequest,
    TemplateResponse,
    UplPipeline,
    UplRegistry,
    UplType,
    ValidateRequest,
    ValidateResponse,
} from '../../../models/streams';
import { SplunkError } from '../../../client';

export const STREAMS_SERVICE_PREFIX: string = '/streams/v2beta1';
export const STREAMS_SERVICE_CLUSTER: string = 'api';

/**
 * Data Stream Processing REST API
 * Version: v2beta1.1
 * With the Splunk Cloud Data Stream Processing service, you can perform create, read, update, and delete (CRUD) operations on your data pipeline. The Streams API also has metrics and preview session endpoints and gives you full control over your data pipeline
 */
export abstract class StreamsServiceGen extends BaseApiService {
    /**
     * Activates an existing pipeline.
     * @param id id of the pipeline to activate
     * @param activatePipelineRequest Request JSON
     * @return Response
     */
    public activatePipeline = (id: string, activatePipelineRequest: ActivatePipelineRequest): Promise<Response> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v2beta1/pipelines/${'id'}/activate`(path_params);
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), activatePipelineRequest)
            .then(response => response.body as Response);
    }
    /**
     * Compiles the Streams DSL and returns Streams JSON.
     * @param dslCompilationRequest Request JSON
     * @return UplPipeline
     */
    public compileDSL = (dslCompilationRequest: DslCompilationRequest): Promise<UplPipeline> => {
        const path = `/streams/v2beta1/pipelines/compile-dsl`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), dslCompilationRequest)
            .then(response => response.body as UplPipeline);
    }
    /**
     * Create a new DSP connection.
     * @param connectionRequest Request JSON
     * @return ConnectionSaveResponse
     */
    public createConnection = (connectionRequest: ConnectionRequest): Promise<ConnectionSaveResponse> => {
        const path = `/streams/v2beta1/connections`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), connectionRequest)
            .then(response => response.body as ConnectionSaveResponse);
    }
    /**
     * Create a new group function by combining the Streams JSON of two or more functions.
     * @param groupRequest Request JSON
     * @return GroupResponse
     */
    public createGroup = (groupRequest: GroupRequest): Promise<GroupResponse> => {
        const path = `/streams/v2beta1/groups`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), groupRequest)
            .then(response => response.body as GroupResponse);
    }
    /**
     * Creates a pipeline.
     * @param pipelineRequest Request JSON
     * @return PipelineResponse
     */
    public createPipeline = (pipelineRequest: PipelineRequest): Promise<PipelineResponse> => {
        const path = `/streams/v2beta1/pipelines`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), pipelineRequest)
            .then(response => response.body as PipelineResponse);
    }
    /**
     * Creates a template for a tenant.
     * @param templateRequest Request JSON
     * @return TemplateResponse
     */
    public createTemplate = (templateRequest: TemplateRequest): Promise<TemplateResponse> => {
        const path = `/streams/v2beta1/templates`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), templateRequest)
            .then(response => response.body as TemplateResponse);
    }
    /**
     * Deactivates an existing pipeline.
     * @param id id of the pipeline to deactivate
     * @param deactivatePipelineRequest Request JSON
     * @return Response
     */
    public deactivatePipeline = (id: string, deactivatePipelineRequest: DeactivatePipelineRequest): Promise<Response> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v2beta1/pipelines/${'id'}/deactivate`(path_params);
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), deactivatePipelineRequest)
            .then(response => response.body as Response);
    }
    /**
     * Delete all versions of a connection by its id.
     * @param connectionId ID of the connection
     */
    public deleteConnection = (connectionId: string): Promise<object> => {
        const path_params = {
            connectionId: connectionId
        };
        const path = this.template`/streams/v2beta1/connections/${'connectionId'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as object);
    }
    /**
     * Removes an existing group.
     * @param groupId The group function's ID from the function registry
     */
    public deleteGroup = (groupId: string): Promise<object> => {
        const path_params = {
            groupId: groupId
        };
        const path = this.template`/streams/v2beta1/groups/${'groupId'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as object);
    }
    /**
     * Removes a pipeline.
     * @param id id of the pipeline to delete
     * @return PipelineDeleteResponse
     */
    public deletePipeline = (id: string): Promise<PipelineDeleteResponse> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v2beta1/pipelines/${'id'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as PipelineDeleteResponse);
    }
    /**
     * Removes a template with a specific ID.
     * @param templateId ID of the template to delete
     */
    public deleteTemplate = (templateId: string): Promise<object> => {
        const path_params = {
            templateId: templateId
        };
        const path = this.template`/streams/v2beta1/templates/${'templateId'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as object);
    }
    /**
     * Creates and returns the expanded version of a group.
     * @param groupId The group function's ID from the function registry
     * @param groupExpandRequest Request JSON
     * @return UplPipeline
     */
    public expandGroup = (groupId: string, groupExpandRequest: GroupExpandRequest): Promise<UplPipeline> => {
        const path_params = {
            groupId: groupId
        };
        const path = this.template`/streams/v2beta1/groups/${'groupId'}/expand`(path_params);
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), groupExpandRequest)
            .then(response => response.body as UplPipeline);
    }
    /**
     * Returns the entire Streams JSON, including the expanded Streams JSON of any group functions in the pipeline.
     * @param uplPipeline Request JSON
     * @return UplPipeline
     */
    public expandPipeline = (uplPipeline: UplPipeline): Promise<UplPipeline> => {
        const path = `/streams/v2beta1/pipelines/expand`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), uplPipeline)
            .then(response => response.body as UplPipeline);
    }
    /**
     * Returns the full Streams JSON of a group.
     * @param groupId The group function's ID from the function registry
     * @return GroupResponse
     */
    public getGroup = (groupId: string): Promise<GroupResponse> => {
        const path_params = {
            groupId: groupId
        };
        const path = this.template`/streams/v2beta1/groups/${'groupId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as GroupResponse);
    }
    /**
     * Returns the input schema for a function in a pipeline.
     * @param getInputSchemaRequest Input Schema Request
     * @return UplType
     */
    public getInputSchema = (getInputSchemaRequest: GetInputSchemaRequest): Promise<UplType> => {
        const path = `/streams/v2beta1/pipelines/input-schema`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), getInputSchemaRequest)
            .then(response => response.body as UplType);
    }
    /**
     * Returns the output schema for a specified function in a pipeline. If no function ID is  specified, the request returns the output schema for all functions in a pipeline.
     * @param getOutputSchemaRequest Output Schema Request
     * @return { [key: string]: UplType; }
     */
    public getOutputSchema = (getOutputSchemaRequest: GetOutputSchemaRequest): Promise<{ [key: string]: UplType; }> => {
        const path = `/streams/v2beta1/pipelines/output-schema`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), getOutputSchemaRequest)
            .then(response => response.body as { [key: string]: UplType; });
    }
    /**
     * Returns an individual pipeline by version.
     * @param id id of the pipeline to get
     * @param args All other arguments.
     * @param args.version version
     * @return PipelineResponse
     */
    public getPipeline = (id: string, args?: { version?: string }): Promise<PipelineResponse> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v2beta1/pipelines/${'id'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PipelineResponse);
    }
    /**
     * Returns the latest metrics for a single pipeline.
     * @param id ID of the pipeline to get metrics for
     * @return MetricsResponse
     */
    public getPipelineLatestMetrics = (id: string): Promise<MetricsResponse> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v2beta1/pipelines/${'id'}/metrics/latest`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as MetricsResponse);
    }
    /**
     * Returns the status of pipelines from the underlying streaming system.
     * @param args All other arguments.
     * @param args.activated activated
     * @param args.createUserId createUserId
     * @param args.name name
     * @param args.offset offset
     * @param args.pageSize pageSize
     * @param args.sortDir sortDir
     * @param args.sortField sortField
     * @return PaginatedResponseOfPipelineJobStatus
     */
    public getPipelinesStatus = (args?: { activated?: boolean, createUserId?: string, name?: string, offset?: number, pageSize?: number, sortDir?: string, sortField?: string }): Promise<PaginatedResponseOfPipelineJobStatus> => {
        const path = `/streams/v2beta1/pipelines/status`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PaginatedResponseOfPipelineJobStatus);
    }
    /**
     * Returns the preview data for a session.
     * @param previewSessionId ID of the preview session
     * @return PreviewData
     */
    public getPreviewData = (previewSessionId: number): Promise<PreviewData> => {
        const path_params = {
            previewSessionId: previewSessionId.toString()
        };
        const path = this.template`/streams/v2beta1/preview-data/${'previewSessionId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as PreviewData);
    }
    /**
     * Returns information from a preview session.
     * @param previewSessionId ID of the preview session
     * @return PreviewState
     */
    public getPreviewSession = (previewSessionId: number): Promise<PreviewState> => {
        const path_params = {
            previewSessionId: previewSessionId.toString()
        };
        const path = this.template`/streams/v2beta1/preview-session/${'previewSessionId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as PreviewState);
    }
    /**
     * Returns the latest metrics for a preview session.
     * @param previewSessionId ID of the preview session
     * @return MetricsResponse
     */
    public getPreviewSessionLatestMetrics = (previewSessionId: number): Promise<MetricsResponse> => {
        const path_params = {
            previewSessionId: previewSessionId.toString()
        };
        const path = this.template`/streams/v2beta1/preview-session/${'previewSessionId'}/metrics/latest`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as MetricsResponse);
    }
    /**
     * Returns all functions in JSON format.
     * @param args All other arguments.
     * @param args.local local
     * @return UplRegistry
     */
    public getRegistry = (args?: { local?: boolean }): Promise<UplRegistry> => {
        const path = `/streams/v2beta1/pipelines/registry`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as UplRegistry);
    }
    /**
     * Returns an individual template by version.
     * @param templateId ID of the template
     * @param args All other arguments.
     * @param args.version version of the template
     * @return TemplateResponse
     */
    public getTemplate = (templateId: string, args?: { version?: number }): Promise<TemplateResponse> => {
        const path_params = {
            templateId: templateId
        };
        const path = this.template`/streams/v2beta1/templates/${'templateId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as TemplateResponse);
    }
    /**
     * Returns a list of connections (latest versions only) by tenant ID.
     * @param args All other arguments.
     * @param args.connectorId
     * @param args.createUserId
     * @param args.functionId
     * @param args.name
     * @param args.offset
     * @param args.pageSize
     * @param args.showSecretNames
     * @param args.sortDir Specify either ascending ('asc') or descending ('desc') sort order for a given field (sortField), which must be set for sortDir to apply. Defaults to 'asc'.
     * @param args.sortField
     * @return PaginatedResponseOfConnectionResponse
     */
    public listConnections = (args?: { connectorId?: string, createUserId?: string, functionId?: string, name?: string, offset?: number, pageSize?: number, showSecretNames?: string, sortDir?: string, sortField?: string }): Promise<PaginatedResponseOfConnectionResponse> => {
        const path = `/streams/v2beta1/connections`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PaginatedResponseOfConnectionResponse);
    }
    /**
     * Returns a list of the available connectors.
     * @return PaginatedResponseOfConnectorResponse
     */
    public listConnectors = (): Promise<PaginatedResponseOfConnectorResponse> => {
        const path = `/streams/v2beta1/connectors`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as PaginatedResponseOfConnectorResponse);
    }
    /**
     * Returns all pipelines.
     * @param args All other arguments.
     * @param args.activated activated
     * @param args.createUserId createUserId
     * @param args.includeData includeData
     * @param args.name name
     * @param args.offset offset
     * @param args.pageSize pageSize
     * @param args.sortDir sortDir
     * @param args.sortField sortField
     * @return PaginatedResponseOfPipelineResponse
     */
    public listPipelines = (args?: { activated?: boolean, createUserId?: string, includeData?: boolean, name?: string, offset?: number, pageSize?: number, sortDir?: string, sortField?: string }): Promise<PaginatedResponseOfPipelineResponse> => {
        const path = `/streams/v2beta1/pipelines`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PaginatedResponseOfPipelineResponse);
    }
    /**
     * Returns a list of all templates.
     * @param args All other arguments.
     * @param args.offset offset
     * @param args.pageSize pageSize
     * @param args.sortDir sortDir
     * @param args.sortField sortField
     * @return PaginatedResponseOfTemplateResponse
     */
    public listTemplates = (args?: { offset?: number, pageSize?: number, sortDir?: string, sortField?: string }): Promise<PaginatedResponseOfTemplateResponse> => {
        const path = `/streams/v2beta1/templates`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PaginatedResponseOfTemplateResponse);
    }
    /**
     * Combines two Streams JSON programs.
     * @param pipelinesMergeRequest Request JSON
     * @return UplPipeline
     */
    public mergePipelines = (pipelinesMergeRequest: PipelinesMergeRequest): Promise<UplPipeline> => {
        const path = `/streams/v2beta1/pipelines/merge`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), pipelinesMergeRequest)
            .then(response => response.body as UplPipeline);
    }
    /**
     * Modifies an existing DSP connection.
     * @param connectionId ID of the connection
     * @param connectionPutRequest Request JSON
     * @return ConnectionSaveResponse
     */
    public putConnection = (connectionId: string, connectionPutRequest: ConnectionPutRequest): Promise<ConnectionSaveResponse> => {
        const path_params = {
            connectionId: connectionId
        };
        const path = this.template`/streams/v2beta1/connections/${'connectionId'}`(path_params);
        return this.client.put(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), connectionPutRequest)
            .then(response => response.body as ConnectionSaveResponse);
    }
    /**
     * Update a group function combining the Streams JSON of two or more functions.
     * @param groupId The group function's ID from the function registry
     * @param groupPutRequest Request JSON
     * @return GroupResponse
     */
    public putGroup = (groupId: string, groupPutRequest: GroupPutRequest): Promise<GroupResponse> => {
        const path_params = {
            groupId: groupId
        };
        const path = this.template`/streams/v2beta1/groups/${'groupId'}`(path_params);
        return this.client.put(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), groupPutRequest)
            .then(response => response.body as GroupResponse);
    }
    /**
     * Updates an existing template.
     * @param templateId ID of the template
     * @param templatePutRequest Request JSON
     * @return TemplateResponse
     */
    public putTemplate = (templateId: string, templatePutRequest: TemplatePutRequest): Promise<TemplateResponse> => {
        const path_params = {
            templateId: templateId
        };
        const path = this.template`/streams/v2beta1/templates/${'templateId'}`(path_params);
        return this.client.put(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), templatePutRequest)
            .then(response => response.body as TemplateResponse);
    }
    /**
     * Reactivate a pipeline
     * @param id Pipeline UUID to reactivate
     * @return PipelineReactivateResponse
     */
    public reactivatePipeline = (id: string): Promise<PipelineReactivateResponse> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v2beta1/pipelines/${'id'}/reactivate`(path_params);
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as PipelineReactivateResponse);
    }
    /**
     * Creates a preview session for a pipeline.
     * @param previewSessionStartRequest Parameters to start a new Preview session
     * @return PreviewStartResponse
     */
    public startPreview = (previewSessionStartRequest: PreviewSessionStartRequest): Promise<PreviewStartResponse> => {
        const path = `/streams/v2beta1/preview-session`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), previewSessionStartRequest)
            .then(response => response.body as PreviewStartResponse);
    }
    /**
     * Stops a preview session.
     * @param previewSessionId ID of the preview session
     * @return string
     */
    public stopPreview = (previewSessionId: number): Promise<string> => {
        const path_params = {
            previewSessionId: previewSessionId.toString()
        };
        const path = this.template`/streams/v2beta1/preview-session/${'previewSessionId'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)))
            .then(response => response.body as string);
    }
    /**
     * Partially modifies an existing DSP connection.
     * @param connectionId ID of the connection
     * @param connectionPatchRequest Request JSON
     * @return ConnectionSaveResponse
     */
    public updateConnection = (connectionId: string, connectionPatchRequest: ConnectionPatchRequest): Promise<ConnectionSaveResponse> => {
        const path_params = {
            connectionId: connectionId
        };
        const path = this.template`/streams/v2beta1/connections/${'connectionId'}`(path_params);
        return this.client.patch(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), connectionPatchRequest)
            .then(response => response.body as ConnectionSaveResponse);
    }
    /**
     * Modify a group function by combining the Streams JSON of two or more functions.
     * @param groupId The group function's ID from the function registry
     * @param groupPatchRequest Request JSON
     * @return GroupResponse
     */
    public updateGroup = (groupId: string, groupPatchRequest: GroupPatchRequest): Promise<GroupResponse> => {
        const path_params = {
            groupId: groupId
        };
        const path = this.template`/streams/v2beta1/groups/${'groupId'}`(path_params);
        return this.client.patch(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), groupPatchRequest)
            .then(response => response.body as GroupResponse);
    }
    /**
     * Partially modifies an existing pipeline.
     * @param id id of the pipeline to update
     * @param pipelinePatchRequest Request JSON
     * @return PipelineResponse
     */
    public updatePipeline = (id: string, pipelinePatchRequest: PipelinePatchRequest): Promise<PipelineResponse> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v2beta1/pipelines/${'id'}`(path_params);
        return this.client.patch(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), pipelinePatchRequest)
            .then(response => response.body as PipelineResponse);
    }
    /**
     * Partially modifies an existing template.
     * @param templateId ID of the template
     * @param templatePatchRequest Request JSON
     * @return TemplateResponse
     */
    public updateTemplate = (templateId: string, templatePatchRequest: TemplatePatchRequest): Promise<TemplateResponse> => {
        const path_params = {
            templateId: templateId
        };
        const path = this.template`/streams/v2beta1/templates/${'templateId'}`(path_params);
        return this.client.patch(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), templatePatchRequest)
            .then(response => response.body as TemplateResponse);
    }
    /**
     * Verifies whether the Streams JSON is valid.
     * @param validateRequest JSON UPL to validate
     * @return ValidateResponse
     */
    public validatePipeline = (validateRequest: ValidateRequest): Promise<ValidateResponse> => {
        const path = `/streams/v2beta1/pipelines/validate`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), validateRequest)
            .then(response => response.body as ValidateResponse);
    }
}