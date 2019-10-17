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
 * Action Service
 * With the Splunk Cloud Action service, you can receive incoming trigger events and use pre-defined action templates to turn these events into meaningful actions. 
 *
 * OpenAPI spec version: v2alpha1.10 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    ActionKind,
} from './';

/**
 *
 * @export
 * @interface AppMessageAction
 */
export interface AppMessageAction {
    /**
     * 
     * @type {ActionKind}
     * @memberof AppMessageAction
     */
    kind: ActionKind;

    /**
     * The name of the action, as one or more identifier strings separated by periods. Each identifier string consists of lowercase letters, digits, and underscores, and cannot start with a digit.
     * @type {string}
     * @memberof AppMessageAction
     */
    name: string;

    /**
     * The title to be displayed for the message.
     * @type {string}
     * @memberof AppMessageAction
     */
    title: string;

    /**
     * The date and time this action template was created (ISO-8601 date/time with zone).
     * @type {string}
     * @memberof AppMessageAction
     */
    readonly createdAt?: string;

    /**
     * The principal that created this action template.
     * @type {string}
     * @memberof AppMessageAction
     */
    readonly createdBy?: string;

    /**
     * The icon URL to be displayed along with the message.
     * @type {string}
     * @memberof AppMessageAction
     */
    iconURL?: string;

    /**
     * Call to action link for this message.
     * @type {string}
     * @memberof AppMessageAction
     */
    link?: string;

    /**
     * The main message that user needs to receive.
     * @type {string}
     * @memberof AppMessageAction
     */
    message?: string;

    /**
     * The date and time this action template was updated (ISO-8601 date/time with zone).
     * @type {string}
     * @memberof AppMessageAction
     */
    readonly updatedAt?: string;

    /**
     * The principal that updated this action template.
     * @type {string}
     * @memberof AppMessageAction
     */
    readonly updatedBy?: string;

}

