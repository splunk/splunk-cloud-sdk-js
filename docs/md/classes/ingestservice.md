[@splunk/ssc-client](../README.md) > [IngestService](../classes/ingestservice.md)

# Class: IngestService

Encapsulates Ingest service endpoints

## Hierarchy

 [BaseApiService](baseapiservice.md)

**↳ IngestService**

## Index

### Constructors

* [constructor](ingestservice.md#constructor)

### Properties

* [client](ingestservice.md#client)

### Methods

* [createEvent](ingestservice.md#createevent)
* [createEvents](ingestservice.md#createevents)
* [createMetrics](ingestservice.md#createmetrics)
* [createRawEvent](ingestservice.md#createrawevent)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new IngestService**(clientOrUrl: * `string` &#124; [ServiceClient](serviceclient.md)*, token?: * `undefined` &#124; `string`*, defaultTenant?: * `undefined` &#124; `string`*): [IngestService](ingestservice.md)

**Parameters:**

| Param | Type |
| ------ | ------ |
| clientOrUrl |  `string` &#124; [ServiceClient](serviceclient.md)|
| `Optional` token |  `undefined` &#124; `string`|
| `Optional` defaultTenant |  `undefined` &#124; `string`|

**Returns:** [IngestService](ingestservice.md)

___

## Properties

<a id="client"></a>

### `<Protected>` client

**● client**: *[ServiceClient](serviceclient.md)*

___

## Methods

<a id="createevent"></a>

###  createEvent

▸ **createEvent**(event: *[Event](../interfaces/event.md)*): `Promise`<`any`>

Create a structured event to be ingested by Splunk SSC via Ingest service.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | [Event](../interfaces/event.md) |   |

**Returns:** `Promise`<`any`>

___
<a id="createevents"></a>

###  createEvents

▸ **createEvents**(events: *[Event](../interfaces/event.md)[]*): `Promise`<`any`>

Create structured events to be ingested by Splunk SSC via Ingest service.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| events | [Event](../interfaces/event.md)[] |   |

**Returns:** `Promise`<`any`>

___
<a id="createmetrics"></a>

###  createMetrics

▸ **createMetrics**(metrics: *[MetricEvent](../interfaces/metricevent.md)[]*): `Promise`<`any`>

Create metrics to be ingested by Splunk SSC.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| metrics | [MetricEvent](../interfaces/metricevent.md)[] |   |

**Returns:** `Promise`<`any`>

___
<a id="createrawevent"></a>

###  createRawEvent

▸ **createRawEvent**(event: *[Event](../interfaces/event.md)*): `Promise`<`any`>

Create unstructured event data to be ingested by Splunk SSC via Ingest service.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| event | [Event](../interfaces/event.md) |   |

**Returns:** `Promise`<`any`>

___

