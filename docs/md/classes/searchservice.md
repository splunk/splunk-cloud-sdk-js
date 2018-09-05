[@splunk/ssc-client](../README.md) > [SearchService](../classes/searchservice.md)

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
* [createJobControlAction](searchservice.md#createjobcontrolaction)
* [deleteJob](searchservice.md#deletejob)
* [getEvents](searchservice.md#getevents)
* [getJob](searchservice.md#getjob)
* [getJobs](searchservice.md#getjobs)
* [getResults](searchservice.md#getresults)
* [submitSearch](searchservice.md#submitsearch)
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

▸ **createJob**(jobArgs?: * `undefined` &#124; `object`*): `Promise`<`string`>

Dispatch a search and return the newly created search job id

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| `Optional` jobArgs |  `undefined` &#124; `object`|  - |

**Returns:** `Promise`<`string`>

___
<a id="createjobcontrolaction"></a>

###  createJobControlAction

▸ **createJobControlAction**(jobId: *`string`*, action: *`string`*): `Promise`<`any`>

**Parameters:**

| Param | Type |
| ------ | ------ |
| jobId | `string` |
| action | `string` |

**Returns:** `Promise`<`any`>

___
<a id="deletejob"></a>

###  deleteJob

▸ **deleteJob**(jobId: *`string`*): `Promise`<`any`>

Delete the search job with the given `id`, cancelling the search if it is running.

**Parameters:**

| Param | Type |
| ------ | ------ |
| jobId | `string` |

**Returns:** `Promise`<`any`>

___
<a id="getevents"></a>

###  getEvents

▸ **getEvents**(jobId: *`string`*, args?: * `undefined` &#124; `object`*): `Promise`<`any`>

Returns events for the search job corresponding to "id". Returns results post-transform, if applicable.

**Parameters:**

| Param | Type |
| ------ | ------ |
| jobId | `string` |
| `Optional` args |  `undefined` &#124; `object`|

**Returns:** `Promise`<`any`>

___
<a id="getjob"></a>

###  getJob

▸ **getJob**(jobId: *`string`*): `Promise`<[Job](../interfaces/job.md)>

Returns the job resource with the given `id`.

**Parameters:**

| Param | Type |
| ------ | ------ |
| jobId | `string` |

**Returns:** `Promise`<[Job](../interfaces/job.md)>

___
<a id="getjobs"></a>

###  getJobs

▸ **getJobs**(jobArgs?: *`any`*): `Promise`<[Job](../interfaces/job.md)[]>

Get details of all current searches.

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` jobArgs | `any` |  {} |

**Returns:** `Promise`<[Job](../interfaces/job.md)[]>

___
<a id="getresults"></a>

###  getResults

▸ **getResults**(jobId: *`string`*, args?: *[FetchResultsRequest](../interfaces/fetchresultsrequest.md)*): `Promise`<`object`>

Returns results for the search job corresponding to "id". Returns results post-transform, if applicable.

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| jobId | `string` | - |
| `Default value` args | [FetchResultsRequest](../interfaces/fetchresultsrequest.md) |  {} |

**Returns:** `Promise`<`object`>

___
<a id="submitsearch"></a>

###  submitSearch

▸ **submitSearch**(searchArgs: *[PostJobsRequest](../interfaces/postjobsrequest.md)*): `Promise`<[Search](search.md)>

Submits a search job and wraps the response in an object for easier further processing.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| searchArgs | [PostJobsRequest](../interfaces/postjobsrequest.md) |  arguments for a new search job |

**Returns:** `Promise`<[Search](search.md)>

___
<a id="waitforjob"></a>

###  waitForJob

▸ **waitForJob**(jobId: *`string`*, pollInterval?: * `undefined` &#124; `number`*, callback?: * `undefined` &#124; `function`*): `Promise`<[Job](../interfaces/job.md)>

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| jobId | `string` |  - |
| `Optional` pollInterval |  `undefined` &#124; `number`|  - |
| `Optional` callback |  `undefined` &#124; `function`|   |

**Returns:** `Promise`<[Job](../interfaces/job.md)>

___

