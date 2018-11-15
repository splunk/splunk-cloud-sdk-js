# Splunk Cloud SDK for JavaScript
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Terms of Service (TOS)
[Splunk Cloud Terms of Service](https://www.splunk.com/en_us/legal/terms/splunk-cloud-pre-release-terms-of-service.html)

## Usage

To install the SDK, run the following command from your project directory:
```sh
npm install @splunk/cloud-sdk
```
Installing this SDK allows your project to interact with services in the Splunk Developer Cloud, such as authorization, identity control, data ingest, search, and so forth.

### Example usage

This example shows how to use one service client to access all supported services:

```js
require('isomorphic-fetch'); // or a fetch polyfill of your choosing

const { SplunkCloud } = require('@splunk/cloud-sdk');
 
const svc = new SplunkCloud({ tokenSource: AUTH_TOKEN, defaultTenant: TENANT });

// Retrieve the datasets for this tenant from the Catalog service
svc.catalog.getDatasets();

// Run a search on the "main" index
svc.search.createJob({ "query": "| from index:main | head 5" });

...

```

If your application needs to work with one specific service, you can use a specific client for only the required service as follows: 

```javascript
require('isomorphic-fetch'); // or a fetch polyfill of your choosing

const { IdentityService } = require('@splunk/cloud-sdk/identity');

const ENDPOINT_URL = "https://api.splunkbeta.com";

const identity = new IdentityService(ENDPOINT_URL, AUTH_TOKEN, TENANT);

// Get the user profile from the Identity API
identity.getPrincipal(PRINCIPAL_NAME);

...

```

## Documentation
For general documentation about the Splunk Cloud SDK for JavaScript, see:
- https://sdc.splunkbeta.com/docs/sdks/jssdk

For the API reference for the Splunk Cloud SDK for JavaScript, see:
- https://sdc.splunkbeta.com/reference/sdk/splunk-cloud-sdk-js

The API reference contains detailed information about all classes and functions, with clearly-defined parameters and return types.
