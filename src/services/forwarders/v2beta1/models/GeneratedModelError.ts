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
 * Splunk Forwarder Service
 * Send data from a Splunk forwarder to the Splunk Forwarder service in Splunk Cloud Services.
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
 * @interface ModelError
 */
export interface ModelError {
    /**
     * 
     * @type {string}
     * @memberof ModelError
     */
    code?: string;

    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof ModelError
     */
    details?: { [key: string]: any; };

    /**
     * 
     * @type {string}
     * @memberof ModelError
     */
    message?: string;

}

