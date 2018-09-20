[@splunk/cloud-sdk](../README.md) > [Metric](../interfaces/metric.md)

# Interface: Metric

Metric - Specify individual metric data.
*__property__*: Dimensions allow metrics to be classified e.g. {"Server":"nginx", "Region":"us-west-1", ...}

*__property__*: Name of the metric e.g. CPU, Memory etc.

*__property__*: Type of metric. Default is g for gauge.

*__property__*: Unit of the metric e.g. percent, megabytes, seconds etc.

*__property__*: Value of the metric.

## Hierarchy

**Metric**

## Index

### Properties

* [dimensions](metric.md#dimensions)
* [name](metric.md#name)
* [type](metric.md#type)
* [unit](metric.md#unit)
* [value](metric.md#value)

---

## Properties

<a id="dimensions"></a>

###  dimensions

**● dimensions**: *`object`*

Dimensions allow metrics to be classified e.g. {"Server":"nginx", "Region":"us-west-1", ...}

___
<a id="name"></a>

###  name

**● name**: *`string`*

Name of the metric e.g. CPU, Memory etc.

___
<a id="type"></a>

###  type

**● type**: *`string`*

Type of metric. Default is g for gauge.

___
<a id="unit"></a>

###  unit

**● unit**: *`string`*

Unit of the metric e.g. percent, megabytes, seconds etc.

___
<a id="value"></a>

###  value

**● value**: *`number`*

Value of the metric.

___

