const SplunkSSC = require("../splunk");

const HOST = process.env.SSC_HOST
const AUTH_TOKEN = process.env.BEARER_TOKEN;
const TENANT_ID = process.env.TENANT_ID;
// const HOST = "https://next.splunknovadev-playground.com:443";
// const AUTH_TOKEN = "eyJraWQiOiJTVGR3WXFCVnFQZlpkeXNNUTQyOElEWTQ5VzRZQzN5MzR2ajNxSl9LRjlvIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULlFjSzNGcG5sVWp3bEQ5Z1VkVGdZTFVNbkVXY2lMY1ZKaUU2azZlRG0yREEiLCJpc3MiOiJodHRwczovL3NwbHVuay1jaWFtLm9rdGEuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTUyNTk3MTY4OSwiZXhwIjoxNTI1OTc1Mjg5LCJjaWQiOiIwb2FwYmcyem1MYW1wV2daNDJwNiIsInVpZCI6IjAwdTEwa20yMWhiT3BUbzdTMnA3Iiwic2NwIjpbImVtYWlsIiwicHJvZmlsZSIsIm9wZW5pZCJdLCJzdWIiOiJ0ZXN0MUBzcGx1bmsuY29tIn0.YnSF2QwPEqgoOWR5p3DUstsExVFevQp8S8ptbs9LMDUKuDGOD6xBeQ9AlrMi-xur5mc8F95xJ5sHKjK1wfkVKzm4-0lVPkQ9v83q7fahX1E2sxDvwQ2moe2tXeW9iWED4gEKLT214LTDrkWU7_6Jc7u_bzmt5kOhFbTqQarQD0JgNGm81RluZ3-auN0Jed9dseQo1aHs3UBaZ15AoAhF-vM-nOnqiFGeoE3QGlpZMQWrvakDOcb8gAToLE56PQ_hIjdl1gMpS2Q6zqTc9p4pK6NZWx7x-x3s6aaTvZn1awcVwAm1hUVsAXtfjIo8hlVLMF_PMxNpeNGHuODLrUDOdQ";
// const TENANT_ID = "22bc0f33-7228-47bc-9a7c-fa6b01392c51";

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

                if(Date.now()-start>100000){
                    throw Error("TIMEOUT!!!! Search is taking too long, terminate!")
                }
                return getSearchResult(start);
            }

            console.log(`spent ${Date.now() - start} ms to find ${found} results `);
            return found;
        });
};

getSearchResult(Date.now())
