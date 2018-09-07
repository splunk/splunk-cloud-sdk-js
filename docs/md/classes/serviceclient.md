[@splunk/ssc-client](../README.md) > [ServiceClient](../classes/serviceclient.md)

# Class: ServiceClient

This class acts as a raw proxy for Splunk SSC, implementing authorization for requests, setting the proper headers, and GET, POST, etc. For the most part you shouldn't need to use this class directly- look at the service proxies that implement the actual endpoints. TODO: Add links to actual endpoints, SSC name

## Hierarchy

**ServiceClient**

## Index

### Constructors

* [constructor](serviceclient.md#constructor)

### Methods

* [buildPath](serviceclient.md#buildpath)
* [delete](serviceclient.md#delete)
* [get](serviceclient.md#get)
* [patch](serviceclient.md#patch)
* [post](serviceclient.md#post)
* [put](serviceclient.md#put)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ServiceClient**(url: *`string`*, token: *`string`*, tenant?: * `undefined` &#124; `string`*): [ServiceClient](serviceclient.md)

Create a ServiceClient with the given URL and an auth token

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| url | `string` |  Url to Splunk SSC instance |
| token | `string` |  Authentication token |
| `Optional` tenant |  `undefined` &#124; `string`|  Default tenant ID to use TODO(david): figure out how to manage token refresh |

**Returns:** [ServiceClient](serviceclient.md)

___

## Methods

<a id="buildpath"></a>

###  buildPath

▸ **buildPath**(servicePrefix: *`string`*, pathname: *`string`[]*, overrideTenant?: * `undefined` &#124; `string`*): `string`

**Parameters:**

| Param | Type |
| ------ | ------ |
| servicePrefix | `string` |
| pathname | `string`[] |
| `Optional` overrideTenant |  `undefined` &#124; `string`|

**Returns:** `string`

___
<a id="delete"></a>

###  delete

▸ **delete**(path: *`string`*, data?: * `undefined` &#124; `object`*, query?: *[QueryArgs](../interfaces/queryargs.md)*): `Promise`<`any`>

Performs a DELETE on the Splunk SSC environment with the supplied path. For the most part this is an internal implementation, but is here in case an API endpoint is unsupported by the SDK.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| path | `string` |  Path portion of the URL to request from Splunk |
| `Optional` data |  `undefined` &#124; `object`|  Data object (to be converted to json) to supply as delete body |
| `Optional` query | [QueryArgs](../interfaces/queryargs.md) |  Object that contains query parameters |

**Returns:** `Promise`<`any`>

___
<a id="get"></a>

###  get

▸ **get**(path: *`string`*, query?: *[QueryArgs](../interfaces/queryargs.md)*, headers?: *[RequestHeaders](../interfaces/requestheaders.md)*): `Promise`<`any`>

Performs a GET on the Splunk SSC environment with the supplied path. For the most part this is an internal implementation, but is here in case an API endpoint is unsupported by the SDK.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| path | `string` |  Path portion of the URL to request from Splunk |
| `Optional` query | [QueryArgs](../interfaces/queryargs.md) |  Object that contains query parameters |
| `Optional` headers | [RequestHeaders](../interfaces/requestheaders.md) |

**Returns:** `Promise`<`any`>

___
<a id="patch"></a>

###  patch

▸ **patch**(path: *`string`*, data: *`object`*): `Promise`<`any`>

Performs a PATCH on the splunk ssc environment with the supplied path. for the most part this is an internal implementation, but is here in case an api endpoint is unsupported by the sdk.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| path | `string` |  Path portion of the url to request from splunk |
| data | `object` |  Data object (to be converted to json) to supply as patch body |

**Returns:** `Promise`<`any`>

___
<a id="post"></a>

###  post

▸ **post**(path: *`string`*, data: *`any`*, query?: *[QueryArgs](../interfaces/queryargs.md)*): `Promise`<`any`>

Performs a POST on the Splunk SSC environment with the supplied path. For the most part this is an internal implementation, but is here in case an API endpoint is unsupported by the SDK.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| path | `string` |  Path portion of the URL to request from Splunk |
| data | `any` |  Data object (to be converted to JSON) to supply as POST body |
| `Optional` query | [QueryArgs](../interfaces/queryargs.md) |  Object that contains query parameters |

**Returns:** `Promise`<`any`>

___
<a id="put"></a>

###  put

▸ **put**(path: *`string`*, data: *`any`*): `Promise`<`any`>

Performs a PUT on the splunk ssc environment with the supplied path. for the most part this is an internal implementation, but is here in case an api endpoint is unsupported by the sdk.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| path | `string` |  Path portion of the url to request from splunk |
| data | `any` |  Data object (to be converted to json) to supply as put body |

**Returns:** `Promise`<`any`>

___

