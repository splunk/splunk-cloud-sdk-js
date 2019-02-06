[@splunk/cloud-sdk](../README.md) > [WebhookAction](../interfaces/webhookaction.md)

# Interface: WebhookAction

## Hierarchy

 [ActionBase](actionbase.md)

**↳ WebhookAction**

## Index

### Properties

* [kind](webhookaction.md#kind)
* [message](webhookaction.md#message)
* [name](webhookaction.md#name)
* [webhookUrl](webhookaction.md#webhookurl)

---

## Properties

<a id="kind"></a>

###  kind

**● kind**: *[webhook](../enums/actionkind.md#webhook)*

___
<a id="message"></a>

###  message

**● message**: *`string`*

___
<a id="name"></a>

###  name

**● name**: *`string`*

Name of the action. Must be atleast 4 alphanumeric characters, and can be segmented with periods.

___
<a id="webhookurl"></a>

###  webhookUrl

**● webhookUrl**: *`string`*

Only allows https scheme. Only allows hostnames that end with "slack.com", "webhook.site", "sendgrid.com", "zapier.com", "hipchat.com", "amazon.com", and "amazonaws.com"

___

