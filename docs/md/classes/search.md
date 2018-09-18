[@splunk/cloud-sdk](../README.md) > [Search](../classes/search.md)

# Class: Search

A base for an easy-to-use search interface

## Hierarchy

**Search**

## Index

### Constructors

* [constructor](search.md#constructor)

### Methods

* [cancel](search.md#cancel)
* [getResults](search.md#getresults)
* [resultObservable](search.md#resultobservable)
* [status](search.md#status)
* [statusObservable](search.md#statusobservable)
* [wait](search.md#wait)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Search**(searchService: *[SearchService](searchservice.md)*, jobId: *`string`*): [Search](search.md)

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| searchService | [SearchService](searchservice.md) |  - |
| jobId | `string` |   |

**Returns:** [Search](search.md)

___

## Methods

<a id="cancel"></a>

###  cancel

▸ **cancel**(): `Promise`<`any`>

Submits a cancel job against this search job

**Returns:** `Promise`<`any`>
A promise that will be resolved when the cancel action is accepted by the service

___
<a id="getresults"></a>

###  getResults

▸ **getResults**(args?: *`object`*): `Promise`<`any`>

Returns the results from a search as a (promised) array. If 'args.offset' is supplied, a window of results will be returned. If an offset is not supplied, all results will be fetched and concatenated.

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` args | `object` |  {} |  - |

**Returns:** `Promise`<`any`>
A list of event objects

___
<a id="resultobservable"></a>

###  resultObservable

▸ **resultObservable**(args?: *[ResultObservableOptions](../interfaces/resultobservableoptions.md)*): `Observable`<`any`>

Returns an observable that will poll the job and return results, updating until the job is final. If offset and count are specified in the args, this method will return that window of results. If neither are specified (or only count is specified), all results available will be fetched.

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` args | [ResultObservableOptions](../interfaces/resultobservableoptions.md) |  {} |  - |

**Returns:** `Observable`<`any`>
An observable that will pass each result object as it is received

___
<a id="status"></a>

###  status

▸ **status**(): `Promise`<[SearchJob](../interfaces/searchjob.md)>

Returns the status of the search job

**Returns:** `Promise`<[SearchJob](../interfaces/searchjob.md)>
search job status description

___
<a id="statusobservable"></a>

###  statusObservable

▸ **statusObservable**(updateInterval: *`number`*): `Observable`<[SearchJob](../interfaces/searchjob.md)>

A utility method that will return an Rx.Observable which will supply status updates at a supplied interval until the job is ready.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| updateInterval | `number` |  interval (in ms) at which to poll |

**Returns:** `Observable`<[SearchJob](../interfaces/searchjob.md)>
An observable that will periodically poll for status on a job until it is complete

___
<a id="wait"></a>

###  wait

▸ **wait**(updateInterval: *`number`*, statusCallback: *`function`*): `Promise`<[SearchJob](../interfaces/searchjob.md)>

Polls the job until it is done processing

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| updateInterval | `number` |  - |
| statusCallback | `function` |  - |

**Returns:** `Promise`<[SearchJob](../interfaces/searchjob.md)>
search job status description

___

