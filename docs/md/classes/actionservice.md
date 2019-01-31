[@splunk/cloud-sdk](../README.md) > [ActionService](../classes/actionservice.md)

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

| Name | Type |
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

▸ **createAction**(action: *[Action](../#action)*): `Promise`<[Action](../#action)>

Create an action

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| action | [Action](../#action) |  input action |

**Returns:** `Promise`<[Action](../#action)>
Promise of an action

___
<a id="deleteaction"></a>

###  deleteAction

▸ **deleteAction**(name: *`string`*): `Promise`<`any`>

Delete an action by name

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  name of the action |

**Returns:** `Promise`<`any`>
Promise of object

___
<a id="getaction"></a>

###  getAction

▸ **getAction**(name: *`string`*): `Promise`<[Action](../#action)>

Get an action by name

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  name of the action |

**Returns:** `Promise`<[Action](../#action)>
Promise of an action

___
<a id="getactionstatus"></a>

###  getActionStatus

▸ **getActionStatus**(name: *`string`*, statusId: *`string`*): `Promise`<[ActionStatus](../interfaces/actionstatus.md)>

Get action status

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  name of the action |
| statusId | `string` |  statusId |

**Returns:** `Promise`<[ActionStatus](../interfaces/actionstatus.md)>
Promise of actionStatus

___
<a id="getactions"></a>

###  getActions

▸ **getActions**(): `Promise`<[Action](../#action)[]>

Get all actions in action service.

**Returns:** `Promise`<[Action](../#action)[]>
Promise of all actions

___
<a id="triggeraction"></a>

###  triggerAction

▸ **triggerAction**(name: *`string`*, notification: *[Notification](../interfaces/notification.md)*): `Promise`<[ActionTriggerResponse](../interfaces/actiontriggerresponse.md)>

Trigger an action

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  name of the action |
| notification | [Notification](../interfaces/notification.md) |  action notification |

**Returns:** `Promise`<[ActionTriggerResponse](../interfaces/actiontriggerresponse.md)>
Promise of actionTriggerResponse

___
<a id="updateaction"></a>

###  updateAction

▸ **updateAction**(name: *`string`*, action: *`Partial`<[Action](../#action)>*): `Promise`<[Action](../#action)>

Update an action

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  name of the action |
| action | `Partial`<[Action](../#action)> |  action updates |

**Returns:** `Promise`<[Action](../#action)>
Promise of an action

___

