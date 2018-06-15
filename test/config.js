require("babel-core/register");
require("babel-polyfill");

module.exports = {
    host: process.env.CI ? "ssc-sdk-shared-stubby" : "localhost",
    authToken: "TEST_AUTH_TOKEN", // TODO (Parul): Generate a valid auth token on-the-fly
    invalidAuthToken: "TEST_INVALID_AUTH_TOKEN",
    novaHost: "http://gateway.splunknovadev-playground.com:443",
    testTenant: "ssc-sdk-06152018" // TODO (Parul): Generate a valid tenant on-the-fly
};
