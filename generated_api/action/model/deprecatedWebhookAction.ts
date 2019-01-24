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

import { DeprecatedActionCommon } from './deprecatedActionCommon';
import { MutableDeprecatedWebhookAction } from './mutableDeprecatedWebhookAction';

export class DeprecatedWebhookAction {
    /**
    * The name of the action. the name must be at least 4 alphanumeric characters, and can be segmented with periods.
    */
    'name': string;
    'kind': DeprecatedWebhookAction.KindEnum;
    /**
    * Human readable name title for the action. Must be less than 128 characters.
    */
    'title'?: string;
    /**
    * Only allows the HTTPS scheme. 
    */
    'webhookUrl'?: string;
    'message'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "kind",
            "baseName": "kind",
            "type": "DeprecatedWebhookAction.KindEnum"
        },
        {
            "name": "title",
            "baseName": "title",
            "type": "string"
        },
        {
            "name": "webhookUrl",
            "baseName": "webhookUrl",
            "type": "string"
        },
        {
            "name": "message",
            "baseName": "message",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return DeprecatedWebhookAction.attributeTypeMap;
    }
}

export namespace DeprecatedWebhookAction {
    export enum KindEnum {
        Webhook = <any> 'webhook',
        Email = <any> 'email',
        Sns = <any> 'sns'
    }
}