# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="16.0.0-beta2"></a>
# [16.0.0-beta2](https://github.com/splunk/splunk-cloud-sdk-js/compare/v16.0.0-beta1...v16.0.0-beta2) (2021-04-26)


### Bug Fixes

* fix import blob issue ([34172bd](https://github.com/splunk/splunk-cloud-sdk-js/commits/34172bd))
* **client:** handle partial error payloads ([0fcac3a](https://github.com/splunk/splunk-cloud-sdk-js/commits/0fcac3a))


### Features

* update with code-generated api bindings and models performed 2021-04-21 ([72239e3](https://github.com/splunk/splunk-cloud-sdk-js/commits/72239e3))



<a name="16.0.0-beta1"></a>
# [16.0.0-beta1](https://github.com/splunk/splunk-cloud-sdk-js/compare/v15.0.0...v16.0.0-beta1) (2021-03-31)


### Services

##### Features

- Add support to tenant-scoped hostname: initiate the client with `hostname` set to enable the client visit endpoints using tenant-scoped url. Example: 


`new ServiceClient(
                                                         { tokenSource:'your-token-source',
                                                             defaultTenant: 'your-tenant',
                                                             hostname: new Hostname('domain','region')
                                                         });`






<a name="15.0.0"></a>
# [15.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v14.0.0...v15.0.0) (2020-12-16)


### Services

#### Breaking Changes

##### Features

- Identity v2beta1:
    - Model `AddInvisibleMemberBody` removed
    - Enpoints `addInvisibleMember`, `getMemberAdmin` and `removeMemberAdmin` removed

- Provisioner v1beta1
    - Models `CreateProvisionJobBody`, `ProvisionJobInfo`, `ProvisionJobInfoErrors`, `ProvisionJobInfoErrors` and 
    `ProvisionJobs` removed
    - Endpoints `createProvisionJob`, `getProvisionJob` and `listProvisionJobs` removed

- Streams v3beta1:
    - Models `CollectJobPatchRequest`, `CollectJobRequest`, `CollectJobResponse`, `CollectJobStartStopResponse`, 
    `EntitlementRequest`, `EntitlementResponse`, `PaginatedResponseOfCollectJobResponse`, `PaginatedResponseOfPlugin`, 
    `PaginatedResponseOfRulesResponse`,  `PaginatedResponseOfRuleKind`, `Plugin`, `PluginPatchRequest`, `PluginRequest`, 
    `PluginResponse`, `RulesRequest` and `RulesResponse` removed

    - Model `UploadFile` renamed to `UploadFileResponse`

    - Endpoints `createCollectJob`, `createRulesPackage`, `deleteCollectJobs`, `deleteCollectJob`, `deleteEntitlements`, 
    `deletePlugin`, `deleteRulesPackage`, `getCollectJob`, `getEntitlements`, `getPlugins`, `getRulesPackageById`, 
    `listCollectJobs`, `listRulesKinds`, `listRulesPackages`, `patchPlugin`, `registerPlugin`, `releaseInfo`, 
    `setEntitlements`, `startCollectJob`, `stopCollectJob`, `updateCollectJob`, `updatePlugin` and `updateRulesPackageById` 
    removed  

#### Non-Breaking Changes

##### Features

- Identity v2beta1:
    - New model `CreatePrincipalBody` added
    - New endpoint `createPrincipal` added

- Identity v3: 
    - New version introduced

- Identity v3alpha1
    - New models `GroupMemberList` and `GroupRoleList`added

- Ingest v1beta2: 
    - New endpoints `postCollectorRaw` and `postCollectorRawV1` added

- Streams v2beta1:
    - New property `attributes` added to `ConnectorResponse`
    - New property `statusDescription` added to `PipelineReactivateResponse`
    - New parameter `functionOp`added to `listConnections`

- Streams v3beta1
    - New model `UploadFileResponse` added
    - New endpoint `deleteLookupFile`, `getLookupFileMetadata` and `getLookupFilesMetadata` added

<a name="14.0.0"></a>
# [14.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v13.0.0...v14.0.0) (2020-11-11)


### Services

#### Breaking Changes

##### Features

- Catalog v2beta1:
    - `createDatasetImport` returns datatype of `Dataset` (replaced 'ImportDataset')
    - `createDatasetImportById` returns `DatasetImportedby` (replaced 'ImportDataset')
    - `DatasetImportedBy` has a new property `owner` and property `name` is now optional

- Provisioner v1beta1:
    - Model `ECStackName` renamed to `EcStackName`

- Search v2beta1:
    - Model `ListSearchResultsResponseFields` renamed to `ListPreiviewResultsResponseFields`

- Search v3alpha1:
    - Model `ListSearchResultsResponseFields` renamed to `ListPreiviewResultsResponseFields`

- Stream v3beta1: 
    - Model `RulesSourcetypesResponse` renamed to `RulesPackageSourcetypes`
    - Model `RulesActionsResponse` renamed to `RulesPackageActions`
    
#### Non-Breaking Changes

##### Features

- Auth 
    - `ServicePrincipalAuthManager` added to Auth service

- Identity v2beta1:
    - New model `AddInvisibleMemberBody` added
    - New endpoints `addInvisibleMember`, `getMemberAdmin` and `removeMemberAdmin` added
    - New properties `expiresAt` and `visible` added to `Member` model
    - New models `DeviceAuthInfo` and `UpdateRoleBody` added

- Identity v3alpha1: 
    - New version introduced

- Ingest v1beta2: 
    - New models `UploadSuccessResponse` and `FileUploadDetails`  added

- KVStore v1beta1:
    - New endpoint `truncateRecords` added

- Search v3alpha1:
    - New models `SearchModule`, `StatementDispatchStatus`, and `SingleSatatementQueryParamters` added
    - New endpoints `createMultiSearchMethod` and `createSearchStatements` added

- Streams v2beta1:
    - New property `messages` added to model `ConnectionSaveResponse`
    - New property `complexity` added to model `PipelineResponse`
    - New property `activateLatestVersion` added to model `ReactivatePipelineRequest`

- Streams v3beta1:
    - New models `CollectJobPatchRequest`, `DataStream`, `DataStreamRequest`, `DataStreamResponse`, `EntitlementRequest`,
     `EntitlementResponse`, `PaginatedResponseOfRuleKind`, `RulesKind` and `PluginResponse`
    - New endpoints `createDataStream`, `deleteCollectJob`, `deletedatastream`, `deleteEntitlements`, `deleteRulesPackage`, 
     `describeDataStream`, `getEntitlements`, `getRulesPackageById`, `listDataStreams`, `listRuleKinds`, `releaseInfo`, 
     `setEntitlements`, `updateCollectJob`, `updateDataStream` and `updateRulesPackageById` added

<a name="13.0.0"></a>
# [13.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v11.0.1...v13.0.0) (2020-09-15)


### Bug Fixes

* whitelist to allowlist ([dde9eb0](https://github.com/splunk/splunk-cloud-sdk-js/commits/dde9eb0))

### Breaking Changes
- App Registry
	- `WebAppPOST`  has been removed

### Non-Breaking Changes

- Catalog
	- `extract_fields` has been added
- Search
    - `extract_fields` has been added
- Streams
    - `PaginatedResponseOfCollectJobResponse` has been added
    - `RulesResponse` has been added
    - `RulesSourcetypesResponse` has been added
    - `RulesActionsResponse` has been added
    - `PaginatedResponseOfRulesResponse` has been added
    - `RulesRequest` has been added

<a name="12.0.0"></a>
# [12.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v11.0.1...v12.0.0) (2020-08-25)


### Bug Fixes

* fix requestStatusCallback to be not be async ([e87ba5d](https://github.com/splunk/splunk-cloud-sdk-js/commits/e87ba5d))


### Features

* update with code-generated api bindings and models performed 2020-08-19 ([7fc330b](https://github.com/splunk/splunk-cloud-sdk-js/commits/7fc330b))

### Breaking Changes
`Catalog service v2beta1`: getDataset,  getDatasetById and listDatasets endpoints now return data type of DatasetGet instead of Dataset

`Identify service v2beta1`: remove endpoint of setPrincipalPublicKeys

`Kvstore service v1beta1`:  insertRecords endpoint has a new parameter of allowUpdates

`Stream service v3beta1`: remove endpoint of uploadPlugin


### Non-Breaking Changes

`Identify service v2beta1`: 
- new endpoints added addPrincipalPublicKey, getPrincipalPublicKey, getPrincipalPublicKeys, deletePrincipalPublicKey, and updatePrincipalPublicKey 

`Stream service v3beta1`: 
- new endpoints added: startCollectJob and stopCollectJob


<a name="11.0.1"></a>
## [11.0.1](https://github.com/splunk/splunk-cloud-sdk-js/compare/v11.0.0...v11.0.1) (2020-06-25)

### BugFix
Adding CHANGELOG.md

<a name="11.0.0"></a>
## [11.0.0](https://github.com/splunk/splunk-cloud-sdk-js/compare/v10.0.0...v11.0.0) (2020-06-25)

### Breaking Changes

* Streams
  * In v3beta
       * Modified `connectorId` parameter to be Array<string> in `ListConnections` endpoint
       * Removed `UploadFile` endpoint as it is not supported

### Non-Breaking Changes
* Catalog
   * In v2beta1
       * `AppClientIDProperties` model has been added
* Identity
   * In v2beta
       *  Added `scopeFilter` parameter to `listMemberPermission` endpoint
* Streams	
   * In v3beta
       * New `getFileMetadata` endpoint



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
