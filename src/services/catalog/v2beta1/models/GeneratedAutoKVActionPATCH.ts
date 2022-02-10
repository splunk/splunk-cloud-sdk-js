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
    AutoKVActionKind,
} from './';

/**
 * Property values for setting existing autokv actions using a PATCH request.
 * @export
 * @interface AutoKVActionPATCH
 */
export interface AutoKVActionPATCH {
    /**
     * 
     * @type {AutoKVActionKind}
     * @memberof AutoKVActionPATCH
     */
    kind?: AutoKVActionKind;

    /**
     * The autokv action mode.
     * @type {string}
     * @memberof AutoKVActionPATCH
     */
    mode?: string;

    /**
     * The name of the user who owns this action. This value is obtained from the bearer token if not present.
     * @type {string}
     * @memberof AutoKVActionPATCH
     */
    owner?: string;

    /**
     * The catalog version.
     * @type {number}
     * @memberof AutoKVActionPATCH
     */
    version?: number;

}

