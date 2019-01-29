[@splunk/cloud-sdk](../README.md) > [View](../interfaces/view.md)

# Interface: View

## Hierarchy

 [DatasetBase](datasetbase.md)

**↳ View**

## Index

### Properties

* [id](view.md#id)
* [kind](view.md#kind)
* [module](view.md#module)
* [name](view.md#name)
* [search](view.md#search)

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

**● kind**: *[View](../enums/datasettypes.md#view)*

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
<a id="search"></a>

###  search

**● search**: *`string`*

A valid SPL-defined search.

___

