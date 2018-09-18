[@splunk/cloud-sdk](../README.md) > [QueryParameters](../interfaces/queryparameters.md)

# Interface: QueryParameters

Represents parameters on the search job mainly earliest and latest.

## Hierarchy

**QueryParameters**

## Index

### Properties

* [earliest](queryparameters.md#earliest)
* [latest](queryparameters.md#latest)

---

## Properties

<a id="earliest"></a>

### `<Optional>` earliest

**● earliest**: * `undefined` &#124; `string`
*

The earliest time in absolute or relative format to retrieve events (only supported if the query supports time-ranges) Default: "-24h@h"

___
<a id="latest"></a>

### `<Optional>` latest

**● latest**: * `undefined` &#124; `string`
*

The latest time in absolute or relative format to retrieve events (only supported if the query supports time-ranges) Default: "now"

___

