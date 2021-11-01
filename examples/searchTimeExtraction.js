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

// ***** TITLE: Search Time Field Extraction Example
// ***** DESCRIPTION: This example shows how to create an Alias rule, a lookup dataset, populate the collection
//              and search the collection via the lookup.
require('isomorphic-fetch');

const { SplunkCloud } = require('../splunk');
const { SPLUNK_CLOUD_API_HOST, BEARER_TOKEN, TENANT_ID } = process.env;
const MAX_RETRIES = 10;

(async function () {
    // ***** STEP 1: Get Splunk Cloud client
    const splunk = new SplunkCloud({
        urls: { api: SPLUNK_CLOUD_API_HOST },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    // ***** STEP 2: Create a rule
    const rulename = `uid_${Date.now()}`; // ruleName should be unique
    const timeSec = Math.floor(Date.now() / 1000);
    const sourcetype = `s_${timeSec}`;
    const fieldName = 'uid';
    const aliasName = `user_${timeSec}`;
    const alias = {
        alias: aliasName,
        kind: 'ALIAS',
        field: fieldName,
    };

    const rule = await splunk.catalog.createRule({
        name: rulename,
        module: '',
        match: `sourcetype::${sourcetype}`,
        actions: [alias],
    });
    console.log(`Rule created. '${rule.name}'`);
    console.log(rule);

    try {
        // ***** STEP 3: Ingest data
        const testEvent = {
            sourcetype: sourcetype,
            body: {
                uid: '123',
                amount: '10',
            },
            attributes: {
                index: 'main',
            },
        };

        const response = await splunk.ingest.postEvents([testEvent]).catch(error => {
            throw new Error(`Unable to find extracted field '${aliasName}'. message='${error.message}'`);
        });
        console.log('Successfully ingested event.');
        console.log(response);

        // ***** STEP 4: Search and see if extracted fields are available
        let attempts = 0;
        while (attempts++ <= MAX_RETRIES) {
            console.log(`Waiting 5s before retrying search... Attempt: ${attempts}/${MAX_RETRIES}`);
            await new Promise(resolve => setTimeout(resolve, 5000));

            const searchJob = await splunk.search.createJob({
                query: `| from main | search uid=${testEvent.body.uid} | fields '*'`,
                extractAllFields: true,
                module: ''
            });
            console.log(`job created. sid='${searchJob.sid}'`);

            await splunk.search.waitForJob(searchJob);
            const searchResults = await splunk.search.listResults(searchJob.sid, { count: 0, offset: 0 });

            // Evaluate whether field has been found.
            if (searchResults && searchResults.fields && searchResults.fields.filter(field => field.name == aliasName).length > 0) {
                console.log(`Successfully found extracted field '${aliasName}'`);
                return;
            }
        }

        throw new Error(`Unable to find extracted field '${aliasName}'`);
    } finally {
        await splunk.catalog.deleteRule(rulename).catch(() => {
            // ignoring exceptions on cleanup.
        });
    }
})().catch(error => console.error(error));
