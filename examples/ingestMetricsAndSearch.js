// ***** TITLE: Get metrics data in using Ingest Service
// ***** DESCRIPTION: This example shows ingestion of metrics data through ingestion service
//              and a search on the ingested data to verify the data.
require('isomorphic-fetch')

const SplunkSSC = require("../splunk");
const { searchResults } = require('./exampleHelperFunctions.js');

const { SSC_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

// Call to the ingest service to insert data
function sendDataViaIngest(splunk, index, host, source) {
    const metrics = [
        {
            'dimensions': { 'Server': 'ubuntu' },
            'name': 'CPU',
            'unit': 'percentage',
            'value': 33.89
        },
        {
            'dimensions': { 'Region': 'us-east-1' },
            'name': 'Memory',
            'type': 'g',
            'value': 2.27
        },
        {
            'name': 'Disk3',
            'unit': 'GB',
            'value': 10.444
        }
    ];

    const metricEvent1 = {
        'attributes': {
            'defaultDimensions': {},
            'defaultType': 'g',
            'defaultUnit': 'MB'
        },
        'body': metrics,
        'host': host,
        'id': 'metric0001',
        'nanos': 1,
        'source': source,
        'sourcetype': 'mysourcetype',
        'timestamp': Date.now() // Millis since epoch
    };

    const metricEvent2 = JSON.parse(JSON.stringify(metricEvent1));
    metricEvent2.id = 'metric0002';
    metricEvent2.nanos = 2;
    metricEvent2.body = [{
        'name': 'External',
        'unit': 'GB',
        'value': 10.444
    }];

    // Use the Ingest Service metrics endpoint to send the metrics data
    splunk.ingest.createMetrics([metricEvent1, metricEvent2]).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(`ingest metrics event failed with err: ${err}`);
        process.exit(1);
    });
};

// Define the main workflow
async function main() {
    // ***** STEP 1: Get Splunk SSC client
    // ***** DESCRIPTION: Get Splunk SSC client of a tenant using an authentication token.
    const splunk = new SplunkSSC(SSC_HOST, BEARER_TOKEN, TENANT_ID);

    // ***** STEP 2: Get metrics data in using Ingest Service
    // ***** DESCRIPTION: Send two metrics events containing the metrics data using Ingest Service.
    const host = `myhost-${new Date().getSeconds()}`;
    const source = `mysource-${new Date().getMinutes()}`;
    console.log(`host=${host}, source = ${source}`);
    sendDataViaIngest(splunk, host, source);

    // ***** STEP 3: Verify the data
    // ***** DESCRIPTION: Search the data to ensure the metrics data was ingested.
    const timeout = 90 * 1000;
    const query = `| mcatalog values(metric_name) as metrics where index=metrics`;
    console.log(query);
    searchResults(splunk, Date.now(), timeout, query, 1).then(
        (ret) => {
            if (!ret) {
                process.exit(1);
            }
        });
}

// Run the workflow
main();
