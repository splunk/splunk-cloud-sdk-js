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
 */
export enum AppResourceKind {
    Web = 'web',
    Native = 'native',
    Service = 'service'
}

export function AppResourceKindFromJSON(json: any): AppResourceKind {
    return json as AppResourceKind;
}

export function AppResourceKindToJSON(value?: AppResourceKind): any {
    return value as any;
}

