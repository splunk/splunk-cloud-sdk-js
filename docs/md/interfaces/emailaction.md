[@splunk/cloud-sdk](../README.md) > [EmailAction](../interfaces/emailaction.md)

# Interface: EmailAction

## Hierarchy

 [ActionBase](actionbase.md)

**↳ EmailAction**

## Index

### Properties

* [addresses](emailaction.md#addresses)
* [body](emailaction.md#body)
* [bodyPlainText](emailaction.md#bodyplaintext)
* [kind](emailaction.md#kind)
* [name](emailaction.md#name)
* [subject](emailaction.md#subject)
* [title](emailaction.md#title)

---

## Properties

<a id="addresses"></a>

###  addresses

**● addresses**: *`string`[]*

___
<a id="body"></a>

###  body

**● body**: *`string`*

HTML content that will be sent as the body of this email.

___
<a id="bodyplaintext"></a>

### `<Optional>` bodyPlainText

**● bodyPlainText**: * `undefined` &#124; `string`
*

Optional text that will be sent as the text/plain part of this email. If this field is not set for an email action, when triggering that action the Action Service will convert th value from the body field to text and send that as the text/plain part.

___
<a id="kind"></a>

###  kind

**● kind**: *[email](../enums/actionkind.md#email)*

___
<a id="name"></a>

###  name

**● name**: *`string`*

Name of the action. Must be atleast 4 alphanumeric characters, and can be segmented with periods.

___
<a id="subject"></a>

###  subject

**● subject**: *`string`*

___
<a id="title"></a>

### `<Optional>` title

**● title**: * `undefined` &#124; `string`
*

Human readable name title for the action. Must be less than 128 characters.

___

