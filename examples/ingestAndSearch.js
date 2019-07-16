// This example shows how to get data in using the Ingest service in
// different ways, then runs a search to verify the data was added.

require('isomorphic-fetch');

const { SplunkCloud } = require('../splunk');
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

async function createIndex(splunk, index) {
    if (index === 'main') {
        return;
    }
    const indexDataset = {
        name: index,
        kind: 'index',
        disabled: false,
    };
    try {
        const response = splunk.catalog.createDataset(indexDataset);
        console.log('Index dataset created with response: ');
        console.log(response);
    } catch {
        err => {
            console.error('Error creating index:');
            console.error(err);
            exitOnFailure();
        };
    }

    // The new index will take some time to be provisioned
    console.log('Waiting for 90s for index to be provisioned');
    await sleep(90 * 1000);
}

async function sendDataViaIngest(splunk, index, host, source) {
    const event1 = {
        sourcetype: 'splunkd',
        source: source,
        host: host,
        body: { body: `device_id=aa1 haha0 my new event ${host},${source}` },
        attributes: {
            index: index,
        },
    };
    const event2 = {
        sourcetype: 'splunkd',
        source: source,
        attributes: {
            index: index,
        },
        host: host,
        body: {
            body: `04-24-2018 12:32:23.252 -0700 INFO  device_id=[www]401:sdfsf haha1 ${host},${source}`,
        },
    };
    const event3 = {
        sourcetype: 'splunkd',
        source: source,
        attributes: {
            index: index,
        },
        host: host,
        body: {
            body: `04-24-2018 12:32:23.258 -0700 INFO device_id:aa2 device_id=[code]error3: haha2 "9765f1bebdb4".  ${host},${source}`,
        },
    };
    try {
        // Use the Ingest endpoint to send multiple events
        const response = await splunk.ingest.postEvents([event1, event2, event3]);
        console.log('Ingest of events succeeded with response:');
        console.log(response);
    } catch {
        err => {
            console.error('Ingest of events failed with err:');
            console.error(err);
            exitOnFailure();
        };
    }
}

function exitOnFailure() {
    process.exit(1);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Create a search job and fetch search results
async function searchResults(splunk, start, timeout, query, expected) {
    try {
        if (Date.now() - start > timeout) {
            console.error(`TIMEOUT!!!! Search is taking more than ${timeout}ms. Terminate!`);
            exitOnFailure();
        }

        // Sleep 5 seconds before retrying the search
        await sleep(5000);
        const job = await splunk.search.createJob({ query: query });
        console.log(`Created sid: ${job.sid}`);
        await splunk.search.waitForJob(job.sid);
        console.log(`Done waiting for job, calling listResults on ${job.sid} ...`);
        const results = await splunk.search.listResults(job.sid);
        const retNum = results.results.length;
        console.log(`got ${retNum} results`);
        if (retNum < expected) {
            return searchResults(splunk, start, timeout, query, expected);
        } else if (retNum > expected) {
            console.log(retNum);
            console.log(`find more events than expected for query ${query}`);
            return results.results;
        }
        console.log(
            `Successfully found ${retNum} event for query ${query}, total spent ${Date.now() -
                start}ms`
        );
        return results.results;
    } catch (err) {
        console.error(err);
        exitOnFailure();
    }
}

// TODO Contact the ingest team for duplicate data ingestion, currently actual results count is 6, expected is 3
// define the main workflow
async function main() {
    try {
        // TODO: a pipeline also needs to be created for this index to ingest data, for now use "main"
        // const index = `test_${new Date().getSeconds()}`;
        const index = 'main';
        // Get a client of a tenant using an authentication token.
        const splunk = new SplunkCloud({
            urls: { api: SPLUNK_CLOUD_API_HOST, app: SPLUNK_CLOUD_APPS_HOST },
            tokenSource: BEARER_TOKEN,
            defaultTenant: TENANT_ID,
        });
        // Define a new index in the Catalog so that we can send events to the new index.
        await createIndex(splunk, index);

        // Get data in using the Ingest service:
        // Send a single event, a batch of events, and raw events.
        const timeSec = Math.floor(Date.now() / 1000);
        const host = `h-${timeSec}`;
        const source = `s-${timeSec}`;
        console.log(`Posting events with host=${host}, source = ${source}`);
        await sendDataViaIngest(splunk, index, host, source);

        // Verify the data:
        // Search the data to ensure the data was ingested and field extractions are present.
        // Search for all 3 events that were sent using the Ingest service.
        const timeout = 90 * 1000;
        const query = `|from  index:${index} where host="${host}" and source="${source}"`;
        console.log(`Searching for events with query: '${query}'`);
        const expectedResults = 3;
        const results = await searchResults(splunk, Date.now(), timeout, query, expectedResults);
        const success = results && results.length >= expectedResults;
        if (index !== 'main') {
            console.log(`Deleting index ${index} ...`);
            await splunk.catalog.deleteDatasetByName(index);
            console.log(`Finished deleted index ${index}`);
        }
        if (!success) {
            console.error(new Error('searh job does not return expected results'));
            exitOnFailure();
        }
    } catch (err) {
        console.error(err);
        err => exitOnFailure();
    }
}

// Run the workflow
main();
