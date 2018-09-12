[@splunk/splunk-cloud-sdk](../README.md) > [FetchEventsRequest](../interfaces/fetcheventsrequest.md)

# Interface: FetchEventsRequest

## Hierarchy

**FetchEventsRequest**

## Index

### Properties

* [count](fetcheventsrequest.md#count)
* [earliestTime](fetcheventsrequest.md#earliesttime)
* [f](fetcheventsrequest.md#f)
* [latestTime](fetcheventsrequest.md#latesttime)
* [maxLines](fetcheventsrequest.md#maxlines)
* [offset](fetcheventsrequest.md#offset)
* [search](fetcheventsrequest.md#search)
* [segmentation](fetcheventsrequest.md#segmentation)
* [timeFormat](fetcheventsrequest.md#timeformat)

---

## Properties

<a id="count"></a>

### `<Optional>` count

**● count**: * `undefined` &#124; `number`
*

The maximum number of results to return. If value is set to 0, then all available results are returned.

___
<a id="earliesttime"></a>

### `<Optional>` earliestTime

**● earliestTime**: * `undefined` &#124; `string`
*

A time string representing the earliest (inclusive), respectively, time bounds for the results to be returned. If not specified, the range applies to all results found.

___
<a id="f"></a>

### `<Optional>` f

**● f**: * `undefined` &#124; `string`
*

A field to return for the event set.

___
<a id="latesttime"></a>

### `<Optional>` latestTime

**● latestTime**: * `undefined` &#124; `string`
*

A time string representing the latest (exclusive), respectively, time bounds for the results to be returned. If not specified, the range applies to all results found.

___
<a id="maxlines"></a>

### `<Optional>` maxLines

**● maxLines**: * `undefined` &#124; `number`
*

The maximum lines that any single event _raw field should contain. Specify 0 to specify no limit.

___
<a id="offset"></a>

### `<Optional>` offset

**● offset**: * `undefined` &#124; `number`
*

The first result (inclusive) from which to begin returning data. This value is 0-indexed. Default value is 0.

___
<a id="search"></a>

### `<Optional>` search

**● search**: * `undefined` &#124; `string`
*

The post processing search to apply to results. Can be any valid search language string.

___
<a id="segmentation"></a>

### `<Optional>` segmentation

**● segmentation**: * `undefined` &#124; `string`
*

The type of segmentation to perform on the data. This includes an option to perform k/v segmentation.

___
<a id="timeformat"></a>

### `<Optional>` timeFormat

**● timeFormat**: * `undefined` &#124; `string`
*

Expression to convert a formatted time string from {start,end}_time into UTC seconds.

___

