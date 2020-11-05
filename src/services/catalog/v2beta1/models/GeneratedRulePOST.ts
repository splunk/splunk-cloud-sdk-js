// tslint:disable
/**
 * Copyright 2020 Splunk, Inc.
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
 * Metadata Catalog service
 * With the Metadata Catalog in Splunk Cloud Services you can create and manage knowledge objects such as datasets, fields, rules, actions, dashboards, and workflows.
 *
 * OpenAPI spec version: v2beta1.4 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    ActionPOST,
} from './';

/**
 * Initial property values for creating a new rule using a POST request.
 * @export
 * @interface RulePOST
 */
export interface RulePOST {
    /**
     * The rule match type.
     * @type {string}
     * @memberof RulePOST
     */
    match: string;

    /**
     * The rule name.
     * @type {string}
     * @memberof RulePOST
     */
    name: string;

    /**
     * The actions to be associated with this rule.
     * @type {Array<ActionPOST>}
     * @memberof RulePOST
     */
    actions?: Array<ActionPOST>;

    /**
     * A unique rule ID. The newly created rule object will use this ID value if provided.
     * @type {string}
     * @memberof RulePOST
     */
    id?: string;

    /**
     * The module containing the rule.
     * @type {string}
     * @memberof RulePOST
     */
    module?: string;

    /**
     * The catalog version.
     * @type {number}
     * @memberof RulePOST
     */
    version?: number;

}

