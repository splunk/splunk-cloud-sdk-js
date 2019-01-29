import { assert } from 'chai';
import 'mocha';
import {
    ActionKind,
    ActionStatus,
    ActionTriggerResponse,
    // EmailAction,
    Notification,
    NotificationKind,
    SNSAction,
    WebhookAction,
} from '../../src/action';
// '../../action';
import { Action, EmailAction } from '../../generated_api/action/models';
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
            body: 'The Text',
            kind: Action.KindEnum.Email,
            name: `crudemail_${Date.now()}`,
            subject: 'The Subject',
            title: 'The title',
        };

        it('should create action', () => {
            return splunkCloud.action.createAction(emailAction).then((response: any) => {
                const email = response.body as EmailAction;
                // console.log("RESPONSE")
                // console.log(response)

                assert.deepEqual(email.addresses, emailAction.addresses);
                assert.equal(email.body, emailAction.body);
                assert.equal(email.kind, emailAction.kind);
                assert.equal(email.name, emailAction.name);
                assert.equal(email.subject, emailAction.subject);
                assert.equal(email.title, emailAction.title);
            });
        });

        it('should get an action', () => {
            return splunkCloud.action.getAction(emailAction.name).then((response: any) => {
                const email = response.body as EmailAction;
                // console.log("RESPONSE")
                // console.log(email)

                assert.deepEqual(email.addresses, emailAction.addresses);
                assert.equal(email.body, emailAction.body);
                assert.equal(email.kind, emailAction.kind);
                assert.equal(email.name, emailAction.name);
                assert.equal(email.subject, emailAction.subject);
                assert.equal(email.title, emailAction.title);
            });
        });

        it('should update actions', () => {
            const new_subject = 'new subject';
            return splunkCloud.action
                .updateAction(emailAction.name, { subject: new_subject })
                .then((response: any) => {
                    const email = response.body as EmailAction;
                    assert.deepEqual(email.addresses, emailAction.addresses);
                    assert.equal(email.body, emailAction.body);
                    assert.equal(email.kind, emailAction.kind);
                    assert.equal(email.name, emailAction.name);
                    assert.equal(email.subject, new_subject);
                    assert.equal(email.title, emailAction.title);
                });
        });

        it('should delete actions', () =>
            splunkCloud.action.deleteAction(emailAction.name).then(response => {
                assert.isEmpty(response);
            }));
    });

    //     describe('Trigger webhook actions', () => {
    //         const webhookAction: WebhookAction = {
    //             name: `WebhookAction_${Date.now()}`,
    //             kind: ActionKind.webhook,
    //             webhookUrl: 'https://foo.slack.com/test',
    //             message: 'some user msg',
    //         };

    //         it('should create action', () => {
    //             return splunkCloud.action.createAction(webhookAction as any).then((response: any) => {
    //                 const webhook = response as any;
    //                 assert.equal(webhook.name, webhookAction.name);
    //                 assert.equal(webhook.kind, webhookAction.kind);
    //                 assert.equal(webhook.webhookUrl, webhookAction.webhookUrl);
    //                 assert.equal(webhook.message, webhookAction.message);
    //             });
    //         });

    //         const notification: Notification = {
    //             kind: NotificationKind.rawJSON,
    //             tenant: tenantID as string,
    //             payload: {
    //                 name: 'user payload',
    //             },
    //         };

    //         it('should trigger action and get status', () => {
    //             let webhook: ActionTriggerResponse;
    //             return splunkCloud.action
    //                 .triggerAction(webhookAction.name, notification)
    //                 .then(response => {
    //                     webhook = response as ActionTriggerResponse;
    //                     assert.isNotNull(webhook.statusId);
    //                     assert.isNotNull(webhook.statusUrl);

    //                     return splunkCloud.action.getActionStatus(
    //                         webhookAction.name,
    //                         webhook.statusId as string
    //                     );
    //                 })
    //                 .then(res => {
    //                     const actionStatus = res as ActionStatus;
    //                     // expect(['RUNNING', 'FAILED']).to.include(res.state) TODO: Whether the action succeeds or not, depends on the action definition
    //                     assert.equal(actionStatus.statusId, webhook.statusId);
    //                 });
    //         });

    //         it('should delete actions', () => {
    //             return splunkCloud.action.deleteAction(webhookAction.name).then(response => {
    //                 assert.isEmpty(response);
    //             });
    //         });
    //     });

    //     describe('Create/delete SNS actions', () => {
    //         const action: SNSAction = {
    //             name: `snsAction_${Date.now()}`,
    //             kind: ActionKind.sns,
    //             topic: 'sns topic',
    //             message: 'sns user msg'
    //         };

    //         it('should create action', () =>
    //             splunkCloud.action.createAction(action as any).then(response => {
    //                 const sns = response as any;
    //                 assert.equal(sns.name, action.name);
    //                 assert.equal(sns.kind, action.kind);
    //                 assert.equal(sns.topic, action.topic);
    //                 assert.equal(sns.message, action.message);
    //             }));

    //         it('should delete actions', () =>
    //             splunkCloud.action.deleteAction(action.name).then(response => {
    //                 assert.isEmpty(response);
    //             }));
    //     });
});
