[@splunk/cloud-sdk](../README.md) > [WebhookAction](../interfaces/webhookaction.md)

# Interface: WebhookAction

## Hierarchy

 [ActionBase](actionbase.md)

**↳ WebhookAction**

## Index

### Properties

* [kind](webhookaction.md#kind)
* [name](webhookaction.md#name)
* [title](webhookaction.md#title)
* [webhookPayload](webhookaction.md#webhookpayload)
* [webhookUrl](webhookaction.md#webhookurl)

---

## Properties

<a id="kind"></a>

###  kind

**● kind**: *[webhook](../enums/actionkind.md#webhook)*

___
<a id="name"></a>

###  name

**● name**: *`string`*

Name of the action. Must be atleast 4 alphanumeric characters, and can be segmented with periods.

___
<a id="title"></a>

### `<Optional>` title

**● title**: * `undefined` &#124; `string`
*

Human readable name title for the action. Must be less than 128 characters.

___
<a id="webhookpayload"></a>

###  webhookPayload

**● webhookPayload**: *`string`*

WebhookPayload (earlier named as 'message') is the (possibly) templated payload body which will be POSTed to the webhookUrl when triggered

___
<a id="webhookurl"></a>

###  webhookUrl

**● webhookUrl**: *`string`*

Only allows https scheme. Only allows hostnames that end with "slack.com", "webhook.site", "sendgrid.com", "zapier.com", "hipchat.com", "amazon.com", and "amazonaws.com"

___

