# Splunk Cloud SDK for JavaScript

# Repository status
[![Codeship Status for splunk/splunk-cloud-sdk-js](https://app.codeship.com/projects/efc247e0-15d9-0136-51cc-4ecad654e338/status?branch=develop)](https://app.codeship.com/projects/283657)

[![codecov](https://codecov.io/gh/splunk/splunk-cloud-sdk-js/branch/develop/graph/badge.svg?token=R5kexVYymt)](https://codecov.io/gh/splunk/splunk-cloud-sdk-js)

## Usage

Download the latest release of the Splunk Cloud SDK for JavaScript from one of the following locations: 
- GitHub: https://github.com/splunk/splunk-cloud-sdk-js/releases
- Splunk Developer Cloud Portal: https://dev.staging.splunkbeta.com/tools

To install the SDK, run the following command from your project directory:
```sh
yarn add <path_to_downloaded_splunk-cloud-sdk-js-X.Y.Z.tar.gz>
```
Installing this SDK allows your project to interact with services in the Splunk Developer Cloud, such as authorization, identity control, data ingest, search, and so forth.

### Example usage

This example shows how to use one service client to access all supported services:

```js
var ServiceClient = require('@splunk/splunk-cloud-src/splunk')
 
var svc = new ServiceClient(ENDPOINT_URL, AUTH_TOKEN, TENANT)
 
// Retrieve the datasets for this tenant from the Catalog service
svc.catalog.getDatasets()

// Run a search on the "main" index
svc.search.createJob({ "query": "| from index:main | head 5" })

...

```

If your application needs to work with one specific service, you can use a specific client for only the required service as follows: 

```javascript

var IdentityService = require('@splunk/splunk-cloud-src/identity')

var identity = new IdentityService(ENDPOINT_URL, AUTH_TOKEN, TENANT)

// Get the user profile from the Identity API
identity.getPrincipal(PRINCIPAL_NAME)

...

```

## Documentation
For general documentation about the Splunk Cloud SDK for JavaScript, see:
- https://dev.staging.splunkbeta.com/docs/devtools/jssdk

For the API reference for the Splunk Cloud SDK for JavaScript, see:
- https://dev.staging.splunkbeta.com/reference/sdk/splunk-cloud-sdk-js

The API reference contains detailed information about all classes and functions, with clearly-defined parameters and return types.
    
## Get Started Developing
To get the SDK up and running in your project: 
1. Fork this repo.
2. Git Clone your fork: `git clone {your repo}`
3. Install all dependencies: `yarn`
4. Build the project: `yarn build`
5. Run the examples: `yarn run example`
6. Generate the docs: `yarn run docs`
