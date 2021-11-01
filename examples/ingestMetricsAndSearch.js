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
const { searchResultsWithRetryTimeout } = require('./helpers/splunkCloudHelper');
const { SPLUNK_CLOUD_API_HOST, BEARER_TOKEN, TENANT_ID } = process.env;
const METRICS_INDEX_NAME = 'metrics_gintegration';

// Call to the ingest service to insert data
async function sendDataViaIngest(splunk, host, source) {
    console.log(`Posting metrics with host=${host}, source=${source}`);
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
    await splunk.ingest.postMetrics([metricEvent1, metricEvent2]).catch(error => {
        throw new Error(`Ingest of metrics failed with err=${error}`);
    });

    console.log('Ingestion of metrics succeeded.');
}

// Define the main workflow
(async function () {
    // ***** STEP 1: Get Splunk Cloud client
    // ***** DESCRIPTION: Get Splunk Cloud client of a tenant using an authentication token.
    const splunk = new SplunkCloud({
        urls: {
            api: SPLUNK_CLOUD_API_HOST
        },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    // ***** STEP 2: Get metrics data in using Ingest Service
    // ***** DESCRIPTION: Send two metrics events containing the metrics data using Ingest Service.
    const timeSec = Math.floor(Date.now() / 1000);
    const host = `h-${timeSec}`;
    const source = `s-${timeSec}`;
    await sendDataViaIngest(splunk, host, source);

    // ***** STEP 3: Verify the data
    // ***** DESCRIPTION: Search the data to ensure the metrics data was ingested.
    const searchResultsResponse = await searchResultsWithRetryTimeout(
        splunk,
        `| from ${METRICS_INDEX_NAME} group by host select host, avg(CPU) as avg_cpu, avg(Memory) as avg_mem, avg(Disk) as avg_disk | search host="${host}"`,
        (result) => {
            return result.length >= 1;
        }).catch(error => {
            throw new Error(`Results search for metrics failed with error=${error}`);
        });

    console.log(searchResultsResponse);
})().catch(error => console.error(error));
