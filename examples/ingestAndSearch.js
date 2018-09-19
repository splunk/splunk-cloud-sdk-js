// ***** TITLE: Get data in using Ingest Service
// ***** DESCRIPTION: This example show show to get data in using the Ingest Service in
//              different ways, then runs a search to verify the data was added.
require("isomorphic-fetch");

const { SplunkCloud } = require("../splunk");
const { sleep, searchResults } = require("../utils/exampleHelperFunctions");

const { SPLUNK_CLOUD_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

async function createIndex(splunk, index) {
    if (index === "main") {
        return;
    }
    const regex1 = {
        "owner": "splunk",
        "capabilities": "1101-00000:11010",
        "version": 1,
        "name": index,
        "kind": "index",
        "disabled": false
    };

    splunk.catalog.createDataset(regex1)
        .then(data => console.log(data))
        .catch(err => console.log(`create index error 1:  ${err.code}`));

    // it will take some time for the new index to finish the provisioning
    console.log("wait for 90s for index to be provisioned");
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
    splunk.ingest.postEvents([event1, event2, event3]).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(`ingest events failed with err: ${err}`);
        process.exit(1);

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
    const splunk = new SplunkCloud(SPLUNK_CLOUD_HOST, BEARER_TOKEN, TENANT_ID);

    // ***** STEP 2: Define a new index
    // ***** DESCRIPTION: Define a new index in the Metadata Catalog so that we can send events to the new index.
    await createIndex(splunk, index);

    // ***** STEP 3: Get data in using Ingest Service
    // ***** DESCRIPTION: Send a single event, a batch of events, and raw events using Ingest Service.
    const timeSec = Math.floor(Date.now()/1000);
    const host = `h-${timeSec}`;
    const source = `s-${timeSec}`;
    console.log(`host=${host}, source = ${source}`);
    sendDataViaIngest(splunk, index, host, source);

    // ***** STEP 4: Verify the data
    // ***** DESCRIPTION: Search the data to ensure the data was ingested and field extractions are present.
    // Search for all 3 events that were sent using Ingest Service
    const timeout = 90 * 1000;
    const query = `|from  index:${index} where host="${host}" and source="${source}"`;
    console.log(query);
    searchResults(splunk, Date.now(), timeout, query, 3).then(
        (ret) => {
            if (index !== "main") {
                console.log("delete index");
                splunk.catalog.deleteDatasetByName(index).then(
                    () => {
                        console.log(`finish deleted index`);
                        if (!ret) {
                            process.exit(1);
                        }
                    })
                    .catch(() => {
                        process.exit(1);
                    });
            } else if (!ret) {
                process.exit(1);
            }
        }).catch(() => {
            process.exit(1);
        });
}

// run the workflow
main();
