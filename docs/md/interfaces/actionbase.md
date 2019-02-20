[@splunk/cloud-sdk](../README.md) > [ActionBase](../interfaces/actionbase.md)

# Interface: ActionBase

## Hierarchy

**ActionBase**

↳  [EmailAction](emailaction.md)

↳  [WebhookAction](webhookaction.md)

## Index

### Properties

* [kind](actionbase.md#kind)
* [name](actionbase.md#name)
* [title](actionbase.md#title)

---

## Properties

<a id="kind"></a>

###  kind

**● kind**: *[ActionKind](../enums/actionkind.md)*

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

