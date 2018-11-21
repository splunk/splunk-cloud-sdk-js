// ***** TITLE: Populating and Searching a KV Collection
// ***** DESCRIPTION: This example shows how to create a kvcollection dataset, a lookup dataset, populate the collection
//              and search the collection via the lookup.  This is based on an example provided by Brad Lovering.
require("isomorphic-fetch");

const { SplunkCloud } = require("../splunk");
const { searchResults } = require("../utils/exampleHelperFunctions");
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

const KV_COLLECTION_DATASET = {
    name: `kvcollection${Date.now()}`,
    kind: "kvcollection",
};

const LOOKUP_DATASET = {
    name: `lookup${Date.now()}`,
    kind: 'lookup',
    externalKind: 'kvcollection',
    externalName: KV_COLLECTION_DATASET.name
};

const DATASET_FIELDS = [
    {
        name: 'a',
        datatype: 'NUMBER',
        fieldtype: 'UNKNOWN',
        prevalence: 'UNKNOWN'
    },
    {
        name: 'b',
        datatype: 'NUMBER',
        fieldtype: 'UNKNOWN',
        prevalence: 'UNKNOWN'
    },
    {
        name: 'c',
        datatype: 'NUMBER',
        fieldtype: 'UNKNOWN',
        prevalence: 'UNKNOWN'
    }];

const RECORDS = [
    {
        "a": "1",
        "b": "2",
        "c": "3"
    },
    {
        "a": "4",
        "b": "5",
        "c": "6"
    }];


async function main() {
    // ***** STEP 1: Get Splunk Cloud client
    const splunk = new SplunkCloud({
        'urls': { 'api': SPLUNK_CLOUD_API_HOST, 'app': SPLUNK_CLOUD_APPS_HOST },
        'tokenSource': BEARER_TOKEN,
        'defaultTenant': TENANT_ID
    });

    // ***** STEP 2: Create kvcollection
    splunk.catalog.createDataset(KV_COLLECTION_DATASET)
        .then(() => {

            // ***** STEP 3: Retrieve the kvcollection
            splunk.catalog.getDataset(KV_COLLECTION_DATASET.name).then((data) => {
                console.log(data);

                // ***** STEP 4: Create a lookup
                splunk.catalog.createDataset(LOOKUP_DATASET).then(lookup => {

                    // ***** STEP 5: Register the fields
                    for (let i in DATASET_FIELDS)
                        splunk.catalog.postDatasetField(lookup.id, DATASET_FIELDS[i]);

                    // ***** STEP 6: Insert records into the lookup
                    splunk.kvstore.insertRecords(KV_COLLECTION_DATASET.name, RECORDS);

                    // ***** STEP 7: Search the kvcollection via the lookup
                    const query = `| from ${LOOKUP_DATASET.name}`;
                    searchResults(splunk, Date.now(), 90 * 1000, query, 1).then(
                        (results) => {
                            console.log(results);

                            // STEP ***** 8: Clean up datasets
                            splunk.catalog.deleteDatasetByName(LOOKUP_DATASET.name);
                            splunk.catalog.deleteDatasetByName(KV_COLLECTION_DATASET.name);

                            if (!(results && results.length >= 0)) {
                                process.exit(1);
                            }
                        });
                })
            })
        })
        .catch(err => {
            console.log(err);
            process.exit(1);
        });

}
main();

