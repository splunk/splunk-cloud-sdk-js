[@splunk/cloud-sdk](../README.md) > [StreamsService](../classes/streamsservice.md)

# Class: StreamsService

Encapsulates Streams endpoints

## Hierarchy

 [BaseApiService](baseapiservice.md)

**↳ StreamsService**

## Index

### Constructors

* [constructor](streamsservice.md#constructor)

### Properties

* [client](streamsservice.md#client)

### Methods

* [activatePipeline](streamsservice.md#activatepipeline)
* [compileDslToUpl](streamsservice.md#compiledsltoupl)
* [createPipeline](streamsservice.md#createpipeline)
* [deactivatePipeline](streamsservice.md#deactivatepipeline)
* [deletePipeline](streamsservice.md#deletepipeline)
* [getPipeline](streamsservice.md#getpipeline)
* [getPipelines](streamsservice.md#getpipelines)
* [updatePipeline](streamsservice.md#updatepipeline)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new StreamsService**(clientOrUrl: * `string` &#124; [ServiceClient](serviceclient.md)*, token?: * `undefined` &#124; `string`*, defaultTenant?: * `undefined` &#124; `string`*): [StreamsService](streamsservice.md)

**Parameters:**

| Param | Type |
| ------ | ------ |
| clientOrUrl |  `string` &#124; [ServiceClient](serviceclient.md)|
| `Optional` token |  `undefined` &#124; `string`|
| `Optional` defaultTenant |  `undefined` &#124; `string`|

**Returns:** [StreamsService](streamsservice.md)

___

## Properties

<a id="client"></a>

### `<Protected>` client

**● client**: *[ServiceClient](serviceclient.md)*

___

## Methods

<a id="activatepipeline"></a>

###  activatePipeline

▸ **activatePipeline**(activatePipelineRequest: *[ActivatePipelineRequest](../interfaces/activatepipelinerequest.md)*): `Promise`<[AdditionalProperties](../interfaces/additionalproperties.md)>

Activates a pipeline.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| activatePipelineRequest | [ActivatePipelineRequest](../interfaces/activatepipelinerequest.md) |  The activate pipeline request containing the ids of pipeline to be activated |

**Returns:** `Promise`<[AdditionalProperties](../interfaces/additionalproperties.md)>
A promise of the additional properties defining the current status of the pipelines

___
<a id="compiledsltoupl"></a>

###  compileDslToUpl

▸ **compileDslToUpl**(dsl: *[DslCompilationRequest](../interfaces/dslcompilationrequest.md)*): `Promise`<[UplPipeline](../interfaces/uplpipeline.md)>

Creates a Upl Json from DSL.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| dsl | [DslCompilationRequest](../interfaces/dslcompilationrequest.md) |  The DSL script that needs to be converted into a UPL pipeline JSON |

**Returns:** `Promise`<[UplPipeline](../interfaces/uplpipeline.md)>
A UPL pipeline in JSON format

___
<a id="createpipeline"></a>

###  createPipeline

▸ **createPipeline**(pipeline: *[PipelineRequest](../interfaces/pipelinerequest.md)*): `Promise`<[Pipeline](../interfaces/pipeline.md)>

Creates a new pipeline.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| pipeline | [PipelineRequest](../interfaces/pipelinerequest.md) |  The new pipeline data to be created |

**Returns:** `Promise`<[Pipeline](../interfaces/pipeline.md)>
A promise of a new pipeline object

___
<a id="deactivatepipeline"></a>

###  deactivatePipeline

▸ **deactivatePipeline**(deactivatePipelineRequest: *[ActivatePipelineRequest](../interfaces/activatepipelinerequest.md)*): `Promise`<[AdditionalProperties](../interfaces/additionalproperties.md)>

Deactivates a pipeline.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| deactivatePipelineRequest | [ActivatePipelineRequest](../interfaces/activatepipelinerequest.md) |  The deactivate pipeline request containing the ids of pipeline to be deactivated |

**Returns:** `Promise`<[AdditionalProperties](../interfaces/additionalproperties.md)>
A promise of the additional properties defining the current status of the pipelines

___
<a id="deletepipeline"></a>

###  deletePipeline

▸ **deletePipeline**(id: *`string`*): `Promise`<[PipelineDeleteResponse](../interfaces/pipelinedeleteresponse.md)>

Deletes the pipeline based on the ID provided by the user.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| id | `string` |  The ID of the pipeline that should be deleted |

**Returns:** `Promise`<[PipelineDeleteResponse](../interfaces/pipelinedeleteresponse.md)>
A promise pf a pipeline delete response containing details on the deleted pipeline

___
<a id="getpipeline"></a>

###  getPipeline

▸ **getPipeline**(id: *`string`*): `Promise`<[Pipeline](../interfaces/pipeline.md)>

Get the pipeline based on the pipeline ID provided by the user.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| id | `string` |  The ID of the pipeline that should be fetched |

**Returns:** `Promise`<[Pipeline](../interfaces/pipeline.md)>
A Promise of an individual pipeline

___
<a id="getpipelines"></a>

###  getPipelines

▸ **getPipelines**(queryArgs?: *[PipelineQueryParams](../interfaces/pipelinequeryparams.md)*): `Promise`<[PaginatedPipelineResponse](../interfaces/paginatedpipelineresponse.md)>

Gets all the pipelines based on the query parameters provided by the user.

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` queryArgs | [PipelineQueryParams](../interfaces/pipelinequeryparams.md) |  {} |  Filter string to target specific pipelines |

**Returns:** `Promise`<[PaginatedPipelineResponse](../interfaces/paginatedpipelineresponse.md)>
A Promise of a paginated pipeline response (consists of the pipelines and total count)

___
<a id="updatepipeline"></a>

###  updatePipeline

▸ **updatePipeline**(id: *`string`*, pipeline: *[PipelineRequest](../interfaces/pipelinerequest.md)*): `Promise`<[Pipeline](../interfaces/pipeline.md)>

Updates an existing pipeline.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| id | `string` |  The ID of the pipeline that should be updated |
| pipeline | [PipelineRequest](../interfaces/pipelinerequest.md) |  The updated pipeline data |

**Returns:** `Promise`<[Pipeline](../interfaces/pipeline.md)>
A promise of an updated pipeline object

___

