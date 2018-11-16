
#  @splunk/cloud-sdk

## Index

### Enumerations

* [ActionKind](enums/actionkind.md)
* [ActionNotificationKind](enums/actionnotificationkind.md)
* [ActionStatusState](enums/actionstatusstate.md)
* [ContentType](enums/contenttype.md)
* [DataType](enums/datatype.md)
* [DispatchState](enums/dispatchstate.md)
* [FieldType](enums/fieldtype.md)
* [PipelineStatus](enums/pipelinestatus.md)
* [Prevalence](enums/prevalence.md)
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

* [Action](interfaces/action.md)
* [ActionBase](interfaces/actionbase.md)
* [ActionError](interfaces/actionerror.md)
* [ActionNotification](interfaces/actionnotification.md)
* [ActionStatus](interfaces/actionstatus.md)
* [ActionTriggerResponse](interfaces/actiontriggerresponse.md)
* [ActionUpdateFields](interfaces/actionupdatefields.md)
* [ActivatePipelineRequest](interfaces/activatepipelinerequest.md)
* [AdditionalProperties](interfaces/additionalproperties.md)
* [AliasAction](interfaces/aliasaction.md)
* [AuthManager](interfaces/authmanager.md)
* [AutoKVAction](interfaces/autokvaction.md)
* [DatasetInfo](interfaces/datasetinfo.md)
* [DslCompilationRequest](interfaces/dslcompilationrequest.md)
* [EmailAction](interfaces/emailaction.md)
* [EvalAction](interfaces/evalaction.md)
* [Event](interfaces/event.md)
* [EventAttributes](interfaces/eventattributes.md)
* [FetchResultsRequest](interfaces/fetchresultsrequest.md)
* [Field](interfaces/field.md)
* [Group](interfaces/group.md)
* [GroupInput](interfaces/groupinput.md)
* [GroupMember](interfaces/groupmember.md)
* [GroupMemberName](interfaces/groupmembername.md)
* [GroupRole](interfaces/grouprole.md)
* [HTTPResponse](interfaces/httpresponse.md)
* [IndexDescription](interfaces/indexdescription.md)
* [IndexFieldDefinition](interfaces/indexfielddefinition.md)
* [Key](interfaces/key.md)
* [LookupAction](interfaces/lookupaction.md)
* [Member](interfaces/member.md)
* [MemberName](interfaces/membername.md)
* [Metric](interfaces/metric.md)
* [MetricAttributes](interfaces/metricattributes.md)
* [MetricEvent](interfaces/metricevent.md)
* [Module](interfaces/module.md)
* [PaginatedPipelineResponse](interfaces/paginatedpipelineresponse.md)
* [PartialDatasetInfo](interfaces/partialdatasetinfo.md)
* [Permission](interfaces/permission.md)
* [PingOKBody](interfaces/pingokbody.md)
* [Pipeline](interfaces/pipeline.md)
* [PipelineDeleteResponse](interfaces/pipelinedeleteresponse.md)
* [PipelineQueryParams](interfaces/pipelinequeryparams.md)
* [PipelineRequest](interfaces/pipelinerequest.md)
* [Principal](interfaces/principal.md)
* [PrincipalInput](interfaces/principalinput.md)
* [QueryArgs](interfaces/queryargs.md)
* [QueryParameters](interfaces/queryparameters.md)
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
* [WebhookAction](interfaces/webhookaction.md)

### Type aliases

* [HTTPMethod](#httpmethod)
* [ResponseHook](#responsehook)
* [TokenProviderFunction](#tokenproviderfunction)

### Object literals

* [DEFAULT_URLS](#default_urls)

---

## Type aliases

<a id="httpmethod"></a>

###  HTTPMethod

**Ƭ HTTPMethod**: * "GET" &#124; "POST" &#124; "PUT" &#124; "PATCH" &#124; "DELETE"
*

___
<a id="responsehook"></a>

###  ResponseHook

**Ƭ ResponseHook**: *`function`*

#### Type declaration
▸(response: *`Response`*):  `Promise`<`Response`> &#124; `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| response | `Response` |

**Returns:**  `Promise`<`Response`> &#124; `any`

___
<a id="tokenproviderfunction"></a>

###  TokenProviderFunction

**Ƭ TokenProviderFunction**: *`function`*

#### Type declaration
▸(): `string`

**Returns:** `string`

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

