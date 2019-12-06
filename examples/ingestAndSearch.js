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

// This example shows how to get data in using the Ingest service in
// different ways, then runs a search to verify the data was added.

require('isomorphic-fetch');

const { SplunkCloud } = require('../src/splunk');
const { activatePipeline, cleanupPipeline, createIndex, createPipeline, searchResultsWithRetryTimeout } = require('./helpers/splunkCloudHelper');
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

/**
 * Sends a set of events via the ingest API.
 * @param {SplunkCloud} splunk SplunkCloud client.
 * @param {number} index Index.
 * @param {string} host Host.
 * @param {string} source Source.
 */
async function sendDataViaIngest(splunk, index, host, source) {
    console.log(`Posting events with host=${host}, source = ${source}`);
    const event1 = {
        sourcetype: 'splunkd',
        source: source,
        host: host,
        body: {
            body: `device_id=aa1 haha0 my new event ${host},${source}`
        },
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
    } catch (err) {
        throw new Error(`Ingest of events failed with err:\n${err}`);
    }
}

// define the main workflow
(async function () {
    const DATE_NOW = Date.now();
    let pipelineId = null;
    let indexId = null;

    // ***** STEP 1: Get Splunk Cloud client
    // ***** DESCRIPTION: Get Splunk Cloud client of a tenant using an authentication token.
    const splunk = new SplunkCloud({
        urls: {
            api: SPLUNK_CLOUD_API_HOST,
            app: SPLUNK_CLOUD_APPS_HOST
        },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    try {
        // ***** STEP 2: Create a dataset in the catalog and capture the index.
        // ***** DESCRIPTION: The index is retained so that we can send events to the new index.
        const indexName = `jssdkindex${DATE_NOW}`;
        indexId = await createIndex(splunk, indexName);

        // ***** STEP 3: Create a pipeline.
        // ***** DESCRIPTION: Configures a streams pipeline for the newly created index.
        const pipelineName = `pipeline${DATE_NOW}`;
        pipelineId = await createPipeline(splunk, TENANT_ID, pipelineName, indexName);
        await activatePipeline(splunk, pipelineId);

        // ***** STEP 4: Push data to index using the Ingest service.
        // ***** DESCRIPTION: Send events.
        const timeSec = Math.floor(DATE_NOW / 1000);
        const host = `h-${timeSec}`;
        const source = `s-${timeSec}`;
        await sendDataViaIngest(splunk, indexName, host, source);

        // ***** STEP 5: Query for the ingested data by index, host and source.
        // ***** DESCRIPTION: Data ingestion is not instantaneous. Perform periodic searches for a fixed amount of time.
        await searchResultsWithRetryTimeout(
            splunk,
            `| from index:${indexName} where host="${host}" and source="${source}"`,
            (result) => {
                // ***** STEP 6: Verify queried results.
                // ***** DESCRIPTION: Ensure that the event results are the ones we are looking for.
                return result.length == 3 && result.filter(event => event.index == indexId && event.host == host && event.source == source).length == 3;
            });
    } finally {
        // ***** STEP 7: Cleanup - Delete all created pipelines and datasets.
        // ***** DESCRIPTION: Ignoring exceptions on cleanup.
        await cleanupPipeline(splunk, pipelineId, indexId).catch(() => {
            // ignoring exceptions on cleanup.
        });
    }
})().catch(error => console.error(error));
