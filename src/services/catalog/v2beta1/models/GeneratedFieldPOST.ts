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
 * Search Catalog service
 * With the Metadata Catalog in Splunk Cloud Services you can create and manage knowledge objects such as datasets, fields, rules, actions, and dashboards.
 *
 * OpenAPI spec version: v2beta1.4 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    FieldDataType,
    FieldPrevalence,
    FieldType,
} from './';

/**
 * Initial property values for creating a new field using a POST request.
 * @export
 * @interface FieldPOST
 */
export interface FieldPOST {
    /**
     * The field name.
     * @type {string}
     * @memberof FieldPOST
     */
    name: string;

    /**
     * 
     * @type {FieldDataType}
     * @memberof FieldPOST
     */
    datatype?: FieldDataType;

    /**
     * The field description.
     * @type {string}
     * @memberof FieldPOST
     */
    description?: string;

    /**
     * 
     * @type {FieldType}
     * @memberof FieldPOST
     */
    fieldtype?: FieldType;

    /**
     * Whether or not the field has been indexed.
     * @type {boolean}
     * @memberof FieldPOST
     */
    indexed?: boolean;

    /**
     * 
     * @type {FieldPrevalence}
     * @memberof FieldPOST
     */
    prevalence?: FieldPrevalence;

    /**
     * The field summary.
     * @type {string}
     * @memberof FieldPOST
     */
    summary?: string;

    /**
     * The field title.
     * @type {string}
     * @memberof FieldPOST
     */
    title?: string;

}

