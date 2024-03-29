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
 * Metadata Catalog
 * With the Metadata Catalog you can create and manage knowledge objects such as datasets, fields, rules, actions, dashboards, and workflows.
 *
 * OpenAPI spec version: v2alpha2.6 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    RelationshipKind,
} from './';

/**
 * Properties of relationships which are read through the API. Implementation detail of RelationshipPOST, RelationshipPATCH and Relationship. Do not use directly.
 * @export
 * @interface RelationshipProperties
 */
export interface RelationshipProperties {
    /**
     * 
     * @type {RelationshipKind}
     * @memberof RelationshipProperties
     */
    kind?: RelationshipKind;

    /**
     * The module that contains the relationship.
     * @type {string}
     * @memberof RelationshipProperties
     */
    module?: string;

    /**
     * The relationship name.
     * @type {string}
     * @memberof RelationshipProperties
     */
    name?: string;

    /**
     * A unique source dataset ID. Either the sourceid or sourceresourcename property must be specified.
     * @type {string}
     * @memberof RelationshipProperties
     */
    sourceid?: string;

    /**
     * The source dataset name qualified by module name. Either the sourceid or sourceresourcename property must be specified.
     * @type {string}
     * @memberof RelationshipProperties
     */
    sourceresourcename?: string;

    /**
     * A unique target dataset ID. Either the targetid or targetresourcename property must be specified.
     * @type {string}
     * @memberof RelationshipProperties
     */
    targetid?: string;

    /**
     * The target dataset name qualified by module name. Either the targetid or targetresourcename property must be specified.
     * @type {string}
     * @memberof RelationshipProperties
     */
    targetresourcename?: string;

    /**
     * The Catalog version.
     * @type {number}
     * @memberof RelationshipProperties
     */
    version?: number;

}

