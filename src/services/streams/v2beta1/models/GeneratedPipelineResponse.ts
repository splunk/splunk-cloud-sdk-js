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
 * OpenAPI spec version: v2beta1.4 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    UplPipeline,
} from './';

/**
 *
 * @export
 * @interface PipelineResponse
 */
export interface PipelineResponse {
    /**
     * 
     * @type {number}
     * @memberof PipelineResponse
     */
    activatedDate?: number;

    /**
     * 
     * @type {string}
     * @memberof PipelineResponse
     */
    activatedUserId?: string;

    /**
     * 
     * @type {number}
     * @memberof PipelineResponse
     */
    activatedVersion?: number;

    /**
     * 
     * @type {number}
     * @memberof PipelineResponse
     */
    complexity?: number;

    /**
     * 
     * @type {number}
     * @memberof PipelineResponse
     */
    createDate?: number;

    /**
     * 
     * @type {string}
     * @memberof PipelineResponse
     */
    createUserId?: string;

    /**
     * 
     * @type {number}
     * @memberof PipelineResponse
     */
    currentVersion?: number;

    /**
     * 
     * @type {UplPipeline}
     * @memberof PipelineResponse
     */
    data?: UplPipeline;

    /**
     * 
     * @type {string}
     * @memberof PipelineResponse
     */
    description?: string;

    /**
     * 
     * @type {string}
     * @memberof PipelineResponse
     */
    id?: string;

    /**
     * 
     * @type {number}
     * @memberof PipelineResponse
     */
    lastUpdateDate?: number;

    /**
     * 
     * @type {string}
     * @memberof PipelineResponse
     */
    lastUpdateUserId?: string;

    /**
     * 
     * @type {string}
     * @memberof PipelineResponse
     */
    name?: string;

    /**
     * 
     * @type {string}
     * @memberof PipelineResponse
     */
    status?: PipelineResponseStatusEnum;

    /**
     * 
     * @type {string}
     * @memberof PipelineResponse
     */
    statusMessage?: string;

    /**
     * 
     * @type {number}
     * @memberof PipelineResponse
     */
    streamingConfigurationId?: number;

    /**
     * 
     * @type {string}
     * @memberof PipelineResponse
     */
    tenantId?: string;

    /**
     * 
     * @type {Array<string>}
     * @memberof PipelineResponse
     */
    validationMessages?: Array<string>;

    /**
     * 
     * @type {number}
     * @memberof PipelineResponse
     */
    version?: number;

}

/**
 * @export
 */
export enum PipelineResponseStatusEnum {
    CREATED = 'CREATED',
    ACTIVATED = 'ACTIVATED',
    FAILED = 'FAILED',
    RESTARTING = 'RESTARTING',
    FINISHED = 'FINISHED'
}

