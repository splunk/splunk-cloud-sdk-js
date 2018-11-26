import { assert } from 'chai';
import 'mocha';
import {
    ActionNotification,
    ActionNotificationKind,
    ActionStatus,
    ActionTriggerResponse,
    EmailAction,
    SNSAction,
    WebhookAction
} from '../../action';
import { SplunkCloud } from '../../splunk';
import config from '../config';

const tenantID = config.stagingTenant;

const splunkCloud = new SplunkCloud({
    urls: {
        api: config.stagingApiHost,
        app: config.stagingAppsHost
    },
    tokenSource: config.stagingAuthToken,
    defaultTenant: tenantID
});

describe('integration tests using action service', () => {
    describe('CRUD email actions', () => {
        const emailAction: EmailAction = {
            name: `crudemail_${Date.now()}`,
            kind: 'email',
            htmlPart: '<html><h1>The HTML</h1></html>',
            subjectPart: 'The Subject',
            textPart: 'The Text',
            templateName: 'template1000',
            addresses: ['test1@splunk.com', 'test2@splunk.com']
        };

        it('should create action', () => splunkCloud.action.createAction(emailAction).then(response => {
            const email = response as EmailAction;
            assert.equal(email.name, emailAction.name);
            assert.equal(email.kind, emailAction.kind);
            assert.equal(email.htmlPart, emailAction.htmlPart);
            assert.equal(email.subjectPart, emailAction.subjectPart);
            assert.equal(email.textPart, emailAction.textPart);
            assert.equal(email.templateName, emailAction.templateName);
            assert.deepEqual(email.addresses, emailAction.addresses);
        }));

        it('should get actions', () => splunkCloud.action.getAction(emailAction.name).then(response => {
            const email = response as EmailAction;
            assert.equal(email.name, emailAction.name);
            assert.equal(email.kind, emailAction.kind);
            assert.equal(email.htmlPart, emailAction.htmlPart);
            assert.equal(email.subjectPart, emailAction.subjectPart);
            assert.equal(email.textPart, emailAction.textPart);
            assert.equal(email.templateName, emailAction.templateName);
            assert.deepEqual(email.addresses, emailAction.addresses);
        }));

        it('should update actions', () => splunkCloud.action.updateAction(emailAction.name, { subjectPart: 'new subject' }).then(response => {
            const email = response as EmailAction;
            assert.equal(email.name, emailAction.name);
            assert.equal(email.kind, emailAction.kind);
            assert.equal(email.htmlPart, emailAction.htmlPart);
            assert.equal(email.subjectPart, 'new subject');
            assert.equal(email.textPart, emailAction.textPart);
            assert.equal(email.templateName, emailAction.templateName);
            assert.deepEqual(email.addresses, emailAction.addresses);
        }));

        it('should delete actions', () => splunkCloud.action.deleteAction(emailAction.name).then(response => {
            assert.isEmpty(response);
        }));

    });

    describe('Trigger webhook actions', () => {
        const webhookAction: WebhookAction = {
            name: `WebhookAction_${Date.now()}`,
            kind: 'webhook',
            webhookUrl: 'https://foo.slack.com/test',
            message: 'some user msg'
        };

        it('should create action', () => splunkCloud.action.createAction(webhookAction).then(response => {
            const webhook = response as WebhookAction;
            assert.equal(webhook.name, webhookAction.name);
            assert.equal(webhook.kind, webhookAction.kind);
            assert.equal(webhook.webhookUrl, webhookAction.webhookUrl);
            assert.equal(webhook.message, webhookAction.message);

        }));

        const notification: ActionNotification = {
            kind: ActionNotificationKind.rawJSON,
            tenant: tenantID as string,
            payload: {
                name: 'user payload'
            }
        };

        it('should trigger action and get status', () => splunkCloud.action.triggerAction(webhookAction.name, notification).then(response => {
            const webhook = response as ActionTriggerResponse;
            assert.isNotNull(webhook.StatusID);
            assert.isNotNull(webhook.StatusURL);

            return splunkCloud.action.getActionStatus(webhookAction.name, webhook.StatusID as string).then(res => {
                const actionStatus = res as ActionStatus;
                // expect(['RUNNING', 'FAILED']).to.include(res.state) TODO: Whether the action succeeds or not, depends on the action definition
                assert.equal(actionStatus.statusId, webhook.StatusID);
            });
        }));

        it('should delete actions', () => splunkCloud.action.deleteAction(webhookAction.name).then(response => {
            assert.isEmpty(response);
        }));
    });

    describe('Create/delete SNS actions', () => {
        const action: SNSAction = {
            name: `snsAction_${Date.now()}`,
            kind: 'sns',
            topic: 'sns topic',
            message: 'sns user msg'
        };

        it('should create action', () => splunkCloud.action.createAction(action).then(response => {
            const sns = response as SNSAction;
            assert.equal(sns.name, action.name);
            assert.equal(sns.kind, action.kind);
            assert.equal(sns.topic, action.topic);
            assert.equal(sns.message, action.message);
        }));

        it('should delete actions', () => splunkCloud.action.deleteAction(action.name).then(response => {
            assert.isEmpty(response);
        }));
    });
});
