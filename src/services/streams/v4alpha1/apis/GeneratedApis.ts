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
 * Data Stream Processing REST API
 * Use the Streams service to perform create, read, update, and delete (CRUD) operations on your data pipeline. The Streams service also has metrics and preview session endpoints and gives you full control over your data pipeline.
 *
 * OpenAPI spec version: v4alpha1.1 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */



import FormData from 'form-data';
import { createReadStream } from "fs";
import {
    ActivatePipelineRequest,
    AutopilotActivationDeactivationResponse,
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
    PaginatedResponseOfPipelineResponseV4,
    PaginatedResponseOfTemplateResponse,
    Pipeline,
    PipelinePatchRequest,
    PipelineRequest,
    PipelineResponseV4,
    PreviewData,
    PreviewSessionStartRequest,
    PreviewStartResponse,
    PreviewState,
    RegistryModel,
    SplCompileRequest,
    TemplatePatchRequest,
    TemplatePutRequest,
    TemplateRequest,
    TemplateResponse,
    UplType,
    UploadFileResponse,
    ValidateConnectionRequest,
    ValidateRequest,
    ValidateResponse,
} from '../models';
import BaseApiService from "../../../../baseapiservice";
import { StreamsServiceExtensions } from "../../../../service_extensions/streams";
import { SplunkError, RequestStatus } from '../../../../client';

export const STREAMS_SERVICE_PREFIX: string = '/streams/v4alpha1';
export const STREAMS_SERVICE_CLUSTER: string = 'api';

