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
export declare function ServiceErrorFromJSON(json: any): ServiceError;
export declare function ServiceErrorToJSON(value?: ServiceError): any;
