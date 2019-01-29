[@splunk/cloud-sdk](../README.md) > [DatasetBaseResponse](../interfaces/datasetbaseresponse.md)

# Interface: DatasetBaseResponse

A response doik

## Hierarchy

 [DatasetBase](datasetbase.md)

**↳ DatasetBaseResponse**

↳  [JobResponse](jobresponse.md)

## Index

### Properties

* [created](datasetbaseresponse.md#created)
* [createdby](datasetbaseresponse.md#createdby)
* [id](datasetbaseresponse.md#id)
* [kind](datasetbaseresponse.md#kind)
* [modified](datasetbaseresponse.md#modified)
* [modifiedby](datasetbaseresponse.md#modifiedby)
* [module](datasetbaseresponse.md#module)
* [name](datasetbaseresponse.md#name)
* [owner](datasetbaseresponse.md#owner)
* [resourcename](datasetbaseresponse.md#resourcename)
* [version](datasetbaseresponse.md#version)

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
<a id="id"></a>

###  id

**● id**: *`string`*

A unique dataset ID. Random ID used if not provided. Not valid for PATCH method.

___
<a id="kind"></a>

###  kind

**● kind**: *`string`*

The dataset kind.

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
<a id="resourcename"></a>

###  resourcename

**● resourcename**: *`string`*

The dataset name qualified by the module name.

___
<a id="version"></a>

###  version

**● version**: *`number`*

The catalog version.

___

