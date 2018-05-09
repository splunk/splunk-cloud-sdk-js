const SplunkSSC = require("../splunk");

const HOST = "https://next.splunknovadev-playground.com:443";
const AUTH_TOKEN = process.env.BEARER_TOKEN;
const TENANT_ID = process.env.TENANT_ID;
// const AUTH_TOKEN = "eyJraWQiOiJTVGR3WXFCVnFQZlpkeXNNUTQyOElEWTQ5VzRZQzN5MzR2ajNxSl9LRjlvIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULjJTaDNXMXZFNWNoZlhOSmhzeGtlY1BGV0xydFFvYUQ0Um0zV0dkZGo0cW8iLCJpc3MiOiJodHRwczovL3NwbHVuay1jaWFtLm9rdGEuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTUyNTkwMTAwNCwiZXhwIjoxNTI1OTA0NjA0LCJjaWQiOiIwb2FwYmcyem1MYW1wV2daNDJwNiIsInVpZCI6IjAwdTEwa20yMWhiT3BUbzdTMnA3Iiwic2NwIjpbImVtYWlsIiwib3BlbmlkIiwicHJvZmlsZSJdLCJzdWIiOiJ0ZXN0MUBzcGx1bmsuY29tIn0.nNjDqow696Iiwyb6quSI9rGaUf3BVSuqYyLdntSxT8sPFowJ0Sz8wF6lVdHIozzMnTfv8kT5VCTl2h1m3YT-F__vphud16J6o8OB13vGfi5H8XuoZaehwqxVdB5-pGlNnh1PoRHggLsjSUpaQLQmtKe7j-7dm3AJhs07DZx0deJm_AkrmQ4o_BwEXLEupxgxXAnlXJGxi5go6ciiX3xXyP9qgTriNyrAE0laja_JPzBvyIPOKYjdXJE9Rxmk9OvueAcyiL-PQIWMS_uGmIoOkmsv-uRxl5K48N7pExP4xpzcWAP2Ys5jginZcFHxRsBlruBwEZpU61IaD8ZA_HqSJA";
// const TENANT_ID = "3f64d905-ec7e-40a2-a43b-7217ccdae522";

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

const checkresult = function(jobResults) {
    let found = 0;
    Object.entries(jobResults.results).forEach(entry => {
        if ((entry[1].host === hostSource.host && entry[1].source === hostSource.source)
            || (entry[1].host === `"${hostSource.host}"` && entry[1].source === `"${hostSource.source}"`)) {
            found += 1;
            console.log(`****${entry[1].host}, ${entry[1].source},  ${entry[1]._raw}`);
        }
    });

    return found;
};

const getSearchResult = async function(start) {
    await sleep(5000);
    await splunk.search.createJobSync({ query: "search index=main" })
        .then(results => {
            const found = checkresult(results);
            if (found !== 5) {
                console.log("try search again ....");
                console.log(`spent ${Date.now() - start}  `);

                if(Date.now()-start>100000){
                    throw Error("TIMEOUT!!!! Search is taking too long, terminate!")
                }
                return getSearchResult(start);
            }

            console.log(`spent ${Date.now() - start} ms to find ${found} results `);
            return found;
        });
};

const start = Date.now();
getSearchResult(start)
