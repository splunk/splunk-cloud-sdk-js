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
function ActionResultFromJSON(json) {
    return {
        'state': !runtime_1.exists(json, 'state') ? undefined : json['state'],
        'statusId': !runtime_1.exists(json, 'statusId') ? undefined : json['statusId'],
        'message': !runtime_1.exists(json, 'message') ? undefined : json['message'],
    };
}
exports.ActionResultFromJSON = ActionResultFromJSON;
function ActionResultToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    return {
        'state': value.state,
        'statusId': value.statusId,
        'message': value.message,
    };
}
exports.ActionResultToJSON = ActionResultToJSON;
/**
 * @export
 * @namespace ActionResult
 */
var ActionResult;
(function (ActionResult) {
    /**
     * @export
     * @enum {string}
     */
    var StateEnum;
    (function (StateEnum) {
        StateEnum["QUEUED"] = "QUEUED";
        StateEnum["RUNNING"] = "RUNNING";
        StateEnum["DONE"] = "DONE";
        StateEnum["FAILED"] = "FAILED";
    })(StateEnum = ActionResult.StateEnum || (ActionResult.StateEnum = {}));
})(ActionResult = exports.ActionResult || (exports.ActionResult = {}));
//# sourceMappingURL=ActionResult.js.map