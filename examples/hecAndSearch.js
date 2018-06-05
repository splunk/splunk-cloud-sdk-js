// ***** TITLE: Get data in using HEC
// ***** DESCRIPTION: This example show show to get data in using the HTTP Event Collector (HEC) in 
//              different ways, then runs a search to verify the data was added. 


const SplunkSSC = require("../splunk");

const HOST = process.env.SSC_HOST;
const AUTH_TOKEN = process.env.BEARER_TOKEN;
const { TENANT_ID } = process.env;

// ***** STEP 1: Get Splunk SSC client
// ***** DESCRIPTION: Get Splunk SSC client of a tenant using an authenticatin token.
const splunk = new SplunkSSC(`${HOST}`, AUTH_TOKEN, TENANT_ID);

// ***** STEP 2: Add field extractions
// ***** DESCRIPTION: Add a field extraction rule to the data in the Metadata Catalog.
const createCatalog = function() {
    const regex1 = {
        "owner": "splunk",
        "capabilities": "1101-00000:11010",
        "version": 1,
        "name": "regexrule1",
        "module": "",
        "match": "host::192.1.1.168",
        "actions": [
            {
                "owner": "splunk",
                "kind": "REGEX",
                "field": "foo",
                "pattern": "device_id=\\[w+\\](?<err_code>[^:]+)"
            }
        ]
    };

    splunk.catalog.createRule(regex1).then(data => console.log(data));

};

createCatalog();

// ***** STEP 3: Get data in using HEC
// ***** DESCRIPTION: Send a single event, a batch of events, and raw events using HEC.
const sendDataViaHec = function() {
    const host = `myhost-${new Date().getSeconds()}`;
    const source = `mysource-${new Date().getMinutes()}`;
    console.log(host);
    console.log(source);

    const event1 = {
        "sourcetype": "splunkd",
        "source": source,
        "host": host,
        "event": `device_id=aa1 haha0 my new event ${host},${source}`
    };
    const event2 = {
        "sourcetype": "splunkd",
        "source": source,
        "index": "main",
        "fields": { "fieldkey1": "fieldval1", "fieldkey2": "fieldkey2" },
        "host": host,
        "event": `04-24-2018 12:32:23.252 -0700 INFO  device_id=aa2 haha1 ${host},${source}`
    };
    const event3 = {
        "sourcetype": "splunkd",
        "source": source,
        "index": "main",
        "fields": { "fieldkey1": "fieldval1", "fieldkey2": "fieldkey2" },
        "host": host,
        "event": `04-24-2018 12:32:23.258 -0700 INFO device_id:aa2 device_id=aa3 haha2 "9765f1bebdb4".  ${host},${source}`
    };

    // Use the HEC raw endpoint to send data
    splunk.hec2.createRawEvent(event1).then(data => {
        console.log(data);
    });

    // Use the HEC endpoint to send one event
    splunk.hec2.createEvent(event2).then(data => {
        console.log(data);
    });

    // Use the HEC endpoint to send multiple events
    splunk.hec2.createEvents([event1, event2, event3]).then(data => {
        console.log(data);
    });

    return { host, source };
};

const hostSource = sendDataViaHec();

// ***** STEP 4: Verify the data
// ***** DESCRIPTION: Search the data to ensure the data was ingested and field extractions are present.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const searchResults = async function (start, timeout, query, expected) {

    if (Date.now() - start > timeout) {
        console.log(`TIMEOUT!!!! Search is taking more than ${timeout}ms. Terminate!`);
        process.exit(1);
    }

    console.log(`Spent ${Date.now() - start}ms to wait for events from query ${query}`);

    await sleep(5000)
    const sid = await splunk.search.createJob({ "query": query });
    await sleep(5000)

    splunk.search.getJob(sid).then(info => {
        if (info.dispatchState === "DONE"){
            splunk.search.getResults(sid).then(results => {
                const retNum = Object.entries(results.results).length;
                if (retNum < expected) {
                    searchResults(start, timeout, query, expected);
                } else if (retNum > expected) {
                    console.log(Object.entries(results.results))
                    throw Error(`find more events than expected for query ${query}`);
                } else if (retNum === expected) {
                    console.log(`Successfully found ${retNum} events for query ${query}, total spent ${Date.now() - start}ms`);
                }
            })
        }
        else {
            console.log("job is not done !!!! need another try")
            searchResults(start, timeout, query, expected)
        }
    })
}



// Define a search timeout constraint
const timeout = 100 * 1000;

// Search for an extracted field that was defined by the Metadata Catalog rule
let query = `search index=main ${hostSource.host},${hostSource.source} | where device_id="aa3"`;
searchResults(Date.now(), timeout, query, 1);

// Search for all events that were sent using HEC
query = `search index=main ${hostSource.host},${hostSource.source}`;
searchResults(Date.now(), timeout, query, 5);