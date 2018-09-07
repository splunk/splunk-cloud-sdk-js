[@splunk/ssc-client](../README.md) > [Search](../classes/search.md)

# Class: Search

A base for an easy-to-use search interface

## Hierarchy

**Search**

## Index

### Constructors

* [constructor](search.md#constructor)

### Methods

* [cancel](search.md#cancel)
* [eventObservable](search.md#eventobservable)
* [getResults](search.md#getresults)
* [pause](search.md#pause)
* [resultObservable](search.md#resultobservable)
* [status](search.md#status)
* [statusObservable](search.md#statusobservable)
* [touch](search.md#touch)
* [wait](search.md#wait)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Search**(searchService: *[SearchService](searchservice.md)*, sid: *`string`*): [Search](search.md)

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| searchService | [SearchService](searchservice.md) |  - |
| sid | `string` |   |

**Returns:** [Search](search.md)

___

## Methods

<a id="cancel"></a>

###  cancel

▸ **cancel**(): `Promise`<`any`>

Submits a cancel job against this search job

**Returns:** `Promise`<`any`>

___
<a id="eventobservable"></a>

###  eventObservable

▸ **eventObservable**(attrs?: *[EventObservableOptions](../interfaces/eventobservableoptions.md)*): `Observable`<`any`>

Returns an Rx.Observable that will return events from the job when it is done processing

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attrs | [EventObservableOptions](../interfaces/eventobservableoptions.md) |  {} |

**Returns:** `Observable`<`any`>

___
<a id="getresults"></a>

###  getResults

▸ **getResults**(args?: *[FetchResultsRequest](../interfaces/fetchresultsrequest.md)*): `Promise`<`any`[]>

Returns the results from a search as a (promised) array. If 'args.offset' is supplied, a window of results will be returned. If an offset is not supplied, all results will be fetched and concatenated.

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` args | [FetchResultsRequest](../interfaces/fetchresultsrequest.md) |  {} |   |

**Returns:** `Promise`<`any`[]>

___
<a id="pause"></a>

###  pause

▸ **pause**(): `Promise`<`any`>

Pauses this search job

**Returns:** `Promise`<`any`>

___
<a id="resultobservable"></a>

###  resultObservable

▸ **resultObservable**(args?: *[ResultObservableOptions](../interfaces/resultobservableoptions.md)*): `Observable`<`any`>

Returns an observable that will poll the job and return results, updating until the job is final. If offset and count are specified in the args, this method will return that window of results. If neither are specified (or only count is specified), all results available will be fetched.

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` args | [ResultObservableOptions](../interfaces/resultobservableoptions.md) |  {} |   |

**Returns:** `Observable`<`any`>

___
<a id="status"></a>

###  status

▸ **status**(): `Promise`<[Job](../interfaces/job.md)>

Returns the status of the search job

**Returns:** `Promise`<[Job](../interfaces/job.md)>

___
<a id="statusobservable"></a>

###  statusObservable

▸ **statusObservable**(updateInterval: *`number`*): `Observable`<[Job](../interfaces/job.md)>

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| updateInterval | `number` |   |

**Returns:** `Observable`<[Job](../interfaces/job.md)>

___
<a id="touch"></a>

###  touch

▸ **touch**(): `Promise`<`any`>

Resets the time to live on this search job

**Returns:** `Promise`<`any`>

___
<a id="wait"></a>

###  wait

▸ **wait**(updateInterval: *`number`*, statusCallback: *`function`*): `Promise`<[Job](../interfaces/job.md)>

Polls the job until it is done processing

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| updateInterval | `number` |  - |
| statusCallback | `function` |   |

**Returns:** `Promise`<[Job](../interfaces/job.md)>

___

