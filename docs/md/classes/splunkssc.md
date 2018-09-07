[@splunk/ssc-client](../README.md) > [SplunkSSC](../classes/splunkssc.md)

# Class: SplunkSSC

This class is a Splunk SSC client.
*__property__*: search Proxies for the search APIs

*__property__*: catalog Proxies for the catalog APIs

*__property__*: identity Proxies for the identity APIs

*__property__*: ingest Proxies for the ingest APIs

## Hierarchy

**SplunkSSC**

## Index

### Constructors

* [constructor](splunkssc.md#constructor)

### Properties

* [action](splunkssc.md#action)
* [catalog](splunkssc.md#catalog)
* [identity](splunkssc.md#identity)
* [ingest](splunkssc.md#ingest)
* [kvstore](splunkssc.md#kvstore)
* [search](splunkssc.md#search)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new SplunkSSC**(url: *`string`*, token: *`string`*, defaultTenant?: * `undefined` &#124; `string`*): [SplunkSSC](splunkssc.md)

Build a Splunk SSC Client

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| url | `string` |  URL to Splunk SSC environment TODO: SSC name |
| token | `string` |  Auth token |
| `Optional` defaultTenant |  `undefined` &#124; `string`|  Default tenant to use for requests |

**Returns:** [SplunkSSC](splunkssc.md)

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

