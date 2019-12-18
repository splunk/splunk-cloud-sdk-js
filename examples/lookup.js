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

// ***** TITLE: Populating and Searching a KV Collection
// ***** DESCRIPTION: This example shows how to create a kvcollection dataset, a lookup dataset, populate the collection
//              and search the collection via the lookup.
require('isomorphic-fetch');

const { SplunkCloud } = require('../splunk');
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

(async function () {
    const DATE_NOW = Date.now();
    const kvcollectionName = `kvcollection${DATE_NOW}`; // kvcollectionName should be unique
    const lookupName = `lookup${DATE_NOW}`; // lookupName should be unique

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

    // ***** STEP 2: Create kvcollection
    const kvCollectionDataset = await splunk.catalog.createDataset({
        name: kvcollectionName,
        kind: 'kvcollection',
    });
    console.log(`Kvcollection dataset created. name='${kvCollectionDataset.name}'`);

    // ***** STEP 3: Create a lookup
    const lookupDataset = await splunk.catalog.createDataset({
        name: lookupName,
        kind: 'lookup',
        externalKind: 'kvcollection',
        externalName: kvcollectionName,
    });
    console.log(`Lookup dataset created. name='${lookupDataset.name}'`);
    console.log(lookupDataset);

    try {
        // ***** STEP 4: Register the fields
        const createFieldForDatasetResponseA = await splunk.catalog.createFieldForDatasetById(lookupDataset.id, {
            name: 'a',
            datatype: 'NUMBER',
            fieldtype: 'UNKNOWN',
            prevalence: 'UNKNOWN',
        });
        console.log(`Field created. name='${createFieldForDatasetResponseA.name}'`);

        const createFieldForDatasetResponseB = await splunk.catalog.createFieldForDatasetById(lookupDataset.id, {
            name: 'b',
            datatype: 'NUMBER',
            fieldtype: 'UNKNOWN',
            prevalence: 'UNKNOWN',
        });
        console.log(`Field created. name='${createFieldForDatasetResponseB.name}'`);

        const createFieldForDatasetResponseC = await splunk.catalog.createFieldForDatasetById(lookupDataset.id, {
            name: 'c',
            datatype: 'NUMBER',
            fieldtype: 'UNKNOWN',
            prevalence: 'UNKNOWN',
        });
        console.log(`Field created. name='${createFieldForDatasetResponseC.name}'`);

        // ***** STEP 5: Insert records into the lookup
        const kvObject1 = {
            a: '1',
            b: '2',
            c: '3',
        };
        const kvObject2 = {
            a: '4',
            b: '5',
            c: '6',
        };
        await splunk.kvstore.insertRecords(kvcollectionName, [kvObject1, kvObject2]);
        console.log(`KV records inserted into ${kvcollectionName}.`);

        // ***** STEP 6: Search the kvcollection via the lookup
        const responseDataset = await splunk.catalog.getDataset(lookupName);
        console.log(`Dataset retrieved. name='${responseDataset.name}'`);

        const job = await splunk.search.createJob({ query: `| from ${responseDataset.name}` });
        console.log(`Created sid: ${job.sid}`);

        await splunk.search.waitForJob(job);
        const searchResults = await splunk.search.listResults(job.sid);
        if (!searchResults || !searchResults.fields || searchResults.fields.length == 0) {
            throw new Error('No search result fields returned.');
        }
        if (!searchResults || !searchResults.results || searchResults.results.length == 0) {
            throw new Error('No search results returned.');
        }

        console.log('Search results returned successfully.');
        console.log(searchResults);
    } finally {
        // ***** STEP 5: Cleanup - Delete all created data sets and kvstores.
        // ***** DESCRIPTION: Ignoring exceptions on cleanup.
        console.log('Cleaning up all created datasets.');
        await splunk.catalog.deleteDatasetById(lookupDataset.id).catch(() => { });
        await splunk.catalog.deleteDatasetById(kvCollectionDataset.id).catch(() => { });
    }
})().catch(error => console.error(error));
