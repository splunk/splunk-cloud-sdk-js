[@splunk/cloud-sdk](../README.md) > [Import](../interfaces/import.md)

# Interface: Import

## Hierarchy

 [DatasetBase](datasetbase.md)

**↳ Import**

## Index

### Properties

* [id](import.md#id)
* [kind](import.md#kind)
* [module](import.md#module)
* [name](import.md#name)
* [originalDatasetId](import.md#originaldatasetid)
* [sourceId](import.md#sourceid)
* [sourceModule](import.md#sourcemodule)
* [sourceName](import.md#sourcename)

---

## Properties

<a id="id"></a>

### `<Optional>` id

**● id**: * `undefined` &#124; `string`
*

A unique dataset ID. Random ID used if not provided. Not valid for PATCH method.

___
<a id="kind"></a>

###  kind

**● kind**: *[Import](../enums/datasettypes.md#import)*

___
<a id="module"></a>

### `<Optional>` module

**● module**: * `undefined` &#124; `string`
*

The name of the module to create the new dataset in.

___
<a id="name"></a>

###  name

**● name**: *`string`*

The dataset name. Dataset names must be unique within each module.

___
<a id="originaldatasetid"></a>

### `<Optional>` originalDatasetId

**● originalDatasetId**: * `undefined` &#124; `string`
*

The dataset ID being imported.

___
<a id="sourceid"></a>

### `<Optional>` sourceId

**● sourceId**: * `undefined` &#124; `string`
*

The dataset ID being imported.

___
<a id="sourcemodule"></a>

###  sourceModule

**● sourceModule**: *`string`*

The dataset module being imported.

___
<a id="sourcename"></a>

###  sourceName

**● sourceName**: *`string`*

The dataset name being imported.

___

