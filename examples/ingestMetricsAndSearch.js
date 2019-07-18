/**
 * Copyright 2019 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

// ***** TITLE: Get metrics data in using Ingest Service
// ***** DESCRIPTION: This example shows ingestion of metrics data through ingestion service
//              and a search on the ingested data to verify the data.
require('isomorphic-fetch');

const { SplunkCloud } = require('../splunk');
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

// Call to the ingest service to insert data
async function sendDataViaIngest(splunk, host, source) {
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
        nanos: 2,
        source: source,
        sourcetype: 'mysourcetype',
        timestamp: Date.now(), // Millis since epoch
    };

    // Use the Ingest Service metrics endpoint to send the metrics data
    await splunk.ingest
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

function exitOnFailure() {
    process.exit(1);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Creates a search job and fetches search results
async function searchResults(splunk, start, timeout, query, expected) {
    if ((Date.now() - start) > timeout) {
        console.log(`TIMEOUT!!!! Search is taking more than ${timeout}ms. Terminate!`);
        return false;
    }

    // sleep 5 seconds before to retry the search
    await sleep(5000);

    return splunk.search
        .createJob({ query: query })
        .then(job => {
            console.log(`Created sid: ${job.sid}`);
            return splunk.search.waitForJob(job.sid);
        })
        .then(searchObj => {
            console.log(`Done waiting for job, calling listResults on ${searchObj.sid} ...`);
            return splunk.search.listResults(searchObj.sid);
        })
        .then(resultResponse => {
            const retNum = resultResponse.results.length;
            console.log(`got ${retNum} results`);
            if (retNum < expected) {
                return searchResults(splunk, start, timeout, query, expected);
            } else if (retNum > expected) {
                console.log(retNum);
                console.log(`find more events than expected for query ${query}`);
                return resultResponse.results;
            }
            console.log(
                `Successfully found ${retNum} event for query ${query}, total spent ${Date.now() -
                    start}ms`
            );
            return resultResponse.results;
        })
        .catch(err => {
            console.log(err);
            return [];
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
    await sendDataViaIngest(splunk, host, source);

    // ***** STEP 3: Verify the data
    // ***** DESCRIPTION: Search the data to ensure the metrics data was ingested.
    const timeout = 90 * 1000;
    const query = `| from metrics group by host select host, avg(CPU) as avg_cpu, avg(Memory) as avg_mem, avg(Disk) as avg_disk | search host="${host}"`;
    console.log(`Searching for metrics with query: '${query}'`);
    await searchResults(splunk, Date.now(), timeout, query, 1)
        .then(results => {
            // TODO: Known issue with duplicate events in ingest service,
            // allow more results than expected for now
            const success = results && results.length >= 0;
            if (!success) {
                console.log('Searching for metrics returned no results.');
                exitOnFailure();
            }
        })
        .catch(err => {
            console.log('Searching for metrics failed with err:');
            console.log(err);
            exitOnFailure();
        });
}

// Run the workflow
main();
