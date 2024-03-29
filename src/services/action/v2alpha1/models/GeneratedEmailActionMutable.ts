// tslint:disable
/**
 * Copyright 2022 Splunk, Inc.
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
 * OpenAPI spec version: v2alpha1.12 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface EmailActionMutable
 */
export interface EmailActionMutable {
    /**
     * An array of email addresses to include as recipients. Requires a special permission set for use. Please DO NOT include actual bouncing emails in automated testing. 
     * @type {Array<string>}
     * @memberof EmailActionMutable
     */
    addresses?: Array<string>;

    /**
     * HTML content to send as the body of the email. You can use a template in this field.
     * @type {string}
     * @memberof EmailActionMutable
     */
    body?: string;

    /**
     * Optional text to send as the text/plain part of the email. If this field is not set for an email action, the Action service converts the value from the body field to text and sends that as the text/plain part when triggering the action. You can use a template in this field.
     * @type {string}
     * @memberof EmailActionMutable
     */
    bodyPlainText?: string;

    /**
     * Optional text providing a human-friendly name for the sender. Must be less than or equal to 81 characters. You can use a template in this field.
     * @type {string}
     * @memberof EmailActionMutable
     */
    fromName?: string;

    /**
     * An array of tenant member names, whose profile email addresses will be included as recipients.
     * @type {Array<string>}
     * @memberof EmailActionMutable
     */
    members?: Array<string>;

    /**
     * The subject of the email. You can use a template in this field.
     * @type {string}
     * @memberof EmailActionMutable
     */
    subject?: string;

    /**
     * A human-readable title for the action. Must be less than or equal to 128 characters.
     * @type {string}
     * @memberof EmailActionMutable
     */
    title?: string;

}

