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

import {
    Pipeline,
} from './';

/**
 *
 * @export
 * @interface TemplateResponse
 */
export interface TemplateResponse {
    /**
     * 
     * @type {number}
     * @memberof TemplateResponse
     */
    createDate?: number;

    /**
     * 
     * @type {string}
     * @memberof TemplateResponse
     */
    createUserId?: string;

    /**
     * 
     * @type {Pipeline}
     * @memberof TemplateResponse
     */
    data?: Pipeline;

    /**
     * 
     * @type {string}
     * @memberof TemplateResponse
     */
    description?: string;

    /**
     * 
     * @type {string}
     * @memberof TemplateResponse
     */
    learnMoreLocation?: string;

    /**
     * 
     * @type {string}
     * @memberof TemplateResponse
     */
    name?: string;

    /**
     * 
     * @type {string}
     * @memberof TemplateResponse
     */
    ownerTenantId?: string;

    /**
     * 
     * @type {string}
     * @memberof TemplateResponse
     */
    templateId?: string;

    /**
     * 
     * @type {number}
     * @memberof TemplateResponse
     */
    version?: number;

}
