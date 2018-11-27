// ***** TITLE: Create and Search View Dataset
//
// ***** DESCRIPTION: This example shows how to create View Dataset using the Catalog Service,
//             then executes the View using the Search Service and validates results are as expected.

require("isomorphic-fetch");

const { SplunkCloud } = require("../splunk");
const { sleep, searchResults } = require("../utils/exampleHelperFunctions");

const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

function exitOnFailure() {
    process.exit(1);
}

async function createView(splunk, viewName) {
    // Create dataset of kind view
    splunk.catalog.createDataset({
        name: viewName,
        kind: 'view',
        search: 'search index=main|stats count()'
    }).then(response => {
        console.log(`View dataset was created : ${response.id}`);
    })
    .catch(err => {
        console.log("Error creating view:");
        console.log(err);
        exitOnFailure();
    });

};

function sendDataViaIngest(splunk, index, host, source) {
    const event1 = {
        "sourcetype": "splunkd",
        "source": source,
        "host": host,
        "body": `Event1 view dataset ${host},${source}`,
        "attributes": {
            "index": index
        }
    };
    const event2 = {
        "sourcetype": "splunkd",
        "source": source,
        "attributes": {
            "index": index
        },
        "host": host,
        "body": `Event2 view dataset ${host},${source}`
    };
    const event3 = {
        "sourcetype": "splunkd",
        "source": source,
        "attributes": {
            "index": index
        },
        "host": host,
        "body": `Event3 view dataset ${host},${source}`
    };

    // Use the Ingest endpoint to send multiple events
    splunk.ingest.postEvents([event1, event2, event3]).then(response => {
        console.log("Ingest of events succeeded with response:");
        console.log(response);
    })
    .catch(err => {
        console.log("Ingest of events failed with err:");
        console.log(err);
        exitOnFailure();
    });
};

// define the main workflow
async function main() {
    //assuming index main pre-exists
    const index = "main" ;
    const viewName = `view_${Date.now()}`;
    // ***** STEP 1: Get Splunk Cloud client
    // ***** DESCRIPTION: Get Splunk Cloud client of a tenant using an authentication token.
    const splunk = new SplunkCloud({'urls': {'api': SPLUNK_CLOUD_API_HOST, 'app': SPLUNK_CLOUD_APPS_HOST}, 'tokenSource': BEARER_TOKEN, 'defaultTenant': TENANT_ID });

    // ***** STEP 2: Create a new View Dataset
    // ***** DESCRIPTION: Define a new View in the Metadata Catalog.
    await createView(splunk, viewName);

    // ***** STEP 3: Get data in using Ingest Service
    // ***** DESCRIPTION: Send in events using Ingest Service.
    const timeSec = Math.floor(Date.now()/1000);
    const host = `h-${timeSec}`;
    const source = `s-${timeSec}`;
    console.log(`Posting events with host=${host}, source = ${source}`);
    sendDataViaIngest(splunk, index, host, source);

    // ***** STEP 4: Verify the data
    // ***** DESCRIPTION: Execute the view using Search Service and ensure there is one result available as a result.
    const timeout = 90 * 1000;
    const query = `|from ${viewName}`;
    console.log(`Executing the view : '${query}'`);
    const expectedResults = 1;


searchResults(splunk, Date.now(), timeout, query, expectedResults).then(
        (results) => {
            const success = (results && results.length == expectedResults);
            console.log(`Search results received : ${success}`);
            console.log(`Deleting View Dataset ${viewName}`);

            splunk.catalog.deleteDatasetByName(viewName).then(
                () => {
                    console.log(`Deleted View Dataset ${viewName}`);
                    if (!success) {
                        exitOnFailure();
                    }
                })
                .catch(() => {
                    exitOnFailure();
                });
            })
            .catch(() => {
                    exitOnFailure();
            });
}

// run the workflow
main();
