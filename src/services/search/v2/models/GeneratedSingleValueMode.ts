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
 * OpenAPI spec version: v2 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * Summary of the value in a field.
 * @export
 * @interface SingleValueMode
 */
export interface SingleValueMode {
    /**
     * The number of occurrences that the value appears in a field.
     * @type {number}
     * @memberof SingleValueMode
     */
    count?: number;

    /**
     * Specifies if the count is accurate. When the count exceeds the maximum count, an approximate count is computed instead and the 'isExact' property is FALSE. 
     * @type {boolean}
     * @memberof SingleValueMode
     */
    isExact?: boolean;

    /**
     * The value in the field.
     * @type {string}
     * @memberof SingleValueMode
     */
    value?: string;

}

