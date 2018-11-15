require('isomorphic-fetch');

module.exports = {
    stubbyHost: process.env.CI ? 'splunk-cloud-sdk-shared-stubby' : 'localhost',
    stubbyAuthToken: 'TEST_AUTH_TOKEN', // TODO (Parul): Generate a valid auth token on-the-fly
    stubbyTenant: 'TEST_TENANT',
    stubbyDevTestTenant: 'devtestTenant',
    stubbyTestCollection: 'testcollection0',
    invalidAuthToken: 'BAD_TOKEN',
    stagingApiHost: process.env.SPLUNK_CLOUD_API_HOST || 'https://api.staging.splunkbeta.com',
    stagingAppsHost: process.env.SPLUNK_CLOUD_APPS_HOST || 'https://apps.staging.splunkbeta.com',
    stagingTenant: process.env.TENANT_ID,
    stagingAuthToken: process.env.BEARER_TOKEN,
    testNamespace: `jsnmspace${Date.now()}`,
    testCollection: `jscollecn${Date.now()}`,
    tenantCreationOn: (process.env.TENANT_CREATION === "1"),
};
