module.exports = {
    host: process.env.CI ? "ssc-sdk-shared-stubby" : "localhost",
    authToken: "TEST_AUTH_TOKEN", // TODO (Parul): Generate a valid auth token on-the-fly
    invalidAuthToken: "TEST_INVALID_AUTH_TOKEN",
    novaHost: "next.splunknovadev-playground.com",
    testTenant: "29308eb3-c85c-4b8d-90a7-81cd1db1c75c" // TODO (Parul): Generate a valid tenant on-the-fly
};
