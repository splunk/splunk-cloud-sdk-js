[@splunk/cloud-sdk](../README.md) > [SearchJob](../interfaces/searchjob.md)

# Interface: SearchJob

Properties allowed (and possibly required) in fully constructed Searchjobs in POST payloads and responses

## Hierarchy

**SearchJob**

## Index

### Properties

* [extractAllFields](searchjob.md#extractallfields)
* [maxTime](searchjob.md#maxtime)
* [messages](searchjob.md#messages)
* [module](searchjob.md#module)
* [percentComplete](searchjob.md#percentcomplete)
* [query](searchjob.md#query)
* [queryParameters](searchjob.md#queryparameters)
* [resultsAvailable](searchjob.md#resultsavailable)
* [sid](searchjob.md#sid)
* [status](searchjob.md#status)
* [timeFormat](searchjob.md#timeformat)
* [timeOfSearch](searchjob.md#timeofsearch)

---

## Properties

<a id="extractallfields"></a>

###  extractAllFields

**● extractAllFields**: *`boolean`*

Should SplunkD produce all fields (including those not explicitly mentioned in the SPL). Default: false

___
<a id="maxtime"></a>

###  maxTime

**● maxTime**: *`number`*

The number of seconds to run this search before finalizing. Min: 1, Max: 21600, Default: 3600

___
<a id="messages"></a>

###  messages

**● messages**: *[SearchJobMessage](searchjobmessage.md)[]*

___
<a id="module"></a>

###  module

**● module**: *`string`*

The module to run the search in. Default: ""

___
<a id="percentcomplete"></a>

###  percentComplete

**● percentComplete**: *`number`*

An estimate of how far through the job is complete

___
<a id="query"></a>

###  query

**● query**: *`string`*

The SPL query string (in SPLv2)

___
<a id="queryparameters"></a>

###  queryParameters

**● queryParameters**: *[QueryParameters](queryparameters.md)*

parameters for the search job mainly earliest and latest.

___
<a id="resultsavailable"></a>

###  resultsAvailable

**● resultsAvailable**: *`number`*

The number of results Splunkd produced so far

___
<a id="sid"></a>

###  sid

**● sid**: *`string`*

The id assigned to the job

___
<a id="status"></a>

###  status

**● status**: *`string`*

The current status of the job

___
<a id="timeformat"></a>

###  timeFormat

**● timeFormat**: *`string`*

Converts a formatted time string from {start,end}\_time into UTC seconds. The default value is the ISO-8601 format.

___
<a id="timeofsearch"></a>

###  timeOfSearch

**● timeOfSearch**: *`string`*

The System time at the time the search job was created. Specify a time string to set the absolute time used for any relative time specifier in the search. Defaults to the current system time when the Job is created.

___

