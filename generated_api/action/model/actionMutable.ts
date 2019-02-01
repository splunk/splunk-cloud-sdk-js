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

import { EmailActionMutable } from './emailActionMutable';
import { WebhookActionMutable } from './webhookActionMutable';

export class ActionMutable {
    /**
    * Human readable name title for the action. Must be less than 128 characters.
    */
    'title'?: string;
    'subject'?: string;
    'body'?: string;
    'addresses'?: Array<string>;
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
            "name": "title",
            "baseName": "title",
            "type": "string"
        },
        {
            "name": "subject",
            "baseName": "subject",
            "type": "string"
        },
        {
            "name": "body",
            "baseName": "body",
            "type": "string"
        },
        {
            "name": "addresses",
            "baseName": "addresses",
            "type": "Array<string>"
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
        return ActionMutable.attributeTypeMap;
    }
}

