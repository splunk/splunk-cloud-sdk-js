[@splunk/cloud-sdk](../README.md) > [SearchArgs](../interfaces/searchargs.md)

# Interface: SearchArgs

Arguments for creating a search

## Hierarchy

**SearchArgs**

## Index

### Properties

* [extractAllFields](searchargs.md#extractallfields)
* [maxTime](searchargs.md#maxtime)
* [module](searchargs.md#module)
* [query](searchargs.md#query)
* [queryParameters](searchargs.md#queryparameters)
* [timeFormat](searchargs.md#timeformat)
* [timeOfSearch](searchargs.md#timeofsearch)

---

## Properties

<a id="extractallfields"></a>

### `<Optional>` extractAllFields

**● extractAllFields**: * `undefined` &#124; `true` &#124; `false`
*

Should SplunkD produce all fields (including those not explicitly mentioned in the SPL). Default: false

___
<a id="maxtime"></a>

### `<Optional>` maxTime

**● maxTime**: * `undefined` &#124; `number`
*

The number of seconds to run this search before finalizing. Min: 1, Max: 21600, Default: 3600

___
<a id="module"></a>

### `<Optional>` module

**● module**: * `undefined` &#124; `string`
*

The module to run the search in. Default: ""

___
<a id="query"></a>

###  query

**● query**: *`string`*

The SPL query string (in SPLv2)

___
<a id="queryparameters"></a>

### `<Optional>` queryParameters

**● queryParameters**: *[QueryParameters](queryparameters.md)*

parameters for the search job mainly earliest and latest.

___
<a id="timeformat"></a>

### `<Optional>` timeFormat

**● timeFormat**: * `undefined` &#124; `string`
*

Converts a formatted time string from {start,end}_time into UTC seconds. The default value is the ISO-8601 format.

___
<a id="timeofsearch"></a>

### `<Optional>` timeOfSearch

**● timeOfSearch**: * `undefined` &#124; `string`
*

The System time at the time the search job was created. Specify a time string to set the absolute time used for any relative time specifier in the search. Defaults to the current system time when the Job is created.

___

