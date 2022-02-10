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
 * OpenAPI spec version: v2beta1.4 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    GroupArgumentsNode,
    GroupFunctionArgsMappingNode,
    GroupFunctionArguments,
    GroupFunctionMappings,
    UplPipeline,
} from './';

/**
 *
 * @export
 * @interface GroupPutRequest
 */
export interface GroupPutRequest {
    /**
     * The group function arguments list.
     * @type {Array<GroupArgumentsNode>}
     * @memberof GroupPutRequest
     */
    arguments: Array<GroupArgumentsNode>;

    /**
     * 
     * @type {UplPipeline}
     * @memberof GroupPutRequest
     */
    ast: UplPipeline;

    /**
     * The attributes map for function.
     * @type {{ [key: string]: any; }}
     * @memberof GroupPutRequest
     */
    attributes: { [key: string]: any; };

    /**
     * The categories for this function.
     * @type {Array<number>}
     * @memberof GroupPutRequest
     */
    categories: Array<number>;

    /**
     * The group function mappings list.
     * @type {Array<GroupFunctionArgsMappingNode>}
     * @memberof GroupPutRequest
     */
    mappings: Array<GroupFunctionArgsMappingNode>;

    /**
     * The group function name.
     * @type {string}
     * @memberof GroupPutRequest
     */
    name: string;

    /**
     * The data type of the function's output.
     * @type {string}
     * @memberof GroupPutRequest
     */
    outputType: string;

    /**
     * 
     * @type {GroupFunctionArguments}
     * @memberof GroupPutRequest
     */
    groupFunctionArguments?: GroupFunctionArguments;

    /**
     * 
     * @type {GroupFunctionMappings}
     * @memberof GroupPutRequest
     */
    groupFunctionMappings?: GroupFunctionMappings;

    /**
     * 
     * @type {boolean}
     * @memberof GroupPutRequest
     */
    scalar?: boolean;

    /**
     * 
     * @type {boolean}
     * @memberof GroupPutRequest
     */
    variadic?: boolean;

}

