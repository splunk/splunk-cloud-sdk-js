// ***** TITLE: Get data in using Ingest Service
// ***** DESCRIPTION: This example show show to get data in using the Ingest Service in
//              different ways, then runs a search to verify the data was added.
require("isomorphic-fetch");

const { SplunkCloud } = require("../splunk");
const { sleep, searchResults } = require("../utils/exampleHelperFunctions");

const { SPLUNK_CLOUD_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

function exitOnFailure() {
    process.exit(1);
}

async function createIndex(splunk, index) {
    if (index === "main") {
        return;
    }
    const indexDataset = {
        "owner": "splunk",
        "capabilities": "1101-00000:11010",
        "version": 1,
        "name": index,
        "kind": "index",
        "disabled": false
    };

    splunk.catalog.createDataset(indexDataset)
        .then(response => {
            console.log("Index dataset created with response: ");
            console.log(response);
        })
        .catch(err => {
            console.log("Error creating index:");
            console.log(err);
            exitOnFailure();
        });

    // it will take some time for the new index to finish the provisioning
    console.log("Waiting for 90s for index to be provisioned");
    await sleep(90 * 1000);
};

function sendDataViaIngest(splunk, index, host, source) {
    const event1 = {
        "sourcetype": "splunkd",
        "source": source,
        "host": host,
        "body": `device_id=aa1 haha0 my new event ${host},${source}`,
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
        "body": `04-24-2018 12:32:23.252 -0700 INFO  device_id=[www]401:sdfsf haha1 ${host},${source}`
    };
    const event3 = {
        "sourcetype": "splunkd",
        "source": source,
        "attributes": {
            "index": index
        },
        "host": host,
        "body": `04-24-2018 12:32:23.258 -0700 INFO device_id:aa2 device_id=[code]error3: haha2 "9765f1bebdb4".  ${host},${source}`
    };

    // Use the Ingest endpoint to send multiple events
    splunk.ingest.postEvents([event1, event2, event3]).then(response => {
        console.log("Ingest of events succeeded with response:");
        console.log(response);
    }).catch(err => {
        console.log("Ingest of events failed with err:");
        console.log(err);
        exitOnFailure();
    });
};

// TODO Contact the ingest team for duplicate data ingestion, currently actual results count is 6, expected is 3
// define the main workflow
async function main() {
    // TODO: a pipeline also needs to be created for this index to ingest data, for now use "main"
    // const index = `test_${new Date().getSeconds()}`;
    const index = "main" ;
    // ***** STEP 1: Get Splunk Cloud client
    // ***** DESCRIPTION: Get Splunk Cloud client of a tenant using an authenticatin token.
    const splunk = new SplunkCloud({'url': SPLUNK_CLOUD_HOST, 'tokenSource': BEARER_TOKEN, 'defaultTenant': TENANT_ID });

    // ***** STEP 2: Define a new index
    // ***** DESCRIPTION: Define a new index in the Metadata Catalog so that we can send events to the new index.
    await createIndex(splunk, index);

    // ***** STEP 3: Get data in using Ingest Service
    // ***** DESCRIPTION: Send a single event, a batch of events, and raw events using Ingest Service.
    const timeSec = Math.floor(Date.now()/1000);
    const host = `h-${timeSec}`;
    const source = `s-${timeSec}`;
    console.log(`Posting events with host=${host}, source = ${source}`);
    sendDataViaIngest(splunk, index, host, source);

    // ***** STEP 4: Verify the data
    // ***** DESCRIPTION: Search the data to ensure the data was ingested and field extractions are present.
    // Search for all 3 events that were sent using Ingest Service
    const timeout = 90 * 1000;
    const query = `|from  index:${index} where host="${host}" and source="${source}"`;
    console.log(`Searching for events with query: '${query}'`);
    const expectedResults = 3;
    searchResults(splunk, Date.now(), timeout, query, expectedResults).then(
        (results) => {
            // TODO: Known issue with duplicate events in ingest service,
            // allow more results than expected for now
            const success = (results && results.length >= expectedResults);
            if (index !== "main") {
                console.log(`Deleting index ${index} ...`);
                splunk.catalog.deleteDatasetByName(index).then(
                    () => {
                        console.log(`Finished deleted index ${index}`);
                        if (!success) {
                            exitOnFailure();
                        }
                    })
                    .catch(() => {
                        exitOnFailure();
                    });
            } else if (!success) {
                exitOnFailure();
            }
        }).catch(() => {
            exitOnFailure();
        });
}

// run the workflow
main();
