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

/**
 * Represents parameters on the search job, such as &#39;earliest&#39; and &#39;latest&#39;. 
 * @export
 * @interface QueryParameters
 */
export interface QueryParameters {
    /**
     * The earliest time, in absolute or relative format, to retrieve events. When specifying an absolute time specify either UNIX time, or UTC in seconds using the ISO-8601 (%FT%T.%Q) format. For example 2019-01-25T13:15:30Z. GMT is the default timezone. You must specify GMT when you specify UTC. Any offset specified is ignored. 
     * @type {string}
     * @memberof QueryParameters
     */
    earliest?: string;

    /**
     * The latest time, in absolute or relative format, to retrieve events. When specifying an absolute time specify either UNIX time, or UTC in seconds using the ISO-8601 (%FT%T.%Q) format. For example 2019-01-25T13:15:30Z. GMT is the default timezone. You must specify GMT when you specify UTC. Any offset specified is ignored. 
     * @type {string}
     * @memberof QueryParameters
     */
    latest?: string;

    /**
     * Relative values for the 'earliest' and 'latest' parameters snap to the unit that you specify. For example, if 'earliest' is set to -d@d, the unit is day. If the 'relativeTimeAnchor' is is set to '2020-10-05T13:15:30Z' then 'resolvedEarliest' is snapped to '2020-10-05T00:00:00Z', which is the day. Hours, minutes, and seconds are dropped. If no 'relativeTimeAnchor' is specified, the default value is set to the time the search job was created. 
     * @type {string}
     * @memberof QueryParameters
     */
    relativeTimeAnchor?: string;

    /**
     * The timezone that relative time specifiers are based off of. Timezone only applies to relative time literals for 'earliest' and 'latest'. If UNIX time or UTC format is used for 'earliest' and 'latest', this field is ignored. For the list of supported timezone formats, see https://docs.splunk.com/Documentation/Splunk/latest/Data/Applytimezoneoffsetstotimestamps#zoneinfo_.28TZ.29_database type: string default: \"GMT\" 
     * @type {any}
     * @memberof QueryParameters
     */
    timezone?: any;

    /**
     * dynamic keys capturing additional key/value pairs for this model
     * @memberof QueryParameters
     */
    [additionalProperty: string]: any;
}

