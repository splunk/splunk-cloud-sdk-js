// tslint:disable
/**
 * Copyright 2021 Splunk, Inc.
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
    QueryParameters,
} from './';

/**
 * A fully constructed recurring search, including read-only fields.
 * @export
 * @interface RecurringSearch
 */
export interface RecurringSearch {
    /**
     * The recurrence interval for the recurring search  specified using relative time specifier literals. 
     * @type {string}
     * @memberof RecurringSearch
     */
    interval: RecurringSearchIntervalEnum;

    /**
     * The user-defined name for this recurring search. The maximum length for a name is 100 characters. 
     * @type {string}
     * @memberof RecurringSearch
     */
    name: string;

    /**
     * The SPL search string for the recurring search including  conditions, predicates, and triggers. 
     * @type {string}
     * @memberof RecurringSearch
     */
    query: string;

    /**
     * The app in which the recurring search is created.
     * @type {string}
     * @memberof RecurringSearch
     */
    app?: string;

    /**
     * The time the recurring search was created.
     * @type {string}
     * @memberof RecurringSearch
     */
    readonly createdAt?: string;

    /**
     * The user who created the recurring search.
     * @type {string}
     * @memberof RecurringSearch
     */
    readonly createdBy?: string;

    /**
     * The user-defined description for this recurring search. There is no limit on the length of the description. 
     * @type {string}
     * @memberof RecurringSearch
     */
    description?: string;

    /**
     * Specifies whether this recurring search is enabled  (runs on the specified interval) or disabled. 
     * @type {boolean}
     * @memberof RecurringSearch
     */
    enabled?: boolean;

    /**
     * The time the recurring search was last modified.
     * @type {string}
     * @memberof RecurringSearch
     */
    readonly modifiedAt?: string;

    /**
     * The user who last modified the recurring search.
     * @type {string}
     * @memberof RecurringSearch
     */
    readonly modifiedBy?: string;

    /**
     * The module to run the search in.  The default module is used if a module is not specified. The maximum lengeth for a module name is 100 characters. 
     * @type {string}
     * @memberof RecurringSearch
     */
    module?: string;

    /**
     * Represents parameters on the search job such as 'earliest'.  By default, the 'earliest' parameter is set based on the recurrence  interval. For example, if the interval is set to '1h', the default  value for 'earliest' is set to '-1h' by the platform.  The 'latest' and 'relativeTimeAnchor' parameters are reserved.  The readonly fields for recurring searches and their values are  determined by the platform. 
     * @type {QueryParameters}
     * @memberof RecurringSearch
     */
    queryParameters?: QueryParameters;

    /**
     * The ID assigned to the recurring search.
     * @type {string}
     * @memberof RecurringSearch
     */
    readonly rsid?: string;

    /**
     * The user-defined title for this recurring search. There is no limit on the length of the title. 
     * @type {string}
     * @memberof RecurringSearch
     */
    title?: string;

}

/**
 * @export
 */
export enum RecurringSearchIntervalEnum {
    _15m = '15m',
    _30m = '30m',
    _1h = '1h',
    _12h = '12h',
    _24h = '24h'
}

