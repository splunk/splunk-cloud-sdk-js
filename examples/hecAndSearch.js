const SplunkSSC = require("../splunk");

const HOST = process.env.SSC_HOST;
const AUTH_TOKEN = process.env.BEARER_TOKEN;
const { TENANT_ID } = process.env;

// ************* Authenticate a ServiceClient
const splunk = new SplunkSSC(`${HOST}`, AUTH_TOKEN, TENANT_ID);

// ************* Add a rule via catalog to add field extractions
// todo: implement this till catalog service support it

// ************* Get data in using HEC
const sendDataViaHec = function() {
    const host = `myhost-${new Date().getSeconds()}`;
    const source = `mysource-${new Date().getMinutes()}`;
    console.log(host);
    console.log(source);

    const event1 = {
        "sourcetype": "splunkd",
        "source": source,
        "host": host,
        "event": `haha0 my new event ${host}`
    };
    const event2 = {
        "sourcetype": "splunkd",
        "source": source,
        "index": "main",
        "fields": { "fieldkey1": "fieldval1", "fieldkey2": "fieldkey2" },
        "host": host,
        "event": `04-24-2018 12:32:23.252 -0700 INFO  haha1 ${host}`
    };
    const event3 = {
        "sourcetype": "splunkd",
        "source": source,
        "index": "main",
        "fields": { "fieldkey1": "fieldval1", "fieldkey2": "fieldkey2" },
        "host": host,
        "event": `04-24-2018 12:32:23.258 -0700 INFO  haha2 "9765f1bebdb4".  ${host}`
    };

    // using hec raw endpoint to send data
    splunk.hec2.createRawEvent(event1).then(data => {
        console.log(data);
    });

    // using hec events endpoint to send one event
    splunk.hec2.createEvent(event2).then(data => {
        console.log(data);
    });

    // using hec events endpoint to send multiple events
    splunk.hec2.createEvents([event1, event2, event3]).then(data => {
        console.log(data);
    });

    return { host, source };
};

const hostSource = sendDataViaHec();
console.log(hostSource);

// ************* Search the data ingested above and ensure the field extractions are present.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// check if the returned results contains the events we just sent via HEC
const checkresult = function(jobResults) {
    let found = 0;
    Object.entries(jobResults.results).forEach(entry => {
        if ((entry[1].host === hostSource.host && entry[1].source === hostSource.source)
            || (entry[1].host === `"${hostSource.host}"` && entry[1].source === `"${hostSource.source}"`)) {
            found += 1;
            /* eslint-disable no-underscore-dangle */
            console.log(`****${entry[1].host}, ${entry[1].source},  ${entry[1]._raw}`);
        }
    });

    return found;
};

// search results to make sure all 5 events can be found
const getSearchResult = async function(start) {
    await sleep(5000);
    await splunk.search.createJobSync({ query: "search index=main" })
        .then(results => {
            const found = checkresult(results);
            if (found !== 5) {
                console.log("Try search again ....");
                console.log(`spent ${Date.now() - start}  `);

                if (Date.now() - start > 100000) {
                    throw Error("TIMEOUT!!!! Search is taking too long, terminate!");
                }
                return getSearchResult(start);
            }

            console.log(`spent ${Date.now() - start} ms to find ${found} results `);
            return found;
        });
};

getSearchResult(Date.now());
