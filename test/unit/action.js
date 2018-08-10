const config = require("../config");
const SplunkSSC = require("../../splunk");
const { assert } = require("chai");

const splunk = new SplunkSSC(`http://${config.stubbyHost}:8882`, config.stubbyAuthToken, config.stubbyTenant);

describe("Action Endpoints", () => {
    describe("Create an action", () => {
        const action = {
            "name": "test10",
            "kind": "webhook",
            "webhookUrl": "http://webhook.site/40fa145b-43d7-48f9-a391-aa7558042fa6",
            "message": "{{ .name }} is a {{ .species }}"
        };
        const expectResult = {
            "name": "test10",
            "kind": "webhook",
            "id": "be7ab21a-995c-4392-9834-66f4a2aec48a",
            "webhookUrl": "http://webhook.site/40fa145b-43d7-48f9-a391-aa7558042fa6",
            "message": "{{ .name }} is a {{ .species }}"
        };

        it("should create an action", () => {
            return splunk.action.createAction(action).then(response => {
                assert.deepEqual(response, expectResult);
            });
        });
    });

    describe("Get an action", () => {
        const expectResult = {
            "name": "test10",
            "kind": "webhook",
            "id": "bf7747e0-e964-410a-988a-8a3aef2cc814",
            "webhookUrl": "http://webhook.site/40fa145b-43d7-48f9-a391-aa7558042fa6",
            "message": "{{ .name }} is a {{ .species }}"
        };
        it("should return the action", () => {
            return splunk.action.getAction("test10").then(response => {
                assert.deepEqual(response, expectResult);
            });
        });
    });

    describe("Get actions", () => {
        const expectResult =
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

        it("should return all actions", () => {
            return splunk.action.getActions().then(response => {
                assert.deepEqual(response, expectResult);
            });
        });
    });

    describe("Delete an action", () => {
        it("should delete the action", () => {
            return splunk.action.deleteAction("test10").then(response => {
                assert(!response);
            });
        });
    });

    describe("Update an action", () => {
        const patch = {
            "message": "updated message"
        };
        const expectResult = {
            "name": "test10",
            "kind": "webhook",
            "id": "bf7747e0-e964-410a-988a-8a3aef2cc814",
            "webhookUrl": "http://webhook.site/40fa145b-43d7-48f9-a391-aa7558042fa6",
            "message": "updated message"
        };

        it("should patch the action", () => {
            return splunk.action.updateAction("test10", patch).then(response => {
                assert.deepEqual(response, expectResult);
            });
        });
    });

    // todo: waiting for discussing with action team to see if they can change the response return info in the body than headers
    // describe("Trigger an action", () => {
    //     const notification = {
    //         "kind": "rawJSON",
    //         "tenant": "tenantId",
    //         "payload": {
    //             "name": "bean bag"
    //         }
    //     };
    //     const expectResult = {"StatusID":"5f718aaf-f205-4af6-995f-54a3ba059b59",
    //         "StatusURL":"/TEST_TENANT/action/v1/actions/test10/status/5f718aaf-f205-4af6-995f-54a3ba059b59" }
    //
    //     it("should trigger the action", () => {
    //         return splunk.action.triggerAction("test10", notification).then(response => {
    //             assert.deepEqual(response, expectResult);
    //         });
    //     });
    // });

    describe("Get action status", () => {

        const expectResult = {
            "state": "RUNNING",
            "statusId": "5f718aaf-f205-4af6-995f-54a3ba059b59"
        };

        it("should get action status", () => {
            return splunk.action.getActionStatus("test10", "5f718aaf-f205-4af6-995f-54a3ba059b59").then(response => {
                assert.deepEqual(response, expectResult);
            });
        });
    });
});
