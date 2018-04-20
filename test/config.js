module.exports = {
    host: !!process.env.CI ? "ssc-sdk-shared-stubby" : "localhost",
    authToken: "TEST_AUTH_TOKEN"
};