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

// ***** TITLE: Create and Search Job Dataset in Catalog
//
// ***** DESCRIPTION: This example creates a Search Job using the Search Service,
//                    then searches Catalog for this Job dataset.

require('isomorphic-fetch');

const { SplunkCloud } = require('../src/splunk');
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

(async function main() {
    //assuming index main pre-exists
    const INDEX = 'main';
    const QUERY = `search index=${INDEX} | head 10 | stats count()`;

    // ***** STEP 1: Get Splunk Cloud client
    // ***** DESCRIPTION: Get Splunk Cloud client of a tenant using an authentication token.
    const splunk = new SplunkCloud({
        urls: { api: SPLUNK_CLOUD_API_HOST, app: SPLUNK_CLOUD_APPS_HOST },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    // ***** STEP 2: Get data in using Ingest Service
    // ***** DESCRIPTION: Send in events using Ingest Service.
    const timeSec = Math.floor(Date.now() / 1000);
    const host = `h-${timeSec}`;
    const source = `s-${timeSec}`;
    console.log(`posting events with host='${host}', source='${source}'`);

    const event1 = {
        attributes: {
            index: INDEX,
        },
        body: { body: `Event1 view dataset ${host},${source}` },
        host: host,
        sourcetype: 'splunkd',
        source: source,
    };
    const event2 = {
        attributes: {
            index: INDEX,
        },
        body: { body: `Event2 view dataset ${host},${source}` },
        host: host,
        sourcetype: 'splunkd',
        source: source,
    };
    const event3 = {
        attributes: {
            index: INDEX,
        },
        body: { body: `Event3 view dataset ${host},${source}` },
        host: host,
        sourcetype: 'splunkd',
        source: source,
    };
    const response = await splunk.ingest.postEvents([event1, event2, event3])
    console.log('Successfully ingested events.');
    console.log(response);

    // ***** STEP 3: Create a Search Job
    // ***** DESCRIPTION: Create a new Search job using the Search Service
    const searchJob = await splunk.search.createJob({ query: QUERY });
    console.log(`Job created. sid='${searchJob.sid}'`);

    await splunk.search.waitForJob(searchJob);

    try {
        // ***** STEP 4: List Job Datasets using Catalog
        // ***** DESCRIPTION: List Job Datasets using Catalog and Validate the Job dataset created using Search exists
        const listResults = await splunk.search.listResults(searchJob.sid);
        if (!listResults || !listResults.results || listResults.results.length < 1) {
            throw new Error('List results did not return any results.');
        }

        console.log(`Querying for catalog dataset from job ${searchJob.name}`);
        const listDatasets = await splunk.catalog.listDatasets({ filter: `name=="${searchJob.name}"` })
        if (!listDatasets || listDatasets.filter(dataset => dataset.name == searchJob.name) == 0) {
            throw new Error('Job created with search service does not exist in catalog.');
        }

        console.log(`Search results found. count=${listDatasets.length}`);
        console.log(listDatasets);
    } finally {
        // ***** STEP 5: Cleanup - Delete job data set. Ignore failures.
        console.log('Cleaning up job dataset.');
        await splunk.catalog.deleteDataset(searchJob.name).catch(() => {});
    }
})().catch(error => console.error(error));
