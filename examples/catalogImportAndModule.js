/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

// ***** TITLE: Import KVCollection dataset, lookup dataset into a module.
// ***** DESCRIPTION: This example shows how to create a kvcollection dataset, a lookup dataset, populate the collection,
//              import into a new module and search the collection via the lookup in the imported module.
require('isomorphic-fetch');

const { SplunkCloud } = require('../splunk');
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

function exitOnFailure() {
    process.exit(1);
}

async function main() {
    // ***** STEP 1: Get Splunk Cloud client
    // ***** DESCRIPTION: Get Splunk Cloud client of a tenant using an authentication token.
    const splunk = new SplunkCloud({
        urls: { api: SPLUNK_CLOUD_API_HOST, app: SPLUNK_CLOUD_APPS_HOST },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    // ***** STEP 2: Create kvcollection
    const collectionModule = `collectionmodule`;
    const kvcollectionName = `kvcollection${Date.now()}`; // kvcollectionName should be unique

    let kvDataset = await splunk.catalog.createDataset({
        name: kvcollectionName,
        module: collectionModule,
        kind: 'kvcollection',
    });
    console.log("KVCollection dataset created with response: ");
    console.log(kvDataset);

    // ***** STEP 3: Create a lookup
    const lookupName = `testlookup${Date.now()}`; // lookupName should be unique

    let lookupDataset = await splunk.catalog.createDataset({
        name: lookupName,
        kind: 'lookup',
        module: collectionModule,
        externalKind: 'kvcollection',
        externalName: kvcollectionName
    });
    console.log("Lookup dataset created with response: ");
    console.log(lookupDataset);

    // ***** STEP 4: Register the fields
    let postDataFieldResponse = splunk.catalog.postDatasetField(lookupDataset.id, {
        name: 'a',
        datatype: 'NUMBER',
        fieldtype: 'UNKNOWN',
        prevalence: 'UNKNOWN',
    })
    console.log("Datafield created with response.");
    console.log(postDataFieldResponse);

    // ***** STEP 5: Insert records into the lookup
    const moduleName = collectionModule + '.' + kvcollectionName;

    let recordResponse = await splunk.kvstore.insertRecords(moduleName, [
         {
             a: '1',
         }
      ]);
    console.log("Dataset records created.");
    console.log(recordResponse);

    // ***** STEP 6: Import the lookup/kvcollection into another module
    const importModule = `importmodule${Date.now()}`
    const importLookup = `importlookup${Date.now()}`;
    let query = {
        filter: `module=="${importModule}"`,
        count: 1,
        orderby: 'id Descending'
    };
    let importResponse = await splunk.catalog.createDataset({
        kind: 'import',
        name: importLookup,
        module: importModule,
        sourceName: lookupName,
        sourceModule: collectionModule
    });
    console.log("Import Response.");
    console.log(importResponse);

    // ***** STEP 7: Validate - Search the kvcollection via the lookup and validate expected data in the new imported module
    let dslist = await splunk.catalog.listDatasets(query);

    splunk.search.createJob({ query: `| from ${importModule}.${dslist[0].name}` })
        .then(job => {
            console.log(`Created sid: ${job.sid}`);
            return splunk.search.waitForJob(job.sid);
        })
        .then(job => {
            console.log(`Getting results`);
            return splunk.search.getResults(job.sid);
        })
        .then(results => {
            console.log(results);
            const success = results && results.results.length == 1;
            console.log(`Search results received : ${success}`);
            if (!success) {
                exitOnFailure('Results did not match expected after executing the View');
                }
        })
        .then(() => {
            // Clean up original lookup dataset
            console.log(`Deleting collection module dataset ${collectionModule}.${lookupName}`);
            splunk.catalog.deleteDataset(`${collectionModule}.${kvcollectionName}`);
            splunk.catalog.deleteDataset(`${collectionModule}.${lookupName}`);
        })
        .then(() => {
            // Clean up import lookup dataset
            console.log(`Deleting import module dataset ${importModule}.${importLookup}`);
            splunk.catalog.deleteDataset(`${importModule}.${importLookup}`);
        })
        .catch(err => {
            console.log(err);
            exitOnFailure();
        });
}
main();
