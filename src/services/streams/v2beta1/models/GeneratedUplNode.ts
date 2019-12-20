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
 * With the Streams service in Splunk Cloud Services, you can perform create, read, update, and delete (CRUD) operations on your data pipeline.The Streams service in Splunk Cloud Services also has metrics and preview session endpoints and gives you full control over your data pipeline.
 *
 * OpenAPI spec version: v2beta1.3 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface UplNode
 */
export interface UplNode {
    /**
     * The function's (node's) UUID
     * @type {string}
     * @memberof UplNode
     */
    id: string;

    /**
     * The function's ID or its API name
     * @type {string}
     * @memberof UplNode
     */
    op: string;

    /**
     * Optional key-value pair for a function (node)
     * @type {{ [key: string]: any; }}
     * @memberof UplNode
     */
    attributes?: { [key: string]: any; };

    /**
     * 
     * @type {string}
     * @memberof UplNode
     */
    resolvedId?: string;

    /**
     * dynamic keys capturing additional key/value pairs for this model
     * @memberof UplNode
     */
    [additionalProperty: string]: any;
}

