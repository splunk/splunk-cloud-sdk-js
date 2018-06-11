// ***** TITLE: Get data in using HEC
// ***** DESCRIPTION: This example show show to get data in using the HTTP Event Collector (HEC) in 
//              different ways, then runs a search to verify the data was added. 


const SplunkSSC = require("../splunk");

const HOST = process.env.SSC_HOST;
const AUTH_TOKEN = process.env.BEARER_TOKEN;
const { TENANT_ID } = process.env;

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
        "module": "",
        "disabled": false
    };

    splunk.catalog.createDataset(regex1)
        .then(data => console.log(data))
        .catch(err => console.log(`create index error:  ${err.code}`));

    // it will take some time for the new index to finish the provisioning
    console.log("wait for 90s for index to be provisioned")
    await sleep(90 * 1000);
};

function sendDataViaHec(splunk, index) {
    const host = `myhost-${new Date().getSeconds()}`;
    const source = `mysource-${new Date().getMinutes()}`;
    console.log(host);
    console.log(source);

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

    // Use the HEC raw endpoint to send data
    splunk.hec2.createRawEvent(event1).then(data => {
        console.log(data);
    }).catch(err => console.log(`hecraw: ${err.code}`));

    // Use the HEC endpoint to send one event
    splunk.hec2.createEvent(event2).then(data => {
        console.log(data);
    }).catch(err => console.log(`hec event1: ${err.code}`));


    // Use the HEC endpoint to send multiple events
    splunk.hec2.createEvents([event1, event2, event3]).then(data => {
        console.log(data);
    }).catch(err => console.log(`hec events: ${err.code}`));

    return { host, source };
};

async function searchResults(splunk, start, timeout, query, expected) {

    if (Date.now() - start > timeout) {
        console.log(`TIMEOUT!!!! Search is taking more than ${timeout}ms. Terminate!`);
        process.exit(1);
    }

    console.log(`Spent ${Date.now() - start}ms to wait for events from query ${query}`);

    await sleep(5000);
    const sid = await splunk.search.createJob({ "query": query });
    await sleep(5000);

    splunk.search.getJob(sid).then(info => {
        if (info.dispatchState === "DONE") {
            splunk.search.getResults(sid).then(results => {
                // console.log(results)
                const retNum = Object.entries(results.results).length;
                console.log(`got ${retNum} results`);
                if (retNum < expected) {
                    searchResults(splunk, start, timeout, query, expected);
                } else if (retNum > expected) {
                    console.log(Object.entries(results.results));
                    throw Error(`find more events than expected for query ${query}`);
                } else if (retNum === expected) {
                    console.log(`Successfully found ${retNum} events for query ${query}, total spent ${Date.now() - start}ms`);
                }
            });
        }
        else {
            console.log("job is not done !!!! need another try");
            searchResults(splunk, start, timeout, query, expected);
        }
    });
};


// define the main workflow
async function main() {

    const index = "newIndexTest";
    // ***** STEP 1: Get Splunk SSC client
    // ***** DESCRIPTION: Get Splunk SSC client of a tenant using an authenticatin token.
    const splunk = new SplunkSSC(HOST, AUTH_TOKEN, TENANT_ID);

    // ***** STEP 2: Define a new index
    // ***** DESCRIPTION: Define a new index in the Metadata Catalog so that we can send events to the new index.
    await createIndex(splunk, index);

    // ***** STEP 3: Get data in using HEC
    // ***** DESCRIPTION: Send a single event, a batch of events, and raw events using HEC.
    const hostSource = sendDataViaHec(splunk, index);

    // ***** STEP 4: Verify the data
    // ***** DESCRIPTION: Search the data to ensure the data was ingested and field extractions are present.

    // Search for all 5 events that were sent using HEC
    const timeout = 90 * 1000;
    const query = `search index=${index} ${hostSource.host},${hostSource.source}`;
    console.log(query);
    await searchResults(splunk, Date.now(), timeout, query, 5);
};

// run the workflow
main();
