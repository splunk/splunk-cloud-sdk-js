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

/**
 *
 * @export
 * @interface ConnectionPatchRequest
 */
export interface ConnectionPatchRequest {
    /**
     * The key-value pairs of configurations for this connection. Connectors may have some configurations that are required, which all connections must provide values for. For configuration values of type BYTES, the provided values must be Base64 encoded.
     * @type {{ [key: string]: any; }}
     * @memberof ConnectionPatchRequest
     */
    data?: { [key: string]: any; };

    /**
     * The description of the connection.
     * @type {string}
     * @memberof ConnectionPatchRequest
     */
    description?: string;

    /**
     * The name of the connection.
     * @type {string}
     * @memberof ConnectionPatchRequest
     */
    name?: string;

}

