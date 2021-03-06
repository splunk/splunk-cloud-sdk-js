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
 * Machine Learning
 * Use the Machine Learning service in Splunk Cloud Services to deliver resource intensive machine learning workloads. The Machine Learning service covers model experimentation, training, inference, validation, scoring, and serving.
 *
 * OpenAPI spec version: v2beta1.1 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    DeploymentSpec,
    InputStream,
    OutputStream,
    WorkflowBuild,
} from './';

/**
 *
 * @export
 * @interface WorkflowStreamDeployment
 */
export interface WorkflowStreamDeployment {
    /**
     * 
     * @type {InputStream}
     * @memberof WorkflowStreamDeployment
     */
    input: InputStream;

    /**
     * 
     * @type {OutputStream}
     * @memberof WorkflowStreamDeployment
     */
    output: OutputStream;

    /**
     * 
     * @type {string}
     * @memberof WorkflowStreamDeployment
     */
    readonly creationTime?: string;

    /**
     * 
     * @type {string}
     * @memberof WorkflowStreamDeployment
     */
    readonly endTime?: string;

    /**
     * 
     * @type {string}
     * @memberof WorkflowStreamDeployment
     */
    readonly id?: string;

    /**
     * 
     * @type {string}
     * @memberof WorkflowStreamDeployment
     */
    name?: string;

    /**
     * 
     * @type {DeploymentSpec}
     * @memberof WorkflowStreamDeployment
     */
    spec?: DeploymentSpec;

    /**
     * 
     * @type {string}
     * @memberof WorkflowStreamDeployment
     */
    readonly startTime?: string;

    /**
     * 
     * @type {string}
     * @memberof WorkflowStreamDeployment
     */
    readonly status?: WorkflowStreamDeploymentStatusEnum;

    /**
     * 
     * @type {WorkflowBuild}
     * @memberof WorkflowStreamDeployment
     */
    workflowBuild?: WorkflowBuild;

}

/**
 * @export
 */
export enum WorkflowStreamDeploymentStatusEnum {
    Running = 'running',
    Failed = 'failed',
    Success = 'success',
    Scheduled = 'scheduled',
    Initializing = 'initializing'
}

