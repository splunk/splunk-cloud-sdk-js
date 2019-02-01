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
/**
 * 
 * @export
 * @interface ActionMutableCommon
 */
export interface ActionMutableCommon {
    /**
     * Human readable name title for the action. Must be less than 128 characters.
     * @type {string}
     * @memberof ActionMutableCommon
     */
    title?: string;
}

export function ActionMutableCommonFromJSON(json: any): ActionMutableCommon {
    return {
        'title': !exists(json, 'title') ? undefined : json['title'],
    // TODO: Template Change
    } as ActionMutableCommon;

}

export function ActionMutableCommonToJSON(value?: ActionMutableCommon): any {
    if (value === undefined) {
        return undefined;
    }
    return {
        'title': value.title,
    };
}

