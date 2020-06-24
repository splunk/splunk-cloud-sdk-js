// tslint:disable
/**
 * Copyright 2020 Splunk, Inc.
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
 * Use the Streams service to perform create, read, update, and delete (CRUD) operations on your data pipeline. The Streams service also has metrics and preview session endpoints and gives you full control over your data pipeline.
 *
 * OpenAPI spec version: v3beta1.1 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import {
    ActivatePipelineRequest,
    ConnectionPatchRequest,
    ConnectionPutRequest,
    ConnectionRequest,
    ConnectionSaveResponse,
    DeactivatePipelineRequest,
    DecompileRequest,
    DecompileResponse,
    ErrorResponse,
    FilesMetaDataResponse,
    GetInputSchemaRequest,
    GetOutputSchemaRequest,
    LookupTableResponse,
    MetricsResponse,
    PaginatedResponseOfConnectionResponse,
    PaginatedResponseOfConnectorResponse,
    PaginatedResponseOfPipelineJobStatus,
    PaginatedResponseOfPipelineResponse,
    PaginatedResponseOfTemplateResponse,
    Pipeline,
    PipelinePatchRequest,
    PipelineReactivateResponse,
    PipelineRequest,
    PipelineResponse,
    PreviewData,
    PreviewSessionStartRequest,
    PreviewStartResponse,
    PreviewState,
    RegistryModel,
    Response,
    SplCompileRequest,
    TemplatePatchRequest,
    TemplatePutRequest,
    TemplateRequest,
    TemplateResponse,
    UplType,
    UploadFile,
    ValidateRequest,
    ValidateResponse,
} from '../models';
import BaseApiService from "../../../../baseapiservice";
import { StreamsServiceExtensions } from "../../../../service_extensions/streams";
import { SplunkError } from '../../../../client';

export const STREAMS_SERVICE_PREFIX: string = '/streams/v3beta1';
export const STREAMS_SERVICE_CLUSTER: string = 'api';

/**
 * Data Stream Processing REST API
 * Version: v3beta1.1
 * Use the Streams service to perform create, read, update, and delete (CRUD) operations on your data pipeline. The Streams service also has metrics and preview session endpoints and gives you full control over your data pipeline.
 */
export class GeneratedStreamsService extends BaseApiService {
    getServiceCluster() : string {
        return STREAMS_SERVICE_CLUSTER
    }

