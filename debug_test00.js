const splunk_sdk = require('./splunk');
const configurations = require('./test/config');

// console.log('Butts');
let client = new splunk_sdk(
    `http://${configurations.host}:8882`,
    configurations.authToken,
    'TEST_TENANT'
);

let local_request_url = 'https://example.com';
let local_request_properties = {
    header: 'header stuff here',
    body: 'body stuff here',
};

// Emiting a request without any handlers
console.log('======================');
console.log('This is a emit without handlers');
client.debug.emit_event('requests');
client.debug.on('requests', (request_url, request_properties) => {
    console.log('--------------------------');
    console.log('request event activated!~');
    console.log('--------------------------');
    console.log(`request_url: ${request_url}`);
    console.log(`request_properties: ${JSON.stringify(request_properties)}`);
});
// Useless emit
console.log('======================');
console.log('This is a useless emit');
client.debug.emit_event('requests');
// Example emit
console.log('======================');
console.log('This is an example emit');
client.debug.emit_event('requests', local_request_url, local_request_properties);
// API emit
console.log('======================');
console.log('This is an example of calling the api');
client.catalog.getDatasets();
