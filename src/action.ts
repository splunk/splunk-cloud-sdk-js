/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import {
    ActionResult,
    EmailAction,
    Notification,
    WebhookAction,
} from '../generated_api/action/models';
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
    }

    /**
     * Get an action by actionName
     * @param actionName name of the action
     * @return Promise of an action
     */
    public getAction = (actionName: string): Promise<Action> => {
        const url = this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', actionName]);
        return this.client
            .get(SERVICE_CLUSTER_MAPPING.action, url)
            .then(response => response.body as Action);
    }

    /**
     * Delete an action by actionName
     * @param actionName name of the action
     * @return Promise of object
     */
    public deleteAction = (actionName: string): Promise<object> => {
        const url = this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', actionName]);
        return this.client
            .delete(SERVICE_CLUSTER_MAPPING.action, url)
            .then(response => response.body as object);
    }

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
    }

    /**
     * Update an action
     * @param actionName name of the action
     * @param action action updates
     * @return Promise of an action
     */
    public updateAction = (actionName: string, action: Partial<Action>): Promise<Action> => {
        const url = this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', actionName]);
        return this.client
            .patch(SERVICE_CLUSTER_MAPPING.action, url, action)
            .then(response => response.body as Action);
    }

    /**
     * Trigger an action
     * @param actionName name of the action
     * @param notification action notification
     * @return Promise of actionTriggerResponse
     */
    public triggerAction = (
        actionName: string,
        notification: Notification
    ): Promise<ActionTriggerResponse> => {
        const url = this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', actionName]);
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
    }

    /**
     * Get action status
     * @param actionName name of the action
     * @param statusId statusId
     * @return Promise of actionStatus
     */
    public getActionStatus = (
        actionName: string,
        statusId: ActionResult['statusId']
    ): Promise<ActionResult> => {
        const url = this.client.buildPath(ACTION_SERVICE_PREFIX, [
            'actions',
            actionName,
            'status',
            statusId,
        ]);
        return this.client
            .get(SERVICE_CLUSTER_MAPPING.action, url)
            .then(response => response.body as ActionResult);
    }
}

// ActionTriggerResponse for returning status url and id
export interface ActionTriggerResponse {
    statusId?: string;
    statusUrl?: string;
}

export type Action = EmailAction | WebhookAction;
