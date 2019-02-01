/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import { EmailAction, WebhookAction } from '../generated_api/action/models';
import BaseApiService from './baseapiservice';
import { ACTION_SERVICE_PREFIX, SERVICE_CLUSTER_MAPPING } from './service_prefixes';

/**
 * Encapsulates Action service endpoints
 */
export class ActionService extends BaseApiService {
    /**
     * Get all actions in action service.
     * @returns Promise of all actions
     */
    public getActions = (): Promise<Action[]> => {
        const url = this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions']);
        return this.client
            .get(SERVICE_CLUSTER_MAPPING.action, url)
            .then(response => response.body as Action[]);
    };

    /**
     * Get an action by action_name
     * @param action_name name of the action
     * @return Promise of an action
     */
    public getAction = (action_name: string): Promise<Action> => {
        const url = this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', action_name]);
        return this.client
            .get(SERVICE_CLUSTER_MAPPING.action, url)
            .then(response => response.body as Action);
    };

    /**
     * Delete an action by action_name
     * @param action_name name of the action
     * @return Promise of object
     */
    public deleteAction = (action_name: string): Promise<object> => {
        const url = this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', action_name]);
        return this.client
            .delete(SERVICE_CLUSTER_MAPPING.action, url)
            .then(response => response.body as object);
    };

    /**
     * Create an action
     * @param action input action
     * @return Promise of an action
     */
    public createAction = (action: Action): Promise<Action> => {
        const url = this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions']);
        return this.client
            .post(SERVICE_CLUSTER_MAPPING.action, url, action)
            .then(response => response.body as Action);
    };

    /**
     * Update an action
     * @param action_name name of the action
     * @param action action updates
     * @return Promise of an action
     */
    public updateAction = (action_name: string, action: Partial<Action>): Promise<Action> => {
        const url = this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', action_name]);
        return this.client
            .patch(SERVICE_CLUSTER_MAPPING.action, url, action)
            .then(response => response.body as Action);
    };

    /**
     * Trigger an action
     * @param name name of the action
     * @param notification action notification
     * @return Promise of actionTriggerResponse
     */
    public triggerAction = (
        name: ActionBase['name'],
        notification: Notification
    ): Promise<ActionTriggerResponse> => {
        const url = this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', name]);
        return this.client
            .post(SERVICE_CLUSTER_MAPPING.action, url, notification)
            .then(response => {
                const key = 'location';
                if (response.headers.has(key)) {
                    const responseStr = response.headers.get(key);
                    if (responseStr !== null && responseStr.match('/status/')) {
                        const parts = responseStr.split('/status/');
                        if (parts.length === 2) {
                            return Promise.resolve({
                                statusId: parts[1],
                                statusUrl: responseStr,
                            } as ActionTriggerResponse);
                        }
                    }
                }
                return response.body as ActionTriggerResponse;
            });
    };

    /**
     * Get action status
     * @param name name of the action
     * @param statusId statusId
     * @return Promise of actionStatus
     */
    public getActionStatus = (
        name: ActionBase['name'],
        statusId: ActionStatus['statusId']
    ): Promise<ActionStatus> => {
        const url = this.client.buildPath(ACTION_SERVICE_PREFIX, [
            'actions',
            name,
            'status',
            statusId,
        ]);
        return this.client
            .get(SERVICE_CLUSTER_MAPPING.action, url)
            .then(response => response.body as ActionStatus);
    };
}

// ActionKind reflects the kinds of actions supported by the Action service
export enum ActionKind {
    email = 'email',
    webhook = 'webhook',
    sns = 'sns',
}

// ActionStatusState reflects the status of the action
export enum ActionStatusState {
    queue = 'QUEUED',
    running = 'RUNNING',
    done = 'DONE',
    failed = 'FAILED',
}

// ActionStatus defines the state information
export interface ActionStatus {
    state: ActionStatusState;
    statusId: string;
    message: string;
}

// ActionTriggerResponse for returning status url and id
export interface ActionTriggerResponse {
    statusId?: string;
    statusUrl?: string;
}

// NotificationKind defines the types of notifications
export enum NotificationKind {
    splunkEvent = 'splunkEvent',
    rawJSON = 'rawJSON',
}

// Notification defines the action notification format
export interface Notification {
    kind: NotificationKind;
    tenant: string;
    payload: object | SplunkEventPayload;
}

// SplunkEventPayload is the payload for a notification coming from Splunk
export interface SplunkEventPayload {
    /**
     * JSON object for the event.
     */
    event: object;
    /**
     * Specifies a JSON object that contains explicit custom fields
     * to be defined at index time.
     */
    fields: Map<string, string>;
    /**
     * The host value assigned to the event data. This is typically
     * the hostname of the client from which you are sending data.
     */
    host: string;
    /**
     * The name of the index by which the event data is to be indexed.
     */
    index: string;
    /**
     * The source value assigned to the event data. For example, if you are sending data from an app that you are developing,
     * set this key to the name of the app.
     */
    source: string;
    /**
     * The sourcetype value assigned to the event data.
     */
    sourcetype: string;
    /**
     * The event time. The default time format is epoch time, in the format sec.ms. For example, 1433188255.500 indicates 1433188255 seconds and
     * 500 milliseconds after epoch.
     */
    time: number;
}

// export interface SNSAction extends ActionBase {
//     kind: ActionKind.sns;
//     message: string;
//     topic: string;
// }

export interface ActionBase {
    kind: ActionKind;
    /**
     * Name of the action.  Must be atleast 4 alphanumeric characters,
     * and can be segmented with periods.
     */
    name: string;
}

// export type Action = EmailAction | SNSAction | WebhookAction;
export type Action = EmailAction | WebhookAction;
