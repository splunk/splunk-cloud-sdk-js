import { assert } from 'chai';
import 'mocha';
import sleep = require('sleep-promise');
import { SplunkCloud } from '../../splunk';
import { actionModels } from '../../src/action';
import config from '../config';

const tenantID = config.stagingTenant;

const splunkCloud = new SplunkCloud({
    urls: {
        api: config.stagingApiHost,
        app: config.stagingAppsHost,
    },
    tokenSource: config.stagingAuthToken,
    defaultTenant: tenantID,
});

describe('integration tests using action service', () => {
    const actionName = `crudemail_${Date.now()}`;

    describe('CRUD email actions', () => {
        const emailAction: actionModels.EmailAction = {
            name: actionName,
            kind: actionModels.ActionKind.Email,
            body: '<html><h1>The HTML</h1></html>',
            bodyPlainText: 'The Plain Text Body',
            subject: 'The Subject',
            members: ['success@simulator.amazonses.com'],
        };

        it('should create action', () =>
            splunkCloud.action.createAction(emailAction).then(response => {
                const email = response as actionModels.EmailAction;
                assert.equal(email.name, emailAction.name);
                assert.equal(email.kind, emailAction.kind);
                assert.equal(email.body, emailAction.body);
                assert.equal(email.bodyPlainText, emailAction.bodyPlainText);
                assert.equal(email.subject, emailAction.subject);
                assert.deepEqual(email.addresses, emailAction.addresses);
            }));

        it('should update actions', () =>
            splunkCloud.action
                .updateAction(emailAction.name, { subject: 'new subject' })
                .then(updateResponse => {
                    const updatedEmail = updateResponse as actionModels.EmailAction;
                    assert.equal(updatedEmail.name, emailAction.name);
                    assert.equal(updatedEmail.kind, emailAction.kind);
                    assert.equal(updatedEmail.body, emailAction.body);
                    assert.equal(updatedEmail.bodyPlainText, emailAction.bodyPlainText);
                    assert.equal(updatedEmail.subject, 'new subject');
                    assert.deepEqual(updatedEmail.addresses, emailAction.addresses);
                }));

        it('should get actions', () =>
            splunkCloud.action.getAction(emailAction.name).then(response => {
                const email = response as actionModels.EmailAction;
                assert.equal(email.name, emailAction.name);
                assert.equal(email.kind, emailAction.kind);
                assert.equal(email.body, emailAction.body);
                assert.equal(email.bodyPlainText, emailAction.bodyPlainText);
                assert.equal(email.subject, 'new subject');
                assert.deepEqual(email.addresses, emailAction.addresses);
            }));

        it('should get public webhook keys', () => {
            return splunkCloud.action.getPublicWebhookKeys()
                .then(res => {
                    assert.typeOf(res, 'Array');
                });
        });

        it('should delete actions', () =>
            splunkCloud.action.deleteAction(emailAction.name).then(response => {
                assert.isEmpty(response);
            }));
    });

    describe('Trigger email actions', () => {
        const emailAction: actionModels.EmailAction = {
            name: `crudemail_${Date.now()}`,
            kind: actionModels.ActionKind.Email,
            body: '<html><h1>The HTML</h1></html>',
            bodyPlainText: 'The Plain Text Body',
            subject: 'The Subject',
            members: ['success@simulator.amazonses.com'],
        };

        it('should create action', () => {
            return splunkCloud.action.createAction(emailAction).then(response => {
                const webhook = response as actionModels.EmailAction;
                assert.equal(webhook.name, emailAction.name);
                assert.equal(webhook.kind, emailAction.kind);
                assert.equal(webhook.title, emailAction.title);
                assert.equal(webhook.body, emailAction.body);
                assert.equal(webhook.bodyPlainText, emailAction.bodyPlainText);
                assert.equal(webhook.subject, emailAction.subject);
                assert.deepEqual(webhook.addresses, emailAction.addresses);
            });
        });
        const rawPayload: actionModels.RawJSONPayload = {
            name: { payload: 'user payload' },
        };
        const notification: actionModels.TriggerEvent = {
            kind: actionModels.TriggerEventKind.Trigger,
            tenant: tenantID as string,
            payload: rawPayload
        };

        it('should trigger action and get status', () => {
            let email: actionModels.ActionTriggerResponse;
            return splunkCloud.action
                .triggerAction(emailAction.name, notification)
                .then(response => {
                    email = response as actionModels.ActionTriggerResponse;
                    assert.isNotNull(email.statusId);
                    assert.isNotNull(email.statusUrl);

                    return splunkCloud.action.getActionStatus(
                        emailAction.name,
                        email.statusId as string
                    );
                })
                .then(res => {
                    const actionStatus = res as actionModels.ActionResult;
                    // TODO: Whether the action succeeds or not, depends on the action definition
                    // assert.include([ActionStatusState.running, ActionStatusState.failed], res.state)
                    assert.equal(actionStatus.statusId, email.statusId);

                    // Only valid for email actions
                    return splunkCloud.action.getActionStatusDetails(emailAction.name, email.statusId as string);
                })
                .then(res => {
                    assert.typeOf(res, 'Array');
                });
        });
    });

    describe('Trigger webhook actions', () => {
        const webhookAction: actionModels.WebhookAction = {
            name: `wh_${Date.now()}`,
            kind: actionModels.ActionKind.Webhook,
            title: 'My Title',
            webhookUrl: 'https://foo.slack.com/test',
            webhookPayload: 'some user msg',
        };

        it('should create action', () => {
            return splunkCloud.action.createAction(webhookAction).then(response => {
                const webhook = response as actionModels.WebhookAction;
                assert.equal(webhook.name, webhookAction.name);
                assert.equal(webhook.kind, webhookAction.kind);
                assert.equal(webhook.title, webhookAction.title);
                assert.equal(webhook.webhookUrl, webhookAction.webhookUrl);
                assert.equal(webhook.webhookPayload, webhookAction.webhookPayload);
            });
        });
        const rawPayload: actionModels.RawJSONPayload = {
            name: { payload: 'user payload' },
        };
        const notification: actionModels.TriggerEvent = {
            kind: actionModels.TriggerEventKind.Trigger,
            tenant: tenantID as string,
            payload:rawPayload
        };

        it('should trigger action and get status', () => {
            let webhook: actionModels.ActionTriggerResponse;
            return splunkCloud.action
                .triggerAction(webhookAction.name, notification)
                .then(response => {
                    webhook = response as actionModels.ActionTriggerResponse;
                    assert.isNotNull(webhook.statusId);
                    assert.isNotNull(webhook.statusUrl);

                    return splunkCloud.action.getActionStatus(
                        webhookAction.name,
                        webhook.statusId as string
                    );
                })
                .then(res => {
                    const actionStatus = res as actionModels.ActionResult;
                    // TODO: Whether the action succeeds or not, depends on the action definition
                    // assert.include([ActionStatusState.running, ActionStatusState.failed], res.state)
                    assert.equal(actionStatus.statusId, webhook.statusId);
                });
        });

        it('should delete actions', () => {
            return splunkCloud.action.deleteAction(webhookAction.name).then(response => {
                assert.isEmpty(response);
            });
        });
    });

});
