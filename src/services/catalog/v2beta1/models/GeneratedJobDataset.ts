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
    JobDatasetKind,
    JobDatasetPropertiesTimelineMetadata,
} from './';

/**
 * A complete job dataset as rendered in POST, PATCH, and GET responses.
 * @export
 * @interface JobDataset
 */
export interface JobDataset {
    /**
     * Time that the job was completed
     * @type {string}
     * @memberof JobDataset
     */
    completionTime: string;

    /**
     * The date and time object was created.
     * @type {string}
     * @memberof JobDataset
     */
    readonly created: string;

    /**
     * The name of the user who created the object. This value is obtained from the bearer token and may not be changed.
     * @type {string}
     * @memberof JobDataset
     */
    readonly createdby: string;

    /**
     * The time the dataset will be available in S3.
     * @type {string}
     * @memberof JobDataset
     */
    deleteTime: string;

    /**
     * Time that the job was dispatched
     * @type {string}
     * @memberof JobDataset
     */
    dispatchTime: string;

    /**
     * A unique dataset ID.
     * @type {string}
     * @memberof JobDataset
     */
    id: string;

    /**
     * 
     * @type {JobDatasetKind}
     * @memberof JobDataset
     */
    kind: JobDatasetKind;

    /**
     * The date and time object was modified.
     * @type {string}
     * @memberof JobDataset
     */
    readonly modified: string;

    /**
     * The name of the user who most recently modified the object.
     * @type {string}
     * @memberof JobDataset
     */
    readonly modifiedby: string;

    /**
     * The name of the module that contains the dataset.
     * @type {string}
     * @memberof JobDataset
     */
    module: string;

    /**
     * The dataset name. Dataset names must be unique within each module.
     * @type {string}
     * @memberof JobDataset
     */
    name: string;

    /**
     * The name of the object's owner.
     * @type {string}
     * @memberof JobDataset
     */
    readonly owner: string;

    /**
     * Parameters for the search job, mainly earliest, latest, timezone, and relativeTimeAnchor.
     * @type {{ [key: string]: any; }}
     * @memberof JobDataset
     */
    parameters: { [key: string]: any; };

    /**
     * The SPL query string for the search job.
     * @type {string}
     * @memberof JobDataset
     */
    query: string;

    /**
     * Resolved earliest time for the job
     * @type {string}
     * @memberof JobDataset
     */
    resolvedEarliest: string;

    /**
     * Resolved latest time for the job
     * @type {string}
     * @memberof JobDataset
     */
    resolvedLatest: string;

    /**
     * The dataset name qualified by the module name.
     * @type {string}
     * @memberof JobDataset
     */
    resourcename: string;

    /**
     * The ID assigned to the search job.
     * @type {string}
     * @memberof JobDataset
     */
    sid: string;

    /**
     * Was the event summary requested for this searhc job?
     * @type {boolean}
     * @memberof JobDataset
     */
    collectEventSummary?: boolean;

    /**
     * Was the field summary requested for this searhc job?
     * @type {boolean}
     * @memberof JobDataset
     */
    collectFieldSummary?: boolean;

    /**
     * Were the time bucketes requested for this searhc job?
     * @type {boolean}
     * @memberof JobDataset
     */
    collectTimeBuckets?: boolean;

    /**
     * Detailed description of the dataset.
     * @type {string}
     * @memberof JobDataset
     */
    description?: string;

    /**
     * The runtime of the search in seconds.
     * @type {number}
     * @memberof JobDataset
     */
    executionTime?: number;

    /**
     * Should the search produce all fields (including those not explicity mentioned in the SPL)?
     * @type {boolean}
     * @memberof JobDataset
     */
    extractAllFields?: boolean;

    /**
     * Did the SPL query cause any side effects on a dataset?
     * @type {boolean}
     * @memberof JobDataset
     */
    hasSideEffects?: boolean;

    /**
     * The maximum number of seconds to run this search before finishing.
     * @type {number}
     * @memberof JobDataset
     */
    maxTime?: number;

    /**
     * The parent's ID of the search job.
     * @type {string}
     * @memberof JobDataset
     */
    parent?: string;

    /**
     * An estimate of how complete the search job is.
     * @type {number}
     * @memberof JobDataset
     */
    percentComplete?: number;

    /**
     * The instantaneous number of results produced by the search job.
     * @type {number}
     * @memberof JobDataset
     */
    resultsAvailable?: number;

    /**
     * The search head that started this search job.
     * @type {string}
     * @memberof JobDataset
     */
    searchHead?: string;

    /**
     * The SPLv2 version of the search job query string.
     * @type {string}
     * @memberof JobDataset
     */
    spl?: string;

    /**
     * The current status of the search job.
     * @type {string}
     * @memberof JobDataset
     */
    status?: string;

    /**
     * Summary of the dataset's purpose.
     * @type {string}
     * @memberof JobDataset
     */
    summary?: string;

    /**
     * 
     * @type {JobDatasetPropertiesTimelineMetadata}
     * @memberof JobDataset
     */
    timelineMetadata?: JobDatasetPropertiesTimelineMetadata;

    /**
     * The title of the dataset.  Does not have to be unique.
     * @type {string}
     * @memberof JobDataset
     */
    title?: string;

    /**
     * The catalog version.
     * @type {number}
     * @memberof JobDataset
     */
    version?: number;

}
