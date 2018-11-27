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
    let kvcollectionName = `kvcollection${Date.now()}`;  // kvcollectionName should be unique

    let kvDataset = await splunk.catalog.createDataset({
        name: kvcollectionName,
        kind: 'kvcollection'});
    console.log(kvDataset);

    // ***** STEP 3: Create a lookup
    let lookupName = `lookup${Date.now()}`;  // lookupName should be unique
    let lookupDataset = await splunk.catalog.createDataset({
        name: lookupName,
        kind: 'lookup',
        externalKind: 'kvcollection',
        externalName: kvcollectionName
    });
    console.log(lookupDataset);

    // ***** STEP 4: Register the fields
    await splunk.catalog.postDatasetField(lookupDataset.id, {
        name: 'a',
        datatype: 'NUMBER',
        fieldtype: 'UNKNOWN',
        prevalence: 'UNKNOWN'
    });
    console.log("postDatasetField a");
    await splunk.catalog.postDatasetField(lookupDataset.id, {
        name: 'b',
        datatype: 'NUMBER',
        fieldtype: 'UNKNOWN',
        prevalence: 'UNKNOWN'
    });
    console.log("postDatasetField b");
    await splunk.catalog.postDatasetField(lookupDataset.id, {
        name: 'c',
        datatype: 'NUMBER',
        fieldtype: 'UNKNOWN',
        prevalence: 'UNKNOWN'
    });
    console.log("postDatasetField c");

    // ***** STEP 5: Insert records into the lookup
    await splunk.kvstore.insertRecords(kvcollectionName, [
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
    searchResults(splunk, Date.now(), 180 * 1000, query, 1).then((results) => {
        console.log(results);

        splunk.catalog.deleteDataset(lookupDataset.id).then(() => {
                console.log(`Deleting ${lookupName + " " + lookupDataset.id}`);
            })
            .catch((err) => {
                console.log(err);
                process.exit(1);
            });

        splunk.catalog.deleteDataset(kvDataset.id).then(() => {
                console.log(`Deleting ${kvcollectionName + " " + kvDataset.id}`);
            })
            .catch((err) => {
                console.log(err);
                process.exit(1);
            });

        if (!results || results.length === 0) {
            process.exit(1);
        }

    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
}
main();