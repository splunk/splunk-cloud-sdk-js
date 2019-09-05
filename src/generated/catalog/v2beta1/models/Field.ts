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
 * Metadata Catalog
 * With the Metadata Catalog you can create and manage knowledge objects such as datasets, fields, rules, actions, dashboards, and workflows.
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
 * A complete field as rendered in POST, PATCH, and GET responses.
 * @export
 * @interface Field
 */
export interface Field {
    /**
     * The date and time object was created.
     * @type {string}
     * @memberof Field
     */
    readonly created: string;
    /**
     * The dataset that the field is part of.
     * @type {string}
     * @memberof Field
     */
    datasetid: string;
    /**
     * 
     * @type {FieldDataType}
     * @memberof Field
     */
    datatype: FieldDataType;
    /**
     * 
     * @type {FieldType}
     * @memberof Field
     */
    fieldtype: FieldType;
    /**
     * The unique ID of this field.
     * @type {string}
     * @memberof Field
     */
    id: string;
    /**
     * The date and time object was modified.
     * @type {string}
     * @memberof Field
     */
    readonly modified: string;
    /**
     * The field name.
     * @type {string}
     * @memberof Field
     */
    name: string;
    /**
     * 
     * @type {FieldPrevalence}
     * @memberof Field
     */
    prevalence: FieldPrevalence;
    /**
     * The field description.
     * @type {string}
     * @memberof Field
     */
    description?: string;
    /**
     * Whether or not the field has been indexed.
     * @type {boolean}
     * @memberof Field
     */
    indexed?: boolean;
    /**
     * The field summary.
     * @type {string}
     * @memberof Field
     */
    summary?: string;
    /**
     * The field title.
     * @type {string}
     * @memberof Field
     */
    title?: string;
}

