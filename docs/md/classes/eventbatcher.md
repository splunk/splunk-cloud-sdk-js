[@splunk/cloud-sdk](../README.md) > [EventBatcher](../classes/eventbatcher.md)

# Class: EventBatcher

Provides the ability to keep a growing number of events queued up and sends them to HEC. The events are flushed on a periodic interval or when the set capacity has been reached.

## Hierarchy

**EventBatcher**

## Index

### Constructors

* [constructor](eventbatcher.md#constructor)

### Methods

* [add](eventbatcher.md#add)
* [flush](eventbatcher.md#flush)
* [stop](eventbatcher.md#stop)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new EventBatcher**(ingest: *[IngestService](ingestservice.md)*, batchSize: *`number`*, batchCount: *`number`*, timeout: *`number`*): [EventBatcher](eventbatcher.md)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| ingest | [IngestService](ingestservice.md) |  Proxy for the Ingest API |
| batchSize | `number` |  Size of events in bytes |
| batchCount | `number` |  Number of events |
| timeout | `number` |  Interval (milliseconds) to send the events and flush the queue |

**Returns:** [EventBatcher](eventbatcher.md)

___

## Methods

<a id="add"></a>

###  add

▸ **add**(event: *[Event](../interfaces/event.md)*):  `Promise`<`any`> &#124; `null`

Add a new event to the array, sends all the events if the event limits are met.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| event | [Event](../interfaces/event.md) |  a single event |

**Returns:**  `Promise`<`any`> &#124; `null`

___
<a id="flush"></a>

###  flush

▸ **flush**(): `Promise`<`any`>

Clean up the events and timer.

**Returns:** `Promise`<`any`>
Promise that will be completed when events are accepted by service

___
<a id="stop"></a>

###  stop

▸ **stop**(): `void`

Stop the timer

**Returns:** `void`

___

