[@splunk/ssc-client](../README.md) > [ActionService](../classes/actionservice.md)

# Class: ActionService

Encapsulates Action service endpoints

## Hierarchy

 [BaseApiService](baseapiservice.md)

**↳ ActionService**

## Index

### Constructors

* [constructor](actionservice.md#constructor)

### Properties

* [client](actionservice.md#client)

### Methods

* [createAction](actionservice.md#createaction)
* [deleteAction](actionservice.md#deleteaction)
* [getAction](actionservice.md#getaction)
* [getActionStatus](actionservice.md#getactionstatus)
* [getActions](actionservice.md#getactions)
* [triggerAction](actionservice.md#triggeraction)
* [updateAction](actionservice.md#updateaction)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ActionService**(clientOrUrl: * `string` &#124; [ServiceClient](serviceclient.md)*, token?: * `undefined` &#124; `string`*, defaultTenant?: * `undefined` &#124; `string`*): [ActionService](actionservice.md)

**Parameters:**

| Param | Type |
| ------ | ------ |
| clientOrUrl |  `string` &#124; [ServiceClient](serviceclient.md)|
| `Optional` token |  `undefined` &#124; `string`|
| `Optional` defaultTenant |  `undefined` &#124; `string`|

**Returns:** [ActionService](actionservice.md)

___

## Properties

<a id="client"></a>

### `<Protected>` client

**● client**: *[ServiceClient](serviceclient.md)*

___

## Methods

<a id="createaction"></a>

###  createAction

▸ **createAction**(action: *[Action](../enums/action.md)*): `Promise`<[Action](../enums/action.md)>

Create an action

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| action | [Action](../enums/action.md) |  input action |

**Returns:** `Promise`<[Action](../enums/action.md)>
Promise of an action

___
<a id="deleteaction"></a>

###  deleteAction

▸ **deleteAction**(name: *`string`*): `Promise`<`any`>

Delete an action by name

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  name of the action |

**Returns:** `Promise`<`any`>
Promise of object

___
<a id="getaction"></a>

###  getAction

▸ **getAction**(name: *`string`*): `Promise`<[Action](../enums/action.md)>

Get an action by name

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  name of the action |

**Returns:** `Promise`<[Action](../enums/action.md)>
Promise of an action

___
<a id="getactionstatus"></a>

###  getActionStatus

▸ **getActionStatus**(name: *`string`*, statusId: *`string`*): `Promise`<[ActionStatus](../interfaces/actionstatus.md)>

Get action status

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  name of the action |
| statusId | `string` |  statusId |

**Returns:** `Promise`<[ActionStatus](../interfaces/actionstatus.md)>
Promise of actionStatus

___
<a id="getactions"></a>

###  getActions

▸ **getActions**(): `Promise`<[Action](../enums/action.md)[]>

Get all actions in action service.

**Returns:** `Promise`<[Action](../enums/action.md)[]>
Promise of all actions

___
<a id="triggeraction"></a>

###  triggerAction

▸ **triggerAction**(name: *`string`*, notification: *[ActionNotification](../interfaces/actionnotification.md)*): `Promise`<[ActionTriggerResponse](../interfaces/actiontriggerresponse.md)>

Trigger an action

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  name of the action |
| notification | [ActionNotification](../interfaces/actionnotification.md) |  action notification |

**Returns:** `Promise`<[ActionTriggerResponse](../interfaces/actiontriggerresponse.md)>
Promise of actionTriggerResponse

___
<a id="updateaction"></a>

###  updateAction

▸ **updateAction**(name: *`string`*, action: *[ActionUpdateFields](../interfaces/actionupdatefields.md)*): `Promise`<[Action](../enums/action.md)>

Update an action

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  name of the action |
| action | [ActionUpdateFields](../interfaces/actionupdatefields.md) |  action updates |

**Returns:** `Promise`<[Action](../enums/action.md)>
Promise of an action

___

