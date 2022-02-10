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

/**
 * A list of the mutable dashboard fields.
 * @export
 * @interface DashboardMutable
 */
export interface DashboardMutable {
    /**
     * The JSON dashboard definition.
     * @type {string}
     * @memberof DashboardMutable
     */
    definition?: string;

    /**
     * Whether the dashboard is active or not.
     * @type {boolean}
     * @memberof DashboardMutable
     */
    isactive?: boolean;

    /**
     * The module that contains the dashboard.
     * @type {string}
     * @memberof DashboardMutable
     */
    module?: string;

    /**
     * The dashboard name. Dashboard names must be unique within each tenant.
     * @type {string}
     * @memberof DashboardMutable
     */
    name?: string;

    /**
     * The version of the dashboard.
     * @type {number}
     * @memberof DashboardMutable
     */
    version?: number;

}

