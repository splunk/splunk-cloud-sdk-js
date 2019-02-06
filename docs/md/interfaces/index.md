[@splunk/cloud-sdk](../README.md) > [Index](../interfaces/index.md)

# Interface: Index

## Hierarchy

 [DatasetBase](datasetbase.md)

**↳ Index**

## Index

### Properties

* [disabled](index.md#disabled)
* [frozenTimePeriodInSecs](index.md#frozentimeperiodinsecs)
* [id](index.md#id)
* [kind](index.md#kind)
* [module](index.md#module)
* [name](index.md#name)

---

## Properties

<a id="disabled"></a>

### `<Optional>` disabled

**● disabled**: * `undefined` &#124; `true` &#124; `false`
*

Specifies whether or not the Splunk index is disabled.

___
<a id="frozentimeperiodinsecs"></a>

### `<Optional>` frozenTimePeriodInSecs

**● frozenTimePeriodInSecs**: * `undefined` &#124; `number`
*

The frozenTimePeriodInSecs to use for the index

___
<a id="id"></a>

### `<Optional>` id

**● id**: * `undefined` &#124; `string`
*

A unique dataset ID. Random ID used if not provided. Not valid for PATCH method.

___
<a id="kind"></a>

###  kind

**● kind**: *[Index](../enums/datasettypes.md#index)*

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

