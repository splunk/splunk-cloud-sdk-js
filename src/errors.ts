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

export function buildSplunkError(errorParams: SplunkErrorParams | string) {
    if (typeof errorParams === 'string') {
        return new SplunkError(errorParams);
    }

    switch (errorParams.httpStatusCode) {
        case 401:
            return new SplunkUnauthorizedError(errorParams);
        case 500:
            return new SplunkServerError(errorParams);
        default:
            return new SplunkError(errorParams);
    }
}

export interface SplunkErrorParams {
    message: string;
    code?: string;
    httpStatusCode?: number;
    details?: any | any[];
    moreInfo?: string;
}

export class SplunkError extends Error implements SplunkErrorParams {
    public code?: string;
    public httpStatusCode?: number;
    public details?: object | any[];
    public moreInfo?: string;

    constructor(errorParams: SplunkErrorParams | string) {
        super(typeof errorParams === 'string' ? errorParams : JSON.stringify(errorParams));
        if (typeof errorParams !== 'string') {
            this.message = errorParams.message || this.message;
            this.code = errorParams.code;
            this.details = errorParams.details;
            this.moreInfo = errorParams.moreInfo;
            this.httpStatusCode = errorParams.httpStatusCode;
        }
    }
}

export class SplunkServerError extends SplunkError implements SplunkErrorParams {
    constructor(errorParams: SplunkErrorParams | string) {
        super(errorParams);
    }
}

export class SplunkUnauthorizedError extends SplunkError implements SplunkErrorParams {
    constructor(errorParams: SplunkErrorParams | string) {
        super(errorParams);
    }
}
