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
 * Splunk Search service
 * Use the Search service in Splunk Cloud Services to dispatch, review, and manage searches and search jobs. You can finalize or cancel jobs, retrieve search results, and request search-related configurations from the Metadata Catalog service in Splunk Cloud Services.
 *
 * OpenAPI spec version: v3alpha1 
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
 * A fully-constructed delete search job, including read-only fields.
 * @export
 * @interface DeleteSearchJob
 */
export interface DeleteSearchJob {
    /**
     * The index to delete events from.
     * @type {string}
     * @memberof DeleteSearchJob
     */
    index: string;

    /**
     * The module to run the delete search job in. The default module is used if module field is empty.
     * @type {string}
     * @memberof DeleteSearchJob
     */
    module: string;

    /**
     * The predicate expression that identifies the events to delete from the index. This expression must return true or false. To delete all events from the index, specify \"true\" instead of an expression.
     * @type {string}
     * @memberof DeleteSearchJob
     */
    predicate: string;

    /**
     * Specifies that the delete search job will contain side effects, with possible security risks. 
     * @type {boolean}
     * @memberof DeleteSearchJob
     */
    readonly allowSideEffects?: boolean;

    /**
     * This field does not apply to delete search jobs and is defaulted to false. 
     * @type {boolean}
     * @memberof DeleteSearchJob
     */
    readonly collectEventSummary?: boolean;

    /**
     * This field does not apply to delete search jobs and is defaulted to false. 
     * @type {boolean}
     * @memberof DeleteSearchJob
     */
    readonly collectFieldSummary?: boolean;

    /**
     * This field does not apply to delete search jobs and is defaulted to false. 
     * @type {boolean}
     * @memberof DeleteSearchJob
     */
    readonly collectTimeBuckets?: boolean;

    /**
     * The time, in GMT, that the search job is finished. Empty if the search job has not completed. 
     * @type {string}
     * @memberof DeleteSearchJob
     */
    readonly completionTime?: string;

    /**
     * The time, in GMT, that the search job is dispatched. 
     * @type {string}
     * @memberof DeleteSearchJob
     */
    readonly dispatchTime?: string;

    /**
     * This field does not apply to delete search jobs and is defaulted to false. 
     * @type {boolean}
     * @memberof DeleteSearchJob
     */
    readonly enablePreview?: boolean;

    /**
     * Specifies whether the Search service should extract all of the available fields in the data, including fields not mentioned in the SPL for the search job. Set to 'false' for better search peformance. The 'extractAllFields' parameter is deprecated as of version v3alpha1. Although this parameter continues to function, it might be removed in a future version. Use the 'extractFields' parameter instead. 
     * @type {boolean}
     * @memberof DeleteSearchJob
     */
    extractAllFields?: boolean;

    /**
     * Specifies how the Search service should extract fields. Valid values include 'all', 'none', or 'indexed'. 'all' will extract all fields, 'indexed' will extract only indexed fields, and 'none' will extract only the default fields. This parameter overwrites the value of the 'extractAllFields' parameter. Set to 'none' for better search performance. 
     * @type {string}
     * @memberof DeleteSearchJob
     */
    extractFields?: string;

    /**
     * The amount of time, in seconds, to run the delete search job before finalizing the search. The maximum value is 3600 seconds (1 hour). 
     * @type {number}
     * @memberof DeleteSearchJob
     */
    maxTime?: number;

    /**
     * 
     * @type {Array<Message>}
     * @memberof DeleteSearchJob
     */
    messages?: Array<Message>;

    /**
     * The name of the created search job.
     * @type {string}
     * @memberof DeleteSearchJob
     */
    readonly name?: string;

    /**
     * An estimate of the percent of time remaining before the delete search job completes.
     * @type {number}
     * @memberof DeleteSearchJob
     */
    readonly percentComplete?: number;

    /**
     * This field does not apply to delete search jobs and is defaulted to false.
     * @type {string}
     * @memberof DeleteSearchJob
     */
    readonly previewAvailable?: string;

    /**
     * The SPL search string that is generated based on index, module and predicate that are specified.
     * @type {string}
     * @memberof DeleteSearchJob
     */
    readonly query?: string;

    /**
     * Represents parameters on the search job such as 'earliest' and 'latest'.
     * @type {QueryParameters}
     * @memberof DeleteSearchJob
     */
    queryParameters?: QueryParameters;

    /**
     * This field does not apply to delete search jobs and is set to 0. 
     * @type {number}
     * @memberof DeleteSearchJob
     */
    readonly requiredFreshness?: number;

    /**
     * The earliest time speciifed as an absolute value in GMT. The time is computed based on the values you specify for the 'timezone' and 'earliest' queryParameters. 
     * @type {string}
     * @memberof DeleteSearchJob
     */
    readonly resolvedEarliest?: string;

    /**
     * The latest time specified as an absolute value in GMT. The time is computed based on the values you specify for the 'timezone' and 'earliest' queryParameters. 
     * @type {string}
     * @memberof DeleteSearchJob
     */
    readonly resolvedLatest?: string;

    /**
     * The number of results produced so far by the delete search job that are going to be deleted.
     * @type {number}
     * @memberof DeleteSearchJob
     */
    readonly resultsAvailable?: number;

    /**
     * This field does not apply to delete search jobs and is defaulted to 0.
     * @type {number}
     * @memberof DeleteSearchJob
     */
    readonly resultsPreviewAvailable?: number;

    /**
     * The ID assigned to the delete search job.
     * @type {string}
     * @memberof DeleteSearchJob
     */
    readonly sid?: string;

    /**
     * 
     * @type {SearchStatus}
     * @memberof DeleteSearchJob
     */
    status?: SearchStatus;

}

