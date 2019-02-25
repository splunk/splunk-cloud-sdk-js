import { assert } from 'chai';
import 'mocha';
import {
    ActionKind,
    ActionStatus,
    ActionTriggerResponse,
    EmailAction,
    Notification,
    NotificationKind,
    WebhookAction,
} from '../../action';
import { SplunkCloud } from '../../splunk';
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
    describe('CRUD email actions', () => {
        const emailAction: EmailAction = {
            name: `crudemail_${Date.now()}`,
            kind: ActionKind.email,
            body: '<html><h1>The HTML</h1></html>',
            bodyPlainText: 'The Plain Text Body',
            subject: 'The Subject',
            addresses: ['test1@splunk.com', 'test2@splunk.com'],
        };

        it('should create action', () =>
            splunkCloud.action.createAction(emailAction).then(response => {
                const email = response as EmailAction;
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
                    const updatedEmail = updateResponse as EmailAction;
                    assert.equal(updatedEmail.name, emailAction.name);
                    assert.equal(updatedEmail.kind, emailAction.kind);
                    assert.equal(updatedEmail.body, emailAction.body);
                    assert.equal(updatedEmail.bodyPlainText, emailAction.bodyPlainText);
                    assert.equal(updatedEmail.subject, 'new subject');
                    assert.deepEqual(updatedEmail.addresses, emailAction.addresses);
                }));

        it('should get actions', () =>
            splunkCloud.action.getAction(emailAction.name).then(response => {
                const email = response as EmailAction;
                assert.equal(email.name, emailAction.name);
                assert.equal(email.kind, emailAction.kind);
                assert.equal(email.body, emailAction.body);
                assert.equal(email.bodyPlainText, emailAction.bodyPlainText);
                assert.equal(email.subject, 'new subject');
                assert.deepEqual(email.addresses, emailAction.addresses);
            }));

        it('should delete actions', () =>
            splunkCloud.action.deleteAction(emailAction.name).then(response => {
                assert.isEmpty(response);
            }));
    });

    describe('Trigger webhook actions', () => {
        const webhookAction: WebhookAction = {
            name: `wh_${Date.now()}`,
            kind: ActionKind.webhook,
            title: 'My Title',
            webhookUrl: 'https://foo.slack.com/test',
            webhookPayload: 'some user msg',
        };

        it('should create action', () => {
            return splunkCloud.action.createAction(webhookAction).then(response => {
                const webhook = response as WebhookAction;
                assert.equal(webhook.name, webhookAction.name);
                assert.equal(webhook.kind, webhookAction.kind);
                assert.equal(webhook.title, webhookAction.title);
                assert.equal(webhook.webhookUrl, webhookAction.webhookUrl);
                assert.equal(webhook.webhookPayload, webhookAction.webhookPayload);
            });
        });

        const notification: Notification = {
            kind: NotificationKind.rawJSON,
            tenant: tenantID as string,
            payload: {
                name: 'user payload',
            },
        };

        it('should trigger action and get status', () => {
            let webhook: ActionTriggerResponse;
            return splunkCloud.action
                .triggerAction(webhookAction.name, notification)
                .then(response => {
                    webhook = response as ActionTriggerResponse;
                    assert.isNotNull(webhook.statusId);
                    assert.isNotNull(webhook.statusUrl);

                    return splunkCloud.action.getActionStatus(
                        webhookAction.name,
                        webhook.statusId as string
                    );
                })
                .then(res => {
                    const actionStatus = res as ActionStatus;
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
