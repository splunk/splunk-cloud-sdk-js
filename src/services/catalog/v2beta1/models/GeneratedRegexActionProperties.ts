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
 * Search Catalog service
 * With the Metadata Catalog in Splunk Cloud Services you can create and manage knowledge objects such as datasets, fields, rules, actions, and dashboards.
 *
 * OpenAPI spec version: v2beta1.4 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    RegexActionKind,
} from './';

/**
 * Properties of regex actions which may be read, set, and changed through the API. Implementation detail of ActionPOST, ActionPOST, and Action, do not use directly.
 * @export
 * @interface RegexActionProperties
 */
export interface RegexActionProperties {
    /**
     * Name of the field that is matched against the regular expression.
     * @type {string}
     * @memberof RegexActionProperties
     */
    field?: string;

    /**
     * 
     * @type {RegexActionKind}
     * @memberof RegexActionProperties
     */
    kind?: RegexActionKind;

    /**
     * The maximum number of times per event to attempt to match fields with the regular expression.
     * @type {number}
     * @memberof RegexActionProperties
     */
    limit?: number;

    /**
     * A regular expression that includes named capture groups for the purpose of field extraction.
     * @type {string}
     * @memberof RegexActionProperties
     */
    pattern?: string;

}

