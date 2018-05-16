const SplunkSSC = require("../splunk");

// const HOST = process.env.SSC_HOST;
// const AUTH_TOKEN = process.env.BEARER_TOKEN;
// const { TENANT_ID } = process.env;

const HOST = "https://next.splunknovadev-playground.com:443";
const AUTH_TOKEN = "eyJraWQiOiJTVGR3WXFCVnFQZlpkeXNNUTQyOElEWTQ5VzRZQzN5MzR2ajNxSl9LRjlvIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULjNIQW9vWF9WdlZVdDd0UDdQbUEzWTFKdm9yWmExOS1sR1BNN3l2ZE9CS1EiLCJpc3MiOiJodHRwczovL3NwbHVuay1jaWFtLm9rdGEuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTUyNjQ5MDAxNSwiZXhwIjoxNTI2NDkzNjE1LCJjaWQiOiIwb2FwYmcyem1MYW1wV2daNDJwNiIsInVpZCI6IjAwdTE1emJxc2l0VWlLYnpvMnA3Iiwic2NwIjpbIm9wZW5pZCIsImVtYWlsIiwicHJvZmlsZSJdLCJzdWIiOiJsamlhbmdAc3BsdW5rLmNvbSJ9.fHZtyUkrr_33Lh_PVZsgdGsZy89JEFu2iChUnbItrdgR847dfIZivC5FQVnuc8OAR9jWNeN282VNfOePI1qKNIPjqO4wuYCf6b5qgVY_TarODDEK7K58jObRVr0lzU9DnRQOrGYA-LcK3bOF_0LpIFVBKxv9zypD6OMT3tioM_1-Ifh9Pg1Mxc6-B5njoTmNx5vn6P9N597C2Q2W4WU9w3VmApeUNL32Wumn4xqcVBz3Fkoos_PXsnARP6kPLRBc777H_KzhyDLm0lBd5KmEP7ognvEboHsQV-Ki78XHmZEj7XiTYGZ9v8YogxDooxTj2_4PCD6RQaD0V3MUcE__Gw";
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
    }

    splunk.catalog.createRule(regex1).then(data => console.log(data))

}

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
        "event": `device_id=aa1 haha0 my new event ${host}`
    };
    const event2 = {
        "sourcetype": "splunkd",
        "source": source,
        "index": "main",
        "fields": { "fieldkey1": "fieldval1", "fieldkey2": "fieldkey2" },
        "host": host,
        "event": `04-24-2018 12:32:23.252 -0700 INFO  device_id=aa2 haha1 ${host}`
    };
    const event3 = {
        "sourcetype": "splunkd",
        "source": source,
        "index": "main",
        "fields": { "fieldkey1": "fieldval1", "fieldkey2": "fieldkey2" },
        "host": host,
        "event": `04-24-2018 12:32:23.258 -0700 INFO device_id:aa2 device_id=aa3 haha2 "9765f1bebdb4".  ${host}`
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

//
// // check if the returned results contains the events we just sent via HEC
// const checkresultField = function(jobResults) {
//     let found = 0;
//     Object.entries(jobResults.results).forEach(entry => {
//         if (entry[1].field === "device_id") {
//             found += 1;
//             /* eslint-disable no-underscore-dangle */
//             console.log(`**** jly ===========: ${entry[1].field}, ${entry[1].values}, ${entry[1].host}, ${entry[1].source}`);
//         }
//     });
//
//     return found;
// };


// search results to make sure all 5 events can be found
const getFieldSearchResult = async function(start) {
    await sleep(5000);
    await splunk.search.createJobSync({ query: "search index=main | where device_id=\"aa1\"" })
        .then(results => {

            if(Object.entries(results.results).length===0){
                if (Date.now() - start > 100000) {
                    throw Error("TIMEOUT!!!! field Search is taking too long, terminate!");
                }

                console.log("Try field search again ....");
                console.log(`spent ${Date.now() - start}  `);
                getFieldSearchResult(start)


            }
            console.log(` spent ${Date.now() - start}  found results ${Object.entries(results.results).length}`)
        });
};

getFieldSearchResult(Date.now())
