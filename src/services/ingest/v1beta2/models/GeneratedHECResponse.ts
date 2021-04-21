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

/**
 *
 * @export
 * @interface HECResponse
 */
export interface HECResponse {
    /**
     * code defines the status of the response. For a complete list of the possible error codes, see https://docs.splunk.com/Documentation/SplunkCloud/latest/Data/TroubleshootHTTPEventCollector#Possible_error_codes
     * @type {number}
     * @memberof HECResponse
     */
    code?: number;

    /**
     * invalid-event-number defines the index of the first event in error.
     * @type {number}
     * @memberof HECResponse
     */
    invalidEventNumber?: number;

    /**
     * text describes the response status
     * @type {string}
     * @memberof HECResponse
     */
    text?: string;

}

