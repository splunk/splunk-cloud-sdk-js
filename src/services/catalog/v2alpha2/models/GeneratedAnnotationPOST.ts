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

/**
 * The properties required to create a new annotation using a POST request. Key:Value pairs in addition to the defined properties will become annotation tags
 * @export
 * @interface AnnotationPOST
 */
export interface AnnotationPOST {
    /**
     * The annotation type ID.
     * @type {string}
     * @memberof AnnotationPOST
     */
    annotationtypeid: string;

    /**
     * Resource name of the annotation type
     * @type {string}
     * @memberof AnnotationPOST
     */
    annotationtyperesourcename?: string;

    /**
     * The dashboard ID.
     * @type {string}
     * @memberof AnnotationPOST
     */
    dashboardid?: string;

    /**
     * The dataset ID. Null if not annotating a dataset.
     * @type {string}
     * @memberof AnnotationPOST
     */
    datasetid?: string;

    /**
     * The field ID. Null if not annotating a dataset.
     * @type {string}
     * @memberof AnnotationPOST
     */
    fieldid?: string;

    /**
     * A unique annotation ID. If not specified, an auto generated ID is created.
     * @type {string}
     * @memberof AnnotationPOST
     */
    id?: string;

    /**
     * The relationship ID. Null if not annotating a dataset.
     * @type {string}
     * @memberof AnnotationPOST
     */
    relationshipid?: string;

    /**
     * dynamic keys capturing additional key/value pairs for this model
     * @memberof AnnotationPOST
     */
    [additionalProperty: string]: any;
}

