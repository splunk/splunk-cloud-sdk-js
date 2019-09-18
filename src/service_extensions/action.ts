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

import BaseApiService from '../baseapiservice';
import { Constructor } from './service_extension';

interface WebhookKey {
    key: string;
}

export interface ActionTriggerResponse {
    statusId: string;
    statusUrl: string;
}

export interface TriggerEventInterface {

}

export type ActionServiceExtensions = {};

export interface ActionServiceInterface extends BaseApiService {
    getServiceCluster(): string;
    getServicePrefix(): string;
}

export function ActionServiceExtensions<T extends Constructor<ActionServiceInterface>>(constructor: T) {
    return class extends constructor {
        /**
         * Trigger an action
         * @param actionName The name of the action, as one or more identifier strings separated by periods. Each identifier string consists of lowercase letters, digits, and underscores, and cannot start with a digit.
         * @param triggerEvent The action payload, which must include values for any templated fields.
         * @return Promise of actionTriggerResponse
         */
        public triggerAction: (actionName: string, triggerEvent: TriggerEventInterface) => Promise<ActionTriggerResponse>;
        constructor(...args: any[]) {
            super(...args);
            // Typescript appears to build mixins with the extended class inheriting _from_ the mixin. As a result,
            // if triggerAction is specified as a normal method, the implementation here is shadowed _by_ the generated
            // implementation, rather than shadowing it. To countermand this, we construct the parent object by calling
            // super, then replace that implementation of triggerAction with this one here.
            //
            // The  reason for this override is that the response for this endpoint is in the header, and the response
            // has no body. Rather than overriding, we should allow access to the response headers.
            // TODO: Allow access to response headers, remove triggerAction
            this.triggerAction = async function(actionName: string, triggerEvent: TriggerEventInterface): Promise<ActionTriggerResponse> {
                const response = await this.client.post(this.getServiceCluster(), this.client.buildPath(this.getServicePrefix(), ['actions', actionName]), triggerEvent);
                const key = 'location';
                if (response.headers.has(key)) {
                    const responseStr = response.headers.get(key);
                    if (responseStr !== null && responseStr.match('/status/')) {
                        const parts = responseStr.split('/status/');
                        if (parts.length === 2) {
                            return {
                                statusId: parts[1],
                                statusUrl: responseStr,
                            };
                        }
                    }
                }
                return response.body as ActionTriggerResponse; // I don't think this works?
            };
        }
    };
}
