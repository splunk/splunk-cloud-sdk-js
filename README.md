# Splunk Cloud Services SDK for JavaScript

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

The Splunk Cloud Services software development kit (SDK) for JavaScript contains library code and examples to enable you to build apps using the Splunk Cloud Services services with the JavaScript programming language.

## Terms of Service (TOS)
[Splunk Cloud Services Terms of Service](https://auth.scp.splunk.com/tos)

Log in to [Splunk Investigate](https://si.scp.splunk.com/) and accept the Terms of Service when prompted.

## Get started

### Install the SDK

Install the SDK to enable your app project to interact with Splunk Cloud Services services.

Run the following command from your project directory:

```sh
npm install @splunkdev/cloud-sdk
```

### Example usage

This example shows how to use one service client to access all supported services:

```js
require('isomorphic-fetch'); // or a fetch polyfill of your choosing

const { SplunkCloud } = require('@splunkdev/cloud-sdk');

const svc = new SplunkCloud({ tokenSource: AUTH_TOKEN, defaultTenant: TENANT });

// Retrieve the datasets for this tenant from the Catalog service
svc.catalog.getDatasets();

// Run a search on the "main" index
svc.search.createJob({ "query": "| from index:main | head 5" });

...

```

If your app needs to work with one specific service, use a specific client for only the required service as follows:

```javascript
require('isomorphic-fetch'); // or a fetch polyfill of your choosing

const { IdentityService } = require('@splunkdev/cloud-sdk/services/identity');

const ENDPOINT_URL = "https://api.scp.splunk.com";

const identity = new IdentityService(ENDPOINT_URL, AUTH_TOKEN, TENANT);

// Get the user profile from the Identity API
identity.getPrincipal(PRINCIPAL_NAME);

...

```

## Documentation
For general documentation, see the [Splunk Developer Portal](https://dev.splunk.com/scs/).

For reference documentation, see the [Splunk Cloud Services SDK for JavaScript API Reference](https://dev.splunk.com/scs/reference/sdk/splunk-cloud-sdk-js).

## Contributing

A detailed quickstart guide for setting up a development environment and contributing to this project [can be found here](https://github.com/splunk/splunk-cloud-sdk-js/wiki/Development).

Do not directly edit any source file in the `/src/generated` directory because these files were generated from service specifications.

## Contact
If you have questions, reach out to us on [Slack](https://splunkdevplatform.slack.com) in the **#sdc** channel or email us at _devinfo@splunk.com_.
