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
 * OpenAPI spec version: v1beta2.32 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * GET  /collector/tokens/{tokenName} PUT  /collector/tokens/{tokenName}
 * @export
 * @interface HECTokenAccessResponse
 */
export interface HECTokenAccessResponse {
    /**
     * ack_enabled is set to true if events sent with the auth token should support indexer acknowledgement  type: bool
     * @type {boolean}
     * @memberof HECTokenAccessResponse
     */
    ackEnabled?: boolean;

    /**
     * allow_query_string_auth is set to true if this token can be passed into the ingest endpoint's query parameter for auth  type: bool
     * @type {boolean}
     * @memberof HECTokenAccessResponse
     */
    allowQueryStringAuth?: boolean;

    /**
     * created_at is a timestamp that captures when this token was created.  type: string format: date-time
     * @type {string}
     * @memberof HECTokenAccessResponse
     */
    createdAt?: string;

    /**
     * created_by is the principal that created the token.  type: string
     * @type {string}
     * @memberof HECTokenAccessResponse
     */
    createdBy?: string;

    /**
     * description is an optional description of the token.  type: string
     * @type {string}
     * @memberof HECTokenAccessResponse
     */
    description?: string;

    /**
     * disabled is set to true if this auth token has been disabled and cannot be used to send events to HECv1  type: bool
     * @type {boolean}
     * @memberof HECTokenAccessResponse
     */
    disabled?: boolean;

    /**
     * index is the default value of the index field for records collected using this token.  type: string
     * @type {string}
     * @memberof HECTokenAccessResponse
     */
    index?: string;

    /**
     * indexes is a list of index names that this token is allowed to send events to  type: []string
     * @type {Array<string>}
     * @memberof HECTokenAccessResponse
     */
    indexes?: Array<string>;

    /**
     * last_modified_at is a timestamp that captures when this token was last modified.  type: string format: date-time
     * @type {string}
     * @memberof HECTokenAccessResponse
     */
    lastModifiedAt?: string;

    /**
     * last_modified_by is the principal that last modified the token.  type: string
     * @type {string}
     * @memberof HECTokenAccessResponse
     */
    lastModifiedBy?: string;

    /**
     * name is the name of the token (unique within the tenant that it belongs to).  type: string
     * @type {string}
     * @memberof HECTokenAccessResponse
     */
    name?: string;

    /**
     * source is the default value of the source field for records collected using this token.  type: string
     * @type {string}
     * @memberof HECTokenAccessResponse
     */
    source?: string;

    /**
     * sourcetype is the default value of the sourcetype field for records collected using this token.  type: string
     * @type {string}
     * @memberof HECTokenAccessResponse
     */
    sourcetype?: string;

    /**
     * tenant is the tenant that this token belongs to  type: string
     * @type {string}
     * @memberof HECTokenAccessResponse
     */
    tenant?: string;

}

