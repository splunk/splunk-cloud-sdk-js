[@splunk/cloud-sdk](../README.md) > [Lookup](../interfaces/lookup.md)

# Interface: Lookup

## Hierarchy

 [DatasetBase](datasetbase.md)

**↳ Lookup**

## Index

### Properties

* [caseSensitiveMatch](lookup.md#casesensitivematch)
* [externalKind](lookup.md#externalkind)
* [externalName](lookup.md#externalname)
* [filter](lookup.md#filter)
* [id](lookup.md#id)
* [kind](lookup.md#kind)
* [module](lookup.md#module)
* [name](lookup.md#name)

---

## Properties

<a id="casesensitivematch"></a>

### `<Optional>` caseSensitiveMatch

**● caseSensitiveMatch**: * `undefined` &#124; `true` &#124; `false`
*

Match case-sensitively against the lookup.

___
<a id="externalkind"></a>

###  externalKind

**● externalKind**: *`string`*

The type of the external lookup, this should always be `kvcollection`

___
<a id="externalname"></a>

###  externalName

**● externalName**: *`string`*

The name of the external lookup.

___
<a id="filter"></a>

### `<Optional>` filter

**● filter**: * `undefined` &#124; `string`
*

A query that filters results out of the lookup before those results are returned.

___
<a id="id"></a>

### `<Optional>` id

**● id**: * `undefined` &#124; `string`
*

A unique dataset ID. Random ID used if not provided. Not valid for PATCH method.

___
<a id="kind"></a>

###  kind

**● kind**: *[Lookup](../enums/datasettypes.md#lookup)*

___
<a id="module"></a>

### `<Optional>` module

**● module**: * `undefined` &#124; `string`
*

The name of the module to create the new dataset in.

___
<a id="name"></a>

###  name

**● name**: *`string`*

The dataset name. Dataset names must be unique within each module.

___

