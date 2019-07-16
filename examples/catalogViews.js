// ***** TITLE: Create and Search View Dataset in Catalog
//
// ***** DESCRIPTION: This example shows how to create View Dataset using the Catalog Service,
//             then execute the View using the Search Service and validate results.

require('isomorphic-fetch');

const { SplunkCloud } = require('../splunk');

const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

function exitOnFailure() {
    process.exit(1);
}

// define the main workflow
async function main() {
    //assuming index main pre-exists
    const index = 'main';
    const viewName = `view_${Date.now()}`;

    // ***** STEP 1: Get Splunk Cloud client
    // ***** DESCRIPTION: Get Splunk Cloud client of a tenant using an authentication token.

    const splunk = new SplunkCloud({
        urls: { api: SPLUNK_CLOUD_API_HOST, app: SPLUNK_CLOUD_APPS_HOST },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    // ***** STEP 2: Create a new View Dataset
    // ***** DESCRIPTION: Define a new View in the Metadata Catalog.

    let viewDatasetResponse = await splunk.catalog.createDataset({
        name: viewName,
        kind: 'view',
        search: 'search index=main | head 10 | stats count()',
    });

    console.log(`View dataset was created : ${viewDatasetResponse.id}`);

    // ***** STEP 3: Get data in using Ingest Service
    // ***** DESCRIPTION: Send in events using Ingest Service.

    const timeSec = Math.floor(Date.now() / 1000);
    const host = `h-${timeSec}`;
    const source = `s-${timeSec}`;
    console.log(`Posting events with host=${host}, source = ${source}`);

    const event1 = {
        sourcetype: 'splunkd',
        source: source,
        host: host,
        body: { body: `Event1 view dataset ${host},${source}` },
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
        body: { body: `Event2 view dataset ${host},${source}` },
    };
    const event3 = {
        sourcetype: 'splunkd',
        source: source,
        attributes: {
            index: index,
        },
        host: host,
        body: { body: `Event3 view dataset ${host},${source}` },
    };
    let events = [event1, event2, event3];
    let ingestResponse = await splunk.ingest.postEvents(events);
    console.log('Ingest of events succeeded with response:');
    console.log(ingestResponse);

    // ***** STEP 4: Verify the view dataset
    // ***** DESCRIPTION: Execute the view using Search Service and ensure there is one expected result.

    const query = `|from ${viewName}`;
    console.log(`Executing the view : '${query}'`);
    const expectedResults = 1;

    splunk.search
        .createJob({ query: `| from ${viewName}` })
        .then(job => {
            console.log(`Created sid: ${job.sid}`);
            return splunk.search.waitForJob(job.sid);
        })
        .then(job => {
            console.log(`Getting results`);
            return splunk.search.listResults(job.sid);
        })
        .then(resultsResponse => {
            const success = resultsResponse && resultsResponse.results.length === expectedResults;
            console.log(`Search results received : ${success}`);
            if (!success) {
                exitOnFailure('Results did not match expected after executing the View');
            }
        })
        .then(() => {
            // Clean up view dataset
            console.log(`Deleting view ${viewDatasetResponse.id}`);
            return splunk.catalog.deleteDataset(viewDatasetResponse.id);
        })
        .catch(err => {
            console.log(error);
            exitOnFailure();
        });
}

// run the workflow
main();
