const config = require("../config");
const SplunkSSC = require("../../splunk");
const { assert, expect } = require("chai");

const splunk = new SplunkSSC(`http://${config.stubbyHost}:8882`, config.stubbyAuthToken, config.stubbyTenant);
const successResponse =
    [
        {
            "name": "test0",
            "kind": "webhook",
            "id": "aeae0a90-e24e-407b-b698-73084d140994",
            "webhookUrl": "http://webhook.site/40fa145b-43d7-48f9-a391-aa7558042fa6",
            "message": "{{ .name }} is a {{ .species }}"
        },
{
    "name": "test10",
    "kind": "webhook",
    "id": "bf7747e0-e964-410a-988a-8a3aef2cc814",
    "webhookUrl": "http://webhook.site/40fa145b-43d7-48f9-a391-aa7558042fa6",
    "message": "{{ .name }} is a {{ .species }}"
}
];

const action = {Name: "test10", Kind: "webhook", WebhookURL: "http://webhook.site/40fa145b-43d7-48f9-a391-aa7558042fa6", Message: "{{ .name }} is a {{ .species }}"};


describe('Action Endpoint', () => {

    describe('Post an action', () => {
        it('should return a successful response', () => {
            return splunk.action.createAction(action).then(response => {
                assert.deepEqual(response, successResponse, 'response should be expected success response.');
            });
        });
    });

    describe('Get actions', () => {
        it('should return a successful response', () => {
            return splunk.action.getActions().then(response => {
                console.log(response)
                assert.deepEqual(response, successResponse, 'response should be expected success response.');
            });
        });
    });

});
