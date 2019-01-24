"use strict";
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
var DeprecatedWebhookAction = /** @class */ (function () {
    function DeprecatedWebhookAction() {
    }
    DeprecatedWebhookAction.getAttributeTypeMap = function () {
        return DeprecatedWebhookAction.attributeTypeMap;
    };
    DeprecatedWebhookAction.discriminator = undefined;
    DeprecatedWebhookAction.attributeTypeMap = [
        {
            name: 'name',
            baseName: 'name',
            type: 'string',
        },
        {
            name: 'kind',
            baseName: 'kind',
            type: 'DeprecatedWebhookAction.KindEnum',
        },
        {
            name: 'title',
            baseName: 'title',
            type: 'string',
        },
        {
            name: 'webhookUrl',
            baseName: 'webhookUrl',
            type: 'string',
        },
        {
            name: 'message',
            baseName: 'message',
            type: 'string',
        },
    ];
    return DeprecatedWebhookAction;
}());
exports.DeprecatedWebhookAction = DeprecatedWebhookAction;
(function (DeprecatedWebhookAction) {
    var KindEnum;
    (function (KindEnum) {
        KindEnum[KindEnum["Webhook"] = 'webhook'] = "Webhook";
        KindEnum[KindEnum["Email"] = 'email'] = "Email";
        KindEnum[KindEnum["Sns"] = 'sns'] = "Sns";
    })(KindEnum = DeprecatedWebhookAction.KindEnum || (DeprecatedWebhookAction.KindEnum = {}));
})(DeprecatedWebhookAction = exports.DeprecatedWebhookAction || (exports.DeprecatedWebhookAction = {}));
exports.DeprecatedWebhookAction = DeprecatedWebhookAction;
//# sourceMappingURL=deprecatedWebhookAction.js.map