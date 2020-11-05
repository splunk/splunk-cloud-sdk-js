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

import {
    KVCollectionDatasetKind,
} from './';

/**
 * A complete kvcollection dataset as rendered in POST, PATCH, and GET responses.
 * @export
 * @interface KVCollectionDataset
 */
export interface KVCollectionDataset {
    /**
     * The date and time object was created.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    readonly created: string;

    /**
     * The name of the user who created the object. This value is obtained from the bearer token and may not be changed.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    readonly createdby: string;

    /**
     * A unique dataset ID.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    id: string;

    /**
     * 
     * @type {KVCollectionDatasetKind}
     * @memberof KVCollectionDataset
     */
    kind: KVCollectionDatasetKind;

    /**
     * The date and time object was modified.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    readonly modified: string;

    /**
     * The name of the user who most recently modified the object.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    readonly modifiedby: string;

    /**
     * The name of the module that contains the dataset.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    module: string;

    /**
     * The dataset name. Dataset names must be unique within each module.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    name: string;

    /**
     * The name of the object's owner.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    readonly owner: string;

    /**
     * The dataset name qualified by the module name.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    resourcename: string;

    /**
     * AppClinetId of the creator app of the dataset.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    appclientidcreatedby?: string;

    /**
     * AppClinetId of the modifier app of the dataset.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    appclientidmodifiedby?: string;

    /**
     * Detailed description of the dataset.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    description?: string;

    /**
     * The dataset name qualified by the module name, primarily used to distinguish between index/metric versus other datasets. Index/metric datasets have a distinct underscore separator (_____) between name and module. Internal use only.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    readonly internalname?: string;

    /**
     * Summary of the dataset's purpose.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    summary?: string;

    /**
     * The title of the dataset.  Does not have to be unique.
     * @type {string}
     * @memberof KVCollectionDataset
     */
    title?: string;

    /**
     * The catalog version.
     * @type {number}
     * @memberof KVCollectionDataset
     */
    version?: number;

}

