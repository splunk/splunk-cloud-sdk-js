# SSC Client for JavaScript

This is the SSC Client for JavaScript

# Repository Statues
[![Codeship Status for splunk/ssc-client-js](https://app.codeship.com/projects/efc247e0-15d9-0136-51cc-4ecad654e338/status?branch=develop)](https://app.codeship.com/projects/283657)

[![codecov](https://codecov.io/gh/splunk/ssc-client-js/branch/develop/graph/badge.svg?token=R5kexVYymt)](https://codecov.io/gh/splunk/ssc-client-js)


###Get the latest release from one of the following locations 
- npm-solutions-local/@splunk/ssc-client/-/@splunk/ssc-client-0.1.4.tgz
- https://github.com/splunk/ssc-client-js/archive/v0.1.4.tar.gz


###From your project directory run
```sh
npm install ~/Downloads/ssc-client-js-0.1.4.tar.gz 
```

###Using the service client to access all supported services

```sh
var ServiceClient = require('@splunk/ssc-client/src/splunk')
 
var svc = new ServiceClient(ENDPOINT_URL, AUTH_TOKEN, TENANT)
 
// Retreive this tenant's datasets from the catalog API 
svc.catalog.getDatasets()

...

```

###Using a specific client for only the service required

```sh

var IdentityService = require('@splunk/ssc-client/src/identity')

var identity = new IdentityService(ENDPOINT_URL, AUTH_TOKEN, TENANT)

// Get the user profile from the identity API
identity.getUserProfile()

...

```
