require("babel-core/register");
require("babel-polyfill");

module.exports = {
    stubbyHost: process.env.CI ? "ssc-sdk-shared-stubby" : "localhost",
    stubbyAuthToken: "TEST_AUTH_TOKEN", // TODO (Parul): Generate a valid auth token on-the-fly
    invalidAuthToken: "TEST_INVALID_AUTH_TOKEN",
    novaHost: process.env.SSC_HOST || "https://api.playground.splunkbeta.com",
    testTenant: "ssc-sdk-06152018" // TODO (Parul): Generate a valid tenant on-the-fly
};
