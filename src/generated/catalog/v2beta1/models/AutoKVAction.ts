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
 * Metadata Catalog
 * With the Metadata Catalog you can create and manage knowledge objects such as datasets, fields, rules, actions, dashboards, and workflows.
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
 * A complete autokv action as rendered in POST, PATCH, and GET responses.
 * @export
 * @interface AutoKVAction
 */
export interface AutoKVAction {
    /**
     * The date and time object was created.
     * @type {string}
     * @memberof AutoKVAction
     */
    readonly created: string;
    /**
     * The name of the user who created the object. This value is obtained from the bearer token and may not be changed.
     * @type {string}
     * @memberof AutoKVAction
     */
    readonly createdby: string;
    /**
     * A unique action ID.
     * @type {string}
     * @memberof AutoKVAction
     */
    id: string;
    /**
     * 
     * @type {AutoKVActionKind}
     * @memberof AutoKVAction
     */
    kind: AutoKVActionKind;
    /**
     * The autokv action mode.
     * @type {string}
     * @memberof AutoKVAction
     */
    mode: string;
    /**
     * The date and time object was modified.
     * @type {string}
     * @memberof AutoKVAction
     */
    readonly modified: string;
    /**
     * The name of the user who most recently modified the object.
     * @type {string}
     * @memberof AutoKVAction
     */
    readonly modifiedby: string;
    /**
     * The name of the object's owner.
     * @type {string}
     * @memberof AutoKVAction
     */
    readonly owner: string;
    /**
     * The rule that this action is part of.
     * @type {string}
     * @memberof AutoKVAction
     */
    ruleid: string;
    /**
     * The catalog version.
     * @type {number}
     * @memberof AutoKVAction
     */
    version?: number;
}

