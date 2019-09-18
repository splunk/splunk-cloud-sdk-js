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

import { assert } from 'chai';
import 'mocha';
import {
    ActionKind,
    ActionResult, ActionTriggerResponse,
    EmailAction,
    RawJSONPayload,
    TriggerEvent,
    TriggerEventKind, WebhookAction
} from '../../services/action';
import { SplunkCloud } from '../../src/splunk';
import config from '../config';

const tenantID = config.stagingTenant;

const splunkCloud = new SplunkCloud({
    urls: {
        api: config.stagingApiHost,
        app: config.stagingAppsHost,
    },
    tokenSource: config.stagingAuthToken,
    defaultTenant: tenantID,
});

describe('integration tests using collect service', () => {
    it('should create action', () =>
        splunkCloud.collect.listJobs().then(response => {
            if (response.data !== undefined) {
                assert.isTrue(response.data.length >= 0);
            }
            // Since the spec lists that the result may be empty, we may
            // get that if we have no jobs. We won't get here on an error
            // though.
        }));
});
