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

export class ModelError {
    public code: string;
    public message: string;
    public details: any;
    public moreInfo: string;

    public static discriminator: string | undefined = undefined;

    public static attributeTypeMap: Array<{ name: string; baseName: string; type: string }> = [
        {
            name: 'code',
            baseName: 'code',
            type: 'string',
        },
        {
            name: 'message',
            baseName: 'message',
            type: 'string',
        },
        {
            name: 'details',
            baseName: 'details',
            type: 'any',
        },
        {
            name: 'moreInfo',
            baseName: 'moreInfo',
            type: 'string',
        },
    ];

    public static getAttributeTypeMap() {
        return ModelError.attributeTypeMap;
    }
}
