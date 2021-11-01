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

// ***** TITLE: Create and Search View Dataset in Catalog
//
// ***** DESCRIPTION: This example shows how to create View Dataset using the Catalog Service,
//             then execute the View using the Search Service and validate results.

require('isomorphic-fetch');

const { SplunkCloud } = require('../splunk');
const { SPLUNK_CLOUD_API_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

(async function () {
    //assuming index main pre-exists
    const DATE_NOW = Date.now();
    const index = 'main';
    const viewName = `view_${DATE_NOW}`;

    // ***** STEP 1: Get Splunk Cloud client
    // ***** DESCRIPTION: Get Splunk Cloud client of a tenant using an authentication token.
    const splunk = new SplunkCloud({
        urls: {
            api: SPLUNK_CLOUD_API_HOST
        },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    // ***** STEP 2: Create a new View Dataset
    // ***** DESCRIPTION: Define a new View in the Metadata Catalog.
    const viewDataset = await splunk.catalog.createDataset({
        name: viewName,
        kind: 'view',
        search: 'search index=main | head 10 | stats count()',
    });
    console.log(`View dataset was created.\n${viewDataset}`);

    try {
        // ***** STEP 3: Get data in using Ingest Service
        // ***** DESCRIPTION: Send in events using Ingest Service.
        const timeSec = Math.floor(DATE_NOW / 1000);
        const host = `h-${timeSec}`;
        const source = `s-${timeSec}`;

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
        await splunk.ingest.postEvents([event1, event2, event3]);
        console.log('Successfully ingested events.');

        // ***** STEP 4: Verify the view dataset
        // ***** DESCRIPTION: Execute the view using Search Service and ensure there is one expected result.
        const job = await splunk.search.createJob({ query: `| from ${viewName}` });
        console.log(`Job created. sid='${job.sid}'`);

        await splunk.search.waitForJob(job);
        const searchResults = await splunk.search.listResults(job.sid);
        if (!searchResults || !searchResults.results || searchResults.results.length == 0) {
            throw new Error('No search results returns from view.');
        }

        console.log(`Search results returned successfully.\n${searchResults}`);
    } finally {
        // ***** STEP 5: Clean up view dataset
        console.log('Cleaning up view dataset.');
        await splunk.catalog.deleteDataset(viewDataset.id).catch(() => {});
    }
})().catch(error => console.error(error));
