const config = require("../config");
const SplunkSSC = require("../../splunk");
const { assert } = require("chai");

const sscHost = "https://api.playground.splunkbeta.com";//config.playgroundHost;
const token = "eyJraWQiOiI3cXV0SjFleUR6V2lOeGlTbktsakZHRWhmU0VzWFlMQWt0NUVNbzJaNFk4IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULk9Bd3ZqZWY4WkdYU1JJcTVCY3JBcWhyblJRVjNEdlk5SE1LUnIyWXh5OFkiLCJpc3MiOiJodHRwczovL3NwbHVuay1jaWFtLm9rdGEuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTUzMzMyODMzNSwiZXhwIjoxNTMzMzcxNTM1LCJjaWQiOiIwb2FwYmcyem1MYW1wV2daNDJwNiIsInVpZCI6IjAwdTE1emJxc2l0VWlLYnpvMnA3Iiwic2NwIjpbIm9wZW5pZCIsImVtYWlsIiwicHJvZmlsZSJdLCJzdWIiOiJsamlhbmdAc3BsdW5rLmNvbSJ9.pSRs5XIIL4uddGuojuwYG0gPUETy22NuQYpWH1FwR7rYKEU7OJU3F7DGtMQCJji5JnV9lKVtbouUZNW8Tr6184YBfHCBhRN9v0-unDTC3_jy7k-mqOY3UWErbfjyCI6zaYrSJpcJC7UYk_5d_DTXok--5xJ7-SEXtf7Cn8yULNi0qt5spehedi9ggD4dQumhtoOjXOCa6Hum2tM7YOVk_7bkm0pLWuE0EC0sL3MpimaZFdcl1vKlmRtHz923PD9qeXq15zl2174z_yQv8D_PlIQ81Z89lm9KcdA3RH6H8l1MStsvEn-vYNpyBB_H5Gj20wBQ9zqtB5RmI08Z8lJvmg";//config.playgroundAuthToken;
const tenantID = "ljiang" ;// config.playgroundTenant;

const ssc = new SplunkSSC(sscHost, token, tenantID);

describe("integration tests using action service", () => {
    const indexName = `idx_${Date.now()}`;
    // Create an index to ensure there is something to return
    // before(() => ssc.catalog.createDataset({
    //     name: indexName,
    //     owner: "test@splunk.com",
    //     kind: "index",
    //     capabilities: "1101-00000:11010",
    //     disabled: false
    // }));
    // after(() => ssc.catalog.deleteDatasetByName(indexName).catch(err => console.log("Error cleaning index: " + err)));

    describe("CRUD email actions", () => {
        const emailAction = {
            "name": `actionTest1`,
            "kind": "email",
            "HTMLPart":"<html><h1>The HTML</h1></html>",
            "SubjectPart":"The Subject",
            "TextPart":"The Text",
            "TemplateName":"template1000",
            "Addresses":["test1@splunk.com", "test2@splunk.com"],
        };

        it("should create action", () => ssc.action.createAction(emailAction).then(response => {
            assert.equal(response["name"],emailAction.name);
            assert.equal(response["kind"],emailAction.kind);
            assert.equal(response["htmlPart"],emailAction.HTMLPart);
            assert.equal(response["subjectPart"],emailAction.SubjectPart);
            assert.equal(response["textPart"],emailAction.TextPart);
            assert.equal(response["templateName"],emailAction.TemplateName);
            assert.deepEqual(response["addresses"],emailAction.Addresses);

        }));

        it("should get actions", () => ssc.action.getAction(emailAction.name).then(response => {
            assert.equal(response["name"],emailAction.name);
            assert.equal(response["kind"],emailAction.kind);
            assert.equal(response["htmlPart"],emailAction.HTMLPart);
            assert.equal(response["subjectPart"],emailAction.SubjectPart);
            assert.equal(response["textPart"],emailAction.TextPart);
            assert.equal(response["templateName"],emailAction.TemplateName);
            assert.deepEqual(response["addresses"],emailAction.Addresses);
        }));

        it("should update actions", () => ssc.action.updateAction(emailAction.name,{"subjectPart":"new subject"}).then(response => {
            console.log(response)
            assert.equal(response["name"],emailAction.name);
            assert.equal(response["kind"],emailAction.kind);
            assert.equal(response["htmlPart"],emailAction.HTMLPart);
            assert.equal(response["subjectPart"],"new subject");
            assert.equal(response["textPart"],emailAction.TextPart);
            assert.equal(response["templateName"],emailAction.TemplateName);
            assert.deepEqual(response["addresses"],emailAction.Addresses);
        }));

        it("should delete actions", () => ssc.action.deleteAction(emailAction.name).then(response=>{
            assert (!response)
        }));

    });

    describe("Trigger webhook actions", () => {
        const webhookAction = {
            "name": `triggerWebhookAction`,
            "kind": "webhook",
            "webhookUrl":"https://locahost:9999/test",
            "message":"some user msg",
        };

        it("should create action", () => ssc.action.createAction(webhookAction).then(response => {
            assert.equal(response["name"],webhookAction.name);
            assert.equal(response["kind"],webhookAction.kind);
            assert.equal(response["webhookUrl"],webhookAction.webhookUrl);
            assert.equal(response["message"],webhookAction.message);

        }));

        const notification = {
            "kind": "rawJSON",
            "tenant": "sdktest_tenant",
            "payload": {
                "name": "user payload"
            }
        };
        it("should trigger actions", () => ssc.action.triggerAction(webhookAction.name, notification).then(response => {
            console.log(response.headers)
            console.log(response)
            assert(response.StatusID != null);
            assert(response.StatusURL != null);

            it("should get actions status", () => ssc.action.getActionStatus(webhookAction.name, response.StatusID).then(response => {
                console.log(response);
            }));
        }));

        it("should delete actions", () => ssc.action.deleteAction(webhookAction.name).then(response=>{
            assert (!response)
        }));

    });

});
