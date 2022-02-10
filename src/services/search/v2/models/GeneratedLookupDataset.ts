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
 * OpenAPI spec version: v2 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    LookupDatasetExternalKind,
    LookupDatasetKind,
} from './';

/**
 * A complete lookup dataset as rendered in POST, PATCH, and GET responses.
 * @export
 * @interface LookupDataset
 */
export interface LookupDataset {
    /**
     * The date and time object was created.
     * @type {string}
     * @memberof LookupDataset
     */
    readonly created: string;

    /**
     * The name of the user who created the object. This value is obtained from the bearer token and may not be changed.
     * @type {string}
     * @memberof LookupDataset
     */
    readonly createdby: string;

    /**
     * 
     * @type {LookupDatasetExternalKind}
     * @memberof LookupDataset
     */
    externalKind: LookupDatasetExternalKind;

    /**
     * The name of the external lookup.
     * @type {string}
     * @memberof LookupDataset
     */
    externalName: string;

    /**
     * A unique dataset ID.
     * @type {string}
     * @memberof LookupDataset
     */
    id: string;

    /**
     * 
     * @type {LookupDatasetKind}
     * @memberof LookupDataset
     */
    kind: LookupDatasetKind;

    /**
     * The date and time object was modified.
     * @type {string}
     * @memberof LookupDataset
     */
    readonly modified: string;

    /**
     * The name of the user who most recently modified the object.
     * @type {string}
     * @memberof LookupDataset
     */
    readonly modifiedby: string;

    /**
     * The dataset name. Dataset names must be unique within each module.
     * @type {string}
     * @memberof LookupDataset
     */
    name: string;

    /**
     * The name of the object's owner.
     * @type {string}
     * @memberof LookupDataset
     */
    readonly owner: string;

    /**
     * The dataset name qualified by the module name.
     * @type {string}
     * @memberof LookupDataset
     */
    resourcename: string;

    /**
     * AppClinetId of the creator app of the dataset.
     * @type {string}
     * @memberof LookupDataset
     */
    appclientidcreatedby?: string;

    /**
     * AppClinetId of the modifier app of the dataset.
     * @type {string}
     * @memberof LookupDataset
     */
    appclientidmodifiedby?: string;

    /**
     * Match case-sensitively against the lookup.
     * @type {boolean}
     * @memberof LookupDataset
     */
    caseSensitiveMatch?: boolean;

    /**
     * Detailed description of the dataset.
     * @type {string}
     * @memberof LookupDataset
     */
    description?: string;

    /**
     * A query that filters results out of the lookup before those results are returned.
     * @type {string}
     * @memberof LookupDataset
     */
    filter?: string;

    /**
     * The name of the namespace that contains the dataset.
     * @type {string}
     * @memberof LookupDataset
     */
    namespace?: string;

    /**
     * Summary of the dataset's purpose.
     * @type {string}
     * @memberof LookupDataset
     */
    summary?: string;

    /**
     * The title of the dataset.  Does not have to be unique.
     * @type {string}
     * @memberof LookupDataset
     */
    title?: string;

}

