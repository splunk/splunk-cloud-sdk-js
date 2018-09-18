
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
* [AuthManager](interfaces/authmanager.md)
* [CollectionDefinition](interfaces/collectiondefinition.md)
* [CollectionDescription](interfaces/collectiondescription.md)
* [CollectionStats](interfaces/collectionstats.md)
* [DatasetInfo](interfaces/datasetinfo.md)
* [DslCompilationRequest](interfaces/dslcompilationrequest.md)
* [EmailAction](interfaces/emailaction.md)
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
* [Member](interfaces/member.md)
* [MemberName](interfaces/membername.md)
* [Metric](interfaces/metric.md)
* [MetricAttributes](interfaces/metricattributes.md)
* [MetricEvent](interfaces/metricevent.md)
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

### Variables

* [DEFAULT_URL](#default_url)

---

## Type aliases

<a id="httpmethod"></a>

###  HTTPMethod

**ΤHTTPMethod**: * "GET" &#124; "POST" &#124; "PUT" &#124; "PATCH" &#124; "DELETE"
*

___
<a id="responsehook"></a>

###  ResponseHook

**ΤResponseHook**: *`function`*

#### Type declaration
▸(response: *`Response`*):  `Promise`<`Response`> &#124; `any`

**Parameters:**

| Param | Type |
| ------ | ------ |
| response | `Response` |

**Returns:**  `Promise`<`Response`> &#124; `any`

___
<a id="tokenproviderfunction"></a>

###  TokenProviderFunction

**ΤTokenProviderFunction**: *`function`*

#### Type declaration
▸(): `string`

**Returns:** `string`

___

## Variables

<a id="action_service_prefix"></a>

### `<Private>``<Const>` ACTION_SERVICE_PREFIX

**● ACTION_SERVICE_PREFIX**: *`string`* = "/action/v1beta1"

___
<a id="catalog_service_prefix"></a>

### `<Private>``<Const>` CATALOG_SERVICE_PREFIX

**● CATALOG_SERVICE_PREFIX**: *`string`* = "/catalog/v1beta1"

___
<a id="default_url"></a>

### `<Const>` DEFAULT_URL

**● DEFAULT_URL**: *"https://api.splunkbeta.com"* = "https://api.splunkbeta.com"

___
<a id="identity_service_prefix"></a>

### `<Private>``<Const>` IDENTITY_SERVICE_PREFIX

**● IDENTITY_SERVICE_PREFIX**: *`string`* = "/identity/v1"

___
<a id="ingest_service_prefix"></a>

### `<Private>``<Const>` INGEST_SERVICE_PREFIX

**● INGEST_SERVICE_PREFIX**: *`string`* = "/ingest/v1beta1"

___
<a id="kvstore_service_prefix"></a>

### `<Private>``<Const>` KVSTORE_SERVICE_PREFIX

**● KVSTORE_SERVICE_PREFIX**: *`string`* = "/kvstore/v1beta1"

___
<a id="search_service_prefix"></a>

### `<Private>``<Const>` SEARCH_SERVICE_PREFIX

**● SEARCH_SERVICE_PREFIX**: *`string`* = "/search/v1beta1"

___
<a id="streams_service_prefix"></a>

### `<Private>``<Const>` STREAMS_SERVICE_PREFIX

**● STREAMS_SERVICE_PREFIX**: *`string`* = "/streams/v1"

___

