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
 * Splunk Search service
 * Use the Search service in Splunk Cloud Services to dispatch, review, and manage searches and search jobs. You can finalize or cancel jobs, retrieve search results, and request search-related configurations from the Metadata Catalog service in Splunk Cloud Services.
 *
 * OpenAPI spec version: v3alpha1 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    Module,
    SingleStatementQueryParameters,
} from './';

/**
 * A fully-constructed multi-statement Module, including read-only fields.
 * @export
 * @interface SearchModule
 */
export interface SearchModule {
    /**
     * Multi-statement module with inter-dependencies between statements. Statements are separated by semicolons.
     * @type {string}
     * @memberof SearchModule
     */
    module?: string;

    /**
     * The namespace to run the search in. The default namespace is used if a namespace is not specified.
     * @type {string}
     * @memberof SearchModule
     */
    namespace?: string;

    /**
     * The parameters on the search statement, such as 'earliest' and 'latest. The request can specify a \"defaults\" set of statement queryParameters which override the system default queryParameters. Each export statement requires to have a statement queryParameters in the object, it can be empty if there is no override. 
     * @type {{ [key: string]: SingleStatementQueryParameters; }}
     * @memberof SearchModule
     */
    queryParameters?: { [key: string]: SingleStatementQueryParameters; };

    /**
     * WIP (Work in progress) modules which are used in the module's search statements, but not yet registered . 
     * @type {{ [key: string]: Module; }}
     * @memberof SearchModule
     */
    wipModules?: { [key: string]: Module; };

}

