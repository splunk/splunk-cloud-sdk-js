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
 * App Registry
 * With the App Registry service in Splunk Cloud Services, you can create, update, and manage your apps.
 *
 * OpenAPI spec version: v1beta2.0 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface UpdateAppRequest
 */
export interface UpdateAppRequest {
    /**
     * Array of permission templates that are used to grant permission to the app principal when a tenant subscribes.
     * @type {Array<string>}
     * @memberof UpdateAppRequest
     */
    appPrincipalPermissions?: Array<string>;

    /**
     * Short paragraph describing the app.
     * @type {string}
     * @memberof UpdateAppRequest
     */
    description?: string;

    /**
     * The URL used to log in to the app.
     * @type {string}
     * @memberof UpdateAppRequest
     */
    loginUrl?: string;

    /**
     * The URL used to display the app's logo.
     * @type {string}
     * @memberof UpdateAppRequest
     */
    logoUrl?: string;

    /**
     * Array of URLs that can be used for redirect after logging into the app.
     * @type {Array<string>}
     * @memberof UpdateAppRequest
     */
    redirectUrls?: Array<string>;

    /**
     * URL to redirect to after a subscription is created.
     * @type {string}
     * @memberof UpdateAppRequest
     */
    setupUrl?: string;

    /**
     * Human-readable title for the app.
     * @type {string}
     * @memberof UpdateAppRequest
     */
    title?: string;

    /**
     * Array of permission filter templates that are used to intersect with a user's permissions when using the app.
     * @type {Array<string>}
     * @memberof UpdateAppRequest
     */
    userPermissionsFilter?: Array<string>;

    /**
     * URL that webhook events are sent to.
     * @type {string}
     * @memberof UpdateAppRequest
     */
    webhookUrl?: string;

}

