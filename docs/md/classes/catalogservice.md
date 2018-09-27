[@splunk/cloud-sdk](../README.md) > [CatalogService](../classes/catalogservice.md)

# Class: CatalogService

Encapsulates catalog endpoints

## Hierarchy

 [BaseApiService](baseapiservice.md)

**↳ CatalogService**

## Index

### Constructors

* [constructor](catalogservice.md#constructor)

### Properties

* [client](catalogservice.md#client)

### Methods

* [createDataset](catalogservice.md#createdataset)
* [createRule](catalogservice.md#createrule)
* [createRuleAction](catalogservice.md#createruleaction)
* [deleteDataset](catalogservice.md#deletedataset)
* [deleteDatasetByName](catalogservice.md#deletedatasetbyname)
* [deleteDatasetField](catalogservice.md#deletedatasetfield)
* [deleteRule](catalogservice.md#deleterule)
* [deleteRuleAction](catalogservice.md#deleteruleaction)
* [getDataset](catalogservice.md#getdataset)
* [getDatasetField](catalogservice.md#getdatasetfield)
* [getDatasetFields](catalogservice.md#getdatasetfields)
* [getDatasets](catalogservice.md#getdatasets)
* [getField](catalogservice.md#getfield)
* [getFields](catalogservice.md#getfields)
* [getModules](catalogservice.md#getmodules)
* [getRule](catalogservice.md#getrule)
* [getRuleAction](catalogservice.md#getruleaction)
* [getRuleActions](catalogservice.md#getruleactions)
* [getRules](catalogservice.md#getrules)
* [patchDatasetField](catalogservice.md#patchdatasetfield)
* [postDatasetField](catalogservice.md#postdatasetfield)
* [updateDataset](catalogservice.md#updatedataset)
* [updateRuleAction](catalogservice.md#updateruleaction)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new CatalogService**(clientOrUrl: * `string` &#124; [ServiceClient](serviceclient.md)*, token?: * `undefined` &#124; `string`*, defaultTenant?: * `undefined` &#124; `string`*): [CatalogService](catalogservice.md)

**Parameters:**

| Param | Type |
| ------ | ------ |
| clientOrUrl |  `string` &#124; [ServiceClient](serviceclient.md)|
| `Optional` token |  `undefined` &#124; `string`|
| `Optional` defaultTenant |  `undefined` &#124; `string`|

**Returns:** [CatalogService](catalogservice.md)

___

## Properties

<a id="client"></a>

### `<Protected>` client

**● client**: *[ServiceClient](serviceclient.md)*

___

## Methods

<a id="createdataset"></a>

###  createDataset

▸ **createDataset**(dataset: *[DatasetInfo](../interfaces/datasetinfo.md)*): `Promise`<[DatasetInfo](../interfaces/datasetinfo.md)>

Create a new dataset.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| dataset | [DatasetInfo](../interfaces/datasetinfo.md) |  The dataset to create |

**Returns:** `Promise`<[DatasetInfo](../interfaces/datasetinfo.md)>
description of the new dataset

___
<a id="createrule"></a>

###  createRule

▸ **createRule**(rule: *[Rule](../interfaces/rule.md)*): `Promise`<[Rule](../interfaces/rule.md)>

Create a new Rule

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| rule | [Rule](../interfaces/rule.md) |  The rule to create |

**Returns:** `Promise`<[Rule](../interfaces/rule.md)>
a description of the new rule

___
<a id="createruleaction"></a>

###  createRuleAction

▸ **createRuleAction**(ruleID: *`string`*, action: * [AliasAction](../interfaces/aliasaction.md) &#124; [AutoKVAction](../interfaces/autokvaction.md) &#124; [EvalAction](../interfaces/evalaction.md) &#124; [LookupAction](../interfaces/lookupaction.md) &#124; [RegexAction](../interfaces/regexaction.md)*): `Promise`< [AliasAction](../interfaces/aliasaction.md) &#124; [AutoKVAction](../interfaces/autokvaction.md) &#124; [EvalAction](../interfaces/evalaction.md) &#124; [LookupAction](../interfaces/lookupaction.md) &#124; [RegexAction](../interfaces/regexaction.md)>

Create a new Rule Action

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ruleID | `string` |  - |
| action |  [AliasAction](../interfaces/aliasaction.md) &#124; [AutoKVAction](../interfaces/autokvaction.md) &#124; [EvalAction](../interfaces/evalaction.md) &#124; [LookupAction](../interfaces/lookupaction.md) &#124; [RegexAction](../interfaces/regexaction.md)|  The rule action to create |

**Returns:** `Promise`< [AliasAction](../interfaces/aliasaction.md) &#124; [AutoKVAction](../interfaces/autokvaction.md) &#124; [EvalAction](../interfaces/evalaction.md) &#124; [LookupAction](../interfaces/lookupaction.md) &#124; [RegexAction](../interfaces/regexaction.md)>
a description of the new rule action

___
<a id="deletedataset"></a>

###  deleteDataset

▸ **deleteDataset**(datasetIdOrResourceName: *`string`*): `Promise`<`any`>

Delete the DatasetInfo and its dependencies with the specified `id`

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| datasetIdOrResourceName | `string` |  - |

**Returns:** `Promise`<`any`>
A promise that will be resolved when deletion is complete

___
<a id="deletedatasetbyname"></a>

###  deleteDatasetByName

▸ **deleteDatasetByName**(name: *`string`*): `Promise`<`any`>

Delete the Dataset

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  of the Dataset to delete |

**Returns:** `Promise`<`any`>
A promise that will be resolved when deletion is complete

___
<a id="deletedatasetfield"></a>

###  deleteDatasetField

▸ **deleteDatasetField**(datasetID: *`string`*, datasetFieldID: *`string`*): `Promise`<`any`>

Deletes the dataset field with the specified datasetID and datasetFieldID

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| datasetID | `string` |  - |
| datasetFieldID | `string` |  - |

**Returns:** `Promise`<`any`>
promise that will be resolved when field is deleted

___
<a id="deleterule"></a>

###  deleteRule

▸ **deleteRule**(ruleIdOrResourceName: *`string`*): `Promise`<`any`>

Delete the Rule and its dependencies with the specified `id`

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ruleIdOrResourceName | `string` |  - |

**Returns:** `Promise`<`any`>
Promise that will be resolved when the rule is deleted

___
<a id="deleteruleaction"></a>

###  deleteRuleAction

▸ **deleteRuleAction**(ruleID: *`string`*, actionID: *`string`*): `Promise`<`any`>

Deletes the rule action with the specified ruleID and actionID

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ruleID | `string` |  - |
| actionID | `string` |  - |

**Returns:** `Promise`<`any`>
promise that will be resolved when rule action is deleted

___
<a id="getdataset"></a>

###  getDataset

▸ **getDataset**(datasetIdOrResourceName: *`string`*): `Promise`<[DatasetInfo](../interfaces/datasetinfo.md)>

Returns the dataset resource with the specified `id` or `resourceName`.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| datasetIdOrResourceName | `string` |  - |

**Returns:** `Promise`<[DatasetInfo](../interfaces/datasetinfo.md)>
description of the dataset

___
<a id="getdatasetfield"></a>

###  getDatasetField

▸ **getDatasetField**(datasetID: *`string`*, datasetFieldID: *`string`*): `Promise`<[Field](../interfaces/field.md)>

Gets the Field with the specified datasetID and datasetFieldID

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| datasetID | `string` |  - |
| datasetFieldID | `string` |  - |

**Returns:** `Promise`<[Field](../interfaces/field.md)>
field description

___
<a id="getdatasetfields"></a>

###  getDatasetFields

▸ **getDatasetFields**(datasetID: *`string`*, filter?: * `undefined` &#124; `string`*): `Promise`<[Field](../interfaces/field.md)[]>

Get the list of dataset fields for the given `id`

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| datasetID | `string` |  - |
| `Optional` filter |  `undefined` &#124; `string`|  An SPL filter string |

**Returns:** `Promise`<[Field](../interfaces/field.md)[]>
array of field descriptions for fields defined on the dataset

___
<a id="getdatasets"></a>

###  getDatasets

▸ **getDatasets**(filter?: * `undefined` &#124; `string`*): `Promise`<[DatasetInfo](../interfaces/datasetinfo.md)[]>

Returns a list of datasets, optionally filtered by a filter string.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| `Optional` filter |  `undefined` &#124; `string`|  An SPL filter string |

**Returns:** `Promise`<[DatasetInfo](../interfaces/datasetinfo.md)[]>
Array of dataset descriptors

___
<a id="getfield"></a>

###  getField

▸ **getField**(fieldID: *`string`*): `Promise`<[Field](../interfaces/field.md)>

Get the matching field

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fieldID | `string` |  - |

**Returns:** `Promise`<[Field](../interfaces/field.md)>
description of the field

___
<a id="getfields"></a>

###  getFields

▸ **getFields**(filter?: * `undefined` &#124; `string`*): `Promise`<[Field](../interfaces/field.md)[]>

Gets the list of fields

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| `Optional` filter |  `undefined` &#124; `string`|  An SPL filter string |

**Returns:** `Promise`<[Field](../interfaces/field.md)[]>
fields

___
<a id="getmodules"></a>

###  getModules

▸ **getModules**(filter?: * `undefined` &#124; `string`*): `Promise`<[Module](../interfaces/module.md)[]>

Return a list of modules that match a filter query if it is given, otherwise return all modules. @param filter a filter to apply to the Modules @return Array of module names

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` filter |  `undefined` &#124; `string`|

**Returns:** `Promise`<[Module](../interfaces/module.md)[]>

___
<a id="getrule"></a>

###  getRule

▸ **getRule**(ruleIdOrResourceName: *`string`*): `Promise`<[Rule](../interfaces/rule.md)>

Return the Rule with the specified `id`

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ruleIdOrResourceName | `string` |  - |

**Returns:** `Promise`<[Rule](../interfaces/rule.md)>
description of the rule

___
<a id="getruleaction"></a>

###  getRuleAction

▸ **getRuleAction**(ruleID: *`string`*, actionID: *`string`*): `Promise`< [AliasAction](../interfaces/aliasaction.md) &#124; [AutoKVAction](../interfaces/autokvaction.md) &#124; [EvalAction](../interfaces/evalaction.md) &#124; [LookupAction](../interfaces/lookupaction.md) &#124; [RegexAction](../interfaces/regexaction.md)>

Gets the rule action with the specified ruleID and actionID

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ruleID | `string` |  - |
| actionID | `string` |  - |

**Returns:** `Promise`< [AliasAction](../interfaces/aliasaction.md) &#124; [AutoKVAction](../interfaces/autokvaction.md) &#124; [EvalAction](../interfaces/evalaction.md) &#124; [LookupAction](../interfaces/lookupaction.md) &#124; [RegexAction](../interfaces/regexaction.md)>
a rule action

___
<a id="getruleactions"></a>

###  getRuleActions

▸ **getRuleActions**(ruleID: *`string`*, filter?: * `undefined` &#124; `string`*): `Promise`< [AliasAction](../interfaces/aliasaction.md)[] &#124; [AutoKVAction](../interfaces/autokvaction.md)[] &#124; [EvalAction](../interfaces/evalaction.md)[] &#124; [LookupAction](../interfaces/lookupaction.md)[] &#124; [RegexAction](../interfaces/regexaction.md)[]>

Gets the list of rule actions

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ruleID | `string` |  - |
| `Optional` filter |  `undefined` &#124; `string`|  An SPL filter string |

**Returns:** `Promise`< [AliasAction](../interfaces/aliasaction.md)[] &#124; [AutoKVAction](../interfaces/autokvaction.md)[] &#124; [EvalAction](../interfaces/evalaction.md)[] &#124; [LookupAction](../interfaces/lookupaction.md)[] &#124; [RegexAction](../interfaces/regexaction.md)[]>
rule actions

___
<a id="getrules"></a>

###  getRules

▸ **getRules**(filter?: * `undefined` &#124; `string`*): `Promise`<[Rule](../interfaces/rule.md)[]>

Get the matching list of Rules

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| `Optional` filter |  `undefined` &#124; `string`|  An SPL filter string |

**Returns:** `Promise`<[Rule](../interfaces/rule.md)[]>
description of defined rules (optionally matching SPL query)

___
<a id="patchdatasetfield"></a>

###  patchDatasetField

▸ **patchDatasetField**(datasetID: *`string`*, datasetFieldID: *`string`*, datasetField: *[Field](../interfaces/field.md)*): `Promise`<[Field](../interfaces/field.md)>

Updates an existing dataset field

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| datasetID | `string` |  - |
| datasetFieldID | `string` |  - |
| datasetField | [Field](../interfaces/field.md) |  - |

**Returns:** `Promise`<[Field](../interfaces/field.md)>
updated description of the field

___
<a id="postdatasetfield"></a>

###  postDatasetField

▸ **postDatasetField**(datasetID: *`string`*, datasetField: *[Field](../interfaces/field.md)*): `Promise`<[Field](../interfaces/field.md)>

Creates a new dataset field

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| datasetID | `string` |  - |
| datasetField | [Field](../interfaces/field.md) |  - |

**Returns:** `Promise`<[Field](../interfaces/field.md)>
description of the new field defined on the dataset

___
<a id="updatedataset"></a>

###  updateDataset

▸ **updateDataset**(datasetIdOrResourceName: *`string`*, partial: *[PartialDatasetInfo](../interfaces/partialdatasetinfo.md)*): `Promise`<[DatasetInfo](../interfaces/datasetinfo.md)>

Updates the supplied dataset

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| datasetIdOrResourceName | `string` |  - |
| partial | [PartialDatasetInfo](../interfaces/partialdatasetinfo.md) |  - |

**Returns:** `Promise`<[DatasetInfo](../interfaces/datasetinfo.md)>
information about the updated dataset

___
<a id="updateruleaction"></a>

###  updateRuleAction

▸ **updateRuleAction**(ruleID: *`string`*, actionID: *`string`*, action: * [AliasAction](../interfaces/aliasaction.md) &#124; [AutoKVAction](../interfaces/autokvaction.md) &#124; [EvalAction](../interfaces/evalaction.md) &#124; [LookupAction](../interfaces/lookupaction.md) &#124; [RegexAction](../interfaces/regexaction.md)*): `Promise`< [AliasAction](../interfaces/aliasaction.md) &#124; [AutoKVAction](../interfaces/autokvaction.md) &#124; [EvalAction](../interfaces/evalaction.md) &#124; [LookupAction](../interfaces/lookupaction.md) &#124; [RegexAction](../interfaces/regexaction.md)>

Updates the supplied rule action

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ruleID | `string` |  - |
| actionID | `string` |  - |
| action |  [AliasAction](../interfaces/aliasaction.md) &#124; [AutoKVAction](../interfaces/autokvaction.md) &#124; [EvalAction](../interfaces/evalaction.md) &#124; [LookupAction](../interfaces/lookupaction.md) &#124; [RegexAction](../interfaces/regexaction.md)|

**Returns:** `Promise`< [AliasAction](../interfaces/aliasaction.md) &#124; [AutoKVAction](../interfaces/autokvaction.md) &#124; [EvalAction](../interfaces/evalaction.md) &#124; [LookupAction](../interfaces/lookupaction.md) &#124; [RegexAction](../interfaces/regexaction.md)>
information about the updated rule action

___

