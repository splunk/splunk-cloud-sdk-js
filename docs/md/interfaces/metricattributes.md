[@splunk/cloud-sdk](../README.md) > [MetricAttributes](../interfaces/metricattributes.md)

# Interface: MetricAttributes

MetricAttributes - Default attributes for related Splunk metrics.
*__property__*: If set, individual Metrics will inherit these dimensions and can override any/all of them.

*__property__*: If set, individual Metrics will inherit this type and can optionally override.

*__property__*: If set, individual Metrics will inherit this unit and can optionally override.

## Hierarchy

**MetricAttributes**

## Index

### Properties

* [defaultDimension](metricattributes.md#defaultdimension)
* [defaultType](metricattributes.md#defaulttype)
* [defaultUnit](metricattributes.md#defaultunit)

---

## Properties

<a id="defaultdimension"></a>

### `<Optional>` defaultDimension

**● defaultDimension**: * `undefined` &#124; `object`
*

Optional. If set, individual metrics inherit these dimensions and can override any and/or all of them.

___
<a id="defaulttype"></a>

### `<Optional>` defaultType

**● defaultType**: * `undefined` &#124; `string`
*

Optional. If set, individual metrics inherit this type and can optionally override.

___
<a id="defaultunit"></a>

### `<Optional>` defaultUnit

**● defaultUnit**: * `undefined` &#124; `string`
*

Optional. If set, individual metrics inherit this unit and can optionally override.

___