/**
 * Data Stream Processing REST API
 * Version: v4alpha1.1
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
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return AutopilotActivationDeactivationResponse
     */
    public activatePipeline = (id: string, activatePipelineRequest: ActivatePipelineRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<AutopilotActivationDeactivationResponse> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v4alpha1/pipelines/${'id'}/activate`(path_params);
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), activatePipelineRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as AutopilotActivationDeactivationResponse);
    }
    /**
     * Compiles SPL2 and returns streams JSON.
     * @param splCompileRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return Pipeline
     */
    public compile = (splCompileRequest: SplCompileRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<Pipeline> => {
        const path = `/streams/v4alpha1/pipelines/compile`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), splCompileRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as Pipeline);
    }
    /**
     * Create a new DSP connection.
     * @param connectionRequest Request JSON
     * @param args parameters to be sent with the request
     * @param args.skipValidation Skip validation
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return ConnectionSaveResponse
     */
    public createConnection = (connectionRequest: ConnectionRequest, args?: { skipValidation?: boolean, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<ConnectionSaveResponse> => {
        const path = `/streams/v4alpha1/connections`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), connectionRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as ConnectionSaveResponse);
    }
    /**
     * Creates a pipeline.
     * @param pipelineRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PipelineResponseV4
     */
    public createPipeline = (pipelineRequest: PipelineRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PipelineResponseV4> => {
        const path = `/streams/v4alpha1/pipelines`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), pipelineRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PipelineResponseV4);
    }
    /**
     * Creates a template for a tenant.
     * @param templateRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return TemplateResponse
     */
    public createTemplate = (templateRequest: TemplateRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<TemplateResponse> => {
        const path = `/streams/v4alpha1/templates`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), templateRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as TemplateResponse);
    }
    /**
     * Deactivates an existing pipeline.
     * @param id Pipeline ID
     * @param deactivatePipelineRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return AutopilotActivationDeactivationResponse
     */
    public deactivatePipeline = (id: string, deactivatePipelineRequest: DeactivatePipelineRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<AutopilotActivationDeactivationResponse> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v4alpha1/pipelines/${'id'}/deactivate`(path_params);
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), deactivatePipelineRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as AutopilotActivationDeactivationResponse);
    }
    /**
     * Decompiles UPL and returns SPL.
     * @param decompileRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return DecompileResponse
     */
    public decompile = (decompileRequest: DecompileRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<DecompileResponse> => {
        const path = `/streams/v4alpha1/pipelines/decompile`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), decompileRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as DecompileResponse);
    }
    /**
     * Delete all versions of a connection by its id.
     * @param connectionId Connection ID
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public deleteConnection = (connectionId: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            connectionId: connectionId
        };
        const path = this.template`/streams/v4alpha1/connections/${'connectionId'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Delete lookup file.
     * @param fileId File ID
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public deleteLookupFile = (fileId: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            fileId: fileId
        };
        const path = this.template`/streams/v4alpha1/lookups/files/${'fileId'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Removes a pipeline.
     * @param id Pipeline ID
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public deletePipeline = (id: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v4alpha1/pipelines/${'id'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Removes a template with a specific ID.
     * @param templateId Template ID
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public deleteTemplate = (templateId: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            templateId: templateId
        };
        const path = this.template`/streams/v4alpha1/templates/${'templateId'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Returns the input schema for a function in a pipeline.
     * @param getInputSchemaRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return UplType
     */
    public getInputSchema = (getInputSchemaRequest: GetInputSchemaRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<UplType> => {
        const path = `/streams/v4alpha1/pipelines/input-schema`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), getInputSchemaRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as UplType);
    }
    /**
     * Get lookup file metadata.
     * @param fileId File ID
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return UploadFileResponse
     */
    public getLookupFileMetadata = (fileId: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<UploadFileResponse> => {
        const path_params = {
            fileId: fileId
        };
        const path = this.template`/streams/v4alpha1/lookups/files/${'fileId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as UploadFileResponse);
    }
    /**
     * Returns lookup files metadata.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return FilesMetaDataResponse
     */
    public getLookupFilesMetadata = (args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<FilesMetaDataResponse> => {
        const path = `/streams/v4alpha1/lookups/files`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as FilesMetaDataResponse);
    }
    /**
     * Returns lookup table results.
     * @param connectionId Connection ID
     * @param args parameters to be sent with the request
     * @param args.offset offset
     * @param args.size size
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return LookupTableResponse
     */
    public getLookupTable = (connectionId: string, args?: { offset: number, size: number, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<LookupTableResponse> => {
        const path_params = {
            connectionId: connectionId
        };
        const path = this.template`/streams/v4alpha1/lookups/${'connectionId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as LookupTableResponse);
    }
    /**
     * Returns the output schema for a specified function in a pipeline.
     * @param getOutputSchemaRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return { [key: string]: UplType; }
     */
    public getOutputSchema = (getOutputSchemaRequest: GetOutputSchemaRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<{ [key: string]: UplType; }> => {
        const path = `/streams/v4alpha1/pipelines/output-schema`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), getOutputSchemaRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as { [key: string]: UplType; });
    }
    /**
     * Returns an individual pipeline by version.
     * @param id Pipeline ID
     * @param args parameters to be sent with the request
     * @param args.version version
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PipelineResponseV4
     */
    public getPipeline = (id: string, args?: { version?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PipelineResponseV4> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v4alpha1/pipelines/${'id'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PipelineResponseV4);
    }
    /**
     * Returns the latest metrics for a single pipeline.
     * @param id Pipeline ID
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return MetricsResponse
     */
    public getPipelineLatestMetrics = (id: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<MetricsResponse> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v4alpha1/pipelines/${'id'}/metrics/latest`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as MetricsResponse);
    }
    /**
     * Returns the preview data for a session.
     * @param previewSessionId Preview Session ID
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PreviewData
     */
    public getPreviewData = (previewSessionId: number, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PreviewData> => {
        const path_params = {
            previewSessionId: previewSessionId.toString()
        };
        const path = this.template`/streams/v4alpha1/preview-data/${'previewSessionId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PreviewData);
    }
    /**
     * Returns information from a preview session.
     * @param previewSessionId Preview Session ID
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PreviewState
     */
    public getPreviewSession = (previewSessionId: number, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PreviewState> => {
        const path_params = {
            previewSessionId: previewSessionId.toString()
        };
        const path = this.template`/streams/v4alpha1/preview-session/${'previewSessionId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PreviewState);
    }
    /**
     * Returns the latest metrics for a preview session.
     * @param previewSessionId Preview Session ID
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return MetricsResponse
     */
    public getPreviewSessionLatestMetrics = (previewSessionId: number, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<MetricsResponse> => {
        const path_params = {
            previewSessionId: previewSessionId.toString()
        };
        const path = this.template`/streams/v4alpha1/preview-session/${'previewSessionId'}/metrics/latest`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as MetricsResponse);
    }
    /**
     * Returns all functions in JSON format.
     * @param args parameters to be sent with the request
     * @param args.local local
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return RegistryModel
     */
    public getRegistry = (args?: { local?: boolean, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<RegistryModel> => {
        const path = `/streams/v4alpha1/pipelines/registry`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as RegistryModel);
    }
    /**
     * Returns an individual template by version.
     * @param templateId Template ID
     * @param args parameters to be sent with the request
     * @param args.version Template version
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return TemplateResponse
     */
    public getTemplate = (templateId: string, args?: { version?: number, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<TemplateResponse> => {
        const path_params = {
            templateId: templateId
        };
        const path = this.template`/streams/v4alpha1/templates/${'templateId'}`(path_params);
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as TemplateResponse);
    }
    /**
     * Returns a list of connections (latest versions only) by tenant ID.
     * @param args parameters to be sent with the request
     * @param args.connectorId
     * @param args.createUserId
     * @param args.functionId
     * @param args.functionOp
     * @param args.name
     * @param args.offset
     * @param args.pageSize
     * @param args.showSecretNames
     * @param args.sortDir Specify either ascending ('asc') or descending ('desc') sort order for a given field (sortField), which must be set for sortDir to apply. Defaults to 'asc'.
     * @param args.sortField
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PaginatedResponseOfConnectionResponse
     */
    public listConnections = (args?: { connectorId?: Array<string>, createUserId?: string, functionId?: string, functionOp?: string, name?: string, offset?: number, pageSize?: number, showSecretNames?: string, sortDir?: string, sortField?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PaginatedResponseOfConnectionResponse> => {
        const path = `/streams/v4alpha1/connections`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PaginatedResponseOfConnectionResponse);
    }
    /**
     * Returns a list of the available connectors.
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PaginatedResponseOfConnectorResponse
     */
    public listConnectors = (args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PaginatedResponseOfConnectorResponse> => {
        const path = `/streams/v4alpha1/connectors`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PaginatedResponseOfConnectorResponse);
    }
    /**
     * Returns all pipelines.
     * @param args parameters to be sent with the request
     * @param args.activated activated
     * @param args.createUserId createUserId
     * @param args.includeData includeData
     * @param args.includeStatus includeStatus
     * @param args.name name
     * @param args.offset offset
     * @param args.pageSize pageSize
     * @param args.sortDir sortDir
     * @param args.sortField sortField
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PaginatedResponseOfPipelineResponseV4
     */
    public listPipelines = (args?: { activated?: boolean, createUserId?: string, includeData?: boolean, includeStatus?: boolean, name?: string, offset?: number, pageSize?: number, sortDir?: string, sortField?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PaginatedResponseOfPipelineResponseV4> => {
        const path = `/streams/v4alpha1/pipelines`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PaginatedResponseOfPipelineResponseV4);
    }
    /**
     * Returns a list of all templates.
     * @param args parameters to be sent with the request
     * @param args.createUserId createUserId
     * @param args.offset offset
     * @param args.pageSize pageSize
     * @param args.sortDir sortDir
     * @param args.sortField sortField
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PaginatedResponseOfTemplateResponse
     */
    public listTemplates = (args?: { createUserId?: string, offset?: number, pageSize?: number, sortDir?: string, sortField?: string, [key: string]: any }, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PaginatedResponseOfTemplateResponse> => {
        const path = `/streams/v4alpha1/templates`;
        return this.client.get(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PaginatedResponseOfTemplateResponse);
    }
    /**
     * Patches an existing pipeline.
     * @param id Pipeline ID
     * @param pipelinePatchRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public patchPipeline = (id: string, pipelinePatchRequest: PipelinePatchRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v4alpha1/pipelines/${'id'}`(path_params);
        return this.client.patch(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), pipelinePatchRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Updates an existing DSP connection.
     * @param connectionId Connection ID
     * @param connectionPutRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return ConnectionSaveResponse
     */
    public putConnection = (connectionId: string, connectionPutRequest: ConnectionPutRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<ConnectionSaveResponse> => {
        const path_params = {
            connectionId: connectionId
        };
        const path = this.template`/streams/v4alpha1/connections/${'connectionId'}`(path_params);
        return this.client.put(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), connectionPutRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as ConnectionSaveResponse);
    }
    /**
     * Updates an existing template.
     * @param templateId Template ID
     * @param templatePutRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return TemplateResponse
     */
    public putTemplate = (templateId: string, templatePutRequest: TemplatePutRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<TemplateResponse> => {
        const path_params = {
            templateId: templateId
        };
        const path = this.template`/streams/v4alpha1/templates/${'templateId'}`(path_params);
        return this.client.put(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), templatePutRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as TemplateResponse);
    }
    /**
     * Creates a preview session for a pipeline.
     * @param previewSessionStartRequest Parameters to start a new Preview session
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return PreviewStartResponse
     */
    public startPreview = (previewSessionStartRequest: PreviewSessionStartRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<PreviewStartResponse> => {
        const path = `/streams/v4alpha1/preview-session`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), previewSessionStartRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as PreviewStartResponse);
    }
    /**
     * Stops a preview session.
     * @param previewSessionId Preview Session ID
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public stopPreview = (previewSessionId: number, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            previewSessionId: previewSessionId.toString()
        };
        const path = this.template`/streams/v4alpha1/preview-session/${'previewSessionId'}`(path_params);
        return this.client.delete(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Patches an existing DSP connection.
     * @param connectionId Connection ID
     * @param connectionPatchRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return ConnectionSaveResponse
     */
    public updateConnection = (connectionId: string, connectionPatchRequest: ConnectionPatchRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<ConnectionSaveResponse> => {
        const path_params = {
            connectionId: connectionId
        };
        const path = this.template`/streams/v4alpha1/connections/${'connectionId'}`(path_params);
        return this.client.patch(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), connectionPatchRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as ConnectionSaveResponse);
    }
    /**
     * Updates an existing pipeline.
     * @param id Pipeline ID
     * @param pipelineRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public updatePipeline = (id: string, pipelineRequest: PipelineRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path_params = {
            id: id
        };
        const path = this.template`/streams/v4alpha1/pipelines/${'id'}`(path_params);
        return this.client.put(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), pipelineRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Patches an existing template.
     * @param templateId Template ID
     * @param templatePatchRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return TemplateResponse
     */
    public updateTemplate = (templateId: string, templatePatchRequest: TemplatePatchRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<TemplateResponse> => {
        const path_params = {
            templateId: templateId
        };
        const path = this.template`/streams/v4alpha1/templates/${'templateId'}`(path_params);
        return this.client.patch(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), templatePatchRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as TemplateResponse);
    }
    /**
     * Upload new lookup file.
     * @param fileName file to be uploaded
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return UploadFileResponse
     */
    public uploadLookupFile = (fileName: string, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<UploadFileResponse> => {
        const path = `/streams/v4alpha1/lookups/files`;
        var formData = new FormData();
        const readStream = createReadStream(fileName);
        formData.append("file", readStream);
        const formHeaders = formData.getHeaders(); 
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), formData, { query: args, headers: formHeaders, statusCallback:  requestStatusCallback})
            .then(response => response.body as UploadFileResponse);
    }
    /**
     * Validates the configuration of a DSP connection.
     * @param validateConnectionRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     */
    public validateConnection = (validateConnectionRequest: ValidateConnectionRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<object> => {
        const path = `/streams/v4alpha1/connections/validate`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), validateConnectionRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as object);
    }
    /**
     * Verifies whether the Streams JSON is valid.
     * @param validateRequest Request JSON
     * @param args parameters to be sent with the request
     * @param requestStatusCallback callback function to listen to the status of a request
     * @return ValidateResponse
     */
    public validatePipeline = (validateRequest: ValidateRequest, args?: object, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<ValidateResponse> => {
        const path = `/streams/v4alpha1/pipelines/validate`;
        return this.client.post(STREAMS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), validateRequest, { query: args, statusCallback:  requestStatusCallback})
            .then(response => response.body as ValidateResponse);
    }
}
export type StreamsService = GeneratedStreamsService & StreamsServiceExtensions;
export const StreamsService = StreamsServiceExtensions(GeneratedStreamsService);