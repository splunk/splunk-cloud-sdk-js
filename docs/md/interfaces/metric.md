[@splunk/cloud-sdk](../README.md) > [Metric](../interfaces/metric.md)

# Interface: Metric

Metric - Specify individual metric data.
*__property__*: Dimensions allow metrics to be classified e.g. {"Server":"nginx", "Region":"us-west-1", ...}

*__property__*: Name of the metric e.g. CPU, Memory etc.

*__property__*: Type of metric. Default is g for gauge.

*__property__*: Unit of the metric e.g. percent, megabytes, seconds etc.

*__property__*: Value of the metric.

## Hierarchy

 [DatasetBase](datasetbase.md)

**↳ Metric**

## Index

### Properties

* [dimensions](metric.md#dimensions)
* [disabled](metric.md#disabled)
* [frozenTimePeriodInSecs](metric.md#frozentimeperiodinsecs)
* [id](metric.md#id)
* [kind](metric.md#kind)
* [module](metric.md#module)
* [name](metric.md#name)
* [type](metric.md#type)
* [unit](metric.md#unit)
* [value](metric.md#value)

---

## Properties

<a id="dimensions"></a>

### `<Optional>` dimensions

**● dimensions**: * `undefined` &#124; `object`
*

Dimensions allow metrics to be classified e.g. {"Server":"nginx", "Region":"us-west-1", ...}

___
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

**● kind**: *[Metric](../enums/datasettypes.md#metric)*

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

The dataset name. Dataset names must be unique within each module. Name of the metric e.g. CPU, Memory etc.

___
<a id="type"></a>

### `<Optional>` type

**● type**: * `undefined` &#124; `string`
*

Type of metric. Default is g for gauge.

___
<a id="unit"></a>

### `<Optional>` unit

**● unit**: * `undefined` &#124; `string`
*

Unit of the metric e.g. percent, megabytes, seconds etc.

___
<a id="value"></a>

### `<Optional>` value

**● value**: * `undefined` &#124; `number`
*

Value of the metric.

___

