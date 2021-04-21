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
 * @interface Source
 */
export interface Source {
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof Source
     */
    arguments?: { [key: string]: any; };

    /**
     * 
     * @type {string}
     * @memberof Source
     */
    connectionId?: string;

    /**
     * 
     * @type {string}
     * @memberof Source
     */
    connectorId?: string;

    /**
     * 
     * @type {number}
     * @memberof Source
     */
    createDate?: number;

    /**
     * 
     * @type {string}
     * @memberof Source
     */
    createUserId?: string;

    /**
     * 
     * @type {string}
     * @memberof Source
     */
    dataStreamId?: string;

    /**
     * 
     * @type {string}
     * @memberof Source
     */
    description?: string;

    /**
     * 
     * @type {boolean}
     * @memberof Source
     */
    enabled?: boolean;

    /**
     * 
     * @type {string}
     * @memberof Source
     */
    id?: string;

    /**
     * 
     * @type {number}
     * @memberof Source
     */
    lastUpdateDate?: number;

    /**
     * 
     * @type {string}
     * @memberof Source
     */
    lastUpdateUserId?: string;

    /**
     * 
     * @type {string}
     * @memberof Source
     */
    name?: string;

    /**
     * 
     * @type {number}
     * @memberof Source
     */
    parallelism?: number;

    /**
     * 
     * @type {string}
     * @memberof Source
     */
    tenantId?: string;

    /**
     * 
     * @type {number}
     * @memberof Source
     */
    version?: number;

}
