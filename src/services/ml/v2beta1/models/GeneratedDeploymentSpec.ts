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
 * Machine Learning
 * Use the Machine Learning service in Splunk Cloud Services to deliver resource intensive machine learning workloads. The Machine Learning service covers model experimentation, training, inference, validation, scoring, and serving.
 *
 * OpenAPI spec version: v2beta1.1 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface DeploymentSpec
 */
export interface DeploymentSpec {
    /**
     * CPU Resource limit for each container in a deployment.
     * @type {string}
     * @memberof DeploymentSpec
     */
    cpuLimit?: string;

    /**
     * CPU Resource limit for serving requests.
     * @type {string}
     * @memberof DeploymentSpec
     */
    cpuRequest?: string;

    /**
     * Memory Resource limit for each container in a deployment.
     * @type {string}
     * @memberof DeploymentSpec
     */
    memoryLimit?: string;

    /**
     * Memory Resource limit for serving requests.
     * @type {string}
     * @memberof DeploymentSpec
     */
    memoryRequest?: string;

    /**
     * Create replicated pods in a deployment.
     * @type {number}
     * @memberof DeploymentSpec
     */
    replicas?: number;

}
