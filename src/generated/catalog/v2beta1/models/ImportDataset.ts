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
    ImportDatasetKind,
} from './';

/**
 * A complete import dataset as rendered in POST, PATCH, and GET responses.
 * @export
 * @interface ImportDataset
 */
export interface ImportDataset {
    /**
     * The date and time object was created.
     * @type {string}
     * @memberof ImportDataset
     */
    readonly created: string;
    /**
     * The name of the user who created the object. This value is obtained from the bearer token and may not be changed.
     * @type {string}
     * @memberof ImportDataset
     */
    readonly createdby: string;
    /**
     * A unique dataset ID.
     * @type {string}
     * @memberof ImportDataset
     */
    id: string;
    /**
     * 
     * @type {ImportDatasetKind}
     * @memberof ImportDataset
     */
    kind: ImportDatasetKind;
    /**
     * The date and time object was modified.
     * @type {string}
     * @memberof ImportDataset
     */
    readonly modified: string;
    /**
     * The name of the user who most recently modified the object.
     * @type {string}
     * @memberof ImportDataset
     */
    readonly modifiedby: string;
    /**
     * The name of the module that contains the dataset.
     * @type {string}
     * @memberof ImportDataset
     */
    module: string;
    /**
     * The dataset name. Dataset names must be unique within each module.
     * @type {string}
     * @memberof ImportDataset
     */
    name: string;
    /**
     * The name of the object's owner.
     * @type {string}
     * @memberof ImportDataset
     */
    readonly owner: string;
    /**
     * The dataset name qualified by the module name.
     * @type {string}
     * @memberof ImportDataset
     */
    resourcename: string;
    /**
     * The dataset module being imported.
     * @type {string}
     * @memberof ImportDataset
     */
    sourceModule: string;
    /**
     * The dataset name being imported.
     * @type {string}
     * @memberof ImportDataset
     */
    sourceName: string;
    /**
     * Detailed description of the dataset.
     * @type {string}
     * @memberof ImportDataset
     */
    description?: string;
    /**
     * Summary of the dataset's purpose.
     * @type {string}
     * @memberof ImportDataset
     */
    summary?: string;
    /**
     * The title of the dataset.  Does not have to be unique.
     * @type {string}
     * @memberof ImportDataset
     */
    title?: string;
    /**
     * The catalog version.
     * @type {number}
     * @memberof ImportDataset
     */
    version?: number;
}

