// tslint:disable
/**
 * Action Service
 * A service that receives incoming notifications and uses pre-defined templates (action objects) to turn those notifications into meaningful actions.
 *
 * OpenAPI spec version: v1beta2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists } from '../runtime';
import {
    EmailActionMutable,
    EmailActionMutableFromJSON,
    EmailActionMutableToJSON,
    WebhookActionMutable,
    WebhookActionMutableFromJSON,
    WebhookActionMutableToJSON,
} from './';

/**
 * 
 * @export
 * @interface ActionMutable
 */
export interface ActionMutable {
    /**
     * Human readable name title for the action. Must be less than 128 characters.
     * @type {string}
     * @memberof ActionMutable
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof ActionMutable
     */
    subject?: string;
    /**
     * 
     * @type {string}
     * @memberof ActionMutable
     */
    body?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof ActionMutable
     */
    addresses?: Array<string>;
    /**
     * Only allows the HTTPS scheme. 
     * @type {string}
     * @memberof ActionMutable
     */
    webhookUrl?: string;
    /**
     * The (possibly) templated payload body which will be POSTed to the webhookUrl when triggered. 
     * @type {string}
     * @memberof ActionMutable
     */
    webhookPayload?: string;
}

export function ActionMutableFromJSON(json: any): ActionMutable {
    return {
    };
}

export function ActionMutableToJSON(value?: ActionMutable): any {
    if (value === undefined) {
        return undefined;
    }
    return {
    };
}


