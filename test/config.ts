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

export default {
    stubbyHost: process.env.CI ? 'splunk-cloud-sdk-shared-stubby' : 'localhost',
    stubbyAuthToken: 'TEST_AUTH_TOKEN',
    stubbyTenant: 'TEST_TENANT',
    stubbyDevTestTenant: 'devtestTenant',
    stubbyTestCollection: 'testcollection0',
    invalidAuthToken: 'BAD_TOKEN',
    stagingApiHost: process.env.SPLUNK_CLOUD_API_HOST || 'https://api.staging.scp.splunk.com',
    stagingAppsHost: process.env.SPLUNK_CLOUD_APPS_HOST || 'https://apps.staging.scp.splunk.com',
    stagingTenant: process.env.TENANT_ID,
    stagingMLTenant: process.env.ML_TENANT_ID,
    stagingAuthToken: process.env.BEARER_TOKEN,
    testNamespace: `jsnmspace${Date.now()}`,
    testCollection: `jscoll${Date.now()}`,
    testUsername: process.env.BACKEND_CLIENT_ID,
    tenantCreationOn: (process.env.TENANT_CREATION === '1'),
};
