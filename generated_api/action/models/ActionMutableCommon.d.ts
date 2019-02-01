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
export declare function ActionMutableCommonFromJSON(json: any): ActionMutableCommon;
export declare function ActionMutableCommonToJSON(value?: ActionMutableCommon): any;