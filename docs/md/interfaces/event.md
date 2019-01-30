[@splunk/cloud-sdk](../README.md) > [Event](../interfaces/event.md)

# Interface: Event

Event - a Splunk event accepted by Ingest service.

## Hierarchy

**Event**

## Index

### Properties

* [attributes](event.md#attributes)
* [body](event.md#body)
* [host](event.md#host)
* [id](event.md#id)
* [nanos](event.md#nanos)
* [source](event.md#source)
* [sourcetype](event.md#sourcetype)
* [timestamp](event.md#timestamp)

---

## Properties

<a id="attributes"></a>

### `<Optional>` attributes

**● attributes**: *[EventAttributes](eventattributes.md)*

Specifies a JSON object that contains explicit custom fields to be defined at index time.

___
<a id="body"></a>

###  body

**● body**: * [`any`] &#124; `number` &#124; `string` &#124; `any`
*

JSON object for the event.

___
<a id="host"></a>

### `<Optional>` host

**● host**: * `undefined` &#124; `string`
*

The host value assigned to the event data. Typically, this is the hostname of the client from which you are sending data.

___
<a id="id"></a>

### `<Optional>` id

**● id**: * `undefined` &#124; `string`
*

An optional ID that uniquely identifies the event data. It is used to deduplicate the data if same data is set multiple times. If ID is not specified, it will be assigned by the system.

___
<a id="nanos"></a>

### `<Optional>` nanos

**● nanos**: * `undefined` &#124; `number`
*

Optional nanoseconds part of the timestamp.

___
<a id="source"></a>

### `<Optional>` source

**● source**: * `undefined` &#124; `string`
*

The source value to assign to the event data. For example, if you are sending data from an app that you are developing, set this key to the name of the app.

___
<a id="sourcetype"></a>

### `<Optional>` sourcetype

**● sourcetype**: * `undefined` &#124; `string`
*

The sourcetype value assigned to the event data.

___
<a id="timestamp"></a>

### `<Optional>` timestamp

**● timestamp**: * `undefined` &#124; `number`
*

Epoch time in milliseconds.

___

