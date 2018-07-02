# SSC Client for JavaScript

This is the SSC Client for JavaScript

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
