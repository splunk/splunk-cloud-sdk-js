// ***** TITLE: Get data in using Ingest Service
// ***** DESCRIPTION: This example show show to get data in using the Ingest Service in
//              different ways, then runs a search to verify the data was added.
require("babel-polyfill");
const SplunkSSC = require("../out/splunk");


const { SSC_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

// define helper functions

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createIndex(splunk, index) {
    const regex1 = {
        "owner": "splunk",
        "capabilities": "1101-00000:11010",
        "version": 1,
        "name": index,
        "kind": "index",
        "module": "splunk",
        "disabled": false
    };


    if (index !== "main") {
        splunk.catalog.createDataset(regex1)
            .then(data => console.log(data))
            .catch(err => console.log(`create index error 1:  ${err.code}`));

        // it will take some time for the new index to finish the provisioning
        console.log("wait for 90s for index to be provisioned");
        await sleep(90 * 1000);
    }
};

function sendDataViaIngest(splunk, index, host, source) {

    const event1 = {
        "sourcetype": "splunkd",
        "source": source,
        "host": host,
        "event": `device_id=aa1 haha0 my new event ${host},${source}`,
        "index": index
    };
    const event2 = {
        "sourcetype": "splunkd",
        "source": source,
        "index": index,
        "fields": { "fieldkey1": "fieldval1", "fieldkey2": "fieldkey2" },
        "host": host,
        "event": `04-24-2018 12:32:23.252 -0700 INFO  device_id=[www]401:sdfsf haha1 ${host},${source}`
    };
    const event3 = {
        "sourcetype": "splunkd",
        "source": source,
        "index": index,
        "fields": { "fieldkey1": "fieldval1", "fieldkey2": "fieldkey2" },
        "host": host,
        "event": `04-24-2018 12:32:23.258 -0700 INFO device_id:aa2 device_id=[code]error3: haha2 "9765f1bebdb4".  ${host},${source}`
    };

    // Use the Ingest Service raw endpoint to send data
    splunk.ingest.createRawEvent(event1).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(`ingest event failed with err: ${err}`);
        process.exit(1);
    });

    // Use the Ingest Service endpoint to send one event
    splunk.ingest.createEvent(event2).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(`ingest event1 failed with err: ${err}`);
        process.exit(1);
    });


    // Use the Ingest endpoint to send multiple events
    splunk.ingest.createEvents([event1, event2, event3]).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(`ingest events failed with err: ${err}`);
        process.exit(1);

    });
};


async function searchResults(splunk, start, timeout, query, expected) {

    if (Date.now() - start > timeout) {
        console.log(`TIMEOUT!!!! Search is taking more than ${timeout}ms. Terminate!`);
        return false;
    }

    // sleep 5 seconds before to retry the search
    await sleep(5000);

    return splunk.search.createJob({ "query": query })
        .then(sid => splunk.search.waitForJob(sid))
        .then(searchObj => splunk.search.getResults(searchObj.sid)
            .then(resultResponse => {
                const retNum = resultResponse.results.length;
                console.log(`got ${retNum} results`);
                if (retNum < expected) {
                    return searchResults(splunk, start, timeout, query, expected);
                } else if (retNum > expected) {
                    console.log(retNum);
                    console.log(`find moreyar events than expected for query ${query}`);
                    return false;
                }
                console.log(`Successfully found ${retNum} events for query ${query}, total spent ${Date.now() - start}ms`);
                return true;
            })
        )
        .catch(err => {
            console.log(err);
            return false;
        });
};


// define the main workflow
async function main() {
    // todo: should be a non-main index, but playground now still have issues for sending data to non-main index
    const index = `test_${new Date().getSeconds()}`;
    // ***** STEP 1: Get Splunk SSC client
    // ***** DESCRIPTION: Get Splunk SSC client of a tenant using an authenticatin token.
    const splunk = new SplunkSSC(SSC_HOST, BEARER_TOKEN, TENANT_ID);

    // ***** STEP 2: Define a new index
    // ***** DESCRIPTION: Define a new index in the Metadata Catalog so that we can send events to the new index.
    await createIndex(splunk, index);

    // ***** STEP 3: Get data in using Ingest Service
    // ***** DESCRIPTION: Send a single event, a batch of events, and raw events using Ingest Service.
    const host = `myhost-${new Date().getSeconds()}`;
    const source = `mysource-${new Date().getMinutes()}`;
    console.log(`host=${host}, source = ${source}`);
    sendDataViaIngest(splunk, index, host, source);

    // ***** STEP 4: Verify the data
    // ***** DESCRIPTION: Search the data to ensure the data was ingested and field extractions are present.
    // Search for all 5 events that were sent using Ingest Service
    const timeout = 90 * 1000;
    const query = `|from  index:${index} where host="${host}" and source="${source}"`;
    console.log(query);
    searchResults(splunk, Date.now(), timeout, query, 5).then(
        (ret) => {
            if (index !== "main") {
                console.log("delete index");
                splunk.catalog.deleteDatasetByName(index).then(
                    () => {
                        console.log(`finish deleted index`);
                        if (!ret) {
                            process.exit(1);
                        }
                    });
            } else if (!ret) {
                process.exit(1);
            }
        });
}

// run the workflow
main();
