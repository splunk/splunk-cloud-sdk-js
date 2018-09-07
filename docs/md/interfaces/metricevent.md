[@splunk/ssc-client](../README.md) > [MetricEvent](../interfaces/metricevent.md)

# Interface: MetricEvent

MetricEvent - Common payload to specify multiple related Splunk metrics.
*__property__*: attributes Default attributes for related Splunk metrics.

*__property__*: body Specify multiple related metrics e.g. Memory, CPU etc.

*__property__*: host The host value to assign to the event data. This is typically the hostname of the client from which you're sending data.

*__property__*: id Optional ID uniquely identifies the metric data. It is used to deduplicate the data if same data is set multiple times. If ID is not specified, it will be assigned by the system.

*__property__*: nanos Optional nanoseconds part of the timestamp (integer).

*__property__*: source The source value to assign to the event data. For example, if you're sending data from an app you're developing, you could set this key to the name of the app.

*__property__*: sourcetype The sourcetype value to assign to the event data.

*__property__*: timestamp Epoch time in milliseconds (integer).

## Hierarchy

**MetricEvent**

## Index

### Properties

* [attributes](metricevent.md#attributes)
* [body](metricevent.md#body)
* [host](metricevent.md#host)
* [id](metricevent.md#id)
* [nanos](metricevent.md#nanos)
* [source](metricevent.md#source)
* [sourceType](metricevent.md#sourcetype)
* [timestamp](metricevent.md#timestamp)

---

## Properties

<a id="attributes"></a>

###  attributes

**● attributes**: *[MetricAttributes](metricattributes.md)*

___
<a id="body"></a>

###  body

**● body**: *[Metric](metric.md)[]*

___
<a id="host"></a>

###  host

**● host**: *`string`*

___
<a id="id"></a>

### `<Optional>` id

**● id**: * `undefined` &#124; `string`
*

___
<a id="nanos"></a>

### `<Optional>` nanos

**● nanos**: * `undefined` &#124; `number`
*

___
<a id="source"></a>

###  source

**● source**: *`string`*

___
<a id="sourcetype"></a>

###  sourceType

**● sourceType**: *`string`*

___
<a id="timestamp"></a>

###  timestamp

**● timestamp**: *`number`*

___

