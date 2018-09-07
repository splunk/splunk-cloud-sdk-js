[@splunk/ssc-client](../README.md) > [Event](../interfaces/event.md)

# Interface: Event

Event - a Splunk event accepted by Ingest service.

## Hierarchy

**Event**

## Indexable

\[key: `string`\]:&nbsp;`any`
Event - a Splunk event accepted by Ingest service.

## Index

### Properties

* [event](event.md#event-1)
* [fields](event.md#fields)
* [host](event.md#host)
* [index](event.md#index)
* [source](event.md#source)
* [sourcetype](event.md#sourcetype)
* [time](event.md#time)

---

## Properties

<a id="event-1"></a>

###  event

**● event**: * `string` &#124; `any`
*

Event Object or string payload.

___
<a id="fields"></a>

### `<Optional>` fields

**● fields**: *[Fields](fields.md)*

Key/value pairs to associate with the event.

___
<a id="host"></a>

### `<Optional>` host

**● host**: * `undefined` &#124; `string`
*

The host name or IP address of the network device that generated the event.

___
<a id="index"></a>

### `<Optional>` index

**● index**: * `undefined` &#124; `string`
*

Index where the event is to be stored.

___
<a id="source"></a>

### `<Optional>` source

**● source**: * `undefined` &#124; `string`
*

A source identifies where the event originated.

___
<a id="sourcetype"></a>

### `<Optional>` sourcetype

**● sourcetype**: * `undefined` &#124; `string`
*

A sourcetype determines how Splunk formats data during the indexing process.

___
<a id="time"></a>

### `<Optional>` time

**● time**: * `undefined` &#124; `number`
*

Epoch time in seconds.

___

