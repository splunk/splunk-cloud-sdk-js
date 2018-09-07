[@splunk/ssc-client](../README.md) > [PostJobsRequest](../interfaces/postjobsrequest.md)

# Interface: PostJobsRequest

create a new search

## Hierarchy

**PostJobsRequest**

## Index

### Properties

* [adhocSearchLevel](postjobsrequest.md#adhocsearchlevel)
* [count](postjobsrequest.md#count)
* [earliestTime](postjobsrequest.md#earliesttime)
* [latestTime](postjobsrequest.md#latesttime)
* [maxCount](postjobsrequest.md#maxcount)
* [maxTime](postjobsrequest.md#maxtime)
* [module](postjobsrequest.md#module)
* [now](postjobsrequest.md#now)
* [offset](postjobsrequest.md#offset)
* [query](postjobsrequest.md#query)
* [search](postjobsrequest.md#search)
* [statusBuckets](postjobsrequest.md#statusbuckets)
* [timeFormat](postjobsrequest.md#timeformat)
* [timeout](postjobsrequest.md#timeout)

---

## Properties

<a id="adhocsearchlevel"></a>

### `<Optional>` adhocSearchLevel

**● adhocSearchLevel**: *[SearchLevel](../enums/searchlevel.md)*

Use one of the following search modes.

___
<a id="count"></a>

### `<Optional>` count

**● count**: * `undefined` &#124; `number`
*

___
<a id="earliesttime"></a>

### `<Optional>` earliestTime

**● earliestTime**: * `undefined` &#124; `string`
*

Specify a time string. Sets the earliest (inclusive), respectively, time bounds for the search

___
<a id="latesttime"></a>

### `<Optional>` latestTime

**● latestTime**: * `undefined` &#124; `string`
*

Specify a time string. Sets the latest (exclusive), respectively, time bounds for the search.

___
<a id="maxcount"></a>

### `<Optional>` maxCount

**● maxCount**: * `undefined` &#124; `number`
*

The number of events that can be accessible in any given status bucket.

___
<a id="maxtime"></a>

### `<Optional>` maxTime

**● maxTime**: * `undefined` &#124; `number`
*

The number of seconds to run this search before finalizing. Specify 0 to never finalize.

___
<a id="module"></a>

### `<Optional>` module

**● module**: * `undefined` &#124; `string`
*

The Module to run the search in.

___
<a id="now"></a>

### `<Optional>` now

**● now**: * `undefined` &#124; `string`
*

current system time Specify a time string to set the absolute time used for any relative time specifier in the search. Defaults to the current system time.

___
<a id="offset"></a>

### `<Optional>` offset

**● offset**: * `undefined` &#124; `number`
*

___
<a id="query"></a>

###  query

**● query**: *`string`*

Search Query

___
<a id="search"></a>

### `<Optional>` search

**● search**: * `undefined` &#124; `string`
*

___
<a id="statusbuckets"></a>

### `<Optional>` statusBuckets

**● statusBuckets**: * `undefined` &#124; `number`
*

The most status buckets to generate.

___
<a id="timeformat"></a>

### `<Optional>` timeFormat

**● timeFormat**: * `undefined` &#124; `string`
*

Used to convert a formatted time string from {start,end}_time into UTC seconds. The default value is the ISO-8601 format.

___
<a id="timeout"></a>

### `<Optional>` timeout

**● timeout**: * `undefined` &#124; `number`
*

The number of seconds to keep this search after processing has stopped.

___

