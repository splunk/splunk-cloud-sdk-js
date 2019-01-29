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
 * @interface ActionCommon
 */
export interface ActionCommon {
    /**
     * The name of the action. The name is one or more identifier strings separated by dots. Each identifier string consists of lower case letters, digits, and underscores, and cannot start with a digit.
     * @type {string}
     * @memberof ActionCommon
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ActionCommon
     */
    kind: ActionCommon.KindEnum;
    /**
     * Human readable name title for the action. Must be less than 128 characters.
     * @type {string}
     * @memberof ActionCommon
     */
    title?: string;
}

/*
export function ActionCommonFromJSON(json: any): ActionCommon {
    return {
        'name': json['name'],
        'kind': json['kind'],
        'title': !exists(json, 'title') ? undefined : json['title'],
    };
}
*/

/*
export function ActionCommonToJSON(value?: ActionCommon): any {
    if (value === undefined) {
        return undefined;
    }
    return {
        'name': value.name,
        'kind': value.kind,
        'title': value.title,
    };
}
*/

/**
 * @export
 * @namespace ActionCommon
 */
export namespace ActionCommon {
    /**
     * @export
     * @enum {string}
     */
    export enum KindEnum {
        Webhook = 'webhook',
        Email = 'email'
    }
}

