[@splunk/cloud-sdk](../README.md) > [JobResponse](../interfaces/jobresponse.md)

# Interface: JobResponse

## Hierarchy

↳  [DatasetBaseResponse](datasetbaseresponse.md)

**↳ JobResponse**

## Index

### Properties

* [created](jobresponse.md#created)
* [createdby](jobresponse.md#createdby)
* [deleteTime](jobresponse.md#deletetime)
* [extractAllFields](jobresponse.md#extractallfields)
* [id](jobresponse.md#id)
* [kind](jobresponse.md#kind)
* [maxTime](jobresponse.md#maxtime)
* [modified](jobresponse.md#modified)
* [modifiedby](jobresponse.md#modifiedby)
* [module](jobresponse.md#module)
* [name](jobresponse.md#name)
* [owner](jobresponse.md#owner)
* [parameters](jobresponse.md#parameters)
* [percentComplete](jobresponse.md#percentcomplete)
* [query](jobresponse.md#query)
* [resourcename](jobresponse.md#resourcename)
* [resultsAvailable](jobresponse.md#resultsavailable)
* [sid](jobresponse.md#sid)
* [spl](jobresponse.md#spl)
* [status](jobresponse.md#status)
* [timeFormat](jobresponse.md#timeformat)
* [timeOfSearch](jobresponse.md#timeofsearch)
* [version](jobresponse.md#version)

---

## Properties

<a id="created"></a>

###  created

**● created**: *`string`*

The date and time object was created.

___
<a id="createdby"></a>

###  createdby

**● createdby**: *`string`*

The name of the user who created the object. This value is obtained from the bearer token and may not be changed.

___
<a id="deletetime"></a>

###  deleteTime

**● deleteTime**: *`string`*

The time the dataset will be available.

___
<a id="extractallfields"></a>

### `<Optional>` extractAllFields

**● extractAllFields**: * `undefined` &#124; `true` &#124; `false`
*

Should the search produce all fields (including those not explicitly mentioned in the SPL)?

___
<a id="id"></a>

###  id

**● id**: *`string`*

A unique dataset ID. Random ID used if not provided. Not valid for PATCH method.

___
<a id="kind"></a>

###  kind

**● kind**: *[Job](../enums/datasettypes.md#job)*

___
<a id="maxtime"></a>

### `<Optional>` maxTime

**● maxTime**: * `undefined` &#124; `number`
*

The number of seconds to run this search before finishing.

___
<a id="modified"></a>

###  modified

**● modified**: *`string`*

The date and time object was modified.

___
<a id="modifiedby"></a>

###  modifiedby

**● modifiedby**: *`string`*

The name of the user who most recently modified the object.

___
<a id="module"></a>

###  module

**● module**: *`string`*

The name of the module to create the new dataset in.

___
<a id="name"></a>

###  name

**● name**: *`string`*

The dataset name. Dataset names must be unique within each module.

___
<a id="owner"></a>

###  owner

**● owner**: *`string`*

The name of the object's owner.

___
<a id="parameters"></a>

###  parameters

**● parameters**: *`object`*

Parameters for the search job, mainly earliest and latest.

___
<a id="percentcomplete"></a>

### `<Optional>` percentComplete

**● percentComplete**: * `undefined` &#124; `number`
*

An estimate of how complete the search job is.

___
<a id="query"></a>

###  query

**● query**: *`string`*

The SPL query string for the search job.

___
<a id="resourcename"></a>

###  resourcename

**● resourcename**: *`string`*

The dataset name qualified by the module name.

___
<a id="resultsavailable"></a>

### `<Optional>` resultsAvailable

**● resultsAvailable**: * `undefined` &#124; `number`
*

The instantaneous number of results produced by the search job.

___
<a id="sid"></a>

###  sid

**● sid**: *`string`*

The ID assigned to the search job.

___
<a id="spl"></a>

###  spl

**● spl**: *`string`*

The SPLv2 version of the search job query string.

___
<a id="status"></a>

###  status

**● status**: *`string`*

The current status of the search job.

___
<a id="timeformat"></a>

###  timeFormat

**● timeFormat**: *`string`*

Converts a formatted time string from into UTC seconds.

___
<a id="timeofsearch"></a>

###  timeOfSearch

**● timeOfSearch**: *`string`*

The system time at the time the search job was created

___
<a id="version"></a>

###  version

**● version**: *`number`*

The catalog version.

___

