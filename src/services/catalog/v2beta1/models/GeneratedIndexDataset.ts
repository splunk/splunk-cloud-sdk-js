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
    IndexDatasetKind,
} from './';

/**
 * A complete index dataset as rendered in POST, PATCH, and GET responses.
 * @export
 * @interface IndexDataset
 */
export interface IndexDataset {
    /**
     * The date and time object was created.
     * @type {string}
     * @memberof IndexDataset
     */
    readonly created: string;

    /**
     * The name of the user who created the object. This value is obtained from the bearer token and may not be changed.
     * @type {string}
     * @memberof IndexDataset
     */
    readonly createdby: string;

    /**
     * Specifies whether or not the Splunk index is disabled.
     * @type {boolean}
     * @memberof IndexDataset
     */
    disabled: boolean;

    /**
     * A unique dataset ID.
     * @type {string}
     * @memberof IndexDataset
     */
    id: string;

    /**
     * 
     * @type {IndexDatasetKind}
     * @memberof IndexDataset
     */
    kind: IndexDatasetKind;

    /**
     * The date and time object was modified.
     * @type {string}
     * @memberof IndexDataset
     */
    readonly modified: string;

    /**
     * The name of the user who most recently modified the object.
     * @type {string}
     * @memberof IndexDataset
     */
    readonly modifiedby: string;

    /**
     * The name of the module that contains the dataset.
     * @type {string}
     * @memberof IndexDataset
     */
    module: string;

    /**
     * The dataset name. Dataset names must be unique within each module.
     * @type {string}
     * @memberof IndexDataset
     */
    name: string;

    /**
     * The name of the object's owner.
     * @type {string}
     * @memberof IndexDataset
     */
    readonly owner: string;

    /**
     * The dataset name qualified by the module name.
     * @type {string}
     * @memberof IndexDataset
     */
    resourcename: string;

    /**
     * AppClinetId of the creator app of the dataset.
     * @type {string}
     * @memberof IndexDataset
     */
    appclientidcreatedby?: string;

    /**
     * AppClinetId of the modifier app of the dataset.
     * @type {string}
     * @memberof IndexDataset
     */
    appclientidmodifiedby?: string;

    /**
     * Detailed description of the dataset.
     * @type {string}
     * @memberof IndexDataset
     */
    description?: string;

    /**
     * The timestamp, in seconds, of the earliest event. The timestamp is in UNIX time.
     * @type {string}
     * @memberof IndexDataset
     */
    earliestEventTime?: string;

    /**
     * The earliest index time for any of the events in this index.
     * @type {string}
     * @memberof IndexDataset
     */
    earliestIngestTime?: string;

    /**
     * The frozenTimePeriodInSecs to use for the index
     * @type {number}
     * @memberof IndexDataset
     */
    frozenTimePeriodInSecs?: number;

    /**
     * The dataset name qualified by the module name, primarily used to distinguish between index/metric versus other datasets. Index/metric datasets have a distinct underscore separator (_____) between name and module. Internal use only.
     * @type {string}
     * @memberof IndexDataset
     */
    readonly internalname?: string;

    /**
     * The timestamp, in seconds, of the latest event. The timestamp is in UNIX time.
     * @type {string}
     * @memberof IndexDataset
     */
    latestEventTime?: string;

    /**
     * The latest index time for any of the events in this index.
     * @type {string}
     * @memberof IndexDataset
     */
    latestIngestTime?: string;

    /**
     * The latest time that the index metadata was refreshed.
     * @type {string}
     * @memberof IndexDataset
     */
    latestMetadataUpdateTime?: string;

    /**
     * Summary of the dataset's purpose.
     * @type {string}
     * @memberof IndexDataset
     */
    summary?: string;

    /**
     * The title of the dataset.  Does not have to be unique.
     * @type {string}
     * @memberof IndexDataset
     */
    title?: string;

    /**
     * The number of events in the index.
     * @type {number}
     * @memberof IndexDataset
     */
    totalEventCount?: number;

    /**
     * The raw size, in bytes, of the uncompressed data in the indexers.
     * @type {number}
     * @memberof IndexDataset
     */
    totalSize?: number;

    /**
     * The catalog version.
     * @type {number}
     * @memberof IndexDataset
     */
    version?: number;

}

