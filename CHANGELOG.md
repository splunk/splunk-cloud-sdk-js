# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.1.0"></a>
# [3.1.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v3.0.0...v3.1.0) (2019-12-05)


### Features

* updating generated APIs (1c4b60b97229cab171981c763edf0b1545afad4f) ([c1fbebd](https://github.com/splunk/splunk-cloud-sdk-js/commits/c1fbebd))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v2.0.0...v3.0.0) (2019-11-19)


### BREAKING CHANGES

* **auth:** remove checkAuthentication from AuthManager interface ([f406862](https://github.com/splunk/splunk-cloud-sdk-js/commits/f406862))
* **auth:** serviceClientArgs.tokenSource no long accepts synchronous functions to return the token ([ab78288](https://github.com/splunk/splunk-cloud-sdk-js/commits/ab78288))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v1.1.0...v2.0.0) (2019-10-16)


### Features

* **collect:** BREAKING CHANGE: scalePolicy is now defined as a ScalePolicy model rather than a simple object. ([2d58bac](https://github.com/splunk/splunk-cloud-sdk-js/commits/2d58bac))
* **streams:** 'Expression' value exposed as part of the SplCompileRequestSyntax enumeration. ([2d58bac](https://github.com/splunk/splunk-cloud-sdk-js/commits/2d58bac))
* **identity:** ValidateInfoKindEnum exposed as a field in ValidateInfo interface. ([2d58bac](https://github.com/splunk/splunk-cloud-sdk-js/commits/2d58bac))
* **all:** arbitrary query parameters exposed as an optional parameter in all public APIs. ([2d58bac](https://github.com/splunk/splunk-cloud-sdk-js/commits/2d58bac))
* **examples:** updating samples with common formatting around logging, await vs promise chaining, adding teardowns for cleanup. ([75370a7](https://github.com/splunk/splunk-cloud-sdk-js/commits/75370a7))


<a name="1.1.0"></a>
# [1.1.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v1.0.1...v1.1.0) (2019-10-01)


### Features

* **search:** regenerate search for resultsPreviewAvailable ([1a8dd6a](https://github.com/splunk/splunk-cloud-sdk-js/commits/1a8dd6a))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/splunk/splunk-cloud-sdk-js/compare/v1.0.0...v1.0.1) (2019-09-25)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v1.0.0-beta.4...v1.0.0) (2019-09-25)


### Bug Fixes

* **core:** always return the httpStatusCode for error responses even if missing fields ([6372c23](https://github.com/splunk/splunk-cloud-sdk-js/commits/6372c23))


### Features
* add support for multiple service versions ([d9c726d](https://github.com/splunk/splunk-cloud-sdk-js/commits/d9c726d))
* temporary import stubs to keep from breaking clients ([70230b0](https://github.com/splunk/splunk-cloud-sdk-js/commits/70230b0))
* update service bindings ([e7505e7](https://github.com/splunk/splunk-cloud-sdk-js/commits/e7505e7))
* **examples:** add new example for tenant setup ([8e6eedd](https://github.com/splunk/splunk-cloud-sdk-js/commits/8e6eedd))



<a name="1.0.0-beta.4"></a>
# [1.0.0-beta.4](https://github.com/splunk/splunk-cloud-sdk-js/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2019-09-12)


### Bug Fixes

* **ingest:** limit ingest batches to 500 events ([41a410e](https://github.com/splunk/splunk-cloud-sdk-js/commits/41a410e))

### Features

* client can on 429 and 503 (needs configuration in this release) ([e7b9532](https://github.com/splunk/splunk-cloud-sdk-js/commits/e7b9532))
* service bindings update, includes search preview results ([f8e2cd2](https://github.com/splunk/splunk-cloud-sdk-js/commits/f8e2cd2))


<a name="1.0.0-beta.3"></a>
# [1.0.0-beta.3](https://github.com/splunk/splunk-cloud-sdk-js/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2019-09-05)


### Bug Fixes

* **core:** clone request before using in naiveExponentialBackoff ([74bf170](https://github.com/splunk/splunk-cloud-sdk-js/commits/74bf170))
* **search:** fix unhandled promise in waitForJob ([2485c1b](https://github.com/splunk/splunk-cloud-sdk-js/commits/2485c1b))


### Features

* update bindings to latest service versions ([58e1460](https://github.com/splunk/splunk-cloud-sdk-js/commits/58e1460))



<a name="1.0.0-beta.2"></a>
# [1.0.0-beta.2](https://github.com/splunk/splunk-cloud-sdk-js/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2019-07-22)


### Features

* re-generate all services with the latest spec files ([c8fed3b](https://github.com/splunk/splunk-cloud-sdk-js/commits/c8fed3b))



<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/splunk/splunk-cloud-sdk-js/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2019-07-19)


### Bug Fixes

* properly encode strings in URLs, not just escape them ([5823b4c](https://github.com/splunk/splunk-cloud-sdk-js/commits/5823b4c))
* splunkError objs will now have more readable messages ([03f6733](https://github.com/splunk/splunk-cloud-sdk-js/commits/03f6733))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
