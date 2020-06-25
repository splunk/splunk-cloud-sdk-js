# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="11.0.1"></a>
## [11.0.1](https://github.com/splunk/splunk-cloud-sdk-js/compare/v11.0.0...v11.0.1) (2020-06-25)



<a name="10.0.0"></a>
# [10.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v9.0.0...v10.0.0) (2020-05-01)


### Bug Fixes

* add missed version update for 9.0.0 ([25ec81b](https://github.com/splunk/splunk-cloud-sdk-js/commits/25ec81b))


### Features

* update with code-generated api bindings and models performed 2020-04-29 ([64ea130](https://github.com/splunk/splunk-cloud-sdk-js/commits/64ea130))
* update with code-generated api bindings and models performed 2020-05-01 ([0b44831](https://github.com/splunk/splunk-cloud-sdk-js/commits/0b44831))



<a name="8.0.0"></a>
# [8.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v7.0.0...v8.0.0) (2020-03-11)


### Features

* make 500 errors more visible ([ee4fb63](https://github.com/splunk/splunk-cloud-sdk-js/commits/ee4fb63))
* update codecov to 3.6.5+ ([8e26560](https://github.com/splunk/splunk-cloud-sdk-js/commits/8e26560))
* update with code-generated api bindings and models performed 2020-03-04 ([a40726d](https://github.com/splunk/splunk-cloud-sdk-js/commits/a40726d))



<a name="7.0.0"></a>
# [7.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v6.1.0...v7.0.0) (2020-02-20)


### BREAKING CHANGES

* Appregistry models `AppResponseCreateUpdate`, 
 `UpdateAppRequest`, `CreateAppRequest`, `AppResponseCreateUpdat`,`AppResponseGetList` 
 have been refactored from single model encompassing all app related properties to discriminator based app kind specific models - `NativeApp/NativeAppPost/NativeAppPut`, `Webapp/WebAppPost/WebAppPut`,`ServiceApp/ServiceAppPost/ServiceAppPut` models

### FEATURES
* Collect service has support for new endpoints - `CreateExecution`, `GetExecution`, `PatchExecution` for scheduled jobs
* Identity service has New Enum value for TenantStatus - `tombstones`

<a name="6.1.0"></a>
# [6.1.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v6.0.0...v6.1.0) (2020-01-31)


### Features

* Added `filter` parameter to search listJobs endpoint ([60fd2ef](https://github.com/splunk/splunk-cloud-sdk-js/commits/60fd2ef))


<a name="6.0.0"></a>
# [6.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v5.0.0...v6.0.0) (2020-01-16)

### BREAKING CHANGES

*  **catalog:** `AnnotationPOST` generated model and related `createAnnotation*` APIs now accurately capturing properties and additionalProperties. Request bodies have been changed from simple maps to `AnnotationPOST` model ([4790776](https://github.com/splunk/splunk-cloud-sdk-js/commits/4790776))


<a name="5.0.0"></a>
# [5.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v4.0.0...v5.0.0) (2019-12-20)

### Features

* **ml:** added `initializing` values to `WorkflowDeploymentStatusEnum` model ([91e68ba4](https://github.com/splunk/splunk-cloud-sdk-js/commits/91e68ba4))

### BREAKING CHANGES

* revert repathing of transpiled JS under `src` directory introduced in v4.0.0 - users upgrading from v3.x.x or earlier to v5.0.0 should be unaffected ([afafe4a](https://github.com/splunk/splunk-cloud-sdk-js/commits/afafe4a))


<a name="4.0.0"></a>
# [4.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v3.0.0...v4.0.0) (2019-12-06)

### Features

* **search:** Expose optional requiredFreshness field on SearchJob interface ([d92c7af](https://github.com/splunk/splunk-cloud-sdk-js/commits/d92c7af))
* **streams:** Expose NotActivated on PipelineReactivateResponsePipelineReactivationStatusEnum ([d92c7af](https://github.com/splunk/splunk-cloud-sdk-js/commits/d92c7af))

### BREAKING CHANGES

* **streams:** Remove AlreadyActivatedWithCurrentVersion from PipelineReactivateResponsePipelineReactivationStatusEnum ([d92c7af](https://github.com/splunk/splunk-cloud-sdk-js/commits/d92c7af))
* **streams:** Remove optional createUserId field on GeneratedPipelineRequest ([d92c7af](https://github.com/splunk/splunk-cloud-sdk-js/commits/d92c7af))



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
