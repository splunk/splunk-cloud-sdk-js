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
    ListSearchResultsResponseFields,
    Message,
} from './';

/**
 * The structure of the preview search results that is returned  for the job with the specified search ID (sid). When a search is running,  it might return incomplete or truncated search results. The &#39;isPreviewStable&#39;  property indicates whether the returned preview results stucture is stable or not. Truncated preview results occur because the number of requested results  exceeds the page limit. Follow the &#39;nextLink&#39; URL to retrieve the next page of results. 
 * @export
 * @interface ListPreviewResultsResponse
 */
export interface ListPreviewResultsResponse {
    /**
     * 
     * @type {boolean}
     * @memberof ListPreviewResultsResponse
     */
    isPreviewStable: boolean;

    /**
     * 
     * @type {Array<{ [key: string]: any; }>}
     * @memberof ListPreviewResultsResponse
     */
    results: Array<{ [key: string]: any; }>;

    /**
     * 
     * @type {Array<ListSearchResultsResponseFields>}
     * @memberof ListPreviewResultsResponse
     */
    fields?: Array<ListSearchResultsResponseFields>;

    /**
     * 
     * @type {Array<Message>}
     * @memberof ListPreviewResultsResponse
     */
    messages?: Array<Message>;

    /**
     * 
     * @type {string}
     * @memberof ListPreviewResultsResponse
     */
    nextLink?: string;

    /**
     * 
     * @type {string}
     * @memberof ListPreviewResultsResponse
     */
    wait?: string;

}
