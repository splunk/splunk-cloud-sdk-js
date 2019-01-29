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
    RawJSONPayload,
    RawJSONPayloadFromJSON,
    RawJSONPayloadToJSON,
    SplunkEventPayload,
    SplunkEventPayloadFromJSON,
    SplunkEventPayloadToJSON,
} from './';

/**
 * 
 * @export
 * @interface NotificationPayload
 */
export interface NotificationPayload {
    /**
     * JSON object for the event.
     * @type {any}
     * @memberof NotificationPayload
     */
    event: any;
    /**
     * Specifies a JSON object that contains explicit custom fields to be defined at indexing time.
     * @type {{ [key: string]: string; }}
     * @memberof NotificationPayload
     */
    fields: { [key: string]: string; };
    /**
     * The host value assigned to the event data. This is typically the hostname of the client from which you are sending data.
     * @type {string}
     * @memberof NotificationPayload
     */
    host: string;
    /**
     * The name of the index where the event data will be indexed.
     * @type {string}
     * @memberof NotificationPayload
     */
    index: string;
    /**
     * The source value assigned to the event data. For example, if you are sending data from an app that you are developing, set this key to the name of the app.
     * @type {string}
     * @memberof NotificationPayload
     */
    source: string;
    /**
     * The sourcetype value assigned to the event data.
     * @type {string}
     * @memberof NotificationPayload
     */
    sourcetype: string;
    /**
     * The event time. The default time format is epoch time, in the format sec.ms. For example, 1433188255.500 indicates 1433188255 seconds and 500 milliseconds after epoch.
     * @type {number}
     * @memberof NotificationPayload
     */
    time: number;
}

/*
export function NotificationPayloadFromJSON(json: any): NotificationPayload {
    return {
    };
}
*/

/*
export function NotificationPayloadToJSON(value?: NotificationPayload): any {
    if (value === undefined) {
        return undefined;
    }
    return {
    };
}
*/


