// tslint:disable
/**
 * Copyright 2021 Splunk, Inc.
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

/**
 *
 * @export
 * @interface ActivatePipelineRequest
 */
export interface ActivatePipelineRequest {
    /**
     * Set to true to activate the latest version of the pipeline. Set to false to use the previously activated version of the pipeline. Defaults to true.
     * @type {boolean}
     * @memberof ActivatePipelineRequest
     */
    activateLatestVersion?: boolean;

    /**
     * Set to true to allow the pipeline to ignore any unused progress states. In some cases, when a data pipeline is changed, the progress state will be stored for functions that no longer exist, so this must be set to activate a pipeline in this state. Defaults to false.
     * @type {boolean}
     * @memberof ActivatePipelineRequest
     */
    allowNonRestoredState?: boolean;

    /**
     * Set to true to start reading from the latest input rather than from where the pipeline's previous run left off, which can cause data loss. Defaults to false.
     * @type {boolean}
     * @memberof ActivatePipelineRequest
     */
    skipRestoreState?: boolean;

}

