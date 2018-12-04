// ***** TITLE: Search Time Field Extraction Example
// ***** DESCRIPTION: This example shows how to create an Alias rule, a lookup dataset, populate the collection
//              and search the collection via the lookup.
require('isomorphic-fetch');

const { SplunkCloud } = require('../splunk');
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;
const { exitOnSuccess, exitOnFailure } = require('../utils/exampleHelperFunctions');

async function main() {
    // ***** STEP 1: Get Splunk Cloud client
    const splunk = new SplunkCloud({
        urls: { api: SPLUNK_CLOUD_API_HOST, app: SPLUNK_CLOUD_APPS_HOST },
        tokenSource: BEARER_TOKEN,
        defaultTenant: TENANT_ID,
    });

    // // ***** STEP 2: Create a rule
    try {
        let ruleName = `uidRule${Date.now()}`; // ruleName should be unique
        const sourcetype = `example`;
        const fieldName = 'uid';
        const aliasName = 'user';
        const alias = {
            alias: aliasName,
            kind: 'ALIAS',
            field: fieldName,
        };

        let rule = await splunk.catalog.createRule({
            name: ruleName,
            module: '',
            match: `sourcetype::${sourcetype}`,
            actions: [alias],
        });
        console.log(rule);
    } catch (error) {
        console.log(error);
        exitOnFailure();
    }

    // ***** STEP 3: Ingest data
    try {
        const testEvent = {
            sourcetype: 'example',
            body: {
                uid: '123',
                amount: '10',
            },
            attributes: {
                index: 'main',
            },
        };
        let response = await splunk.ingest.postEvents([testEvent]);
        console.log(response);
    } catch (error) {
        console.log(error);
        exitOnFailure();
    }

    // ***** STEP 4: Search and see if exracted fields are available
    try {
        let jobObj = await splunk.search.submitSearch({
            query: '| from main',
            extractAllFields: true,
        });
        await jobObj.wait();
        let results = await jobObj.getResults({ count: 0, offset: 0 });
        fields = results.fields;
        fields.forEach(field => {
            if (field.name === aliasName) {
                console.log(`extracted field: ${aliasName} found!`);
                exitOnSuccess();
            }
        });
        console.log(`failed to find extracted field: ${aliasName}`);
        exitOnFailure();
    } catch (error) {
        console.log(error);
        exitOnFailure();
    }
}
main();
