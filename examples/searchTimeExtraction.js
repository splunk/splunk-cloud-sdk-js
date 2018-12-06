// ***** TITLE: Search Time Field Extraction Example
// ***** DESCRIPTION: This example shows how to create an Alias rule, a lookup dataset, populate the collection
//              and search the collection via the lookup.
require('isomorphic-fetch');

const { SplunkCloud } = require('../splunk');
const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

function exitOnFailure() {
    console.log(`failed to find extracted field: ${aliasName}`);
    process.exit(1);
}

function exitOnSuccess() {
    process.exit(0);
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
    const ruleName = `uid-,${Date.now()}`; // ruleName should be unique
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
        exitOnFailure();
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
        exitOnFailure();
    }

    // ***** STEP 4: Search and see if exracted fields are available
    const maxRetries = 10;
    let found = false;
    while (maxRetries > 0 && !found) {
        setTimeout(() => {
            console.log('wait 5s before retry search');
        }, 5000);
        try {
            let jobObj = await splunk.search.submitSearch({
                query: '| from main | search uid=*',
                extractAllFields: true,
            });
            await jobObj.wait();
            let results = await jobObj.getResults({ count: 0, offset: 0 });
            fields = results.fields;
            fields.forEach(field => {
                if (field.name === aliasName) {
                    console.log(`extracted field: ${aliasName} found!`);
                    found = true;
                }
            });
        } catch (error) {
            console.log(error);
            break;
        }
    }
    found ? exitOnSuccess() : exitOnFailure();
}
main();
