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

import * as dotenv from 'dotenv';
import 'isomorphic-fetch';
/*
 * Do not touch this process type declaration unless
 * you're prepared to deal with tsc compiler issues with @types/node
 * when trying to use the following import as a replacement.
 *
 * import 'node';
 *
 * See https://stackoverflow.com/a/50235545/2785681
 */
declare var process: {
    env: {
        [key: string]: string;
    }
};

dotenv.config();

export default {
    stubbyHost: process.env.CI ? 'splunk-cloud-sdk-shared-stubby' : 'localhost',
    stubbyAuthToken: 'TEST_AUTH_TOKEN',
    stubbyTenant: 'TEST_TENANT',
    stubbyDevTestTenant: 'devtestTenant',
    stubbyTestCollection: 'testcollection0',
    invalidAuthToken: 'BAD_TOKEN',
    pkceUser: process.env.TEST_USERNAME,
    stagingApiHost: process.env.SPLUNK_CLOUD_API_HOST,
    stagingTenant: process.env.TENANT_ID,
    stagingAuthToken: process.env.BEARER_TOKEN,
    testNamespace: `jsnmspace${Date.now()}`,
    testCollection: `jscoll${Date.now()}`,
    testUsername: process.env.BACKEND_CLIENT_ID,
};
