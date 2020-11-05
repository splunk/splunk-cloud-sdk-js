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
    IndexDatasetKind,
} from './';

/**
 * Properties of index datasets which can only be read through the API.
 * @export
 * @interface IndexDatasetReadOnlyProperties
 */
export interface IndexDatasetReadOnlyProperties {
    /**
     * The timestamp, in seconds, of the earliest event. The timestamp is in UNIX time.
     * @type {string}
     * @memberof IndexDatasetReadOnlyProperties
     */
    earliestEventTime?: string;

    /**
     * The earliest index time for any of the events in this index.
     * @type {string}
     * @memberof IndexDatasetReadOnlyProperties
     */
    earliestIngestTime?: string;

    /**
     * 
     * @type {IndexDatasetKind}
     * @memberof IndexDatasetReadOnlyProperties
     */
    kind?: IndexDatasetKind;

    /**
     * The timestamp, in seconds, of the latest event. The timestamp is in UNIX time.
     * @type {string}
     * @memberof IndexDatasetReadOnlyProperties
     */
    latestEventTime?: string;

    /**
     * The latest index time for any of the events in this index.
     * @type {string}
     * @memberof IndexDatasetReadOnlyProperties
     */
    latestIngestTime?: string;

    /**
     * The latest time that the index metadata was refreshed.
     * @type {string}
     * @memberof IndexDatasetReadOnlyProperties
     */
    latestMetadataUpdateTime?: string;

    /**
     * The number of events in the index.
     * @type {number}
     * @memberof IndexDatasetReadOnlyProperties
     */
    totalEventCount?: number;

    /**
     * The raw size, in bytes, of the uncompressed data in the indexers.
     * @type {number}
     * @memberof IndexDatasetReadOnlyProperties
     */
    totalSize?: number;

}

