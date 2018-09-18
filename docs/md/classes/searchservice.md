[@splunk/cloud-sdk](../README.md) > [SearchService](../classes/searchservice.md)

# Class: SearchService

Encapsulates search endpoints

## Hierarchy

 [BaseApiService](baseapiservice.md)

**↳ SearchService**

## Index

### Constructors

* [constructor](searchservice.md#constructor)

### Properties

* [client](searchservice.md#client)

### Methods

* [createJob](searchservice.md#createjob)
* [getJob](searchservice.md#getjob)
* [getResults](searchservice.md#getresults)
* [listJobs](searchservice.md#listjobs)
* [submitSearch](searchservice.md#submitsearch)
* [updateJob](searchservice.md#updatejob)
* [waitForJob](searchservice.md#waitforjob)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SearchService**(clientOrUrl: * `string` &#124; [ServiceClient](serviceclient.md)*, token?: * `undefined` &#124; `string`*, defaultTenant?: * `undefined` &#124; `string`*): [SearchService](searchservice.md)

**Parameters:**

| Param | Type |
| ------ | ------ |
| clientOrUrl |  `string` &#124; [ServiceClient](serviceclient.md)|
| `Optional` token |  `undefined` &#124; `string`|
| `Optional` defaultTenant |  `undefined` &#124; `string`|

**Returns:** [SearchService](searchservice.md)

___

## Properties

<a id="client"></a>

### `<Protected>` client

**● client**: *[ServiceClient](serviceclient.md)*

___

## Methods

<a id="createjob"></a>

###  createJob

▸ **createJob**(jobArgs: *[SearchArgs](../interfaces/searchargs.md)*): `Promise`<[SearchJob](../interfaces/searchjob.md)>

Creates a new SearchJob

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| jobArgs | [SearchArgs](../interfaces/searchargs.md) |  Arguments for the new search |

**Returns:** `Promise`<[SearchJob](../interfaces/searchjob.md)>

___
<a id="getjob"></a>

###  getJob

▸ **getJob**(jobId: *`string`*): `Promise`<[SearchJob](../interfaces/searchjob.md)>

Returns the job resource with the given `id`.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| jobId | `string` |  - |

**Returns:** `Promise`<[SearchJob](../interfaces/searchjob.md)>
Description of job

___
<a id="getresults"></a>

###  getResults

▸ **getResults**(jobId: *`string`*, args?: *[FetchResultsRequest](../interfaces/fetchresultsrequest.md)*): `Promise`< [SearchResults](../interfaces/searchresults.md) &#124; [ResultsNotReadyResponse](../interfaces/resultsnotreadyresponse.md)>

Get {search_id} search results.

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| jobId | `string` | - |
| `Default value` args | [FetchResultsRequest](../interfaces/fetchresultsrequest.md) |  {} |

**Returns:** `Promise`< [SearchResults](../interfaces/searchresults.md) &#124; [ResultsNotReadyResponse](../interfaces/resultsnotreadyresponse.md)>

___
<a id="listjobs"></a>

###  listJobs

▸ **listJobs**(jobArgs?: *`any`*): `Promise`<[SearchJob](../interfaces/searchjob.md)[]>

Get the matching list of search jobs.

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` jobArgs | `any` |  {} |

**Returns:** `Promise`<[SearchJob](../interfaces/searchjob.md)[]>

___
<a id="submitsearch"></a>

###  submitSearch

▸ **submitSearch**(searchArgs: *[SearchArgs](../interfaces/searchargs.md)*): `Promise`<[Search](search.md)>

Submits a search job and wraps the response in an object for easier further processing.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| searchArgs | [SearchArgs](../interfaces/searchargs.md) |  arguments for a new search job |

**Returns:** `Promise`<[Search](search.md)>
a wrapper utility object for the search

___
<a id="updatejob"></a>

###  updateJob

▸ **updateJob**(jobId: *`string`*, update: *[UpdateJob](../interfaces/updatejob.md)*): `Promise`<[UpdateJobResponse](../interfaces/updatejobresponse.md)>

action is applied to search job

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| jobId | `string` |  - |
| update | [UpdateJob](../interfaces/updatejob.md) |   |

**Returns:** `Promise`<[UpdateJobResponse](../interfaces/updatejobresponse.md)>

___
<a id="waitforjob"></a>

###  waitForJob

▸ **waitForJob**(jobId: *`string`*, pollInterval?: * `undefined` &#124; `number`*, callback?: * `undefined` &#124; `function`*): `Promise`<[SearchJob](../interfaces/searchjob.md)>

Polls the service until the job is ready, then resolves returned promise with the final job description (as found from `getJob`).

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| jobId | `string` |  - |
| `Optional` pollInterval |  `undefined` &#124; `number`|  in ms |
| `Optional` callback |  `undefined` &#124; `function`|  optional function that will be called on every poll result |

**Returns:** `Promise`<[SearchJob](../interfaces/searchjob.md)>

___