    getServicePrefix() : string {
        return STREAMS_SERVICE_PREFIX;
    }
    /**
     * Activates an existing pipeline.
     * @param id Pipeline ID
     * @param activatePipelineRequest Request JSON
     * @param args parameters to be sent with the request
     * @return Response
     */
    public activatePipeline = (id: string, activatePipelineRequest: ActivatePipelineRequest, args?: object): Promise<Response> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v3beta1/pipelines/${'id'}/activate`(path_params);
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), activatePipelineRequest, { query: args })
            .then(response => response.body as Response);
    }
    /**
     * Compiles SPL2 and returns streams JSON.
     * @param splCompileRequest Request JSON
     * @param args parameters to be sent with the request
     * @return Pipeline
     */
    public compile = (splCompileRequest: SplCompileRequest, args?: object): Promise<Pipeline> => {
        const path = `/streams/v3beta1/pipelines/compile`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), splCompileRequest, { query: args })
            .then(response => response.body as Pipeline);
    }
    /**
     * Create a new DSP connection.
     * @param connectionRequest Request JSON
     * @param args parameters to be sent with the request
     * @return ConnectionSaveResponse
     */
    public createConnection = (connectionRequest: ConnectionRequest, args?: object): Promise<ConnectionSaveResponse> => {
        const path = `/streams/v3beta1/connections`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), connectionRequest, { query: args })
            .then(response => response.body as ConnectionSaveResponse);
    }
    /**
     * Creates a pipeline.
     * @param pipelineRequest Request JSON
     * @param args parameters to be sent with the request
     * @return PipelineResponse
     */
    public createPipeline = (pipelineRequest: PipelineRequest, args?: object): Promise<PipelineResponse> => {
        const path = `/streams/v3beta1/pipelines`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), pipelineRequest, { query: args })
            .then(response => response.body as PipelineResponse);
    }
    /**
     * Creates a template for a tenant.
     * @param templateRequest Request JSON
     * @param args parameters to be sent with the request
     * @return TemplateResponse
     */
    public createTemplate = (templateRequest: TemplateRequest, args?: object): Promise<TemplateResponse> => {
        const path = `/streams/v3beta1/templates`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), templateRequest, { query: args })
            .then(response => response.body as TemplateResponse);
    }
    /**
     * Deactivates an existing pipeline.
     * @param id Pipeline ID
     * @param deactivatePipelineRequest Request JSON
     * @param args parameters to be sent with the request
     * @return Response
     */
    public deactivatePipeline = (id: string, deactivatePipelineRequest: DeactivatePipelineRequest, args?: object): Promise<Response> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v3beta1/pipelines/${'id'}/deactivate`(path_params);
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), deactivatePipelineRequest, { query: args })
            .then(response => response.body as Response);
    }
    /**
     * Decompiles UPL and returns SPL.
     * @param decompileRequest Request JSON
     * @param args parameters to be sent with the request
     * @return DecompileResponse
     */
    public decompile = (decompileRequest: DecompileRequest, args?: object): Promise<DecompileResponse> => {
        const path = `/streams/v3beta1/pipelines/decompile`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), decompileRequest, { query: args })
            .then(response => response.body as DecompileResponse);
    }
    /**
     * Delete all versions of a connection by its id.
     * @param connectionId Connection ID
     * @param args parameters to be sent with the request
     */
    public deleteConnection = (connectionId: string, args?: object): Promise<object> => {
        const path_params = {
            connectionId: connectionId
        };
        const path = this.template`/streams/v3beta1/connections/${'connectionId'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as object);
    }
    /**
     * Delete file.
     * @param fileId File ID
     * @param args parameters to be sent with the request
     */
    public deleteFile = (fileId: string, args?: object): Promise<object> => {
        const path_params = {
            fileId: fileId
        };
        const path = this.template`/streams/v3beta1/files/${'fileId'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as object);
    }
    /**
     * Removes a pipeline.
     * @param id Pipeline ID
     * @param args parameters to be sent with the request
     */
    public deletePipeline = (id: string, args?: object): Promise<object> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v3beta1/pipelines/${'id'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as object);
    }
    /**
     * Removes a template with a specific ID.
     * @param templateId Template ID
     * @param args parameters to be sent with the request
     */
    public deleteTemplate = (templateId: string, args?: object): Promise<object> => {
        const path_params = {
            templateId: templateId
        };
        const path = this.template`/streams/v3beta1/templates/${'templateId'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as object);
    }
    /**
     * Get file metadata.
     * @param fileId File ID
     * @param args parameters to be sent with the request
     * @return UploadFile
     */
    public getFileMetadata = (fileId: string, args?: object): Promise<UploadFile> => {
        const path_params = {
            fileId: fileId
        };
        const path = this.template`/streams/v3beta1/files/${'fileId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as UploadFile);
    }
    /**
     * Returns files metadata.
     * @param args parameters to be sent with the request
     * @return FilesMetaDataResponse
     */
    public getFilesMetadata = (args?: object): Promise<FilesMetaDataResponse> => {
        const path = `/streams/v3beta1/files`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as FilesMetaDataResponse);
    }
    /**
     * Returns the input schema for a function in a pipeline.
     * @param getInputSchemaRequest Request JSON
     * @param args parameters to be sent with the request
     * @return UplType
     */
    public getInputSchema = (getInputSchemaRequest: GetInputSchemaRequest, args?: object): Promise<UplType> => {
        const path = `/streams/v3beta1/pipelines/input-schema`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), getInputSchemaRequest, { query: args })
            .then(response => response.body as UplType);
    }
    /**
     * Returns lookup table results.
     * @param connectionId Connection ID
     * @param args parameters to be sent with the request
     * @param args.offset offset
     * @param args.size size
     * @return LookupTableResponse
     */
    public getLookupTable = (connectionId: string, args?: { offset: number, size: number, [key: string]: any }): Promise<LookupTableResponse> => {
        const path_params = {
            connectionId: connectionId
        };
        const path = this.template`/streams/v3beta1/lookups/${'connectionId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as LookupTableResponse);
    }
    /**
     * Returns the output schema for a specified function in a pipeline.
     * @param getOutputSchemaRequest Request JSON
     * @param args parameters to be sent with the request
     * @return { [key: string]: UplType; }
     */
    public getOutputSchema = (getOutputSchemaRequest: GetOutputSchemaRequest, args?: object): Promise<{ [key: string]: UplType; }> => {
        const path = `/streams/v3beta1/pipelines/output-schema`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), getOutputSchemaRequest, { query: args })
            .then(response => response.body as { [key: string]: UplType; });
    }
    /**
     * Returns an individual pipeline by version.
     * @param id Pipeline ID
     * @param args parameters to be sent with the request
     * @param args.version version
     * @return PipelineResponse
     */
    public getPipeline = (id: string, args?: { version?: string, [key: string]: any }): Promise<PipelineResponse> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v3beta1/pipelines/${'id'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PipelineResponse);
    }
    /**
     * Returns the latest metrics for a single pipeline.
     * @param id Pipeline ID
     * @param args parameters to be sent with the request
     * @return MetricsResponse
     */
    public getPipelineLatestMetrics = (id: string, args?: object): Promise<MetricsResponse> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v3beta1/pipelines/${'id'}/metrics/latest`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as MetricsResponse);
    }
    /**
     * Returns the status of pipelines from the underlying streaming system.
     * @param args parameters to be sent with the request
     * @param args.activated activated
     * @param args.createUserId createUserId
     * @param args.name name
     * @param args.offset offset
     * @param args.pageSize pageSize
     * @param args.sortDir sortDir
     * @param args.sortField sortField
     * @return PaginatedResponseOfPipelineJobStatus
     */
    public getPipelinesStatus = (args?: { activated?: boolean, createUserId?: string, name?: string, offset?: number, pageSize?: number, sortDir?: string, sortField?: string, [key: string]: any }): Promise<PaginatedResponseOfPipelineJobStatus> => {
        const path = `/streams/v3beta1/pipelines/status`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PaginatedResponseOfPipelineJobStatus);
    }
    /**
     * Returns the preview data for a session.
     * @param previewSessionId Preview Session ID
     * @param args parameters to be sent with the request
     * @return PreviewData
     */
    public getPreviewData = (previewSessionId: number, args?: object): Promise<PreviewData> => {
        const path_params = {
            previewSessionId: previewSessionId.toString()
        };
        const path = this.template`/streams/v3beta1/preview-data/${'previewSessionId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PreviewData);
    }
    /**
     * Returns information from a preview session.
     * @param previewSessionId Preview Session ID
     * @param args parameters to be sent with the request
     * @return PreviewState
     */
    public getPreviewSession = (previewSessionId: number, args?: object): Promise<PreviewState> => {
        const path_params = {
            previewSessionId: previewSessionId.toString()
        };
        const path = this.template`/streams/v3beta1/preview-session/${'previewSessionId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PreviewState);
    }
    /**
     * Returns the latest metrics for a preview session.
     * @param previewSessionId Preview Session ID
     * @param args parameters to be sent with the request
     * @return MetricsResponse
     */
    public getPreviewSessionLatestMetrics = (previewSessionId: number, args?: object): Promise<MetricsResponse> => {
        const path_params = {
            previewSessionId: previewSessionId.toString()
        };
        const path = this.template`/streams/v3beta1/preview-session/${'previewSessionId'}/metrics/latest`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as MetricsResponse);
    }
    /**
     * Returns all functions in JSON format.
     * @param args parameters to be sent with the request
     * @param args.local local
     * @return RegistryModel
     */
    public getRegistry = (args?: { local?: boolean, [key: string]: any }): Promise<RegistryModel> => {
        const path = `/streams/v3beta1/pipelines/registry`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as RegistryModel);
    }
    /**
     * Returns an individual template by version.
     * @param templateId Template ID
     * @param args parameters to be sent with the request
     * @param args.version Template version
     * @return TemplateResponse
     */
    public getTemplate = (templateId: string, args?: { version?: number, [key: string]: any }): Promise<TemplateResponse> => {
        const path_params = {
            templateId: templateId
        };
        const path = this.template`/streams/v3beta1/templates/${'templateId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as TemplateResponse);
    }
    /**
     * Returns a list of connections (latest versions only) by tenant ID.
     * @param args parameters to be sent with the request
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
    public listConnections = (args?: { connectorId?: Array<string>, createUserId?: string, functionId?: string, name?: string, offset?: number, pageSize?: number, showSecretNames?: string, sortDir?: string, sortField?: string, [key: string]: any }): Promise<PaginatedResponseOfConnectionResponse> => {
        const path = `/streams/v3beta1/connections`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PaginatedResponseOfConnectionResponse);
    }
    /**
     * Returns a list of the available connectors.
     * @param args parameters to be sent with the request
     * @return PaginatedResponseOfConnectorResponse
     */
    public listConnectors = (args?: object): Promise<PaginatedResponseOfConnectorResponse> => {
        const path = `/streams/v3beta1/connectors`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PaginatedResponseOfConnectorResponse);
    }
    /**
     * Returns all pipelines.
     * @param args parameters to be sent with the request
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
    public listPipelines = (args?: { activated?: boolean, createUserId?: string, includeData?: boolean, name?: string, offset?: number, pageSize?: number, sortDir?: string, sortField?: string, [key: string]: any }): Promise<PaginatedResponseOfPipelineResponse> => {
        const path = `/streams/v3beta1/pipelines`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PaginatedResponseOfPipelineResponse);
    }
    /**
     * Returns a list of all templates.
     * @param args parameters to be sent with the request
     * @param args.offset offset
     * @param args.pageSize pageSize
     * @param args.sortDir sortDir
     * @param args.sortField sortField
     * @return PaginatedResponseOfTemplateResponse
     */
    public listTemplates = (args?: { offset?: number, pageSize?: number, sortDir?: string, sortField?: string, [key: string]: any }): Promise<PaginatedResponseOfTemplateResponse> => {
        const path = `/streams/v3beta1/templates`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PaginatedResponseOfTemplateResponse);
    }
    /**
     * Patches an existing pipeline.
     * @param id Pipeline ID
     * @param pipelinePatchRequest Request JSON
     * @param args parameters to be sent with the request
     * @return PipelineResponse
     */
    public patchPipeline = (id: string, pipelinePatchRequest: PipelinePatchRequest, args?: object): Promise<PipelineResponse> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v3beta1/pipelines/${'id'}`(path_params);
        return this.client.patch(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), pipelinePatchRequest, { query: args })
            .then(response => response.body as PipelineResponse);
    }
    /**
     * Updates an existing DSP connection.
     * @param connectionId Connection ID
     * @param connectionPutRequest Request JSON
     * @param args parameters to be sent with the request
     * @return ConnectionSaveResponse
     */
    public putConnection = (connectionId: string, connectionPutRequest: ConnectionPutRequest, args?: object): Promise<ConnectionSaveResponse> => {
        const path_params = {
            connectionId: connectionId
        };
        const path = this.template`/streams/v3beta1/connections/${'connectionId'}`(path_params);
        return this.client.put(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), connectionPutRequest, { query: args })
            .then(response => response.body as ConnectionSaveResponse);
    }
    /**
     * Updates an existing template.
     * @param templateId Template ID
     * @param templatePutRequest Request JSON
     * @param args parameters to be sent with the request
     * @return TemplateResponse
     */
    public putTemplate = (templateId: string, templatePutRequest: TemplatePutRequest, args?: object): Promise<TemplateResponse> => {
        const path_params = {
            templateId: templateId
        };
        const path = this.template`/streams/v3beta1/templates/${'templateId'}`(path_params);
        return this.client.put(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), templatePutRequest, { query: args })
            .then(response => response.body as TemplateResponse);
    }
    /**
     * Reactivate a pipeline
     * @param id Pipeline ID
     * @param args parameters to be sent with the request
     * @return PipelineReactivateResponse
     */
    public reactivatePipeline = (id: string, args?: object): Promise<PipelineReactivateResponse> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v3beta1/pipelines/${'id'}/reactivate`(path_params);
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as PipelineReactivateResponse);
    }
    /**
     * Creates a preview session for a pipeline.
     * @param previewSessionStartRequest Parameters to start a new Preview session
     * @param args parameters to be sent with the request
     * @return PreviewStartResponse
     */
    public startPreview = (previewSessionStartRequest: PreviewSessionStartRequest, args?: object): Promise<PreviewStartResponse> => {
        const path = `/streams/v3beta1/preview-session`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), previewSessionStartRequest, { query: args })
            .then(response => response.body as PreviewStartResponse);
    }
    /**
     * Stops a preview session.
     * @param previewSessionId Preview Session ID
     * @param args parameters to be sent with the request
     */
    public stopPreview = (previewSessionId: number, args?: object): Promise<object> => {
        const path_params = {
            previewSessionId: previewSessionId.toString()
        };
        const path = this.template`/streams/v3beta1/preview-session/${'previewSessionId'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as object);
    }
    /**
     * Patches an existing DSP connection.
     * @param connectionId Connection ID
     * @param connectionPatchRequest Request JSON
     * @param args parameters to be sent with the request
     * @return ConnectionSaveResponse
     */
    public updateConnection = (connectionId: string, connectionPatchRequest: ConnectionPatchRequest, args?: object): Promise<ConnectionSaveResponse> => {
        const path_params = {
            connectionId: connectionId
        };
        const path = this.template`/streams/v3beta1/connections/${'connectionId'}`(path_params);
        return this.client.patch(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), connectionPatchRequest, { query: args })
            .then(response => response.body as ConnectionSaveResponse);
    }
    /**
     * Updates an existing pipeline.
     * @param id Pipeline ID
     * @param pipelineRequest Request JSON
     * @param args parameters to be sent with the request
     * @return PipelineResponse
     */
    public updatePipeline = (id: string, pipelineRequest: PipelineRequest, args?: object): Promise<PipelineResponse> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v3beta1/pipelines/${'id'}`(path_params);
        return this.client.put(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), pipelineRequest, { query: args })
            .then(response => response.body as PipelineResponse);
    }
    /**
     * Patches an existing template.
     * @param templateId Template ID
     * @param templatePatchRequest Request JSON
     * @param args parameters to be sent with the request
     * @return TemplateResponse
     */
    public updateTemplate = (templateId: string, templatePatchRequest: TemplatePatchRequest, args?: object): Promise<TemplateResponse> => {
        const path_params = {
            templateId: templateId
        };
        const path = this.template`/streams/v3beta1/templates/${'templateId'}`(path_params);
        return this.client.patch(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), templatePatchRequest, { query: args })
            .then(response => response.body as TemplateResponse);
    }
    /**
     * Verifies whether the Streams JSON is valid.
     * @param validateRequest Request JSON
     * @param args parameters to be sent with the request
     * @return ValidateResponse
     */
    public validatePipeline = (validateRequest: ValidateRequest, args?: object): Promise<ValidateResponse> => {
        const path = `/streams/v3beta1/pipelines/validate`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), validateRequest, { query: args })
            .then(response => response.body as ValidateResponse);
    }
}
export type StreamsService = GeneratedStreamsService & StreamsServiceExtensions;
export const StreamsService = StreamsServiceExtensions(GeneratedStreamsService);