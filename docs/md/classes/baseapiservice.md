[@splunk/cloud-sdk](../README.md) > [BaseApiService](../classes/baseapiservice.md)

# Class: BaseApiService

Base class for each of the API proxies
*__deprecated__*: BaseApiService Constructor signature with three arguments, future support for constructor with only ServiceClient object - constructor(client: ServiceClient)

## Hierarchy

**BaseApiService**

↳  [ActionService](actionservice.md)

↳  [CatalogService](catalogservice.md)

↳  [IdentityService](identityservice.md)

↳  [IngestService](ingestservice.md)

↳  [KVStoreService](kvstoreservice.md)

↳  [SearchService](searchservice.md)

↳  [StreamsService](streamsservice.md)

## Index

### Constructors

* [constructor](baseapiservice.md#constructor)

### Properties

* [client](baseapiservice.md#client)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new BaseApiService**(clientOrUrl: * `string` &#124; [ServiceClient](serviceclient.md)*, token?: * `undefined` &#124; `string`*, defaultTenant?: * `undefined` &#124; `string`*): [BaseApiService](baseapiservice.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| clientOrUrl |  `string` &#124; [ServiceClient](serviceclient.md)|
| `Optional` token |  `undefined` &#124; `string`|
| `Optional` defaultTenant |  `undefined` &#124; `string`|

**Returns:** [BaseApiService](baseapiservice.md)

___

## Properties

<a id="client"></a>

### `<Protected>` client

**● client**: *[ServiceClient](serviceclient.md)*

___

