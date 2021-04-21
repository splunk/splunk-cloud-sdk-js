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
 * POST /collector/tokens
 * @export
 * @interface HECTokenCreateResponse
 */
export interface HECTokenCreateResponse {
    /**
     * ack_enabled is set to true if events sent with the auth token should support indexer acknowledgement  type: bool
     * @type {boolean}
     * @memberof HECTokenCreateResponse
     */
    ackEnabled?: boolean;

    /**
     * allow_query_string_auth is set to true if this token can be passed into the ingest endpoint's query parameter for auth  type: bool
     * @type {boolean}
     * @memberof HECTokenCreateResponse
     */
    allowQueryStringAuth?: boolean;

    /**
     * created_at is a timestamp that captures when this token was created.  type: string format: date-time
     * @type {string}
     * @memberof HECTokenCreateResponse
     */
    createdAt?: string;

    /**
     * created_by is the principal that created the token.  type: string
     * @type {string}
     * @memberof HECTokenCreateResponse
     */
    createdBy?: string;

    /**
     * description is an optional description of the token.  type: string
     * @type {string}
     * @memberof HECTokenCreateResponse
     */
    description?: string;

    /**
     * disabled is set to true if this auth token has been disabled and cannot be used to send events to HECv1  type: bool
     * @type {boolean}
     * @memberof HECTokenCreateResponse
     */
    disabled?: boolean;

    /**
     * index is the default value of the index field for records collected using this token.  type: string
     * @type {string}
     * @memberof HECTokenCreateResponse
     */
    index?: string;

    /**
     * indexes is a list of index names that this token is allowed to send events to  type: []string
     * @type {Array<string>}
     * @memberof HECTokenCreateResponse
     */
    indexes?: Array<string>;

    /**
     * last_modified_at is a timestamp that captures when this token was last modified.  type: string format: date-time
     * @type {string}
     * @memberof HECTokenCreateResponse
     */
    lastModifiedAt?: string;

    /**
     * last_modified_by is the principal that last modified the token.  type: string
     * @type {string}
     * @memberof HECTokenCreateResponse
     */
    lastModifiedBy?: string;

    /**
     * name is the name of the token (unique within the tenant that it belongs to).  type: string
     * @type {string}
     * @memberof HECTokenCreateResponse
     */
    name?: string;

    /**
     * source is the default value of the source field for records collected using this token.  type: string
     * @type {string}
     * @memberof HECTokenCreateResponse
     */
    source?: string;

    /**
     * sourcetype is the default value of the sourcetype field for records collected using this token.  type: string
     * @type {string}
     * @memberof HECTokenCreateResponse
     */
    sourcetype?: string;

    /**
     * tenant is the tenant that this token belongs to.  type: string
     * @type {string}
     * @memberof HECTokenCreateResponse
     */
    tenant?: string;

    /**
     * token is the token value.  type: string
     * @type {string}
     * @memberof HECTokenCreateResponse
     */
    token?: string;

}

