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


// ***** TITLE: Import KVCollection dataset, lookup dataset into a module.
// ***** DESCRIPTION: This example shows how to create a kvcollection dataset, a lookup dataset, populate the collection,
//              import into a new module and search the collection via the lookup in the imported module.
require('isomorphic-fetch');

const { SplunkCloud } = require('../splunk');
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

(async function () {
    const DATE_NOW = Date.now();
    const collectionModule = `collectionmodule`;
    const kvcollectionName = `kvcollection${DATE_NOW}`;
    const lookupName = `testlookup${DATE_NOW}`;
    const importModule = `importmodule${DATE_NOW}`;
    const importLookup = `importlookup${DATE_NOW}`;

    // ***** STEP 1: Get Splunk Cloud client
    // ***** DESCRIPTION: Get Splunk Cloud client of a tenant using an authentication token.
    const splunk = new SplunkCloud({
        urls: { api: SPLUNK_CLOUD_API_HOST, app: SPLUNK_CLOUD_APPS_HOST },
        tokenSource: () => new Promise((resolve) => resolve(BEARER_TOKEN)),
        defaultTenant: TENANT_ID,
    });

    try {
        // ***** STEP 2: Create kvcollection dataset
        const kvCollectionDataset = await splunk.catalog.createDataset({
            name: kvcollectionName,
            module: collectionModule,
            kind: 'kvcollection',
        });
        console.log(`Kvcollection dataset created. name='${kvCollectionDataset.name}'`);
        console.log(kvCollectionDataset);

        // ***** STEP 3: Create a lookup dataset with external kvcollection dataset.
        const lookupDataset = await splunk.catalog.createDataset({
            name: lookupName,
            kind: 'lookup',
            module: collectionModule,
            externalKind: 'kvcollection',
            externalName: kvcollectionName,
        });
        console.log('Lookup dataset created.');
        console.log(lookupDataset);

        // ***** STEP 4: Create field for lookup dataset.
        const createFieldForDatasetResponse = await splunk.catalog.createFieldForDatasetById(
            lookupDataset.id,
            {
                name: 'a',
                datatype: 'NUMBER',
                fieldtype: 'UNKNOWN',
                prevalence: 'UNKNOWN',
            }
        );
        console.log(`Field created. name='${createFieldForDatasetResponse.name}'`);

        // ***** STEP 5: Insert record into the lookup
        const moduleName = collectionModule + '.' + kvcollectionName;
        const insertRecordResponse = await splunk.kvstore.insertRecords(moduleName, [
            {
                a: '1',
            },
        ]);
        console.log(`KV record inserted into ${moduleName}. id='${insertRecordResponse[0]}'`);

        // ***** STEP 6: Import the lookup/kvcollection into another module
        const importDataset = await splunk.catalog.createDataset({
            kind: 'import',
            name: importLookup,
            module: importModule,
            sourceName: lookupName,
            sourceModule: collectionModule,
        });
        console.log(`Import dataset created.\n${importDataset}`);

        // ***** STEP 7: Validate - Search the kvcollection via the lookup and validate expected data in the new imported module
        const datasetQuery = {
            filter: `module=="${importModule}"`,
            count: 1,
            orderby: 'id Descending',
        };
        const datasetList = await splunk.catalog.listDatasets(datasetQuery);
        const searchJob = await splunk.search.createJob({
            query: `| from ${importModule}.${datasetList[0].name}`,
            module: importModule
        });
        console.log(`Job created. sid='${searchJob.sid}'`);

        await splunk.search.waitForJob(searchJob);
        const searchResults = await splunk.search.listResults(searchJob.sid);
        if (!searchResults || !searchResults.results || searchResults.results.length == 0) {
            throw new Error('No results returned from search job.');
        }

        console.log(`Search results found. count=${searchResults.results.length}`);
        console.log(searchResults);
    } finally {
        // ***** STEP 8: Cleanup - Delete all created data sets.
        // ***** DESCRIPTION: Ignoring exceptions on cleanup.
        console.log('Cleaning up all created datasets.');
        await splunk.catalog.deleteDataset(`${importModule}.${importLookup}`).catch(() => { });
        await splunk.catalog.deleteDataset(`${collectionModule}.${lookupName}`).catch(() => { });
        await splunk.catalog.deleteDataset(`${collectionModule}.${kvcollectionName}`).catch(() => { });
    };
})().catch(error => console.error(error));
