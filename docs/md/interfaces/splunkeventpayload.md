[@splunk/cloud-sdk](../README.md) > [SplunkEventPayload](../interfaces/splunkeventpayload.md)

# Interface: SplunkEventPayload

## Hierarchy

**SplunkEventPayload**

## Index

### Properties

* [event](splunkeventpayload.md#event)
* [fields](splunkeventpayload.md#fields)
* [host](splunkeventpayload.md#host)
* [index](splunkeventpayload.md#index)
* [source](splunkeventpayload.md#source)
* [sourcetype](splunkeventpayload.md#sourcetype)
* [time](splunkeventpayload.md#time)

---

## Properties

<a id="event"></a>

###  event

**● event**: *`object`*

JSON object for the event.

___
<a id="fields"></a>

###  fields

**● fields**: *`Map`<`string`, `string`>*

Specifies a JSON object that contains explicit custom fields to be defined at index time.

___
<a id="host"></a>

###  host

**● host**: *`string`*

The host value assigned to the event data. This is typically the hostname of the client from which you are sending data.

___
<a id="index"></a>

###  index

**● index**: *`string`*

The name of the index by which the event data is to be indexed.

___
<a id="source"></a>

###  source

**● source**: *`string`*

The source value assigned to the event data. For example, if you are sending data from an app that you are developing, set this key to the name of the app.

___
<a id="sourcetype"></a>

###  sourcetype

**● sourcetype**: *`string`*

The sourcetype value assigned to the event data.

___
<a id="time"></a>

###  time

**● time**: *`number`*

The event time. The default time format is epoch time, in the format sec.ms. For example, 1433188255.500 indicates 1433188255 seconds and 500 milliseconds after epoch.

___

