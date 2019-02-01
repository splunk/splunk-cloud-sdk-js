"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var runtime_1 = require("../runtime");
function ServiceErrorFromJSON(json) {
    return {
        'code': json['code'],
        'message': json['message'],
        // TODO: Template Change
        'details': !runtime_1.exists(json, 'details') ? undefined : JSON.parse(json['details']),
        // 'details': !exists(json, 'details') ? undefined : anyFromJSON(json['details']),
        'moreInfo': !runtime_1.exists(json, 'moreInfo') ? undefined : json['moreInfo'],
    };
}
exports.ServiceErrorFromJSON = ServiceErrorFromJSON;
function ServiceErrorToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    return {
        'code': value.code,
        'message': value.message,
        // TODO: Template Change
        // Original
        // 'details': anyToJSON(value.details),
        // New
        'details': JSON.stringify(value.details),
        'moreInfo': value.moreInfo,
    };
}
exports.ServiceErrorToJSON = ServiceErrorToJSON;
//# sourceMappingURL=ServiceError.js.map