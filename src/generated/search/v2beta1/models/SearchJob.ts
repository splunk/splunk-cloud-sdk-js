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
 * Splunk Search Service
 * Use the Search service to dispatch, review, and manage searches and search jobs. You can also finalize or cancel running search jobs, retrieve search results and events, and request search-related configurations from the Metadata Catalog service.
 *
 * OpenAPI spec version: v2beta1.0 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    Message,
    QueryParameters,
    SearchStatus,
} from './';

/**
 * A fully-constructed search job, including read-only fields.
 * @export
 * @interface SearchJob
 */
export interface SearchJob {
    /**
     * The SPL search string.
     * @type {string}
     * @memberof SearchJob
     */
    query: string;
    /**
     * Specifies whether a search that contains commands with side effects (with possible security risks) is allowed to run. type: boolean default: false 
     * @type {any}
     * @memberof SearchJob
     */
    allowSideEffects?: any;
    /**
     * Specified whether a search is allowed to collect events summary during the run time. 
     * @type {boolean}
     * @memberof SearchJob
     */
    collectEventSummary?: boolean;
    /**
     * Specified whether a search is allowed to collect Fields summary during the run time. 
     * @type {boolean}
     * @memberof SearchJob
     */
    collectFieldSummary?: boolean;
    /**
     * Specified whether a search is allowed to collect Timeline Buckets summary during the run time. 
     * @type {boolean}
     * @memberof SearchJob
     */
    collectTimeBuckets?: boolean;
    /**
     * The time, in GMT, that the search job is finished. Empty if the search job has not completed. 
     * @type {string}
     * @memberof SearchJob
     */
    readonly completionTime?: string;
    /**
     * The time, in GMT, that the search job is dispatched. 
     * @type {string}
     * @memberof SearchJob
     */
    readonly dispatchTime?: string;
    /**
     * Specifies whether the Search service should extract all of the available fields in the data, including fields not mentioned in the SPL for the search job. Set to 'false' for better search peformance. 
     * @type {boolean}
     * @memberof SearchJob
     */
    extractAllFields?: boolean;
    /**
     * The number of seconds to run the search before finalizing the search. The maximum value is 21600 seconds (6 hours). 
     * @type {number}
     * @memberof SearchJob
     */
    maxTime?: number;
    /**
     * 
     * @type {Array<Message>}
     * @memberof SearchJob
     */
    messages?: Array<Message>;
    /**
     * The module to run the search in. The default module is used if a module is not specified.
     * @type {string}
     * @memberof SearchJob
     */
    module?: string;
    /**
     * The name of the created search job.
     * @type {string}
     * @memberof SearchJob
     */
    readonly name?: string;
    /**
     * An estimate of the percent of time remaining before the job completes.
     * @type {number}
     * @memberof SearchJob
     */
    readonly percentComplete?: number;
    /**
     * Represents parameters on the search job such as 'earliest' and 'latest'.
     * @type {QueryParameters}
     * @memberof SearchJob
     */
    queryParameters?: QueryParameters;
    /**
     * The earliest time speciifed as an absolute value in GMT. The time is computed based on the values you specify for the 'timezone' and 'earliest' queryParameters. 
     * @type {string}
     * @memberof SearchJob
     */
    readonly resolvedEarliest?: string;
    /**
     * The latest time specified as an absolute value in GMT. The time is computed based on the values you specify for the 'timezone' and 'earliest' queryParameters. 
     * @type {string}
     * @memberof SearchJob
     */
    readonly resolvedLatest?: string;
    /**
     * The number of results produced so far for the search job.
     * @type {number}
     * @memberof SearchJob
     */
    readonly resultsAvailable?: number;
    /**
     * The ID assigned to the search job.
     * @type {string}
     * @memberof SearchJob
     */
    readonly sid?: string;
    /**
     * 
     * @type {SearchStatus}
     * @memberof SearchJob
     */
    status?: SearchStatus;
}

