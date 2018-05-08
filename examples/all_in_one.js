const SplunkSSC = require("../splunk");

// const AUTH_TOKEN = process.env.BEARER_TOKEN;
// const TENANT_ID = process.env.TENANT_ID;

const HOST = "https://next.splunknovadev-playground.com:443";
const AUTH_TOKEN = "eyJraWQiOiJTVGR3WXFCVnFQZlpkeXNNUTQyOElEWTQ5VzRZQzN5MzR2ajNxSl9LRjlvIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULi1mZE8wT2luQ1pXcEtaNmt5M2ppX2ZSM2NZZjh2QkswdG42elB3QWg1anciLCJpc3MiOiJodHRwczovL3NwbHVuay1jaWFtLm9rdGEuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTUyNTczMTE4MiwiZXhwIjoxNTI1NzM0NzgyLCJjaWQiOiIwb2FwYmcyem1MYW1wV2daNDJwNiIsInVpZCI6IjAwdTEwa20yMWhiT3BUbzdTMnA3Iiwic2NwIjpbInByb2ZpbGUiLCJvcGVuaWQiLCJlbWFpbCJdLCJzdWIiOiJ0ZXN0MUBzcGx1bmsuY29tIn0.BI2cOFAdrWIiZHLRDEjrjXg1MIGUx8ZMyOln0vaj5Ik1yZtmFyDem0ZhWh0rv0wW8PzYQjIVgdyAMs8VrZMQYiN79o087kfghaIPKy_S3MJdKwn_UDv6Qy6QsbprY9ayP1ldbJgHAWWuu5b2ju9pK-48w2M6eEcNJ02m8HJH09KqJ20XCl2YfADsBX9DWQ0PmUGa4Jsr39yIb_k2CS1V3b2B2I82b2H_NgQelAWie3rPkTuYmUd9oF8DdUIEldLvZBB1hJk3xkFLZKwy-APoZTBPL6PcfPN41xUibXPoFYfIR69yd1alRGL0F1Trn5mqPlTnW9FBt6YALQXZXnY6qQ";
const TENANT_ID = "3f64d905-ec7e-40a2-a43b-7217ccdae522";

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

                return getSearchResult(start);
            }

            console.log(`spent ${Date.now() - start} ms to find ${found} results `);
            return found;
        });
};

const start = Date.now();
getSearchResult(start);
