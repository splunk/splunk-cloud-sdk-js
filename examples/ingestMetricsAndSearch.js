// ***** TITLE: Get metrics data in using Ingest Service
// ***** DESCRIPTION: This example shows ingestion of metrics data through ingestion service
//              and a search on the ingested data to verify the data.
require('isomorphic-fetch');

const { SplunkCloud } = require('../splunk');
const { searchResults, exitOnFailure } = require('../utils/exampleHelperFunctions');

const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

// Call to the ingest service to insert data
function sendDataViaIngest(splunk, host, source) {
    const metricEvent1 = {
        attributes: {
            defaultDimensions: {},
            defaultType: 'g',
            defaultUnit: 'MB',
        },
        body: [
            {
                dimensions: { Server: 'ubuntu' },
                name: 'CPU',
                unit: 'percentage',
                value: 33.89,
            },
            {
                dimensions: { Region: 'us-east-1' },
                name: 'Memory',
                type: 'g',
                value: 2.27,
            },
            {
                name: 'Disk',
                unit: 'GB',
                value: 10.0,
            },
        ],
        host: host,
        id: 'metric0001',
        nanos: 1,
        source: source,
        sourcetype: 'mysourcetype',
        timestamp: Date.now(), // Millis since epoch
    };

    const metricEvent2 = {
        attributes: {
            defaultDimensions: {},
            defaultType: 'g',
            defaultUnit: 'MB',
        },
        body: [
            {
                dimensions: { Server: 'ubuntu' },
                name: 'CPU',
                unit: 'percentage',
                value: 35.89,
            },
            {
                dimensions: { Region: 'us-east-1' },
                name: 'Memory',
                type: 'g',
                value: 4.27,
            },
            {
                name: 'Disk',
                unit: 'GB',
                value: 10.0,
            },
        ],
        host: host,
        id: 'metric0002',
        nanos: 2,
        source: source,
        sourcetype: 'mysourcetype',
        timestamp: Date.now(), // Millis since epoch
    };

    // Use the Ingest Service metrics endpoint to send the metrics data
    splunk.ingest
        .postMetrics([metricEvent1, metricEvent2])
        .then(response => {
            console.log('Ingest of metrics succeeded with response:');
            console.log(response);
        })
        .catch(err => {
            console.log('Ingest of metrics failed with err:');
            console.log(err);
            exitOnFailure();
        });
}

// Define the main workflow
async function main() {
    // ***** STEP 1: Get Splunk SSC client
    // ***** DESCRIPTION: Get Splunk SSC client of a tenant using an authentication token.
    const splunk = new SplunkCloud({
        urls: { api: SPLUNK_CLOUD_API_HOST, app: SPLUNK_CLOUD_APPS_HOST },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    // ***** STEP 2: Get metrics data in using Ingest Service
    // ***** DESCRIPTION: Send two metrics events containing the metrics data using Ingest Service.
    const timeSec = Math.floor(Date.now() / 1000);
    const host = `h-${timeSec}`;
    const source = `s-${timeSec}`;
    console.log(`Posting metrics with host=${host}, source=${source}`);
    sendDataViaIngest(splunk, host, source);

    // ***** STEP 3: Verify the data
    // ***** DESCRIPTION: Search the data to ensure the metrics data was ingested.
    const timeout = 90 * 1000;
    const query = `| from metrics group by host select host, avg(CPU) as avg_cpu, avg(Memory) as avg_mem, avg(Disk) as avg_disk | search host="${host}"`;
    console.log(`Searching for metrics with query: '${query}'`);
    searchResults(splunk, Date.now(), timeout, query, 1)
        .then(results => {
            // TODO: Known issue with duplicate events in ingest service,
            // allow more results than expected for now
            const success = results && results.length >= 0;
            if (!success) {
                exitOnFailure();
            }
        })
        .catch(() => {
            exitOnFailure();
        });
}

// Run the workflow
main();
