module.exports = {
    host: !!process.env.CI_COMMIT_ID ? "ssc-sdk-shared-stubby" : "localhost"
};