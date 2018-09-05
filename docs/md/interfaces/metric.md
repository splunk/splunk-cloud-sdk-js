[@splunk/ssc-client](../README.md) > [Metric](../interfaces/metric.md)

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

___
<a id="name"></a>

###  name

**● name**: *`string`*

___
<a id="type"></a>

###  type

**● type**: *`string`*

___
<a id="unit"></a>

###  unit

**● unit**: *`string`*

___
<a id="value"></a>

###  value

**● value**: *`number`*

___

