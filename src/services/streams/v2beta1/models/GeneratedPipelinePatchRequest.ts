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
 * @interface PipelinePatchRequest
 */
export interface PipelinePatchRequest {
    /**
     * Set to true to bypass initial pipeline validation upon creation. The pipeline still needs to be validated before activation. Defaults to false.
     * @type {boolean}
     * @memberof PipelinePatchRequest
     */
    bypassValidation?: boolean;

    /**
     * The user that created the pipeline. Deprecated.
     * @type {string}
     * @memberof PipelinePatchRequest
     */
    createUserId?: string;

    /**
     * 
     * @type {UplPipeline}
     * @memberof PipelinePatchRequest
     */
    data?: UplPipeline;

    /**
     * The description of the pipeline. Defaults to null.
     * @type {string}
     * @memberof PipelinePatchRequest
     */
    description?: string;

    /**
     * The name of the pipeline.
     * @type {string}
     * @memberof PipelinePatchRequest
     */
    name?: string;

}

