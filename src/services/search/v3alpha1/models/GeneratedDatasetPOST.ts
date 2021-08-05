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
    FieldPOST,
} from './';

/**
 * Properties that are common across all Dataset kinds for creating a new dataset using a POST request.
 * @export
 * @interface DatasetPOST
 */
export interface DatasetPOST {
    /**
     * The dataset name. Dataset names must be unique within each module.
     * @type {string}
     * @memberof DatasetPOST
     */
    name: string;

    /**
     * The fields to be associated with this dataset.
     * @type {Array<FieldPOST>}
     * @memberof DatasetPOST
     */
    fields?: Array<FieldPOST>;

    /**
     * A unique dataset ID. Random ID used if not provided.
     * @type {string}
     * @memberof DatasetPOST
     */
    id?: string;

    /**
     * The name of the module to create the new dataset in.
     * @type {string}
     * @memberof DatasetPOST
     */
    module?: string;

}
