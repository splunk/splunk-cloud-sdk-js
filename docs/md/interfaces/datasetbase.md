[@splunk/cloud-sdk](../README.md) > [DatasetBase](../interfaces/datasetbase.md)

# Interface: DatasetBase

## Hierarchy

**DatasetBase**

↳  [DatasetBaseResponse](datasetbaseresponse.md)

↳  [Import](import.md)

↳  [Metric](metric.md)

↳  [Index](index.md)

↳  [View](view.md)

↳  [Lookup](lookup.md)

↳  [KVCollection](kvcollection.md)

## Index

### Properties

* [id](datasetbase.md#id)
* [kind](datasetbase.md#kind)
* [module](datasetbase.md#module)
* [name](datasetbase.md#name)

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

**● kind**: *`string`*

The dataset kind.

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

