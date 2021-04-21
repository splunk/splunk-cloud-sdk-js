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
 * Collect Service
 * With the Collect service in Splunk Cloud Services, you can manage how data collection jobs ingest event and metric data.
 *
 * OpenAPI spec version: v1beta1.8 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface BaseJob
 */
export interface BaseJob {
    /**
     * The ID of the connector used in the job.
     * @type {string}
     * @memberof BaseJob
     */
    connectorID: string;

    /**
     * 
     * @type {string}
     * @memberof BaseJob
     */
    name: string;

    /**
     * The cron schedule, in UTC time format.
     * @type {string}
     * @memberof BaseJob
     */
    schedule: string;

    /**
     * 
     * @type {string}
     * @memberof BaseJob
     */
    readonly createUserID?: string;

    /**
     * 
     * @type {string}
     * @memberof BaseJob
     */
    readonly createdAt?: string;

    /**
     * 
     * @type {string}
     * @memberof BaseJob
     */
    readonly id?: string;

    /**
     * 
     * @type {string}
     * @memberof BaseJob
     */
    readonly lastModifiedAt?: string;

    /**
     * 
     * @type {string}
     * @memberof BaseJob
     */
    readonly lastUpdateUserID?: string;

    /**
     * Defines whether a job is scheduled or not
     * @type {boolean}
     * @memberof BaseJob
     */
    scheduled?: boolean;

    /**
     * 
     * @type {string}
     * @memberof BaseJob
     */
    readonly tenant?: string;

}

