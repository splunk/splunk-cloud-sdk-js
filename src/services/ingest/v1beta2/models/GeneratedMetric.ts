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
 * Ingest API
 * Use the Ingest service in Splunk Cloud Services to send event and metrics data, or upload a static file, to Splunk Cloud Services.
 *
 * OpenAPI spec version: v1beta2.32 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface Metric
 */
export interface Metric {
    /**
     * Name of the metric e.g. CPU, Memory etc.
     * @type {string}
     * @memberof Metric
     */
    name: string;

    /**
     * Dimensions allow metrics to be classified e.g. {\"Server\":\"nginx\", \"Region\":\"us-west-1\", ...}
     * @type {{ [key: string]: string; }}
     * @memberof Metric
     */
    dimensions?: { [key: string]: string; };

    /**
     * Type of metric. Default is g for gauge.
     * @type {string}
     * @memberof Metric
     */
    type?: string;

    /**
     * Unit of the metric e.g. percent, megabytes, seconds etc.
     * @type {string}
     * @memberof Metric
     */
    unit?: string;

    /**
     * Value of the metric. If not specified, it will be defaulted to 0.
     * @type {number}
     * @memberof Metric
     */
    value?: number;

}

