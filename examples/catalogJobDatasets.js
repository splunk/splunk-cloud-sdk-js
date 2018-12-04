// ***** TITLE: Create and Search Job Dataset in Catalog
//
// ***** DESCRIPTION: This example creates a Search Job using the Search Service,
//                    then searches Catalog for this Job dataset.

require("isomorphic-fetch");

const { SplunkCloud } = require("../splunk");

const { SPLUNK_CLOUD_API_HOST, SPLUNK_CLOUD_APPS_HOST, BEARER_TOKEN, TENANT_ID } = process.env;

function exitOnFailure(error) {
    console.log(error)
    process.exit(1);
}

// define the main workflow
async function main() {
    //assuming index main pre-exists
    const index = "main";
    const query = `search index=main | head limit=10 | stats count()`;
    let jobId, jobName;

    // ***** STEP 1: Get Splunk Cloud client
    // ***** DESCRIPTION: Get Splunk Cloud client of a tenant using an authentication token.

    const splunk = new SplunkCloud({
        'urls': {'api': SPLUNK_CLOUD_API_HOST, 'app': SPLUNK_CLOUD_APPS_HOST},
        'tokenSource': BEARER_TOKEN,
        'defaultTenant': TENANT_ID
    });

    // ***** STEP 2: Get data in using Ingest Service
    // ***** DESCRIPTION: Send in events using Ingest Service.

    const timeSec = Math.floor(Date.now() / 1000);
    const host = `h-${timeSec}`;
    const source = `s-${timeSec}`;
    console.log(`Posting events with host=${host}, source = ${source}`);

    const event1 = {
        "attributes": {
            "index": index
        },
        "body": `Event1 view dataset ${host},${source}`,
        "host": host,
        "sourcetype": "splunkd",
        "source": source,
    };
    const event2 = {
        "attributes": {
            "index": index
        },
        "body": `Event2 view dataset ${host},${source}`,
        "host": host,
        "sourcetype": "splunkd",
        "source": source,
    };
    const event3 = {
        "attributes": {
            "index": index
        },
        "body": `Event3 view dataset ${host},${source}`,
        "host": host,
        "sourcetype": "splunkd",
        "source": source,
    };
    events = [event1, event2, event3];
    let ingestResponse = await splunk.ingest.postEvents(events);
    console.log("Ingest of events succeeded with response:");
    console.log(ingestResponse);


    // ***** STEP 3: Create a Search Job
    // ***** DESCRIPTION: Create a new Search job using the Search Service

    const expectedResults = 1;

    splunk.search.createJob({"query": `${query}`})
        .then(job => {
            console.log(`Created job with sid: ${job.sid}`);
            return splunk.search.waitForJob(job.sid);
    })
    .then(job => {
            jobId = job.sid;
            console.log(`Getting results`);
            return splunk.search.getResults(job.sid);
    })
    // ***** STEP 4: List Job Datasets using Catalog
    // ***** DESCRIPTION: List Job Datasets using Catalog and Validate the Job dataset created using Search exists

    .then(resultsResponse => {
            const success = (resultsResponse && resultsResponse.results.length == expectedResults);
            console.log(`Search results received : ${success}`);
            if (!success) {
                exitOnFailure("Results did not match expected after executing the search job");
            }
            jobName = 'sid_'+ jobId.replace(".", "_");
            return splunk.catalog.listDatasets({ filter: `name=="${jobName}"` });
    })
    .then(dsList => {
            console.log("Job Dataset Found: ");
            console.log(dsList[0].name);
            if(dsList.length != 1) {
                exitOnFailure("Job created with search service does not exist in Catalog.");
            } else {
                console.log("Expected Job dataset found in catalog")
            }
    })
    .then(() => {
            // Clean up job dataset
            console.log(`Deleting job ${jobName}`);
            splunk.catalog.deleteDataset(jobName);
    })
    .catch(err=> {
            exitOnFailure(err);
    })
}

// run the workflow
main();
