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
 * Metadata Catalog service
 * With the Metadata Catalog in Splunk Cloud Services you can create and manage knowledge objects such as datasets, fields, rules, actions, dashboards, and workflows.
 *
 * OpenAPI spec version: v2beta1.4 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * Properties that are common across all Dataset kinds rendered in POST, PATCH, and GET responses.
 * @export
 * @interface DatasetCommon
 */
export interface DatasetCommon {
    /**
     * A unique dataset ID.
     * @type {string}
     * @memberof DatasetCommon
     */
    id: string;

    /**
     * The name of the module that contains the dataset.
     * @type {string}
     * @memberof DatasetCommon
     */
    module: string;

    /**
     * The dataset name. Dataset names must be unique within each module.
     * @type {string}
     * @memberof DatasetCommon
     */
    name: string;

    /**
     * The dataset name qualified by the module name.
     * @type {string}
     * @memberof DatasetCommon
     */
    resourcename: string;

    /**
     * AppClinetId of the creator app of the dataset.
     * @type {string}
     * @memberof DatasetCommon
     */
    appclientidcreatedby?: string;

    /**
     * AppClinetId of the modifier app of the dataset.
     * @type {string}
     * @memberof DatasetCommon
     */
    appclientidmodifiedby?: string;

    /**
     * Detailed description of the dataset.
     * @type {string}
     * @memberof DatasetCommon
     */
    description?: string;

    /**
     * The dataset name qualified by the module name, primarily used to distinguish between index/metric versus other datasets. Index/metric datasets have a distinct underscore separator (_____) between name and module. Internal use only.
     * @type {string}
     * @memberof DatasetCommon
     */
    readonly internalname?: string;

    /**
     * Summary of the dataset's purpose.
     * @type {string}
     * @memberof DatasetCommon
     */
    summary?: string;

    /**
     * The title of the dataset.  Does not have to be unique.
     * @type {string}
     * @memberof DatasetCommon
     */
    title?: string;

    /**
     * The catalog version.
     * @type {number}
     * @memberof DatasetCommon
     */
    version?: number;

}

