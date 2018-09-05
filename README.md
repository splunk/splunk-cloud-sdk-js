# Splunk Cloud SDK for JavaScript

This is the Splunk Cloud SDK for JavaScript

# Repository Statues
[![Codeship Status for splunk/splunk-cloud-sdk-js](https://app.codeship.com/projects/efc247e0-15d9-0136-51cc-4ecad654e338/status?branch=develop)](https://app.codeship.com/projects/283657)

[![codecov](https://codecov.io/gh/splunk/splunk-cloud-sdk-js/branch/develop/graph/badge.svg?token=R5kexVYymt)](https://codecov.io/gh/splunk/splunk-cloud-sdk-js)


### Get the latest release from one of the following locations 
- npm-solutions-local/@splunk/splunk-cloud-sdk-js/@splunk/splunk-cloud-sdk-js-X.Y.Z.tgz
- https://github.com/splunk/splunk-cloud-sdk-js/archive/vX.Y.Z.tar.gz


### From your project directory run
```sh
npm install ~/Downloads/splunk-cloud-sdk-js-X.Y.Z.tar.gz 
```

### Using the service client to access all supported services

```sh
var ServiceClient = require('@splunk/splunk-cloud-src/splunk')
 
var svc = new ServiceClient(ENDPOINT_URL, AUTH_TOKEN, TENANT)
 
// Retreive this tenant's datasets from the catalog API 
svc.catalog.getDatasets()

...

```

### Using a specific client for only the service required

```sh

var IdentityService = require('@splunk/splunk-cloud-src/identity')

var identity = new IdentityService(ENDPOINT_URL, AUTH_TOKEN, TENANT)

// Get the user profile from the identity API
identity.getUserProfile()

...

```
