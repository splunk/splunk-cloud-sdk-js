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
 * Initial values for creating a new workflow run using a POST request.
 * @export
 * @interface WorkflowRunPOST
 */
export interface WorkflowRunPOST {
    /**
     * The input data of the workflow run for specified workflow build ID.
     * @type {Array<string>}
     * @memberof WorkflowRunPOST
     */
    inputdata: Array<string>;

    /**
     * The output data of the workflow run for specified workflow build ID.
     * @type {Array<string>}
     * @memberof WorkflowRunPOST
     */
    outputdata: Array<string>;

    /**
     * The timeout in seconds of the workflow run for specified workflow build ID.
     * @type {number}
     * @memberof WorkflowRunPOST
     */
    timeoutsecs: number;

    /**
     * The description of the workflow run.
     * @type {string}
     * @memberof WorkflowRunPOST
     */
    description?: string;

    /**
     * The date and time the workflow run ended for specified workflow build ID.
     * @type {string}
     * @memberof WorkflowRunPOST
     */
    ended?: string;

    /**
     * The failure message of the workflow run for specified workflow build ID.
     * @type {string}
     * @memberof WorkflowRunPOST
     */
    failuremessage?: string;

    /**
     * A unique workflow Run ID.
     * @type {string}
     * @memberof WorkflowRunPOST
     */
    id?: string;

    /**
     * The workflow run name.
     * @type {string}
     * @memberof WorkflowRunPOST
     */
    name?: string;

    /**
     * The date and time the workflow run started for specified workflow build ID.
     * @type {string}
     * @memberof WorkflowRunPOST
     */
    started?: string;

    /**
     * The status of the workflow run for specified workflow build ID.
     * @type {string}
     * @memberof WorkflowRunPOST
     */
    status?: string;

    /**
     * A unique workflow build ID that is associated with the workflow run.
     * @type {string}
     * @memberof WorkflowRunPOST
     */
    workflowbuildid?: string;

    /**
     * The version of the workflow build that is assocaited with the workflow run.
     * @type {number}
     * @memberof WorkflowRunPOST
     */
    workflowbuildversion?: number;

}

