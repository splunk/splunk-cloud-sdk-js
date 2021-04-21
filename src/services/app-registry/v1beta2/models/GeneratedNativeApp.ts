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

import {
    AppResourceKind,
} from './';

/**
 * A native kind app.
 * @export
 * @interface NativeApp
 */
export interface NativeApp {
    /**
     * OAuth 2.0 Client ID.
     * @type {string}
     * @memberof NativeApp
     */
    readonly clientId: string;

    /**
     * The date that the app was created.
     * @type {string}
     * @memberof NativeApp
     */
    readonly createdAt: string;

    /**
     * The principal who created this app.
     * @type {string}
     * @memberof NativeApp
     */
    readonly createdBy: string;

    /**
     * 
     * @type {AppResourceKind}
     * @memberof NativeApp
     */
    kind: AppResourceKind;

    /**
     * App name that is unique within Splunk Cloud Platform.
     * @type {string}
     * @memberof NativeApp
     */
    name: string;

    /**
     * Human-readable title for the app.
     * @type {string}
     * @memberof NativeApp
     */
    title: string;

    /**
     * Array of permission templates that are used to grant permission to the app principal when a tenant subscribes.
     * @type {Array<string>}
     * @memberof NativeApp
     */
    appPrincipalPermissions?: Array<string>;

    /**
     * Short paragraph describing the app.
     * @type {string}
     * @memberof NativeApp
     */
    description?: string;

    /**
     * The URL used to log in to the app.
     * @type {string}
     * @memberof NativeApp
     */
    loginUrl?: string;

    /**
     * The URL used to display the app's logo.
     * @type {string}
     * @memberof NativeApp
     */
    logoUrl?: string;

    /**
     * Array of URLs that can be used for redirect after logging into the app.
     * @type {Array<string>}
     * @memberof NativeApp
     */
    redirectUrls?: Array<string>;

    /**
     * URL to redirect to after a subscription is created.
     * @type {string}
     * @memberof NativeApp
     */
    setupUrl?: string;

    /**
     * Array of permission filter templates that are used to intersect with a user's permissions when using the app.
     * @type {Array<string>}
     * @memberof NativeApp
     */
    userPermissionsFilter?: Array<string>;

    /**
     * URL that webhook events are sent to.
     * @type {string}
     * @memberof NativeApp
     */
    webhookUrl?: string;

}

