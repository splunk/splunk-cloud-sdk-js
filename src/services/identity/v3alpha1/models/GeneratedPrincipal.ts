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
 * Identity
 * With the Identity service in Splunk Cloud Services, you can authenticate and authorize Splunk Cloud Services users.
 *
 * OpenAPI spec version: v3alpha1.1 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    PrincipalKind,
    PrincipalProfile,
} from './';

/**
 *
 * @export
 * @interface Principal
 */
export interface Principal {
    /**
     * 
     * @type {string}
     * @memberof Principal
     */
    name: string;

    /**
     * 
     * @type {string}
     * @memberof Principal
     */
    createdAt?: string;

    /**
     * 
     * @type {string}
     * @memberof Principal
     */
    createdBy?: string;

    /**
     * 
     * @type {PrincipalKind}
     * @memberof Principal
     */
    kind?: PrincipalKind;

    /**
     * 
     * @type {PrincipalProfile}
     * @memberof Principal
     */
    profile?: PrincipalProfile;

    /**
     * 
     * @type {Array<string>}
     * @memberof Principal
     */
    tenants?: Array<string>;

    /**
     * 
     * @type {string}
     * @memberof Principal
     */
    updatedAt?: string;

    /**
     * 
     * @type {string}
     * @memberof Principal
     */
    updatedBy?: string;

}

