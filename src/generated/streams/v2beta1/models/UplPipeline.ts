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

import {
    UplEdge,
    UplNode,
} from './';

/**
 *
 * @export
 * @interface UplPipeline
 */
export interface UplPipeline {
    /**
     * A list of links or connections between the output of one pipeline function and the input of another pipeline function
     * @type {Array<UplEdge>}
     * @memberof UplPipeline
     */
    edges: Array<UplEdge>;
    /**
     * The functions (or nodes) in your entire pipeline, including each function's operations, attributes, and properties
     * @type {Array<UplNode>}
     * @memberof UplPipeline
     */
    nodes: Array<UplNode>;
    /**
     * The UUIDs of all sink functions in a given pipeline
     * @type {Array<string>}
     * @memberof UplPipeline
     */
    rootNode: Array<string>;
}
