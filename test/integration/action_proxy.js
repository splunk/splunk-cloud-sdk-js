const config = require("../config");
const SplunkSSC = require("../../splunk");
const { assert } = require("chai");

const sscHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const ssc = new SplunkSSC(sscHost, token, tenantID);

describe("integration tests using action service", () => {
    describe("CRUD email actions", () => {
        const emailAction = {
            "name": `actionTest1`,
            "kind": "email",
            "HTMLPart": "<html><h1>The HTML</h1></html>",
            "SubjectPart": "The Subject",
            "TextPart": "The Text",
            "TemplateName": "template1000",
            "Addresses": ["test1@splunk.com", "test2@splunk.com"]
        };

        it("should create action", () => ssc.action.createAction(emailAction).then(response => {
            assert.equal(response["name"], emailAction.name);
            assert.equal(response["kind"], emailAction.kind);
            assert.equal(response["htmlPart"], emailAction.HTMLPart);
            assert.equal(response["subjectPart"], emailAction.SubjectPart);
            assert.equal(response["textPart"], emailAction.TextPart);
            assert.equal(response["templateName"], emailAction.TemplateName);
            assert.deepEqual(response["addresses"], emailAction.Addresses);

        }));

        it("should get actions", () => ssc.action.getAction(emailAction.name).then(response => {
            assert.equal(response["name"], emailAction.name);
            assert.equal(response["kind"], emailAction.kind);
            assert.equal(response["htmlPart"], emailAction.HTMLPart);
            assert.equal(response["subjectPart"], emailAction.SubjectPart);
            assert.equal(response["textPart"], emailAction.TextPart);
            assert.equal(response["templateName"], emailAction.TemplateName);
            assert.deepEqual(response["addresses"], emailAction.Addresses);
        }));

        it("should update actions", () => ssc.action.updateAction(emailAction.name, { "subjectPart": "new subject" }).then(response => {
            assert.equal(response["name"], emailAction.name);
            assert.equal(response["kind"], emailAction.kind);
            assert.equal(response["htmlPart"], emailAction.HTMLPart);
            assert.equal(response["subjectPart"], "new subject");
            assert.equal(response["textPart"], emailAction.TextPart);
            assert.equal(response["templateName"], emailAction.TemplateName);
            assert.deepEqual(response["addresses"], emailAction.Addresses);
        }));

        it("should delete actions", () => ssc.action.deleteAction(emailAction.name).then(response => {
            assert(!response);
        }));

    });

    describe("Trigger webhook actions", () => {
        const webhookAction = {
            "name": `triggerWebhookAction`,
            "kind": "webhook",
            "webhookUrl": "https://locahost:9999/test",
            "message": "some user msg"
        };

        it("should create action", () => ssc.action.createAction(webhookAction).then(response => {
            assert.equal(response["name"], webhookAction.name);
            assert.equal(response["kind"], webhookAction.kind);
            assert.equal(response["webhookUrl"], webhookAction.webhookUrl);
            assert.equal(response["message"], webhookAction.message);

        }));

        const notification = {
            "kind": "rawJSON",
            "tenant": "sdktest_tenant",
            "payload": {
                "name": "user payload"
            }
        };
        it("should trigger action and get status", () => ssc.action.triggerAction(webhookAction.name, notification).then(response => {
            assert(response.StatusID != null);
            assert(response.StatusURL != null);

            ssc.action.getActionStatus(webhookAction.name, response.StatusID).then(res => {
                assert.equal(res.state, "RUNNING");
                assert.equal(res.statusId, response.StatusID);

            });
        }));

        it("should delete actions", () => ssc.action.deleteAction(webhookAction.name).then(response => {
            assert(!response);
        }));
    });
});
