// tslint:disable
/**
 * Copyright 2020 Splunk, Inc.
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
 * Data Stream Processing REST API
 * Use the Streams service to perform create, read, update, and delete (CRUD) operations on your data pipeline. The Streams service also has metrics and preview session endpoints and gives you full control over your data pipeline.
 *
 * OpenAPI spec version: v2beta1.4 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface SplCompileRequest
 */
export interface SplCompileRequest {
    /**
     * The SPL2 representation of a pipeline or function parameters.
     * @type {string}
     * @memberof SplCompileRequest
     */
    spl: string;

    /**
     * The parse parameters as arguments to this SPL2 command
     * @type {string}
     * @memberof SplCompileRequest
     */
    syntax?: SplCompileRequestSyntaxEnum;

    /**
     * A boolean flag to indicate whether the pipeline should be validated.
     * @type {boolean}
     * @memberof SplCompileRequest
     */
    validate?: boolean;

}

/**
 * @export
 */
export enum SplCompileRequestSyntaxEnum {
    UPL = 'UPL',
    DSL = 'DSL',
    SPL = 'SPL',
    EVAL = 'EVAL',
    WHERE = 'WHERE',
    TIMECHART = 'TIMECHART',
    FIELDS = 'FIELDS',
    MVEXPAND = 'MVEXPAND',
    REX = 'REX',
    BIN = 'BIN',
    RENAME = 'RENAME',
    STATS = 'STATS',
    STATSBY = 'STATS_BY',
    SELECT = 'SELECT',
    EXPRESSION = 'EXPRESSION',
    FUNCTION = 'FUNCTION',
    LITERAL = 'LITERAL',
    UNKNOWN = 'UNKNOWN'
}

