
#  @splunk/cloud-sdk

## Index

### Enumerations

* [ActionKind](enums/actionkind.md)
* [ActionStatusState](enums/actionstatusstate.md)
* [ContentType](enums/contenttype.md)
* [DatasetTypes](enums/datasettypes.md)
* [Datatype](enums/datatype.md)
* [DispatchState](enums/dispatchstate.md)
* [Fieldtype](enums/fieldtype.md)
* [NotificationKind](enums/notificationkind.md)
* [PingOKBodyStatus](enums/pingokbodystatus.md)
* [PipelineStatus](enums/pipelinestatus.md)
* [Prevalence](enums/prevalence.md)
* [PrincipalKind](enums/principalkind.md)
* [TenantStatus](enums/tenantstatus.md)
* [messageTypes](enums/messagetypes.md)

### Classes

* [ActionService](classes/actionservice.md)
* [BaseApiService](classes/baseapiservice.md)
* [CatalogService](classes/catalogservice.md)
* [EventBatcher](classes/eventbatcher.md)
* [IdentityService](classes/identityservice.md)
* [IngestService](classes/ingestservice.md)
* [KVStoreService](classes/kvstoreservice.md)
* [Search](classes/search.md)
* [SearchService](classes/searchservice.md)
* [ServiceClient](classes/serviceclient.md)
* [SplunkCloud](classes/splunkcloud.md)
* [SplunkError](classes/splunkerror.md)
* [SplunkSearchCancelError](classes/splunksearchcancelerror.md)
* [StreamsService](classes/streamsservice.md)

### Interfaces

* [ActionBase](interfaces/actionbase.md)
* [ActionStatus](interfaces/actionstatus.md)
* [ActionTriggerResponse](interfaces/actiontriggerresponse.md)
* [ActivatePipelineRequest](interfaces/activatepipelinerequest.md)
* [AdditionalProperties](interfaces/additionalproperties.md)
* [AliasAction](interfaces/aliasaction.md)
* [AuthManager](interfaces/authmanager.md)
* [AutoKVAction](interfaces/autokvaction.md)
* [CreateRule](interfaces/createrule.md)
* [DatasetBase](interfaces/datasetbase.md)
* [DatasetBaseResponse](interfaces/datasetbaseresponse.md)
* [DslCompilationRequest](interfaces/dslcompilationrequest.md)
* [EmailAction](interfaces/emailaction.md)
* [EvalAction](interfaces/evalaction.md)
* [Event](interfaces/event.md)
* [EventAttributes](interfaces/eventattributes.md)
* [FetchResultsRequest](interfaces/fetchresultsrequest.md)
* [Field](interfaces/field.md)
* [Group](interfaces/group.md)
* [GroupMember](interfaces/groupmember.md)
* [GroupMemberName](interfaces/groupmembername.md)
* [GroupRole](interfaces/grouprole.md)
* [HTTPResponse](interfaces/httpresponse.md)
* [Import](interfaces/import.md)
* [Index](interfaces/index.md)
* [IndexDefinition](interfaces/indexdefinition.md)
* [IndexFieldDefinition](interfaces/indexfielddefinition.md)
* [JobResponse](interfaces/jobresponse.md)
* [KVCollection](interfaces/kvcollection.md)
* [Key](interfaces/key.md)
* [ListRecordsFilter](interfaces/listrecordsfilter.md)
* [Lookup](interfaces/lookup.md)
* [LookupAction](interfaces/lookupaction.md)
* [Member](interfaces/member.md)
* [MemberName](interfaces/membername.md)
* [Metric](interfaces/metric.md)
* [MetricAttributes](interfaces/metricattributes.md)
* [MetricEvent](interfaces/metricevent.md)
* [Module](interfaces/module.md)
* [Notification](interfaces/notification.md)
* [PaginatedPipelineResponse](interfaces/paginatedpipelineresponse.md)
* [Permission](interfaces/permission.md)
* [PingOKBody](interfaces/pingokbody.md)
* [Pipeline](interfaces/pipeline.md)
* [PipelineDeleteResponse](interfaces/pipelinedeleteresponse.md)
* [PipelineQueryParams](interfaces/pipelinequeryparams.md)
* [PipelineRequest](interfaces/pipelinerequest.md)
* [PostGroupBody](interfaces/postgroupbody.md)
* [PostGroupRoleBody](interfaces/postgrouprolebody.md)
* [Principal](interfaces/principal.md)
* [PrincipalInput](interfaces/principalinput.md)
* [QueryArgs](interfaces/queryargs.md)
* [QueryParameters](interfaces/queryparameters.md)
* [QueryRecordsFilter](interfaces/queryrecordsfilter.md)
* [RegexAction](interfaces/regexaction.md)
* [RequestHeaders](interfaces/requestheaders.md)
* [RequestOptions](interfaces/requestoptions.md)
* [ResultObservableOptions](interfaces/resultobservableoptions.md)
* [ResultsNotReadyResponse](interfaces/resultsnotreadyresponse.md)
* [Role](interfaces/role.md)
* [RoleInput](interfaces/roleinput.md)
* [RoleName](interfaces/rolename.md)
* [RolePermission](interfaces/rolepermission.md)
* [Rule](interfaces/rule.md)
* [SNSAction](interfaces/snsaction.md)
* [SearchArgs](interfaces/searchargs.md)
* [SearchJob](interfaces/searchjob.md)
* [SearchJobMessage](interfaces/searchjobmessage.md)
* [SearchResults](interfaces/searchresults.md)
* [ServiceClientArgs](interfaces/serviceclientargs.md)
* [SplunkErrorParams](interfaces/splunkerrorparams.md)
* [SplunkEventPayload](interfaces/splunkeventpayload.md)
* [Tenant](interfaces/tenant.md)
* [TenantName](interfaces/tenantname.md)
* [UpdateJob](interfaces/updatejob.md)
* [UpdateJobResponse](interfaces/updatejobresponse.md)
* [UplEdge](interfaces/upledge.md)
* [UplNode](interfaces/uplnode.md)
* [UplPipeline](interfaces/uplpipeline.md)
* [ValidateInfo](interfaces/validateinfo.md)
* [View](interfaces/view.md)
* [WebhookAction](interfaces/webhookaction.md)

