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
const sleep = require('sleep-promise');

const { SplunkCloud } = require('../splunk');
const tenantSetup = require('./tenantSetup');
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

// define the main workflow
async function main() {
    let pipelineId = null;
    let indexId = null;
    let exitCode = 0;

    // Get a client of a tenant using an authentication token.
    const splunk = new SplunkCloud({
        urls: { api: SPLUNK_CLOUD_API_HOST, app: SPLUNK_CLOUD_APPS_HOST },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    try {

        // Define a new index in the Catalog so that we can send events to the new index.
        // Includes a 90s sleep
        const indexName = `jssdkindex${Date.now()}`;
        const indexId = await tenantSetup.createIndex(splunk, indexName);

        // Configure streams pipeline for the newly created index
        // Includes a 30s sleep
        const pipelineName = `pipeline${Date.now()}`;
        const pipelineId = await tenantSetup.createPipeline(splunk, TENANT_ID, pipelineName, indexName);
        await tenantSetup.activatePipeline(splunk, pipelineId);

        // Get data in using the Ingest service:
        // Send a single event, a batch of events, and raw events.
        const timeSec = Math.floor(Date.now() / 1000);
        const host = `h-${timeSec}`;
        const source = `s-${timeSec}`;
        console.log(`Posting events with host=${host}, source = ${source}`);
        await sendDataViaIngest(splunk, indexName, host, source);

        // Verify the data:
        // Search the data to ensure the data was ingested and field extractions are present.
        // Search for all 3 events that were sent using the Ingest service.
        const timeout = 90 * 1000;
        const query = `| from index:${indexName} where host="${host}" and source="${source}"`;
        console.log(`Searching for events with query: '${query}'`);
        const expectedResults = 3;
        const results = await searchResults(splunk, Date.now(), timeout, query, expectedResults);
        const success = results && results.length >= expectedResults;
        if (!success) {
            throw new Error('Search job did not return expected results');
        }
    } catch (err) {
        console.error(err);
        exitCode = 1;
    } finally {
        // Only cleanup in CI
        if (process.env.CI) {
            await tenantSetup.cleanup(splunk, pipelineId, indexId);
        }
        process.exit(exitCode);
    }
}

// Run the workflow
main();

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
    } catch(err) {
        console.error('Ingest of events failed with err:');
        console.error(err);
        process.exit(1);
    }
}

// Create a search job and fetch search results
async function searchResults(splunk, start, timeout, query, expected) {
    try {
        if (Date.now() - start > timeout) {
            console.error(`TIMEOUT!!!! Search is taking more than ${timeout}ms. Terminate!`);
            process.exit(1);
        }

        // Sleep 5 seconds before retrying the search
        await sleep(5000);
        const job = await splunk.search.createJob({ query: query });
        console.log(`Created search job with sid ${job.sid}, waiting for completion`);
        await splunk.search.waitForJob(job);

        console.log(`Done waiting for job, calling listResults on ${job.sid} ...`);
        const results = await splunk.search.listResults(job.sid);
        const retNum = results.results.length;
        console.log(`got ${retNum} results`);
        if (retNum < expected) {
            return await searchResults(splunk, start, timeout, query, expected);
        } else if (retNum > expected) {
            console.log(retNum);
            console.log(`Found more events than expected for query ${query}`);
            return results.results;
        }
        console.log(`Successfully found ${retNum} results for query ${query}, Search took ${Date.now() - start}ms to complete`);
        return results.results;
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

