[@splunk/cloud-sdk](../README.md) > [KVStoreService](../classes/kvstoreservice.md)

# Class: KVStoreService

Encapsulates kvstore service endpoints

## Hierarchy

 [BaseApiService](baseapiservice.md)

**↳ KVStoreService**

## Index

### Constructors

* [constructor](kvstoreservice.md#constructor)

### Properties

* [client](kvstoreservice.md#client)

### Methods

* [createIndex](kvstoreservice.md#createindex)
* [deleteIndex](kvstoreservice.md#deleteindex)
* [deleteRecordByKey](kvstoreservice.md#deleterecordbykey)
* [deleteRecords](kvstoreservice.md#deleterecords)
* [getCollectionStats](kvstoreservice.md#getcollectionstats)
* [getCollections](kvstoreservice.md#getcollections)
* [getHealthStatus](kvstoreservice.md#gethealthstatus)
* [getRecordByKey](kvstoreservice.md#getrecordbykey)
* [insertRecord](kvstoreservice.md#insertrecord)
* [insertRecords](kvstoreservice.md#insertrecords)
* [listIndexes](kvstoreservice.md#listindexes)
* [listRecords](kvstoreservice.md#listrecords)
* [queryRecords](kvstoreservice.md#queryrecords)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new KVStoreService**(clientOrUrl: * `string` &#124; [ServiceClient](serviceclient.md)*, token?: * `undefined` &#124; `string`*, defaultTenant?: * `undefined` &#124; `string`*): [KVStoreService](kvstoreservice.md)

**Parameters:**

| Param | Type |
| ------ | ------ |
| clientOrUrl |  `string` &#124; [ServiceClient](serviceclient.md)|
| `Optional` token |  `undefined` &#124; `string`|
| `Optional` defaultTenant |  `undefined` &#124; `string`|

**Returns:** [KVStoreService](kvstoreservice.md)

___

## Properties

<a id="client"></a>

### `<Protected>` client

**● client**: *[ServiceClient](serviceclient.md)*

___

## Methods

<a id="createindex"></a>

###  createIndex

▸ **createIndex**(collection: *`string`*, index: *[IndexDescription](../interfaces/indexdescription.md)*): `Promise`<[IndexDescription](../interfaces/indexdescription.md)>

Creates a new index to be added to the collection.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  The name of the collection where the new index will be created |
| index | [IndexDescription](../interfaces/indexdescription.md) |  The index to create |

**Returns:** `Promise`<[IndexDescription](../interfaces/indexdescription.md)>
A definition of the created index

___
<a id="deleteindex"></a>

###  deleteIndex

▸ **deleteIndex**(collection: *`string`*, indexName: *`string`*): `Promise`<`any`>

Deletes an index in a given collection.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  The name of the collection whose index should be deleted |
| indexName | `string` |  The name of the index to delete |

**Returns:** `Promise`<`any`>
A promise that will be resolved when the index is deleted

___
<a id="deleterecordbykey"></a>

###  deleteRecordByKey

▸ **deleteRecordByKey**(collection: *`string`*, key: *`string`*): `Promise`<`any`>

Deletes a record present in a given collection based on the key value provided by the user.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  The name of the collection whose record should be deleted |
| key | `string` |  The key of the record used for deletion |

**Returns:** `Promise`<`any`>
A promise that will be resolved when the record matching the supplied key is deleted

___
<a id="deleterecords"></a>

###  deleteRecords

▸ **deleteRecords**(collection: *`string`*, filter?: *[QueryArgs](../interfaces/queryargs.md)*): `Promise`<`any`>

Deletes records present in a given collection based on the query parameters provided by the user.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  The name of the collection whose records should be deleted |
| `Optional` filter | [QueryArgs](../interfaces/queryargs.md) |  Query JSON expression to target specific records |

**Returns:** `Promise`<`any`>
A promise that will be resolved when the matching records are deleted

___
<a id="getcollectionstats"></a>

###  getCollectionStats

▸ **getCollectionStats**(collection: *`string`*): `Promise`<[CollectionStats](../interfaces/collectionstats.md)>

Gets the the KVStore collections stats.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  the collection to retrieve |

**Returns:** `Promise`<[CollectionStats](../interfaces/collectionstats.md)>
Statistics for the collection

___
<a id="getcollections"></a>

###  getCollections

▸ **getCollections**(): `Promise`<[CollectionDefinition](../interfaces/collectiondefinition.md)[]>

Gets all the collections.

**Returns:** `Promise`<[CollectionDefinition](../interfaces/collectiondefinition.md)[]>
A list of defined collections

___
<a id="gethealthstatus"></a>

###  getHealthStatus

▸ **getHealthStatus**(): `Promise`<`any`>

Gets the KVStore's status.

**Returns:** `Promise`<`any`>
KVStore health status

___
<a id="getrecordbykey"></a>

###  getRecordByKey

▸ **getRecordByKey**(collection: *`string`*, key: *`string`*): `Promise`<`Map`<`string`, `string`>>

Gets the record present in a given collection based on the key value provided by the user.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  The name of the collection whose record should be fetched |
| key | `string` |  The record key used to query a specific record |

**Returns:** `Promise`<`Map`<`string`, `string`>>
the record associated with the given key

___
<a id="insertrecord"></a>

###  insertRecord

▸ **insertRecord**(collection: *`string`*, record: *`Map`<`string`, `string`>*): `Promise`<[Key](../interfaces/key.md)>

Inserts a new record to the collection.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  The name of the collection where the record should be inserted |
| record | `Map`<`string`, `string`> |  The record to add to the collection |

**Returns:** `Promise`<[Key](../interfaces/key.md)>
An object with the unique _key of the added record

___
<a id="insertrecords"></a>

###  insertRecords

▸ **insertRecords**(collection: *`string`*, records: *`Array`<`Map`<`string`, `string`>>*): `Promise`<`string`[]>

Inserts multiple new records to the collection in a single request.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  The name of the collection where the new records should be inserted |
| records | `Array`<`Map`<`string`, `string`>> |  The data tuples to insert |

**Returns:** `Promise`<`string`[]>
A list of keys of the inserted records

___
<a id="listindexes"></a>

###  listIndexes

▸ **listIndexes**(collection: *`string`*): `Promise`<[IndexDescription](../interfaces/indexdescription.md)[]>

Lists all the indexes in a given collection.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| collection | `string` |  The name of the collection whose indexes should be listed |

**Returns:** `Promise`<[IndexDescription](../interfaces/indexdescription.md)[]>
A list of indexes on the specified collection

___
<a id="listrecords"></a>

###  listRecords

▸ **listRecords**(collection: *`string`*, filter?: *[QueryArgs](../interfaces/queryargs.md)*): `Promise`<`Map`<`string`, `string`>>

Lists the records present in a given collection based on the query parameters provided by the user.

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| collection | `string` | - |  The name of the collection whose records should be fetched |
| `Default value` filter | [QueryArgs](../interfaces/queryargs.md) |  {} |  Filter string to target specific records |

**Returns:** `Promise`<`Map`<`string`, `string`>>
A list of records in the collection

___
<a id="queryrecords"></a>

###  queryRecords

▸ **queryRecords**(collection: *`string`*, filter?: *[QueryArgs](../interfaces/queryargs.md)*): `Promise`<`Map`<`string`, `string`>>

Queries records present in a given collection based on the query parameters provided by the user.

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| collection | `string` | - |  The name of the collection whose records should be fetched |
| `Default value` filter | [QueryArgs](../interfaces/queryargs.md) |  {} |  Filter string to target specific records |

**Returns:** `Promise`<`Map`<`string`, `string`>>
A Promise of an array of records

___

