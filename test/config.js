require("babel-core/register");
require("babel-polyfill");
require("isomorphic-fetch")

module.exports = {
    stubbyHost: process.env.CI ? "ssc-sdk-shared-stubby" : "localhost",
    stubbyAuthToken: "TEST_AUTH_TOKEN", // TODO (Parul): Generate a valid auth token on-the-fly
    stubbyTenant: "TEST_TENANT",
    stubbyDevTestTenant: "devtestTenant",
    invalidAuthToken: "BAD_TOKEN",
    playgroundHost: process.env.SSC_HOST || "https://api.playground.splunkbeta.com",
    playgroundTenant: process.env.TENANT_ID,
    playgroundAuthToken: process.env.BEARER_TOKEN
};
