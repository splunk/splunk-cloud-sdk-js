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
import sleep = require('sleep-promise');
import { provisionerModels } from '../../provisioner';
import { SplunkCloud } from '../../splunk';
import config from '../config';

let testInviteID: string = '';
const tenantID = 'system';
const provTestTenantID = 'testprovisionersdks'; //  long-lived  and white-listed tenant

const splunk = new SplunkCloud({
    urls: {
        api: config.stagingApiHost,
        app: config.stagingAppsHost,
    },
    tokenSource: config.stagingAuthToken,
    defaultTenant: tenantID,
});

const provSplunk = new SplunkCloud({
    urls: {
        api: config.stagingApiHost,
        app: config.stagingAppsHost,
    },
    tokenSource: config.stagingAuthToken,
    defaultTenant: provTestTenantID,
});

// Scenario:
// Integration test for Provisioner endpoints
describe('integration tests for Provisioner Endpoints', () => {
    const bannedName = 'splunk';
    let testTenantInfo: provisionerModels.TenantInfo;

    it('should error on creating provisioner job', () => {
        return splunk.provisioner.createProvisionJob({ apps: [], tenant: bannedName } as provisionerModels.CreateProvisionJobBody)
            .then((provisionerJob: provisionerModels.ProvisionJobInfo) => {
                assert.fail('expected to fail because of banned word');

            }).catch(err => {
                assert.equal(err.httpStatusCode, 422);
            });
    });
    it('should error on getting non-existing provisioner job', () => {
        return splunk.provisioner.getProvisionJob('-1' as string)
            .then((provisionerJob: provisionerModels.ProvisionJobInfo) => {
                assert.fail('expected to fail because -1 job does not exist');

            }).catch(err => {
                assert.equal(err.httpStatusCode, 404);
            });
    });
    it('should successfully return an empty list when listing provision job(s)', () => {
        return splunk.provisioner.listProvisionJobs()
            .then((provisionerJobsList: provisionerModels.ProvisionJobs) => {
                assert.isNotNull(provisionerJobsList);
                assert.isArray(provisionerJobsList);
                assert.equal(provisionerJobsList.length, 0);
            });
    });
    it('should successfully return a tenant when getting an existing tenant', () => {
        return splunk.provisioner.getTenant(provTestTenantID as string)
            .then((tenantInfo: provisionerModels.TenantInfo) => {
                assert.isNotNull(tenantInfo);
                assert.equal(tenantInfo.name, provTestTenantID);
                testTenantInfo = tenantInfo;
            });
    });
    it('should successfully return a list of tenant(s) when listing tenant(s)', () => {
        return splunk.provisioner.listTenants()
            .then((tenants: provisionerModels.Tenants) => {
                assert.isNotNull(tenants);
                assert.isArray(tenants);
                assert(tenants.length > 0);

                let isFound: boolean = false;
                for (const tenant of tenants) {
                    if (tenant.name === provTestTenantID) {
                        isFound = true;
                    }
                }
                assert.isTrue(isFound);
                return sleep(2000); // Wait 2s before starting next test
            });
    });
    it.only('should successfully create an invite', () => {
        return provSplunk.provisioner.createInvite({ email: 'bounce@simulator.amazonses.com', groups: [], comment: 'SDK invite' })
            .then((invite: provisionerModels.InviteInfo) => {
                assert.isNotNull(invite);
                assert.equal(invite.tenant, provTestTenantID);
                assert.equal(invite.email, 'bounce@simulator.amazonses.com');
                testInviteID = invite.inviteID;
            });
    });
    it.only('should successfully return the invite when getting an existing invite', () => {
        return provSplunk.provisioner.getInvite(testInviteID)
            .then((invite: provisionerModels.InviteInfo) => {
                assert.isNotNull(invite);
                assert.equal(invite.inviteID, testInviteID);
                assert.equal(invite.tenant, provTestTenantID);
            });
    });
    it.only('should successfully return the invite when listing all existing invites', () => {
        return provSplunk.provisioner.listInvites()
            .then((invitesList: provisionerModels.Invites) => {
                assert.isNotNull(invitesList);
                assert.isArray(invitesList);
                assert.ok(invitesList.length);

                let isFound: boolean = false;
                for (const invite of invitesList) {
                    if (invite.inviteID === testInviteID) {
                        isFound = true;
                    }
                }
                assert.isTrue(isFound);
            });
    });
    it.only('should successfully resend the invite when updating an existing invite', () => {
        return provSplunk.provisioner.updateInvite(testInviteID, { action: provisionerModels.UpdateInviteBodyActionEnum.Resend })
            .then((invite: provisionerModels.InviteInfo) => {
                assert.isNotNull(invite);
                assert.equal(invite.inviteID, testInviteID);
            });
    });
    it.only('should successfully delete the invite', () => {
        return provSplunk.provisioner.deleteInvite(testInviteID)
            .then(response => {
                assert.isEmpty(response);
            });
    });
});