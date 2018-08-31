const config = require('../config');
const SplunkSSC = require('../../splunk');
const { assert, expect } = require('chai');

const sscHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const ssc = new SplunkSSC(sscHost, token, tenantID);

describe("integration tests using action service", () => {
    describe("CRUD email actions", () => {
        const emailAction = {
            "name": `crudemail_${Date.now()}`,
            "kind": "email",
            "htmlPart": "<html><h1>The HTML</h1></html>",
            "subjectPart": "The Subject",
            "textPart": "The Text",
            "templateName": "template1000",
            "addresses": ["test1@splunk.com", "test2@splunk.com"]
        };

        it("should create action", () => ssc.action.createAction(emailAction).then(response => {
            assert.equal(response["name"], emailAction.name);
            assert.equal(response["kind"], emailAction.kind);
            assert.equal(response["htmlPart"], emailAction.htmlPart);
            assert.equal(response["subjectPart"], emailAction.subjectPart);
            assert.equal(response["textPart"], emailAction.textPart);
            assert.equal(response["templateName"], emailAction.templateName);
            assert.deepEqual(response["addresses"], emailAction.addresses);

        }));

        it("should get actions", () => ssc.action.getAction(emailAction.name).then(response => {
            assert.equal(response["name"], emailAction.name);
            assert.equal(response["kind"], emailAction.kind);
            assert.equal(response["htmlPart"], emailAction.htmlPart);
            assert.equal(response["subjectPart"], emailAction.subjectPart);
            assert.equal(response["textPart"], emailAction.textPart);
            assert.equal(response["templateName"], emailAction.templateName);
            assert.deepEqual(response["addresses"], emailAction.addresses);
        }));

        it("should update actions", () => ssc.action.updateAction(emailAction.name, { "subjectPart": "new subject" }).then(response => {
            assert.equal(response["name"], emailAction.name);
            assert.equal(response["kind"], emailAction.kind);
            assert.equal(response["htmlPart"], emailAction.htmlPart);
            assert.equal(response["subjectPart"], "new subject");
            assert.equal(response["textPart"], emailAction.textPart);
            assert.equal(response["templateName"], emailAction.templateName);
            assert.deepEqual(response["addresses"], emailAction.addresses);
        }));

        it("should delete actions", () => ssc.action.deleteAction(emailAction.name).then(response => {
            assert(!response);
        }));

    });

    describe("Trigger webhook actions", () => {
        const webhookAction = {
            "name": `WebhookAction_${Date.now()}`,
            "kind": "webhook",
            "webhookUrl": "https://foo.slack.com/test",
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
            "tenant": tenantID,
            "payload": {
                "name": "user payload"
            }
        };

        it("should trigger action and get status", () => ssc.action.triggerAction(webhookAction.name, notification).then(response => {
            assert(response.StatusID != null);
            assert(response.StatusURL != null);

            ssc.action.getActionStatus(webhookAction.name, response.StatusID).then(res => {
                // expect(['RUNNING', 'FAILED']).to.include(res.state) TODO: Whether the action succeeds or not, depends on the action definition
                assert.equal(res.statusId, response.StatusID);
            });
        }));

        it("should delete actions", () => ssc.action.deleteAction(webhookAction.name).then(response => {
            assert(!response);
        }));
    });

    describe("Create/delete SNS actions", () => {
        const action = {
            "name": `snsAction_${Date.now()}`,
            "kind": "sns",
            "topic": "sns topic",
            "message": "sns user msg"
        };

        it("should create action", () => ssc.action.createAction(action).then(response => {
            assert.equal(response["name"], action.name);
            assert.equal(response["kind"], action.kind);
            assert.equal(response["topic"], action.topic);
            assert.equal(response["message"], action.message);

        }));

        it("should delete actions", () => ssc.action.deleteAction(action.name).then(response => {
            assert(!response);
        }));
    });
});
