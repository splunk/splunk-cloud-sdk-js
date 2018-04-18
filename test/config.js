'use strict';

module.exports = {
    host: !!process.env.CI ? "ssc-sdk-shared-stubby" : "localhost"
};