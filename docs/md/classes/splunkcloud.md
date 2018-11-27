[@splunk/cloud-sdk](../README.md) > [SplunkCloud](../classes/splunkcloud.md)

# Class: SplunkCloud

This class is a Splunk Cloud client.
*__property__*: search Proxies for the search APIs

*__property__*: catalog Proxies for the catalog APIs

*__property__*: identity Proxies for the identity APIs

*__property__*: ingest Proxies for the ingest APIs

*__property__*: kvstore Proxies for the kvstore APIs

*__property__*: action Proxies for the action APIs

*__property__*: streams Proxies for the streams APIs

## Hierarchy

**SplunkCloud**

## Index

### Constructors

* [constructor](splunkcloud.md#constructor)

### Properties

* [action](splunkcloud.md#action)
* [catalog](splunkcloud.md#catalog)
* [client](splunkcloud.md#client)
* [identity](splunkcloud.md#identity)
* [ingest](splunkcloud.md#ingest)
* [kvstore](splunkcloud.md#kvstore)
* [search](splunkcloud.md#search)
* [streams](splunkcloud.md#streams)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SplunkCloud**(args: * [ServiceClientArgs](../interfaces/serviceclientargs.md) &#124; `string`*, token?: * `undefined` &#124; `string`*, defaultTenant?: * `undefined` &#124; `string`*): [SplunkCloud](splunkcloud.md)

Build a Splunk Cloud Client
*__deprecated__*: Constructor signature with three arguments, future support for constructor with only ServiceClientArgs object - constructor(args: ServiceClientArgs)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| args |  [ServiceClientArgs](../interfaces/serviceclientargs.md) &#124; `string`|  URL to Splunk Cloud environment or a ServiceClientArgs object |
| `Optional` token |  `undefined` &#124; `string`|  Auth token |
| `Optional` defaultTenant |  `undefined` &#124; `string`|  Default tenant to use for requests |

**Returns:** [SplunkCloud](splunkcloud.md)

___

## Properties

<a id="action"></a>

###  action

**● action**: *[ActionService](actionservice.md)*

___
<a id="catalog"></a>

###  catalog

**● catalog**: *[CatalogService](catalogservice.md)*

___
<a id="client"></a>

###  client

**● client**: *[ServiceClient](serviceclient.md)*

___
<a id="identity"></a>

###  identity

**● identity**: *[IdentityService](identityservice.md)*

___
<a id="ingest"></a>

###  ingest

**● ingest**: *[IngestService](ingestservice.md)*

___
<a id="kvstore"></a>

###  kvstore

**● kvstore**: *[KVStoreService](kvstoreservice.md)*

___
<a id="search"></a>

###  search

**● search**: *[SearchService](searchservice.md)*

___
<a id="streams"></a>

###  streams

**● streams**: *[StreamsService](streamsservice.md)*

___

