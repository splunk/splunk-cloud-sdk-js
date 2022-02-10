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
    MetricDatasetKind,
} from './';

/**
 * A complete metric dataset as rendered in POST, PATCH, and GET responses.
 * @export
 * @interface MetricDataset
 */
export interface MetricDataset {
    /**
     * The date and time object was created.
     * @type {string}
     * @memberof MetricDataset
     */
    readonly created: string;

    /**
     * The name of the user who created the object. This value is obtained from the bearer token and may not be changed.
     * @type {string}
     * @memberof MetricDataset
     */
    readonly createdby: string;

    /**
     * Specifies whether or not the Splunk index is disabled.
     * @type {boolean}
     * @memberof MetricDataset
     */
    disabled: boolean;

    /**
     * A unique dataset ID.
     * @type {string}
     * @memberof MetricDataset
     */
    id: string;

    /**
     * 
     * @type {MetricDatasetKind}
     * @memberof MetricDataset
     */
    kind: MetricDatasetKind;

    /**
     * The date and time object was modified.
     * @type {string}
     * @memberof MetricDataset
     */
    readonly modified: string;

    /**
     * The name of the user who most recently modified the object.
     * @type {string}
     * @memberof MetricDataset
     */
    readonly modifiedby: string;

    /**
     * The name of the module that contains the dataset.
     * @type {string}
     * @memberof MetricDataset
     */
    module: string;

    /**
     * The dataset name. Dataset names must be unique within each module.
     * @type {string}
     * @memberof MetricDataset
     */
    name: string;

    /**
     * The name of the object's owner.
     * @type {string}
     * @memberof MetricDataset
     */
    readonly owner: string;

    /**
     * The dataset name qualified by the module name.
     * @type {string}
     * @memberof MetricDataset
     */
    resourcename: string;

    /**
     * AppClinetId of the creator app of the dataset.
     * @type {string}
     * @memberof MetricDataset
     */
    appclientidcreatedby?: string;

    /**
     * AppClinetId of the modifier app of the dataset.
     * @type {string}
     * @memberof MetricDataset
     */
    appclientidmodifiedby?: string;

    /**
     * Detailed description of the dataset.
     * @type {string}
     * @memberof MetricDataset
     */
    description?: string;

    /**
     * The timestamp, in seconds, of the earliest measure. The timestamp is in UNIX time.
     * @type {string}
     * @memberof MetricDataset
     */
    earliestEventTime?: string;

    /**
     * The earliest index time for any of the measures in this index.
     * @type {string}
     * @memberof MetricDataset
     */
    earliestIngestTime?: string;

    /**
     * The frozenTimePeriodInSecs to use for the index
     * @type {number}
     * @memberof MetricDataset
     */
    frozenTimePeriodInSecs?: number;

    /**
     * The dataset name qualified by the module name, primarily used to distinguish between index/metric versus other datasets. Index/metric datasets have a distinct underscore separator (_____) between name and module. Internal use only.
     * @type {string}
     * @memberof MetricDataset
     */
    readonly internalname?: string;

    /**
     * The timestamp, in seconds, of the latest measure. The timestamp is in UNIX time.
     * @type {string}
     * @memberof MetricDataset
     */
    latestEventTime?: string;

    /**
     * The earliest index time for any of the measures in this index.
     * @type {string}
     * @memberof MetricDataset
     */
    latestIngestTime?: string;

    /**
     * The latest time that the metric index metadata was refreshed.
     * @type {string}
     * @memberof MetricDataset
     */
    latestMetadataUpdateTime?: string;

    /**
     * Summary of the dataset's purpose.
     * @type {string}
     * @memberof MetricDataset
     */
    summary?: string;

    /**
     * The title of the dataset.  Does not have to be unique.
     * @type {string}
     * @memberof MetricDataset
     */
    title?: string;

    /**
     * THe number of measures in the metric index.
     * @type {number}
     * @memberof MetricDataset
     */
    totalEventCount?: number;

    /**
     * For metrics indexes, the totalSize is set to 0.
     * @type {number}
     * @memberof MetricDataset
     */
    totalSize?: number;

    /**
     * The catalog version.
     * @type {number}
     * @memberof MetricDataset
     */
    version?: number;

}

