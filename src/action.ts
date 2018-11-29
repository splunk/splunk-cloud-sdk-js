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
    public getActions = (): Promise<Array<EmailAction | WebhookAction | SNSAction>> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX,['actions']))
            .then(response => response.body as Array<EmailAction | WebhookAction | SNSAction>);
    }

    /**
     * Get an action by name
     * @param name name of the action
     * @return Promise of an action
     */
    public getAction = (name: ActionBase['name']): Promise<EmailAction | WebhookAction | SNSAction> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', name]))
            .then(response => response.body as EmailAction | WebhookAction | SNSAction);
    }

    /**
     * Delete an action by name
     * @param name name of the action
     * @return Promise of object
     */
    public deleteAction = (name: ActionBase['name']): Promise<object> => {
        return this.client.delete(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', name]))
            .then(response => response.body as object);
    }

    /**
     * Create an action
     * @param action input action
     * @return Promise of an action
     */
    public createAction = (action: EmailAction | WebhookAction | SNSAction): Promise<EmailAction | WebhookAction | SNSAction> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions']), action)
            .then(response => response.body as EmailAction | WebhookAction | SNSAction);
    }

    /**
     * Update an action
     * @param name name of the action
     * @param action action updates
     * @return Promise of an action
     */
    public updateAction = (name: ActionBase['name'], action: ActionUpdateFields): Promise<EmailAction | WebhookAction | SNSAction> => {
        return this.client.patch(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', name]), action)
            .then(response => response.body as EmailAction | WebhookAction | SNSAction);
    }

    /**
     * Trigger an action
     * @param name name of the action
     * @param notification action notification
     * @return Promise of actionTriggerResponse
     */
    public triggerAction = (name: ActionBase['name'], notification: ActionNotification): Promise<ActionTriggerResponse> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', name]), notification)
            .then(response => {
                const key = 'location';
                if (response.headers.has(key)) {
                    const responseStr = response.headers.get(key);
                    if (responseStr !== null && responseStr.match('\/status\/')) {
                        const parts = responseStr.split('/status/');
                        if (parts.length === 2) {
                            return Promise.resolve({
                                statusId: parts[1],
                                statusUrl: responseStr
                            } as ActionTriggerResponse);
                        }
                    }
                }
                return response.body as ActionTriggerResponse;
            });
    }

    /**
     * Get action status
     * @param name name of the action
     * @param statusId statusId
     * @return Promise of actionStatus
     */
    public getActionStatus = (name: ActionBase['name'], statusId: ActionStatus['statusId']): Promise<ActionStatus> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.action, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', name, 'status', statusId]))
            .then(response => response.body as ActionStatus);
    }
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

// ActionError defines format for returned errors
export interface ActionError {
    code: string;
    message: string;
}

// ActionNotificationKind defines the types of notifications
export enum ActionNotificationKind {
    splunkEvent = 'splunkEvent',
    rawJSON = 'rawJSON',
}

// ActionNotification defines the action notification format
export interface ActionNotification {
    kind: ActionNotificationKind;
    tenant: string;
    payload: any;
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

// ActionUpdateFields defines the fields that may be updated for an existing Action
export interface ActionUpdateFields {
    // Email action fields:
    // HTMLPart to send via Email action
    htmlPart?: string;
    // SubjectPart to send via Email action
    subjectPart?: string;
    // TextPart to send via Email action
    textPart?: string;
    // TemplateName to send via Email action
    templateName?: string;
    // Addresses to send to when Email action triggered
    addresses?: string[];

    // SNS action fields:
    // Topic to trigger SNS action
    topic?: string;
    // Message to send via SNS or Webhook action
    message?: string;

    // Webhook action fields:
    // WebhookURL to trigger Webhook action
    webhookUrl?: string;
}


export interface EmailAction extends ActionBase {
    kind: 'email';
    addresses: string[];
    htmlPart?: string;
    subjectPart?: string;
    templateName?: string;
    textPart?: string;
}

export interface SNSAction extends ActionBase {
    kind: 'sns';
    message: string;
    topic: string;
}

export interface WebhookAction extends ActionBase {
    kind: 'webhook';
    message: string;

    /**
     * Only allows https scheme. Only allows hostnames that end with "slack.com", "webhook.site", "sendgrid.com", "zapier.com", "hipchat.com", "amazon.com", and "amazonaws.com"
     */
    webhookUrl: string;
}

export interface ActionBase {
    kind: string;
    /**
     * Name of the action.  Must be atleast 4 alphanumeric characters,
     * and can be segmented with periods.
     */
    name: string;
}
