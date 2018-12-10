/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

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
    public getActions = (): Promise<Array<EmailAction | WebhookAction | SNSAction> | Error> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions']))
            .then(response => response.body as Array<EmailAction | WebhookAction | SNSAction> | Error);
    }

    /**
     * Get an action by name
     * @param name name of the action
     * @return Promise of an action
     */
    public getAction = (name: ActionBase['name']): Promise<EmailAction | WebhookAction | SNSAction | Error> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', name]))
            .then(response => response.body as EmailAction | WebhookAction | SNSAction | Error);
    }

    /**
     * Delete an action by name
     * @param name name of the action
     * @return Promise of object
     */
    public deleteAction = (name: ActionBase['name']): Promise<object | Error> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', name]))
            .then(response => response.body as object | Error);
    }

    /**
     * Create an action
     * @param action input action
     * @return Promise of an action
     */
    public createAction = (action: EmailAction | WebhookAction | SNSAction): Promise<EmailAction | WebhookAction | SNSAction | Error> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions']), action)
            .then(response => response.body as EmailAction | WebhookAction | SNSAction | Error);
    }

    /**
     * Update an action
     * @param name name of the action
     * @param action action updates
     * @return Promise of an action
     */
    public updateAction = (name: ActionBase['name'], action: Partial<EmailAction | SNSAction | WebhookAction>): Promise<EmailAction | WebhookAction | SNSAction | Error> => {
        return this.client.patch(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', name]), action)
            .then(response => response.body as EmailAction | WebhookAction | SNSAction | Error);
    }

    /**
     * Trigger an action
     * @param name name of the action
     * @param notification action notification
     * @return Promise of actionTriggerResponse
     */
    public triggerAction = (name: ActionBase['name'], notification: Notification): Promise<ActionTriggerResponse | Error> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', name]), notification)
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
                            } as ActionTriggerResponse | Error);
                        }
                    }
                }
                return response.body as ActionTriggerResponse | Error;
            });
    }

    /**
     * Get action status
     * @param name name of the action
     * @param statusId statusId
     * @return Promise of actionResult
     */
    public getActionStatus = (name: ActionBase['name'], statusId: ActionResult['statusId']): Promise<ActionResult | Error> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', name, 'status', statusId]))
            .then(response => response.body as ActionResult | Error);
    }
}

// ActionKind reflects the kinds of actions supported by the Action service
export enum ActionKind {
    email = 'email',
    webhook = 'webhook',
    sns = 'sns',
}

// ActionResultState reflects the status of the action
export enum ActionResultState {
    queue = 'QUEUED',
    running = 'RUNNING',
    done = 'DONE',
    failed = 'FAILED',
}

// ActionResult defines the state information
export interface ActionResult {
    state: ActionResultState;
    statusId: string;
    message: string;
}

// ActionTriggerResponse for returning status url and id
export interface ActionTriggerResponse {
    statusId?: string;
    statusUrl?: string;
}

// ActionError defines format for returned errors
export interface ActionError {
    code: string;
    message: string;
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

export interface EmailAction extends ActionBase {
    kind: ActionKind.email;
    addresses: string[];
    htmlPart?: string;
    subjectPart?: string;
    templateName?: string;
    textPart?: string;
}

export interface SNSAction extends ActionBase {
    kind: ActionKind.sns;
    message: string;
    topic: string;
}

export interface WebhookAction extends ActionBase {
    kind: ActionKind.webhook;
    message: string;

    /**
     * Only allows https scheme. Only allows hostnames that end with "slack.com", "webhook.site", "sendgrid.com", "zapier.com", "hipchat.com", "amazon.com", and "amazonaws.com"
     */
    webhookUrl: string;
}

export interface ActionBase {
    kind: ActionKind;
    /**
     * Name of the action.  Must be atleast 4 alphanumeric characters,
     * and can be segmented with periods.
     */
    name: string;
}

export interface Error {
    code: string;
    details: object;
    message: string;
    moreInfo: string;
}
