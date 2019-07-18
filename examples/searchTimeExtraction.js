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
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

function exitOnFailure(aliasName) {
    console.log(`failed to find extracted field: ${aliasName}`);
    process.exit(1);
}

function exitOnSuccess() {
    process.exit(0);
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    // ***** STEP 1: Get Splunk Cloud client
    const splunk = new SplunkCloud({
        urls: { api: SPLUNK_CLOUD_API_HOST, app: SPLUNK_CLOUD_APPS_HOST },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    // ***** STEP 2: Create a rule
    const timeSec = Math.floor(Date.now() / 1000);
    const ruleName = `uid_${Date.now()}`; // ruleName should be unique
    const sourcetype = `s_${timeSec}`;
    const fieldName = 'uid';
    const aliasName = `user_${timeSec}`;
    const alias = {
        alias: aliasName,
        kind: 'ALIAS',
        field: fieldName,
    };
    try {
        let rule = await splunk.catalog.createRule({
            name: ruleName,
            module: '',
            match: `sourcetype::${sourcetype}`,
            actions: [alias],
        });
        console.log(`rule ${ruleName} created successfully`);
        console.log(rule);
    } catch (error) {
        console.log(error);
        exitOnFailure(aliasName);
    }

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
    try {
        let response = await splunk.ingest.postEvents([testEvent]);
        console.log('event ingested successfully');
        console.log(response);
    } catch (error) {
        console.log(error);
        exitOnFailure(aliasName);
    }

    // ***** STEP 4: Search and see if extracted fields are available
    const maxRetries = 10;
    let numTries = 0;
    let found = false;
    while (maxRetries > numTries && !found) {
        numTries++;
        console.log('wait 5s before retry search');
        await timeout(5000);
        try {
            let jobObj = await splunk.search.createJob({
                query: `| from main | search uid=${testEvent.body.uid} | fields '*'`,
                extractAllFields: true,
                module: ''
            });
            await splunk.search.waitForJob(jobObj.sid).catch(err => {throw err;});
            let results = await splunk.search.listResults(jobObj.sid, { count: 0, offset: 0 }).catch(err => {throw err;});
            if (results.fields) {
                results.fields.forEach(field => {
                    if (field.name === aliasName) {
                        console.log(`extracted field: ${aliasName} found!`);
                        found = true;
                    }
                });
            }
        } catch (error) {
            console.log(error);
            break;
        }
    }
    found ? exitOnSuccess() : exitOnFailure(aliasName);
}
main();
