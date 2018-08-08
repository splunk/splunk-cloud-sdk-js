/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import BaseApiService from './baseapiservice';
import { ACTION_SERVICE_PREFIX } from './service_prefixes';

/**
 * Encapsulates Action service endpoints
 */
export class ActionService extends BaseApiService {
    /**
     * Get actions in action service.
     * @param Action[]
     */
    public getActions = (): Promise<Action[]> => {
        return this.client.get(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions']))
            .then(response => response as Action[]);
    };

    /**
     * Get an action by name
     */
    public getAction = (id: Action['name']): Promise<Action> => {
        return this.client.get(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', id]))
            .then(response => response as Action);
    };

    /**
     * Delete an action by name
     */
    public deleteAction = (id: Action['name']): Promise<any> => {
        return this.client.delete(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', id]));
    };


    /**
     * Create an action
     */
    public createAction = (action: Action): Promise<Action> => {
        return this.client.post(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions']), action)
            .then(response => response as Action);
    };

    /**
     * Update an action
     */
    public updateAction = (id: Action['name'], action: ActionUpdateFields): Promise<Action> => {
        return this.client.patch(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', id]), action)
            .then(response => response as Action);
    };

    /**
     * Trigger an action
     */
    public triggerAction = (id: Action['name'], notification: ActionNotification): Promise<ActionTriggerResponse> => {
        return this.client.post(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', id]), notification)
            .then(response => {
                const responseStr = response.toString();
                if (responseStr.includes('/status/')) {
                    const parts = responseStr.split('/status/');
                    if (parts.length === 2) {
                        return Promise.resolve({
                            'StatusID': parts[1],
                            'StatusURL': responseStr
                        } as ActionTriggerResponse);
                    }
                }
                return response as ActionTriggerResponse;
            });
    };

    /**
     * Get action status
     */
    public getActionStatus = (id: Action['name'], statusId: string): Promise<ActionStatus> => {
        return this.client.get(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', id, 'status', statusId]))
            .then(response => response as ActionStatus);
    };
}


// ActionKind reflects the kinds of actions supported by the Action service
enum ActionKind {

    email,
    webhook,
    sns,
}

// Action defines the fields for email, sns, and webhooks as one aggregated model
export interface Action {
    // Common action fields:
    // Name of action, all actions have this field
    name: string;
    // Kind of action (email, webhook, or sns), all actions have this field
    kind: ActionKind;
    // ID of action assigned by action service, all actions have this field
    id?: string;
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
    addresses: string[];
    // SNS action fields:
    // Topic to trigger SNS action
    topic?: string;
    // Message to send via SNS or Webhook action
    message: string;
    // Webhook action fields:
    // WebhookURL to trigger Webhook action
    webhookUrl?: string;
    // Message string ;message" binding:"required"` (defined above)
}


// ActionStatusState reflects the status of the action
enum ActionStatusState {

    queue = 'QUEUED',
    running = 'RUNNING',
    done = 'DONE',
    failed = 'FAILED',
}

// ActionStatus defines the state information
interface ActionStatus {
    state: ActionStatusState;
    id: string;
    message: string;
}

// ActionTriggerResponse for returning status url and parsed statusID (if possible)
interface ActionTriggerResponse {
    statusId?: string;
    statusUrl?: string;
}


// ActionError defines format for returned errors
interface ActionError {
    code: string;
    message: string;
}

// ActionNotificationKind defines the types of notifications
enum ActionNotificationKind {
    splunkEvent = 'splunkEvent',
    rawJSON = 'rawJSON',
}

// ActionNotification defines the action notification format
interface ActionNotification {
    kind: ActionNotificationKind;
    tenant: string;
    payload: any;
}

// SplunkEventPayload is the payload for a notification coming from Splunk
interface SplunkEventPayload {
    event: any;
    fields: any;
    host: string;
    index: string;
    source: string;
    sourcetype: string;
    time: number;
}

// ActionUpdateFields defines the fields that may be updated for an existing Action
interface ActionUpdateFields {
    // ID of action assigned by action service, all actions have this field
    id?: string;
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
    addresses: string[];
    // SNS action fields:
    // Topic to trigger SNS action
    topic?: string;
    // Message to send via SNS or Webhook action
    message?: string;
    // Webhook action fields:
    // WebhookURL to trigger Webhook action
    webhookUrl?: string;
    // Message string `json:"message" binding:"required"` (defined above)
}
