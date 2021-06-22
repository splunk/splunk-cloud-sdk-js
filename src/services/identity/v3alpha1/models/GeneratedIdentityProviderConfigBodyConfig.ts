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
 * OpenAPI spec version: v3alpha1.3 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface IdentityProviderConfigBodyConfig
 */
export interface IdentityProviderConfigBodyConfig {
    /**
     * 
     * @type {string}
     * @memberof IdentityProviderConfigBodyConfig
     */
    certificate?: string;

    /**
     * 
     * @type {string}
     * @memberof IdentityProviderConfigBodyConfig
     */
    emailAttribute?: string;

    /**
     * 
     * @type {string}
     * @memberof IdentityProviderConfigBodyConfig
     */
    entityDescriptor?: string;

    /**
     * 
     * @type {string}
     * @memberof IdentityProviderConfigBodyConfig
     */
    firstNameAttribute?: string;

    /**
     * 
     * @type {string}
     * @memberof IdentityProviderConfigBodyConfig
     */
    lastNameAttribute?: string;

    /**
     * 
     * @type {string}
     * @memberof IdentityProviderConfigBodyConfig
     */
    method?: IdentityProviderConfigBodyConfigMethodEnum;

    /**
     * 
     * @type {string}
     * @memberof IdentityProviderConfigBodyConfig
     */
    singleSignOnServiceUrl?: string;

}

/**
 * @export
 */
export enum IdentityProviderConfigBodyConfigMethodEnum {
    Post = 'post',
    Redirect = 'redirect'
}

