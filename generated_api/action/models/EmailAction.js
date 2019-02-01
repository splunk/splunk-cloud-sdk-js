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
function EmailActionFromJSON(json) {
    return {
    // TODO: Template Change
    };
}
exports.EmailActionFromJSON = EmailActionFromJSON;
function EmailActionToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    return {};
}
exports.EmailActionToJSON = EmailActionToJSON;
/**
 * @export
 * @namespace EmailAction
 */
var EmailAction;
(function (EmailAction) {
    /**
     * @export
     * @enum {string}
     */
    var KindEnum;
    (function (KindEnum) {
        KindEnum["Webhook"] = "webhook";
        KindEnum["Email"] = "email";
    })(KindEnum = EmailAction.KindEnum || (EmailAction.KindEnum = {}));
})(EmailAction = exports.EmailAction || (exports.EmailAction = {}));
//# sourceMappingURL=EmailAction.js.map