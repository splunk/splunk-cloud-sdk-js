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
 * OpenAPI spec version: v2beta1.1 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    SingleValueMode,
} from './';

/**
 * Summary of each field.
 * @export
 * @interface SingleFieldSummary
 */
export interface SingleFieldSummary {
    /**
     * The total number of events that contain the field.
     * @type {number}
     * @memberof SingleFieldSummary
     */
    count?: number;

    /**
     * The total number of unique values in the field.
     * @type {number}
     * @memberof SingleFieldSummary
     */
    distinctCount?: number;

    /**
     * Specifies if the distinctCount is accurate. The isExact property is FALSE when the distinctCount exceeds the maximum count and an exact count is not available. 
     * @type {boolean}
     * @memberof SingleFieldSummary
     */
    isExact?: boolean;

    /**
     * The maximum numeric values in the field.
     * @type {string}
     * @memberof SingleFieldSummary
     */
    max?: string;

    /**
     * The mean (average) for the numeric values in the field.
     * @type {number}
     * @memberof SingleFieldSummary
     */
    mean?: number;

    /**
     * The minimum numeric values in the field.
     * @type {string}
     * @memberof SingleFieldSummary
     */
    min?: string;

    /**
     * An array of the values in the field.
     * @type {Array<SingleValueMode>}
     * @memberof SingleFieldSummary
     */
    modes?: Array<SingleValueMode>;

    /**
     * The count of the numeric values in the field.
     * @type {number}
     * @memberof SingleFieldSummary
     */
    numericCount?: number;

    /**
     * Specifies if the field was added or changed by the search.
     * @type {boolean}
     * @memberof SingleFieldSummary
     */
    relevant?: boolean;

    /**
     * The standard deviation for the numeric values in the field.
     * @type {number}
     * @memberof SingleFieldSummary
     */
    stddev?: number;

}

