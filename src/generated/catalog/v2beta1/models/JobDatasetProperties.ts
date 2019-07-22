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
 * OpenAPI spec version: v2beta1.3
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
 * Properties of job datasets which may be read, set, and changed through the API. Implementation detail of DatasetPOST, DatasetPATCH, and Dataset, do not use directly.
 * @export
 * @interface JobDatasetProperties
 */
export interface JobDatasetProperties {
    /**
     * Was the event summary requested for this searhc job?
     * @type {boolean}
     * @memberof JobDatasetProperties
     */
    collectEventSummary?: boolean;
    /**
     * Was the field summary requested for this searhc job?
     * @type {boolean}
     * @memberof JobDatasetProperties
     */
    collectFieldSummary?: boolean;
    /**
     * Were the time bucketes requested for this searhc job?
     * @type {boolean}
     * @memberof JobDatasetProperties
     */
    collectTimeBuckets?: boolean;
    /**
     * Time that the job was completed
     * @type {string}
     * @memberof JobDatasetProperties
     */
    completionTime?: string;
    /**
     * The time the dataset will be available in S3.
     * @type {string}
     * @memberof JobDatasetProperties
     */
    deleteTime?: string;
    /**
     * Time that the job was dispatched
     * @type {string}
     * @memberof JobDatasetProperties
     */
    dispatchTime?: string;
    /**
     * The runtime of the search in seconds.
     * @type {number}
     * @memberof JobDatasetProperties
     */
    executionTime?: number;
    /**
     * Should the search produce all fields (including those not explicity mentioned in the SPL)?
     * @type {boolean}
     * @memberof JobDatasetProperties
     */
    extractAllFields?: boolean;
    /**
     * Did the SPL query cause any side effects on a dataset?
     * @type {boolean}
     * @memberof JobDatasetProperties
     */
    hasSideEffects?: boolean;
    /**
     * 
     * @type {JobDatasetKind}
     * @memberof JobDatasetProperties
     */
    kind?: JobDatasetKind;
    /**
     * The maximum number of seconds to run this search before finishing.
     * @type {number}
     * @memberof JobDatasetProperties
     */
    maxTime?: number;
    /**
     * Parameters for the search job, mainly earliest, latest, timezone, and relativeTimeAnchor.
     * @type {{ [key: string]: any; }}
     * @memberof JobDatasetProperties
     */
    parameters?: { [key: string]: any; };
    /**
     * An estimate of how complete the search job is.
     * @type {number}
     * @memberof JobDatasetProperties
     */
    percentComplete?: number;
    /**
     * The SPL query string for the search job.
     * @type {string}
     * @memberof JobDatasetProperties
     */
    query?: string;
    /**
     * Resolved earliest time for the job
     * @type {string}
     * @memberof JobDatasetProperties
     */
    resolvedEarliest?: string;
    /**
     * Resolved latest time for the job
     * @type {string}
     * @memberof JobDatasetProperties
     */
    resolvedLatest?: string;
    /**
     * The instantaneous number of results produced by the search job.
     * @type {number}
     * @memberof JobDatasetProperties
     */
    resultsAvailable?: number;
    /**
     * The search head that started this search job.
     * @type {string}
     * @memberof JobDatasetProperties
     */
    searchHead?: string;
    /**
     * The ID assigned to the search job.
     * @type {string}
     * @memberof JobDatasetProperties
     */
    sid?: string;
    /**
     * The SPLv2 version of the search job query string.
     * @type {string}
     * @memberof JobDatasetProperties
     */
    spl?: string;
    /**
     * The current status of the search job.
     * @type {string}
     * @memberof JobDatasetProperties
     */
    status?: string;
    /**
     * 
     * @type {JobDatasetPropertiesTimelineMetadata}
     * @memberof JobDatasetProperties
     */
    timelineMetadata?: JobDatasetPropertiesTimelineMetadata;
}
