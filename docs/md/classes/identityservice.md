[@splunk/ssc-client](../README.md) > [IdentityService](../classes/identityservice.md)

# Class: IdentityService

Encapsulates Identity endpoints

## Hierarchy

 [BaseApiService](baseapiservice.md)

**↳ IdentityService**

## Index

### Constructors

* [constructor](identityservice.md#constructor)

### Properties

* [client](identityservice.md#client)

### Methods

* [addTenantUsers](identityservice.md#addtenantusers)
* [createTenant](identityservice.md#createtenant)
* [deleteTenant](identityservice.md#deletetenant)
* [deleteTenantUsers](identityservice.md#deletetenantusers)
* [getTenantUsers](identityservice.md#gettenantusers)
* [getUserProfile](identityservice.md#getuserprofile)
* [replaceTenantUsers](identityservice.md#replacetenantusers)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new IdentityService**(clientOrUrl: * `string` &#124; [ServiceClient](serviceclient.md)*, token?: * `undefined` &#124; `string`*, defaultTenant?: * `undefined` &#124; `string`*): [IdentityService](identityservice.md)

**Parameters:**

| Param | Type |
| ------ | ------ |
| clientOrUrl |  `string` &#124; [ServiceClient](serviceclient.md)|
| `Optional` token |  `undefined` &#124; `string`|
| `Optional` defaultTenant |  `undefined` &#124; `string`|

**Returns:** [IdentityService](identityservice.md)

___

## Properties

<a id="client"></a>

### `<Protected>` client

**● client**: *[ServiceClient](serviceclient.md)*

___

## Methods

<a id="addtenantusers"></a>

###  addTenantUsers

▸ **addTenantUsers**(tenantId: *`string`*, users: *[User](../interfaces/user.md)[]*): `Promise`<`any`>

Adds a list of users to the tenant

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| tenantId | `string` |  - |
| users | [User](../interfaces/user.md)[] |   |

**Returns:** `Promise`<`any`>

___
<a id="createtenant"></a>

###  createTenant

▸ **createTenant**(tenantId: *`string`*): `Promise`<`any`>

Adds a tenant

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| tenantId | `string` |   |

**Returns:** `Promise`<`any`>

___
<a id="deletetenant"></a>

###  deleteTenant

▸ **deleteTenant**(tenantId: *`string`*): `Promise`<`any`>

Deletes a tenant

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| tenantId | `string` |   |

**Returns:** `Promise`<`any`>

___
<a id="deletetenantusers"></a>

###  deleteTenantUsers

▸ **deleteTenantUsers**(tenantId: *`string`*, users: *[User](../interfaces/user.md)[]*): `Promise`<`any`>

Deletes a list of users from the tenant

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| tenantId | `string` |  - |
| users | [User](../interfaces/user.md)[] |   |

**Returns:** `Promise`<`any`>

___
<a id="gettenantusers"></a>

###  getTenantUsers

▸ **getTenantUsers**(tenantId: *`string`*): `Promise`<[User](../interfaces/user.md)[]>

Reads a list of users in the given tenant

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| tenantId | `string` |   |

**Returns:** `Promise`<[User](../interfaces/user.md)[]>

___
<a id="getuserprofile"></a>

###  getUserProfile

▸ **getUserProfile**(tenantId?: *`string`*): `Promise`<[UserProfile](../interfaces/userprofile.md)>

Authenticate the user by the access token obtained from authorization header and return user profile data, including tenant memberships

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` tenantId | `string` | &quot;system&quot; |   |

**Returns:** `Promise`<[UserProfile](../interfaces/userprofile.md)>

___
<a id="replacetenantusers"></a>

###  replaceTenantUsers

▸ **replaceTenantUsers**(tenantId: *`string`*, users: *[User](../interfaces/user.md)[]*): `Promise`<`any`>

Replaces current tenant users with new users

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| tenantId | `string` |  - |
| users | [User](../interfaces/user.md)[] |   |

**Returns:** `Promise`<`any`>

___

