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

import { ActionCommon } from './actionCommon';
import { WebhookActionMutable } from './webhookActionMutable';

export class WebhookAction {
    /**
    * The name of the action. The name is one or more identifier strings separated by dots. Each identifier string consists of lower case letters, digits, and underscores, and cannot start with a digit.
    */
    'name': string;
    'kind': WebhookAction.KindEnum;
    /**
    * Human readable name title for the action. Must be less than 128 characters.
    */
    'title'?: string;
    /**
    * Only allows the HTTPS scheme. 
    */
    'webhookUrl'?: string;
    /**
    * The (possibly) templated payload body which will be POSTed to the webhookUrl when triggered. 
    */
    'webhookPayload'?: string;

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
            "type": "WebhookAction.KindEnum"
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
            "name": "webhookPayload",
            "baseName": "webhookPayload",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return WebhookAction.attributeTypeMap;
    }
}

export namespace WebhookAction {
    export enum KindEnum {
        Webhook = <any> 'webhook',
        Email = <any> 'email'
    }
}
