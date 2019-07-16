/**
 * Copyright 2019 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { ACTION_SERVICE_CLUSTER, ACTION_SERVICE_PREFIX, ActionServiceGen } from './generated/action/v1beta2/api';
import * as actionModels from './models/action';

export { actionModels };
/**
 * Encapsulates Action service endpoints.
 */
export class ActionService extends ActionServiceGen {
    /**
     * Get the current webhook key(s). If multiple keys were returned, one is active and one is expired.
     * @return Array<PublicWebhookKey>
     */
    public getPublicWebhookKeys = (): Promise<actionModels.PublicWebhookKey[]> => {
        return this.client.get(ACTION_SERVICE_CLUSTER, this.client.buildPath(ACTION_SERVICE_PREFIX, ['webhook', 'keys'], 'system'))
            .then(response => response.body as actionModels.PublicWebhookKey[]);
    }

    /**
     * Trigger an action
     * @param actionName The name of the action, as one or more identifier strings separated by periods. Each identifier string consists of lowercase letters, digits, and underscores, and cannot start with a digit.
     * @param triggerEvent The action payload, which must include values for any templated fields.
     * @return Promise of actionTriggerResponse
     */
    public triggerAction = (actionName: string, triggerEvent: actionModels.TriggerEvent): Promise<actionModels.ActionTriggerResponse> => {
        return this.client.post(ACTION_SERVICE_CLUSTER, this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', actionName]), triggerEvent)
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
                            } as actionModels.ActionTriggerResponse);
                        }
                    }
                }
                return response.body as actionModels.ActionTriggerResponse;
            });
    }

}
