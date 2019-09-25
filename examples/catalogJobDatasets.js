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

const { SplunkCloud } = require('../splunk');

const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

function exitOnFailure(error) {
    console.log(error);
    process.exit(1);
}

// define the main workflow
async function main() {
    //assuming index main pre-exists
    const index = 'main';
    const query = `search index=main | head 10 | stats count()`;
    let jobId, jobName;

    // ***** STEP 1: Get Splunk Cloud client
    // ***** DESCRIPTION: Get Splunk Cloud client of a tenant using an authentication token.

    const splunk = new SplunkCloud({
        urls: { api: SPLUNK_CLOUD_API_HOST, app: SPLUNK_CLOUD_APPS_HOST },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    try {
        // ***** STEP 2: Get data in using Ingest Service
        // ***** DESCRIPTION: Send in events using Ingest Service.

        const timeSec = Math.floor(Date.now() / 1000);
        const host = `h-${timeSec}`;
        const source = `s-${timeSec}`;
        console.log(`Posting events with host=${host}, source = ${source}`);

        const event1 = {
            attributes: {
                index: index,
            },
            body: { body: `Event1 view dataset ${host},${source}` },
            host: host,
            sourcetype: 'splunkd',
            source: source,
        };
        const event2 = {
            attributes: {
                index: index,
            },
            body: { body: `Event2 view dataset ${host},${source}` },
            host: host,
            sourcetype: 'splunkd',
            source: source,
        };
        const event3 = {
            attributes: {
                index: index,
            },
            body: { body: `Event3 view dataset ${host},${source}` },
            host: host,
            sourcetype: 'splunkd',
            source: source,
        };
        let events = [event1, event2, event3];
        let ingestResponse = await splunk.ingest.postEvents(events);
        console.log('Ingest of events succeeded with response:');
        console.log(ingestResponse);

        // ***** STEP 3: Create a Search Job
        // ***** DESCRIPTION: Create a new Search job using the Search Service

        const expectedResults = 1;

        const job = await splunk.search.createJob({ query: `${query}` });
        const jobID = job.sid;
        console.log(`Created job with sid: ${jobID}`);
        await splunk.search.waitForJob(job);
        const results = await splunk.search.listResults(jobID);

        // ***** STEP 4: List Job Datasets using Catalog
        // ***** DESCRIPTION: List Job Datasets using Catalog and Validate the Job dataset created using Search exists
        const success = results && results.results.length == expectedResults;
        console.log(`Search results received : ${success}`);
        if (!success) {
            exitOnFailure('Results did not match expected after executing the search job');
        }
        jobName = 'sid_' + jobID.replace('.', '_');
        const dsList = await splunk.catalog.listDatasets({ filter: `name=="${jobName}"` });
        console.log('Job Dataset Found: ');
        console.log(dsList[0].name);
        if (dsList.length != 1) {
            exitOnFailure('Job created with search service does not exist in Catalog.');
        } else {
            console.log('Expected Job dataset found in catalog');
        }
        console.log(`Deleting job ${jobName}`);
        await splunk.catalog.deleteDataset(jobName);
    } catch (err) {
        console.error(err);
        err => exitOnFailure(err);
    }
}

// run the workflow
main();