### Type aliases

* [Action](#action)
* [Dataset](#dataset)
* [DatasetResponse](#datasetresponse)
* [HTTPMethod](#httpmethod)
* [ImportResponse](#importresponse)
* [IndexResponse](#indexresponse)
* [KVCollectionResponse](#kvcollectionresponse)
* [LookupResponse](#lookupresponse)
* [MetricResponse](#metricresponse)
* [PostPermissionBody](#postpermissionbody)
* [ResponseHook](#responsehook)
* [TokenProviderFunction](#tokenproviderfunction)
* [ViewResponse](#viewresponse)

### Functions

* [_filterObject](#_filterobject)
* [_sleep](#_sleep)
* [naiveExponentialBackoff](#naiveexponentialbackoff)

### Object literals

* [DEFAULT_URLS](#default_urls)

---

## Type aliases

<a id="action"></a>

###  Action

**Ƭ Action**: * [EmailAction](interfaces/emailaction.md) &#124; [WebhookAction](interfaces/webhookaction.md) &#124; [SNSAction](interfaces/snsaction.md)
*

<a id="action.created"></a>

### `<Optional>` created

**● created**: * `undefined` &#124; `string`
*

___
<a id="action.createdby"></a>

### `<Optional>` createdby

**● createdby**: * `undefined` &#124; `string`
*

___
<a id="action.id"></a>

### `<Optional>` id

**● id**: * `undefined` &#124; `string`
*

___
<a id="action.kind"></a>

###  kind

**● kind**: *`string`*

___
<a id="action.modified"></a>

### `<Optional>` modified

**● modified**: * `undefined` &#124; `string`
*

___
<a id="action.modifiedby"></a>

### `<Optional>` modifiedby

**● modifiedby**: * `undefined` &#124; `string`
*

___
<a id="action.owner"></a>

### `<Optional>` owner

**● owner**: * `undefined` &#124; `string`
*

___
<a id="action.ruleid"></a>

### `<Optional>` ruleid

**● ruleid**: * `undefined` &#124; `string`
*

___
<a id="action.version"></a>

### `<Optional>` version

**● version**: * `undefined` &#124; `number`
*

___

___
<a id="dataset"></a>

###  Dataset

**Ƭ Dataset**: * [Import](interfaces/import.md) &#124; [Metric](interfaces/metric.md) &#124; [Index](interfaces/index.md) &#124; [View](interfaces/view.md) &#124; [Lookup](interfaces/lookup.md) &#124; [KVCollection](interfaces/kvcollection.md)
*

___
<a id="datasetresponse"></a>

###  DatasetResponse

**Ƭ DatasetResponse**: * [ImportResponse](#importresponse) &#124; [MetricResponse](#metricresponse) &#124; [IndexResponse](#indexresponse) &#124; [JobResponse](interfaces/jobresponse.md) &#124; [ViewResponse](#viewresponse) &#124; [LookupResponse](#lookupresponse) &#124; [KVCollectionResponse](#kvcollectionresponse)
*

___
<a id="httpmethod"></a>

###  HTTPMethod

**Ƭ HTTPMethod**: * "GET" &#124; "POST" &#124; "PUT" &#124; "PATCH" &#124; "DELETE"
*

___
<a id="importresponse"></a>

###  ImportResponse

**Ƭ ImportResponse**: * [Import](interfaces/import.md) & [DatasetBaseResponse](interfaces/datasetbaseresponse.md)
*

___
<a id="indexresponse"></a>

###  IndexResponse

**Ƭ IndexResponse**: * [Index](interfaces/index.md) & [DatasetBaseResponse](interfaces/datasetbaseresponse.md)
*

___
<a id="kvcollectionresponse"></a>

###  KVCollectionResponse

**Ƭ KVCollectionResponse**: * [KVCollection](interfaces/kvcollection.md) & [DatasetBaseResponse](interfaces/datasetbaseresponse.md)
*

___
<a id="lookupresponse"></a>

###  LookupResponse

**Ƭ LookupResponse**: * [Lookup](interfaces/lookup.md) & [DatasetBaseResponse](interfaces/datasetbaseresponse.md)
*

___
<a id="metricresponse"></a>

###  MetricResponse

**Ƭ MetricResponse**: * [Metric](interfaces/metric.md) & [DatasetBaseResponse](interfaces/datasetbaseresponse.md)
*

___
<a id="postpermissionbody"></a>

###  PostPermissionBody

**Ƭ PostPermissionBody**: *`string`*

PostPermissionBody - Permission to add to a role

___
<a id="responsehook"></a>

###  ResponseHook

**Ƭ ResponseHook**: *`function`*

#### Type declaration
▸(response: *`Response`*, request: *`Request`*):  `Promise`<`Response`> &#124; `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| response | `Response` |
| request | `Request` |

**Returns:**  `Promise`<`Response`> &#124; `any`

___
<a id="tokenproviderfunction"></a>

###  TokenProviderFunction

**Ƭ TokenProviderFunction**: *`function`*

#### Type declaration
▸(): `string`

**Returns:** `string`

___
<a id="viewresponse"></a>

###  ViewResponse

**Ƭ ViewResponse**: * [View](interfaces/view.md) & [DatasetBaseResponse](interfaces/datasetbaseresponse.md)
*

___

## Functions

<a id="_filterobject"></a>

### `<Const>` _filterObject

▸ **_filterObject**(template: *`object`*, propertiesToRemove: *`string`[]*): `object`

**Parameters:**

| Name | Type |
| ------ | ------ |
| template | `object` |
| propertiesToRemove | `string`[] |

**Returns:** `object`

___
<a id="_sleep"></a>

### `<Const>` _sleep

▸ **_sleep**(millis: *`number`*): `Promise`<`void`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| millis | `number` |

**Returns:** `Promise`<`void`>

___
<a id="decodejson"></a>

### `<Private>` decodeJson

▸ **decodeJson**(text: *`string`*):  `any` &#124; `string`

Decodes the JSON into an object. Returns a string if empty or an error if unable to parse.

**Parameters:**

| Name | Type |
| ------ | ------ |
| text | `string` |

**Returns:**  `any` &#124; `string`

___
<a id="handleresponse"></a>

### `<Private>` handleResponse

▸ **handleResponse**(response: *`Response`*): `Promise`<[HTTPResponse](interfaces/httpresponse.md)>

Interrogates the response, decodes if successful and throws if error

**Parameters:**

| Name | Type |
| ------ | ------ |
| response | `Response` |

**Returns:** `Promise`<[HTTPResponse](interfaces/httpresponse.md)>

___
<a id="iteratebatches"></a>

### `<Private>` iterateBatches

▸ **iterateBatches**(func: *`function`*, batchSize: *`number`*, max: *`number`*): `Iterable`<`Promise`<`any`>>

**Parameters:**

| Name | Type |
| ------ | ------ |
| func | `function` |
| batchSize | `number` |
| max | `number` |

**Returns:** `Iterable`<`Promise`<`any`>>

___
<a id="naiveexponentialbackoff"></a>

###  naiveExponentialBackoff

▸ **naiveExponentialBackoff**(__namedParameters?: *`object`*): [ResponseHook](#responsehook)

This function creates a ResponseHook that will retry requests that receive a 429 (too many requests) response from the server a certain number of times (5 by default), increasing the wait time with each attempt. The wait starts at 100ms by default and doubles with each retry attempt. If none of the retries come back with a response other than 429 after it's max number of attempts, it will return the last response received.

This ResponseHook can be installed like this:

```
client.addResponseHook(naiveExponentialBackoff({maxRetries: 5, timeout: 100, backoff: 2});

```

**Parameters:**

**`Default value` __namedParameters: `object`**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| backoff | `number` | 2 |  The multiplier that is applied to the previous timeout for this attempt |
| maxRetries | `number` | 5 |  The number of times to retry this request before failing |
| timeout | `number` | 100 |  The _initial_ time to wait for the first retry attempt |
| onFailure |  | - |  A callback that takes a response and a request. Will be called after maxRetries are exhausted. |
| onRetry |  | - |  A callback that takes a response and a request. Will be called on every retry attempt. |

**Returns:** [ResponseHook](#responsehook)

___

## Object literals

<a id="default_urls"></a>

### `<Const>` DEFAULT_URLS

**DEFAULT_URLS**: *`object`*

<a id="default_urls.api"></a>

####  api

**● api**: *`string`* = "https://api.splunkbeta.com"

___
<a id="default_urls.app"></a>

####  app

**● app**: *`string`* = "https://apps.splunkbeta.com"

___

___
<a id="service_cluster_mapping"></a>

### `<Private>``<Const>` SERVICE_CLUSTER_MAPPING

**SERVICE_CLUSTER_MAPPING**: *`object`*

<a id="service_cluster_mapping.action"></a>

####  action

**● action**: *`string`* = "api"

___
<a id="service_cluster_mapping.catalog"></a>

####  catalog

**● catalog**: *`string`* = "api"

___
<a id="service_cluster_mapping.identity"></a>

####  identity

**● identity**: *`string`* = "api"

___
<a id="service_cluster_mapping.ingest"></a>

####  ingest

**● ingest**: *`string`* = "api"

___
<a id="service_cluster_mapping.kvstore"></a>

####  kvstore

**● kvstore**: *`string`* = "api"

___
<a id="service_cluster_mapping.search"></a>

####  search

**● search**: *`string`* = "api"

___
<a id="service_cluster_mapping.streams"></a>

####  streams

**● streams**: *`string`* = "api"

___

___

