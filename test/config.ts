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
    playgroundHost: process.env.SPLUNK_CLOUD_HOST || 'https://api.playground.splunkbeta.com',
    playgroundTenant: process.env.TENANT_ID,
    playgroundAuthToken: process.env.BEARER_TOKEN,
    testNamespace: `jsnmspace${Date.now()}`,
    testCollection: `jscollecn${Date.now()}`,
    tenantCreationOn: (process.env.TENANT_CREATION === '1'),
};
