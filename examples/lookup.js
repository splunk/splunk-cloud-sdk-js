// ***** TITLE: Populating and Searching a KV Collection
// ***** DESCRIPTION: This example shows how to create a kvcollection dataset, a lookup dataset, populate the collection
//              and search the collection via the lookup.
require('isomorphic-fetch');

const { SplunkCloud } = require('../splunk');
const { searchResults } = require('../utils/exampleHelperFunctions');
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

async function main() {
    // ***** STEP 1: Get Splunk Cloud client
    const splunk = new SplunkCloud({
        'urls': { 'api': SPLUNK_CLOUD_API_HOST, 'app': SPLUNK_CLOUD_APPS_HOST },
        'tokenSource': BEARER_TOKEN,
        'defaultTenant': TENANT_ID
    });

    // ***** STEP 2: Create kvcollection
    let kvcollectionName = `kvcollection${Date.now()}`;  // kvcollectionName should ge unique
    let moduleName = `mymodule${Date.now()}`;  // moduleName should ge unique

    let kvDataset = await splunk.catalog.createDataset({
        name: kvcollectionName,
        module: moduleName,
        kind: 'kvcollection'});
    console.log(kvDataset);

    // ***** STEP 3: Create a lookup
    let lookupName = `lookup${Date.now()}`;  // lookupName should ge unique
    let lookupDataset = await splunk.catalog.createDataset({
        name: lookupName,
        module: moduleName,
        kind: 'lookup',
        externalKind: 'kvcollection',
        externalName: kvcollectionName
    });

    // ***** STEP 4: Register the fields
    splunk.catalog.postDatasetField(lookupDataset.id, {
        name: 'a',
        datatype: 'NUMBER',
        fieldtype: 'UNKNOWN',
        prevalence: 'UNKNOWN'
    });
    splunk.catalog.postDatasetField(lookupDataset.id, {
        name: 'b',
        datatype: 'NUMBER',
        fieldtype: 'UNKNOWN',
        prevalence: 'UNKNOWN'
    });
    splunk.catalog.postDatasetField(lookupDataset.id, {
        name: 'c',
        datatype: 'NUMBER',
        fieldtype: 'UNKNOWN',
        prevalence: 'UNKNOWN'
    });

    // ***** STEP 5: Insert records into the lookup
    splunk.kvstore.insertRecords(kvcollectionName, [
        {
            "a": "1",
            "b": "2",
            "c": "3"
        },
        {
            "a": "4",
            "b": "5",
            "c": "6"
        }]);

    // ***** STEP 6: Search the kvcollection via the lookup
    const query = `| from ${lookupName}`;
    searchResults(splunk, Date.now(), 90 * 1000, query, 1).then((results) => {
            console.log(results);

            // STEP ***** 7: Clean up datasets
            splunk.catalog.deleteDatasetByName(moduleName + '.' + lookupName);
            splunk.catalog.deleteDatasetByName(moduleName + '.' + kvcollectionName);

        if (!results || results.hasOwnProperty('length')) {
                process.exit(1);
            }
        })
        .catch(err => {
            console.log(err);
            process.exit(1);
        });

}
main();

