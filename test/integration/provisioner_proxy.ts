import { assert } from 'chai';
import 'mocha';
import sleep = require('sleep-promise');
import { provisionerModels } from '../../provisioner';
import { SplunkCloud } from '../../splunk';
import config from '../config';

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
});
