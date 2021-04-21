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
 * Ingest API
 * Use the Ingest service in Splunk Cloud Services to send event and metrics data, or upload a static file, to Splunk Cloud Services.
 *
 * OpenAPI spec version: v1beta2.17 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    Metric,
    MetricAttribute,
} from './';

/**
 *
 * @export
 * @interface MetricEvent
 */
export interface MetricEvent {
    /**
     * Specifies multiple related metrics e.g. Memory, CPU etc.
     * @type {Array<Metric>}
     * @memberof MetricEvent
     */
    body: Array<Metric>;

    /**
     * 
     * @type {MetricAttribute}
     * @memberof MetricEvent
     */
    attributes?: MetricAttribute;

    /**
     * The host value assigned to the event data. Typically, this is the hostname of the client from which you are sending data.
     * @type {string}
     * @memberof MetricEvent
     */
    host?: string;

    /**
     * An optional ID that uniquely identifies the metric data. It is used to deduplicate the data if same data is set multiple times. If ID is not specified, it will be assigned by the system.
     * @type {string}
     * @memberof MetricEvent
     */
    id?: string;

    /**
     * Optional nanoseconds part of the timestamp.
     * @type {number}
     * @memberof MetricEvent
     */
    nanos?: number;

    /**
     * The source value to assign to the event data. For example, if you are sending data from an app that you are developing, set this key to the name of the app.
     * @type {string}
     * @memberof MetricEvent
     */
    source?: string;

    /**
     * The sourcetype value assigned to the event data.
     * @type {string}
     * @memberof MetricEvent
     */
    sourcetype?: string;

    /**
     * Epoch time in milliseconds.
     * @type {number}
     * @memberof MetricEvent
     */
    timestamp?: number;

}

