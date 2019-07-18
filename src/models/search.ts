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
 */
export * from '../generated/search/v2beta1/models';

// TODO: commented out until Search service utility functions are fixed
// export interface FetchResultsRequest {
//     offset?: number;
//     count?: number;
//     /**
//      * A field to return for the result set. You can pass multiple fields of comma-separated values if multiple
//      * fields are required.
//      */
//     field?: string;
// }
//
// export interface ResultObservableOptions {
//     pollInterval?: number;
//     offset?: number;
//     count?: number;
//     field?: string;
// }
//
// export class SplunkSearchCancelError extends Error {
// }
//
// export interface ListEventsSummaryParams {
//     count?: number;
//     offset?: number;
//     field?: string;
//     earliest?: string;
//     latest?: string;
// }
//
// export interface ListFieldsSummaryParams {
//     earliest?: string;
//     latest?: string;
// }
