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
 * Identity
 * With the Identity service in Splunk Cloud Services, you can authenticate and authorize Splunk Cloud Services users.
 *
 * OpenAPI spec version: v3.6 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface IdentityProviderBodyConfig
 */
export interface IdentityProviderBodyConfig {
    /**
     * 
     * @type {string}
     * @memberof IdentityProviderBodyConfig
     */
    certificate: string;

    /**
     * 
     * @type {string}
     * @memberof IdentityProviderBodyConfig
     */
    email_attribute: string;

    /**
     * 
     * @type {string}
     * @memberof IdentityProviderBodyConfig
     */
    entity_descriptor: string;

    /**
     * 
     * @type {string}
     * @memberof IdentityProviderBodyConfig
     */
    method: IdentityProviderBodyConfigMethodEnum;

    /**
     * 
     * @type {string}
     * @memberof IdentityProviderBodyConfig
     */
    single_sign_on_service_url: string;

    /**
     * 
     * @type {string}
     * @memberof IdentityProviderBodyConfig
     */
    first_name_attribute?: string;

    /**
     * 
     * @type {string}
     * @memberof IdentityProviderBodyConfig
     */
    last_name_attribute?: string;

}

/**
 * @export
 */
export enum IdentityProviderBodyConfigMethodEnum {
    Post = 'post',
    Redirect = 'redirect'
}

