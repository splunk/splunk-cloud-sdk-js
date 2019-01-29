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
 * @interface ServiceError
 */
export interface ServiceError {
    /**
     * 
     * @type {string}
     * @memberof ServiceError
     */
    code: string;
    /**
     * 
     * @type {string}
     * @memberof ServiceError
     */
    message: string;
    /**
     * 
     * @type {any}
     * @memberof ServiceError
     */
    details?: any;
    /**
     * 
     * @type {string}
     * @memberof ServiceError
     */
    moreInfo?: string;
}

export function ServiceErrorFromJSON(json: any): ServiceError {
    return {
        'code': json['code'],
        'message': json['message'],
        'details': !exists(json, 'details') ? undefined : anyFromJSON(json['details']),
        'moreInfo': !exists(json, 'moreInfo') ? undefined : json['moreInfo'],
    };
}

export function ServiceErrorToJSON(value?: ServiceError): any {
    if (value === undefined) {
        return undefined;
    }
    return {
        'code': value.code,
        'message': value.message,
        'details': anyToJSON(value.details),
        'moreInfo': value.moreInfo,
    };
}


