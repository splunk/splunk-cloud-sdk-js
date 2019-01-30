[@splunk/cloud-sdk](../README.md) > [KVCollection](../interfaces/kvcollection.md)

# Interface: KVCollection

## Hierarchy

 [DatasetBase](datasetbase.md)

**↳ KVCollection**

## Index

### Properties

* [id](kvcollection.md#id)
* [kind](kvcollection.md#kind)
* [module](kvcollection.md#module)
* [name](kvcollection.md#name)

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

**● kind**: *[KVCollection](../enums/datasettypes.md#kvcollection)*

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

