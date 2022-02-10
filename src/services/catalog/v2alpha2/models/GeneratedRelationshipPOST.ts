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
    RelationshipFieldPOST,
    RelationshipKind,
} from './';

/**
 * The properties required to create a new relationship using a POST request.
 * @export
 * @interface RelationshipPOST
 */
export interface RelationshipPOST {
    /**
     * 
     * @type {RelationshipKind}
     * @memberof RelationshipPOST
     */
    kind: RelationshipKind;

    /**
     * The relationship name.
     * @type {string}
     * @memberof RelationshipPOST
     */
    name: string;

    /**
     * The fields associated with this relationship.
     * @type {Array<RelationshipFieldPOST>}
     * @memberof RelationshipPOST
     */
    fields?: Array<RelationshipFieldPOST>;

    /**
     * A unique relationship ID. If not specified, an auto generated ID is created.
     * @type {string}
     * @memberof RelationshipPOST
     */
    id?: string;

    /**
     * The module that contains the relationship.
     * @type {string}
     * @memberof RelationshipPOST
     */
    module?: string;

    /**
     * A unique source dataset ID. Either the sourceid or sourceresourcename property must be specified.
     * @type {string}
     * @memberof RelationshipPOST
     */
    sourceid?: string;

    /**
     * The source dataset name qualified by module name. Either the sourceid or sourceresourcename property must be specified.
     * @type {string}
     * @memberof RelationshipPOST
     */
    sourceresourcename?: string;

    /**
     * A unique target dataset ID. Either the targetid or targetresourcename property must be specified.
     * @type {string}
     * @memberof RelationshipPOST
     */
    targetid?: string;

    /**
     * The target dataset name qualified by module name. Either the targetid or targetresourcename property must be specified.
     * @type {string}
     * @memberof RelationshipPOST
     */
    targetresourcename?: string;

    /**
     * The Catalog version.
     * @type {number}
     * @memberof RelationshipPOST
     */
    version?: number;

}

