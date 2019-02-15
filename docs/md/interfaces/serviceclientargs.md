[@splunk/cloud-sdk](../README.md) > [ServiceClientArgs](../interfaces/serviceclientargs.md)

# Interface: ServiceClientArgs

## Hierarchy

**ServiceClientArgs**

## Index

### Properties

* [defaultTenant](serviceclientargs.md#defaulttenant)
* [tokenSource](serviceclientargs.md#tokensource)
* [url](serviceclientargs.md#url)
* [urls](serviceclientargs.md#urls)

---

## Properties

<a id="defaulttenant"></a>

### `<Optional>` defaultTenant

**● defaultTenant**: * `undefined` &#124; `string`
*

Default tenant to use for requests

___
<a id="tokensource"></a>

###  tokenSource

**● tokenSource**: * [AuthManager](authmanager.md) &#124; `string` &#124; [TokenProviderFunction](../#tokenproviderfunction)
*

A function that returns a token. A string that is a token. Or, an object containing a function named `getAccessToken` that returns a token.

___
<a id="url"></a>

### `<Optional>` url

**● url**: * `undefined` &#124; `string`
*

*__deprecated__*: Use urls instead

___
<a id="urls"></a>

### `<Optional>` urls

**● urls**: * `undefined` &#124; `object`
*

An object of key value pairs, where the keys represent a Splunk Cloud Platform cluster, and values are the base url for the cluster. Example: `{ "api": "https://api.splunkbeta.com" }`

___

