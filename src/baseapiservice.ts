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

import { ServiceClient } from './client';

/**
 * A base class for each of the API proxies.
 */
export default abstract class BaseApiService {
    public abstract getServiceCluster() : string;
    public abstract getServicePrefix() : string;
    // TODO: Document when we have a final auth story
    public client: ServiceClient;
    constructor(client: ServiceClient) {
        this.client = client;
    }
    /**
     * A tag function to parse tagged templates.
     * @param strings  An array of string values in the original TL.
     * @param keys An array of the expressions in the original TL.
     * @returns A function that replaces expressions with values from the map that is passed in.
     */
    public template = (strings: TemplateStringsArray, ...keys: string[]) => {
        return (tlMap:{ [key:string]:string} ) => {
            if (!tlMap || Object.keys(tlMap).length === 0) {
                throw Error('failed to reformat template string. mapping cannot be empty or undefined.');
            }
            let result = ``;
            strings.map((value, index) => {
                const wordsToBeReplaced = index <= keys.length - 1 ? keys[index] : ``;
                if (wordsToBeReplaced in tlMap) {
                    result += value + tlMap[wordsToBeReplaced];
                } else if(wordsToBeReplaced === ``) {
                    result += value;
                } else {
                    throw Error(`failed to reformat template string. mapping for template expression ${wordsToBeReplaced} is not found in the template literals.`);
                }
            });
            return result;
        };
    }
}
