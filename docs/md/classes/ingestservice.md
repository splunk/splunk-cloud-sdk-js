[@splunk/cloud-sdk](../README.md) > [IngestService](../classes/ingestservice.md)

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

* [postEvents](ingestservice.md#postevents)
* [postMetrics](ingestservice.md#postmetrics)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new IngestService**(clientOrUrl: * `string` &#124; [ServiceClient](serviceclient.md)*, token?: * `undefined` &#124; `string`*, defaultTenant?: * `undefined` &#124; `string`*): [IngestService](ingestservice.md)

**Parameters:**

| Name | Type |
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

<a id="postevents"></a>

###  postEvents

▸ **postEvents**(events: *[Event](../interfaces/event.md)[]*): `Promise`<`any`>

Post structured events to be ingested by Splunk Cloud via Ingest service.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| events | [Event](../interfaces/event.md)[] |  \- |

**Returns:** `Promise`<`any`>
promise that will be resolved when the ingest service has accepted the events for indexing

___
<a id="postmetrics"></a>

###  postMetrics

▸ **postMetrics**(metrics: *[MetricEvent](../interfaces/metricevent.md)[]*): `Promise`<`any`>

Post metrics to be ingested by Splunk Cloud.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| metrics | [MetricEvent](../interfaces/metricevent.md)[] |  \- |

**Returns:** `Promise`<`any`>
promise that will be resolved when the ingest service has accepted the metrics for indexing

___

