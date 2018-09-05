# Splunk Cloud SDK for JavaScript

This is the Splunk Cloud SDK for JavaScript

# Repository Statues
[![Codeship Status for splunk/splunk-cloud-sdk-js](https://app.codeship.com/projects/efc247e0-15d9-0136-51cc-4ecad654e338/status?branch=develop)](https://app.codeship.com/projects/283657)

[![codecov](https://codecov.io/gh/splunk/splunk-cloud-sdk-js/branch/develop/graph/badge.svg?token=R5kexVYymt)](https://codecov.io/gh/splunk/splunk-cloud-sdk-js)

## Usage

### Get the latest release from one of the following locations 
- Splunk Pre-release Program Page: https://www.splunk.com/page/preview/ssc-client-js
- Splunk Developer Cloud page: https://dev.staging.splunkbeta.com/tools
- Github Releases: https://github.com/splunk/splunk-cloud-sdk-js/releases

### From your project directory run
```sh
npm install <path_to_downloaded_splunk-cloud-sdk-js-X.Y.Z.tar.gz>
```
This will allow you intereact to services like auth, ingest, search etc. in Splunk Developer Cloud within your project.

### Sample Usage
For example, you could use one service client to access all supported services

```sh
var ServiceClient = require('@splunk/splunk-cloud-src/splunk')
 
var svc = new ServiceClient(ENDPOINT_URL, AUTH_TOKEN, TENANT)
 
// Retreive this tenant's datasets from the catalog service
svc.catalog.getDatasets()

// Run a search on main index
svc.search.createJob({ "query": "| from index:main | head 5" })

...

```

If your application only needs to work with a specific service, you can use a specific client for only the service required

```sh

var IdentityService = require('@splunk/splunk-cloud-src/identity')

var identity = new IdentityService(ENDPOINT_URL, AUTH_TOKEN, TENANT)

// Get the user profile from the identity service
identity.getUserProfile()

...

```

## Documentation
Documentation of the latest released version of the SDK can be found at two places:
- https://dev.staging.splunkbeta.com/docs/aboutdevtools/jssdk General documentaion of Splunk Cloud SDK for JavaScript
- https://dev.staging.splunkbeta.com/apiref/sdks/ssc-client-js/README.md API Reference of Splunk Cloud SDK for JavaScript
    * It contains detailed information about all classes and functions in the SDK 
    * Each function has clearly defined parameters and return types
    * Function and class level documentation is included
    
## Start Developing
Follow these instructions to get up and running this project locally.
1. Fork it
2. Git Clone your fork `git clone {your repo}`
3. Install all dependencies `npm install / yarn`
4. Build project: `npm build / yarn build`
5. Run examples: `npm run example / yarn run example`
6. Generate docs: `npm run docs / yarn run docs`
