import { assert } from 'chai';
import 'mocha';
import {
    ActionResult,
    EmailAction,
    Notification,
    WebhookAction,
} from '../../generated_api/action/models';
import { ActionTriggerResponse } from '../../src/action';
import { SplunkCloud } from '../../src/splunk';
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
            addresses: ['test1@splunk.com', 'test2@splunk.com'],
            name: `crudemail_${Date.now()}`,
            kind: EmailAction.KindEnum.Email,
            subject: 'The subject',
            title: 'The title',
        };

        it('should create action', () =>
            splunkCloud.action.createAction(emailAction).then(response => {
                const email = response as EmailAction;
                assert.deepEqual(email.addresses, emailAction.addresses);
                assert.equal(email.name, emailAction.name);
                assert.equal(email.kind, emailAction.kind);
                assert.equal(email.subject, emailAction.subject);
                assert.equal(email.title, emailAction.title);
            }));

        it('should get actions', () =>
            splunkCloud.action.getAction(emailAction.name).then(response => {
                const email = response as EmailAction;
                assert.deepEqual(email.addresses, emailAction.addresses);
                assert.equal(email.name, emailAction.name);
                assert.equal(email.kind, emailAction.kind);
                assert.equal(email.subject, emailAction.subject);
                assert.equal(email.title, emailAction.title);
            }));

        it('should update actions', () =>
            splunkCloud.action
                .updateAction(emailAction.name, { subject: 'new subject' })
                .then(response => {
                    const email = response as EmailAction;
                    assert.deepEqual(email.addresses, emailAction.addresses);
                    assert.equal(email.name, emailAction.name);
                    assert.equal(email.kind, emailAction.kind);
                    assert.equal(email.subject, 'new subject');
                    assert.equal(email.title, emailAction.title);
                }));

        it('should delete actions', () =>
            splunkCloud.action.deleteAction(emailAction.name).then(response => {
                assert.isEmpty(response);
            }));
    });

    describe('Trigger webhook actions', () => {
        const webhookAction: WebhookAction = {
            name: `webhook_action_${Date.now()}`,
            kind: WebhookAction.KindEnum.Webhook,
            webhookPayload: 'This is a webhook payload!',
            webhookUrl: 'https://foo.slack.com/test',
        };

        it('should create action', () => {
            return splunkCloud.action.createAction(webhookAction).then(response => {
                const webhook = response as WebhookAction;
                assert.equal(webhook.name, webhookAction.name);
                assert.equal(webhook.kind, webhookAction.kind);
                assert.equal(webhook.webhookPayload, webhookAction.webhookPayload);
                assert.equal(webhook.webhookUrl, webhookAction.webhookUrl);
            });
        });

        const notification: Notification = {
            kind: Notification.KindEnum.RawJSON,
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
                    const actionStatus = res as ActionResult;
                    // expect(['RUNNING', 'FAILED']).to.include(res.state)
                    // TODO: Whether the action succeeds or not, depends on the action definition
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
