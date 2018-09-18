[@splunk/cloud-sdk](../README.md) > [SplunkCloud](../classes/splunkcloud.md)

# Class: SplunkCloud

This class is a Splunk Cloud client.
*__property__*: search Proxies for the search APIs

*__property__*: catalog Proxies for the catalog APIs

*__property__*: identity Proxies for the identity APIs

*__property__*: ingest Proxies for the ingest APIs

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

⊕ **new SplunkCloud**(url: *`string`*, token: *`string`*, defaultTenant?: * `undefined` &#124; `string`*): [SplunkCloud](splunkcloud.md)

Build a Splunk Cloud Client

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| url | `string` |  URL to Splunk Cloud environment |
| token | `string` |  Auth token |
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

