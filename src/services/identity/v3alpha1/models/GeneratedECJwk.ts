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
 * OpenAPI spec version: v3alpha1.4 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface ECJwk
 */
export interface ECJwk {
    /**
     * 
     * @type {string}
     * @memberof ECJwk
     */
    alg?: ECJwkAlgEnum;

    /**
     * 
     * @type {string}
     * @memberof ECJwk
     */
    crv?: string;

    /**
     * 
     * @type {string}
     * @memberof ECJwk
     */
    d?: string;

    /**
     * 
     * @type {string}
     * @memberof ECJwk
     */
    kid?: string;

    /**
     * 
     * @type {string}
     * @memberof ECJwk
     */
    kty?: ECJwkKtyEnum;

    /**
     * 
     * @type {string}
     * @memberof ECJwk
     */
    x?: string;

    /**
     * 
     * @type {string}
     * @memberof ECJwk
     */
    y?: string;

}

/**
 * @export
 */
export enum ECJwkAlgEnum {
    ES256 = 'ES256',
    ES384 = 'ES384',
    ES512 = 'ES512'
}

/**
 * @export
 */
export enum ECJwkKtyEnum {
    EC = 'EC'
}

