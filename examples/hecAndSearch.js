const SplunkSSC = require("../splunk");

// const HOST = process.env.SSC_HOST;
// const AUTH_TOKEN = process.env.BEARER_TOKEN;
// const { TENANT_ID } = process.env;

const HOST = "https://next.splunknovadev-playground.com:443";
const AUTH_TOKEN = "eyJraWQiOiI3cXV0SjFleUR6V2lOeGlTbktsakZHRWhmU0VzWFlMQWt0NUVNbzJaNFk4IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULm5VQkZzME1zTXhHUHM2WmpsQTJOZTJPODQwSzREN01OUHBsbjFNY3JNeGsiLCJpc3MiOiJodHRwczovL3NwbHVuay1jaWFtLm9rdGEuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTUyNjU3NTQ3MCwiZXhwIjoxNTI2NTc5MDcwLCJjaWQiOiIwb2FwYmcyem1MYW1wV2daNDJwNiIsInVpZCI6IjAwdTE1emJxc2l0VWlLYnpvMnA3Iiwic2NwIjpbImVtYWlsIiwicHJvZmlsZSIsIm9wZW5pZCJdLCJzdWIiOiJsamlhbmdAc3BsdW5rLmNvbSJ9.IbV6j84crLKBlko5A0o9Ynl_03apm6f4AIcqnyZGUVO04pJiib5ecUk58HM6CotTvg2Wtm0pOgrXWKMXu6mhA35lCsgGNMlmWoqPYo7jgshH4L_TgcFcn3m_ttn4hOUYeU5Y2rUZ9q1SYBqCsI5m_-P1xzIScWA-IRiQo0N7MxG2cfgZOv0dXfutxzQdoFGahsYctsACZAdTf5uxM1JkDeZ3Yvti6rzUnRZKZop-WVSdtyXEi8Ze9Xwj8vos8ob-0Ib3nhVa5xTdZqY6TjukizXm5zbM5KiwSU6A3hDKejeWvIYywu4p1ai34lM7MY650_zec7T8_OX7S4-O26ynLA";
const TENANT_ID = "429f1795-4695-4c73-b117-affa738d3d14";


// ************* Authenticate a ServiceClient
const splunk = new SplunkSSC(`${HOST}`, AUTH_TOKEN, TENANT_ID);

// ************* Add a rule via catalog to add field extractions
// todo: implement this till catalog service support it
const createCatalog = function() {
    const regex1 = {
        "owner": "splunk",
        "created": "2018-05-14 08:16:19.000718",
        "modified": "2018-05-14 08:16:19.000718",
        "capabilities": "1101-00000:11010",
        "version": 1,
        "id": "5af9ee931eb835000a50eb3b",
        "name": "aaa0",
        "module": "",
        "match": "host::192.1.1.168",
        "actions": [
            {
                "owner": "splunk",
                "created": "2018-05-14 08:16:19.000718",
                "modified": "2018-05-14 08:16:19.000718",
                "capabilities": "1101-00000:11010",
                "version": 1,
                "id": "5af9ee931eb835000a50eb3c",
                "kind": "REGEX",
                "createdby": "splunk",
                "modifiedby": "splunk",
                "ruleid": "5af9ee931eb835000a50eb3b",
                "field": "foo",
                "pattern": "device_id=\\[w+\\](?<err_code>[^:]+)"
            }
        ],
        "createdby": "splunk",
        "modifiedby": "splunk"
    };

    splunk.catalog.createRule(regex1).then(data => console.log(data));

};

createCatalog();

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
        "event": `device_id=aa1 haha0 my new event ${host},${source}`
    };
    const event2 = {
        "sourcetype": "splunkd",
        "source": source,
        "index": "main",
        "fields": { "fieldkey1": "fieldval1", "fieldkey2": "fieldkey2" },
        "host": host,
        "event": `04-24-2018 12:32:23.252 -0700 INFO  device_id=aa2 haha1 ${host},${source}`
    };
    const event3 = {
        "sourcetype": "splunkd",
        "source": source,
        "index": "main",
        "fields": { "fieldkey1": "fieldval1", "fieldkey2": "fieldkey2" },
        "host": host,
        "event": `04-24-2018 12:32:23.258 -0700 INFO device_id:aa2 device_id=aa3 haha2 "9765f1bebdb4".  ${host},${source}`
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
const mygetresult = async function(start, timeout, query, expected) {

    await sleep(5000);
    console.log(`now is ${Date.now() - start}`);
    if (Date.now() - start > timeout) {
        throw Error("TIMEOUT!!!! Search is taking too long, terminate!");
    }

    splunk.search.createJobSync({ "query": query })
        .then(results => {
            console.log(results);
            const retNum = Object.entries(results.results).length;
            if (retNum < expected) {
                mygetresult(start, timeout, query, expected);
            } else if (retNum > expected) {
                throw Error("find more events than expected");
            }

            console.log("============================    found ==========================");
            console.log(Object.entries(results.results).length);
        });

};


const timeout = 30 * 1000;

let query = `search index=main ${hostSource.host},${hostSource.source} | where device_id="aa3"`;
mygetresult(Date.now(), timeout, query, 1);

query = `search index=main ${hostSource.host},${hostSource.source}`;
mygetresult(Date.now(), timeout, query, 6);

