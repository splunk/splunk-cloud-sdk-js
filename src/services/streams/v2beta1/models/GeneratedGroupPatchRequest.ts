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
 * OpenAPI spec version: v2beta1.4 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    GroupArgumentsNode,
    GroupFunctionArgsMappingNode,
    UplPipeline,
} from './';

/**
 *
 * @export
 * @interface GroupPatchRequest
 */
export interface GroupPatchRequest {
    /**
     * Group function arguments list.
     * @type {Array<GroupArgumentsNode>}
     * @memberof GroupPatchRequest
     */
    arguments?: Array<GroupArgumentsNode>;

    /**
     * 
     * @type {UplPipeline}
     * @memberof GroupPatchRequest
     */
    ast?: UplPipeline;

    /**
     * Attributes map for function.
     * @type {{ [key: string]: any; }}
     * @memberof GroupPatchRequest
     */
    attributes?: { [key: string]: any; };

    /**
     * Categories for this function.
     * @type {Array<number>}
     * @memberof GroupPatchRequest
     */
    categories?: Array<number>;

    /**
     * Group function mappings list.
     * @type {Array<GroupFunctionArgsMappingNode>}
     * @memberof GroupPatchRequest
     */
    mappings?: Array<GroupFunctionArgsMappingNode>;

    /**
     * The name for the group function.
     * @type {string}
     * @memberof GroupPatchRequest
     */
    name?: string;

    /**
     * The data type of the output of your function.
     * @type {string}
     * @memberof GroupPatchRequest
     */
    outputType?: string;

    /**
     * 
     * @type {boolean}
     * @memberof GroupPatchRequest
     */
    scalar?: boolean;

    /**
     * 
     * @type {boolean}
     * @memberof GroupPatchRequest
     */
    variadic?: boolean;

}

