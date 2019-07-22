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
 * App Registry
 * With the Splunk Cloud App Registry service, you can create, update, and manage apps built with Splunk Developer Cloud.
 *
 * OpenAPI spec version: v1beta2.0
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    AppResourceKind,
} from './';

/**
 *
 * @export
 * @interface AppResponseGetList
 */
export interface AppResponseGetList {
    /**
     * OAuth 2.0 Client ID.
     * @type {string}
     * @memberof AppResponseGetList
     */
    readonly clientId: string;
    /**
     * The date that the app was created.
     * @type {string}
     * @memberof AppResponseGetList
     */
    readonly createdAt: string;
    /**
     * The principal who created this app.
     * @type {string}
     * @memberof AppResponseGetList
     */
    readonly createdBy: string;
    /**
     * 
     * @type {AppResourceKind}
     * @memberof AppResponseGetList
     */
    kind: AppResourceKind;
    /**
     * App name that is unique within Splunk Cloud Platform.
     * @type {string}
     * @memberof AppResponseGetList
     */
    name: string;
    /**
     * Human-readable title for the app.
     * @type {string}
     * @memberof AppResponseGetList
     */
    title: string;
    /**
     * Array of permission templates that are used to grant permission to the app principal when a tenant subscribes.
     * @type {Array<string>}
     * @memberof AppResponseGetList
     */
    appPrincipalPermissions?: Array<string>;
    /**
     * Short paragraph describing the app.
     * @type {string}
     * @memberof AppResponseGetList
     */
    description?: string;
    /**
     * The URL used to log in to the app.
     * @type {string}
     * @memberof AppResponseGetList
     */
    loginUrl?: string;
    /**
     * The URL used to display the app's logo.
     * @type {string}
     * @memberof AppResponseGetList
     */
    logoUrl?: string;
    /**
     * Array of URLs that can be used for redirect after logging into the app.
     * @type {Array<string>}
     * @memberof AppResponseGetList
     */
    redirectUrls?: Array<string>;
    /**
     * URL to redirect to after a subscription is created.
     * @type {string}
     * @memberof AppResponseGetList
     */
    setupUrl?: string;
    /**
     * Array of permission filter templates that are used to intersect with a user's permissions when using the app.
     * @type {Array<string>}
     * @memberof AppResponseGetList
     */
    userPermissionsFilter?: Array<string>;
    /**
     * URL that webhook events are sent to.
     * @type {string}
     * @memberof AppResponseGetList
     */
    webhookUrl?: string;
}
