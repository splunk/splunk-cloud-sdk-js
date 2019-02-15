[@splunk/cloud-sdk](../README.md) > [ServiceClient](../classes/serviceclient.md)

# Class: ServiceClient

This class acts as a raw proxy for Splunk Cloud, implementing authorization for requests, setting the proper headers, and GET, POST, etc. For the most part you shouldn't need to use this class directly- look at the service proxies that implement the actual endpoints. TODO: Add links to actual endpoints, Splunk Cloud name

## Hierarchy

**ServiceClient**

## Index

### Constructors

* [constructor](serviceclient.md#constructor)

### Methods

* [addResponseHook](serviceclient.md#addresponsehook)
* [buildPath](serviceclient.md#buildpath)
* [buildUrl](serviceclient.md#buildurl)
* [clearResponseHooks](serviceclient.md#clearresponsehooks)
* [delete](serviceclient.md#delete)
* [fetch](serviceclient.md#fetch)
* [get](serviceclient.md#get)
* [patch](serviceclient.md#patch)
* [post](serviceclient.md#post)
* [put](serviceclient.md#put)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ServiceClient**(args: * [ServiceClientArgs](../interfaces/serviceclientargs.md) &#124; `string`*, token?: * `undefined` &#124; `string`*, tenant?: * `undefined` &#124; `string`*): [ServiceClient](serviceclient.md)

Create a ServiceClient with the given URL and an auth token

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| args |  [ServiceClientArgs](../interfaces/serviceclientargs.md) &#124; `string`|  A string that is an authentication or a ServiceClientArgs Url to a Splunk Cloud instance |
| `Optional` token |  `undefined` &#124; `string`|  Authentication token |
| `Optional` tenant |  `undefined` &#124; `string`|  Tenant to use for requests |

**Returns:** [ServiceClient](serviceclient.md)

___

## Methods

<a id="addresponsehook"></a>

###  addResponseHook

▸ **addResponseHook**(hook: *[ResponseHook](../#responsehook)*): `void`

Adds a response hook to the list of response handlers. Each will be called with a response for each request in defining order- if the callback returns a Response object, it will be substituted for the argument it was called with. This can be used for several things- logging requests (if it returns null it will not affect the result), retrying failed requests (retry the request, and if successful, return the successful response), etc.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| hook | [ResponseHook](../#responsehook) |  A callback that takes a \`Response\` object and optionally returns a \`Response\` |

**Returns:** `void`

___
<a id="buildpath"></a>

###  buildPath

▸ **buildPath**(servicePrefix: *`string`*, segments: *`string`[]*, overrideTenant?: * `undefined` &#124; `string`*): `string`

Builds a path for a given service call

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| servicePrefix | `string` |  The name of the service, with version (search/v1) |
| segments | `string`[] |  An array of path elements that will be checked and added to the path (\['jobs', jobId\]) |
| `Optional` overrideTenant |  `undefined` &#124; `string`|  If supplied, this tenant will be used instead of the tenant associated with this client object |

**Returns:** `string`
A fully qualified path to the resource

___
<a id="buildurl"></a>

###  buildUrl

▸ **buildUrl**(cluster: *`string`*, path: *`string`*, query?: *[QueryArgs](../interfaces/queryargs.md)*): `string`

Builds the URL from a service + endpoint with query encoded in url (concatenates the URL with the path)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| cluster | `string` |  Service prefix |
| path | `string` |  Path to the resource being requested |
| `Optional` query | [QueryArgs](../interfaces/queryargs.md) |  QueryArgs object |

**Returns:** `string`
A fully qualified url

___
<a id="clearresponsehooks"></a>

###  clearResponseHooks

▸ **clearResponseHooks**(): `void`

Clears response hooks from the client

**Returns:** `void`

___
<a id="delete"></a>

###  delete

▸ **delete**(cluster: *`string`*, path: *`string`*, data?: *`object`*, opts?: *[RequestOptions](../interfaces/requestoptions.md)*): `Promise`<[HTTPResponse](../interfaces/httpresponse.md)>

Performs a DELETE on the Splunk Cloud environment with the supplied path. For the most part this is an internal implementation, but is here in case an API endpoint is unsupported by the SDK.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| cluster | `string` | - |  Service prefix |
| path | `string` | - |  Path portion of the URL to request from Splunk |
| `Default value` data | `object` |  {} |  Data object (to be converted to json) to supply as delete body |
| `Default value` opts | [RequestOptions](../interfaces/requestoptions.md) |  {} |  Request options |

**Returns:** `Promise`<[HTTPResponse](../interfaces/httpresponse.md)>
A promise containing an HTTPResponse object

___
<a id="fetch"></a>

###  fetch

▸ **fetch**(method: *[HTTPMethod](../#httpmethod)*, cluster: *`string`*, path: *`string`*, opts?: *[RequestOptions](../interfaces/requestoptions.md)*, data?: *`any`*): `Promise`<`Response`>

Proxy for fetch that builds URL, applies headers and query string, and invokes hooks before returning a `Response`

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| method | [HTTPMethod](../#httpmethod) | - |  HTTP Verb |
| cluster | `string` | - |  Service prefix |
| path | `string` | - |  Path to the resource being requested |
| `Default value` opts | [RequestOptions](../interfaces/requestoptions.md) |  {} |  Request opts |
| `Optional` data | `any` | - |  Body data (will be stringified if an object) |

**Returns:** `Promise`<`Response`>

___
<a id="get"></a>

###  get

▸ **get**(cluster: *`string`*, path: *`string`*, opts?: *[RequestOptions](../interfaces/requestoptions.md)*): `Promise`<[HTTPResponse](../interfaces/httpresponse.md)>

Performs a GET on the Splunk Cloud environment with the supplied path. For the most part this is an internal implementation, but is here in case an API endpoint is unsupported by the SDK.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| cluster | `string` | - |  Service prefix |
| path | `string` | - |  Path portion of the URL to request from Splunk |
| `Default value` opts | [RequestOptions](../interfaces/requestoptions.md) |  {} |  Request options |

**Returns:** `Promise`<[HTTPResponse](../interfaces/httpresponse.md)>
A promise containing an HTTPResponse object

___
<a id="patch"></a>

###  patch

▸ **patch**(cluster: *`string`*, path: *`string`*, data: *`object`*, opts?: *[RequestOptions](../interfaces/requestoptions.md)*): `Promise`<[HTTPResponse](../interfaces/httpresponse.md)>

Performs a PATCH on the Splunk Cloud environment with the supplied path. for the most part this is an internal implementation, but is here in case an api endpoint is unsupported by the sdk.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| cluster | `string` | - |  Service prefix |
| path | `string` | - |  Path portion of the url to request from Splunk |
| data | `object` | - |  Data object (to be converted to json) to supply as patch body |
| `Default value` opts | [RequestOptions](../interfaces/requestoptions.md) |  {} |  Request options |

**Returns:** `Promise`<[HTTPResponse](../interfaces/httpresponse.md)>
A promise containing an HTTPResponse object

___
<a id="post"></a>

###  post

▸ **post**(cluster: *`string`*, path: *`string`*, data: *`any`*, opts?: *[RequestOptions](../interfaces/requestoptions.md)*): `Promise`<[HTTPResponse](../interfaces/httpresponse.md)>

Performs a POST on the Splunk Cloud environment with the supplied path. For the most part this is an internal implementation, but is here in case an API endpoint is unsupported by the SDK.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| cluster | `string` | - |  Service prefix |
| path | `string` | - |  Path portion of the URL to request from Splunk |
| data | `any` | - |  Data object (to be converted to JSON) to supply as POST body |
| `Default value` opts | [RequestOptions](../interfaces/requestoptions.md) |  {} |  Request options |

**Returns:** `Promise`<[HTTPResponse](../interfaces/httpresponse.md)>
A promise containing an HTTPResponse object

___
<a id="put"></a>

###  put

▸ **put**(cluster: *`string`*, path: *`string`*, data: *`any`*, opts?: *[RequestOptions](../interfaces/requestoptions.md)*): `Promise`<[HTTPResponse](../interfaces/httpresponse.md)>

Performs a PUT on the Splunk Cloud environment with the supplied path. for the most part this is an internal implementation, but is here in case an api endpoint is unsupported by the sdk.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| cluster | `string` | - |  Service prefix |
| path | `string` | - |  Path portion of the url to request from Splunk |
| data | `any` | - |  Data object (to be converted to json) to supply as put body |
| `Default value` opts | [RequestOptions](../interfaces/requestoptions.md) |  {} |  Request options |

**Returns:** `Promise`<[HTTPResponse](../interfaces/httpresponse.md)>
A promise containing an HTTPResponse object

___

