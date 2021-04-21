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
 * @interface Subscription
 */
export interface Subscription {
    /**
     * App name.
     * @type {string}
     * @memberof Subscription
     */
    readonly appName: string;

    /**
     * Time of subscription creation (UTC).
     * @type {string}
     * @memberof Subscription
     */
    readonly createdAt: string;

    /**
     * The user who created the subscription.
     * @type {string}
     * @memberof Subscription
     */
    readonly createdBy: string;

    /**
     * Short paragraph describing the app.
     * @type {string}
     * @memberof Subscription
     */
    readonly description: string;

    /**
     * URL used to login to the app.
     * @type {string}
     * @memberof Subscription
     */
    readonly loginUrl: string;

    /**
     * The URL used to display the app's logo.
     * @type {string}
     * @memberof Subscription
     */
    readonly logoUrl: string;

    /**
     * Human-readable name for the application.
     * @type {string}
     * @memberof Subscription
     */
    readonly title: string;

    /**
     * The tenant that is subscribed to the app.
     * @type {string}
     * @memberof Subscription
     */
    readonly tenant?: string;

}

