
#  @splunk/splunk-cloud-sdk

## Index

### Enumerations

* [Action](enums/action.md)
* [ActionKind](enums/actionkind.md)
* [ActionNotificationKind](enums/actionnotificationkind.md)
* [ActionStatusState](enums/actionstatusstate.md)
* [ContentType](enums/contenttype.md)
* [DataType](enums/datatype.md)
* [DispatchState](enums/dispatchstate.md)
* [FieldType](enums/fieldtype.md)
* [PipelineStatus](enums/pipelinestatus.md)
* [Prevalence](enums/prevalence.md)
* [SearchLevel](enums/searchlevel.md)

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

* [ActionError](interfaces/actionerror.md)
* [ActionNotification](interfaces/actionnotification.md)
* [ActionStatus](interfaces/actionstatus.md)
* [ActionTriggerResponse](interfaces/actiontriggerresponse.md)
* [ActionUpdateFields](interfaces/actionupdatefields.md)
* [ActivatePipelineRequest](interfaces/activatepipelinerequest.md)
* [AdditionalProperties](interfaces/additionalproperties.md)
* [CollectionDefinition](interfaces/collectiondefinition.md)
* [CollectionDescription](interfaces/collectiondescription.md)
* [CollectionStats](interfaces/collectionstats.md)
* [DatasetInfo](interfaces/datasetinfo.md)
* [DslCompilationRequest](interfaces/dslcompilationrequest.md)
* [Event](interfaces/event.md)
* [EventAttributes](interfaces/eventattributes.md)
* [EventObservableOptions](interfaces/eventobservableoptions.md)
* [FetchEventsRequest](interfaces/fetcheventsrequest.md)
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
* [Job](interfaces/job.md)
* [JobControlActionRequest](interfaces/jobcontrolactionrequest.md)
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
* [PostJobsRequest](interfaces/postjobsrequest.md)
* [Principal](interfaces/principal.md)
* [PrincipalInput](interfaces/principalinput.md)
* [QueryArgs](interfaces/queryargs.md)
* [RequestHeaders](interfaces/requestheaders.md)
* [RequestOptions](interfaces/requestoptions.md)
* [ResultObservableOptions](interfaces/resultobservableoptions.md)
* [Role](interfaces/role.md)
* [RoleInput](interfaces/roleinput.md)
* [RoleName](interfaces/rolename.md)
* [RolePermission](interfaces/rolepermission.md)
* [Rule](interfaces/rule.md)
* [SplunkErrorParams](interfaces/splunkerrorparams.md)
* [SplunkEventPayload](interfaces/splunkeventpayload.md)
* [Tenant](interfaces/tenant.md)
* [TenantName](interfaces/tenantname.md)
* [UplEdge](interfaces/upledge.md)
* [UplNode](interfaces/uplnode.md)
* [UplPipeline](interfaces/uplpipeline.md)
* [ValidateInfo](interfaces/validateinfo.md)

### Type aliases

* [HTTPMethod](#httpmethod)
* [ResponseHook](#responsehook)

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

