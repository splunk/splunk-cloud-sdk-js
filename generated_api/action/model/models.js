"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./action"));
__export(require("./actionCommon"));
__export(require("./actionMutable"));
__export(require("./actionMutableCommon"));
__export(require("./actionResult"));
__export(require("./deprecatedAction"));
__export(require("./deprecatedActionCommon"));
__export(require("./deprecatedActionMutable"));
__export(require("./deprecatedActionMutableCommon"));
__export(require("./deprecatedEmailAction"));
__export(require("./deprecatedSNSAction"));
__export(require("./deprecatedWebhookAction"));
__export(require("./emailAction"));
__export(require("./emailActionMutable"));
__export(require("./modelError"));
__export(require("./mutableDeprecatedEmailAction"));
__export(require("./mutableDeprecatedSNSAction"));
__export(require("./mutableDeprecatedWebhookAction"));
// export * from './notification';
__export(require("./splunkEventPayload"));
__export(require("./webhookAction"));
__export(require("./webhookActionMutable"));
var action_1 = require("./action");
var actionCommon_1 = require("./actionCommon");
var actionMutable_1 = require("./actionMutable");
var actionMutableCommon_1 = require("./actionMutableCommon");
var actionResult_1 = require("./actionResult");
var deprecatedAction_1 = require("./deprecatedAction");
var deprecatedActionCommon_1 = require("./deprecatedActionCommon");
var deprecatedActionMutable_1 = require("./deprecatedActionMutable");
var deprecatedActionMutableCommon_1 = require("./deprecatedActionMutableCommon");
var deprecatedEmailAction_1 = require("./deprecatedEmailAction");
var deprecatedSNSAction_1 = require("./deprecatedSNSAction");
var deprecatedWebhookAction_1 = require("./deprecatedWebhookAction");
var emailAction_1 = require("./emailAction");
var emailActionMutable_1 = require("./emailActionMutable");
var modelError_1 = require("./modelError");
var mutableDeprecatedEmailAction_1 = require("./mutableDeprecatedEmailAction");
var mutableDeprecatedSNSAction_1 = require("./mutableDeprecatedSNSAction");
var mutableDeprecatedWebhookAction_1 = require("./mutableDeprecatedWebhookAction");
// import { Notification } from './notification';
var splunkEventPayload_1 = require("./splunkEventPayload");
var webhookAction_1 = require("./webhookAction");
var webhookActionMutable_1 = require("./webhookActionMutable");
/* tslint:disable:no-unused-variable */
var primitives = ['string', 'boolean', 'double', 'integer', 'long', 'float', 'number', 'any'];
var enumsMap = {
    'Action.KindEnum': action_1.Action.KindEnum,
    'ActionCommon.KindEnum': actionCommon_1.ActionCommon.KindEnum,
    'ActionResult.StateEnum': actionResult_1.ActionResult.StateEnum,
    'DeprecatedAction.KindEnum': deprecatedAction_1.DeprecatedAction.KindEnum,
    'DeprecatedActionCommon.KindEnum': deprecatedActionCommon_1.DeprecatedActionCommon.KindEnum,
    'DeprecatedEmailAction.KindEnum': deprecatedEmailAction_1.DeprecatedEmailAction.KindEnum,
    'DeprecatedSNSAction.KindEnum': deprecatedSNSAction_1.DeprecatedSNSAction.KindEnum,
    'DeprecatedWebhookAction.KindEnum': deprecatedWebhookAction_1.DeprecatedWebhookAction.KindEnum,
    'EmailAction.KindEnum': emailAction_1.EmailAction.KindEnum,
    // 'Notification.KindEnum': Notification.KindEnum,
    'WebhookAction.KindEnum': webhookAction_1.WebhookAction.KindEnum,
};
var typeMap = {
    Action: action_1.Action,
    ActionCommon: actionCommon_1.ActionCommon,
    ActionMutable: actionMutable_1.ActionMutable,
    ActionMutableCommon: actionMutableCommon_1.ActionMutableCommon,
    ActionResult: actionResult_1.ActionResult,
    DeprecatedAction: deprecatedAction_1.DeprecatedAction,
    DeprecatedActionCommon: deprecatedActionCommon_1.DeprecatedActionCommon,
    DeprecatedActionMutable: deprecatedActionMutable_1.DeprecatedActionMutable,
    DeprecatedActionMutableCommon: deprecatedActionMutableCommon_1.DeprecatedActionMutableCommon,
    DeprecatedEmailAction: deprecatedEmailAction_1.DeprecatedEmailAction,
    DeprecatedSNSAction: deprecatedSNSAction_1.DeprecatedSNSAction,
    DeprecatedWebhookAction: deprecatedWebhookAction_1.DeprecatedWebhookAction,
    EmailAction: emailAction_1.EmailAction,
    EmailActionMutable: emailActionMutable_1.EmailActionMutable,
    ModelError: modelError_1.ModelError,
    MutableDeprecatedEmailAction: mutableDeprecatedEmailAction_1.MutableDeprecatedEmailAction,
    MutableDeprecatedSNSAction: mutableDeprecatedSNSAction_1.MutableDeprecatedSNSAction,
    MutableDeprecatedWebhookAction: mutableDeprecatedWebhookAction_1.MutableDeprecatedWebhookAction,
    // Notification,
    SplunkEventPayload: splunkEventPayload_1.SplunkEventPayload,
    WebhookAction: webhookAction_1.WebhookAction,
    WebhookActionMutable: webhookActionMutable_1.WebhookActionMutable,
};
var ObjectSerializer = /** @class */ (function () {
    function ObjectSerializer() {
    }
    ObjectSerializer.findCorrectType = function (data, expectedType) {
        if (data === undefined) {
            return expectedType;
        }
        else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        }
        else if (expectedType === 'Date') {
            return expectedType;
        }
        else {
            if (enumsMap[expectedType]) {
                return expectedType;
            }
            if (!typeMap[expectedType]) {
                return expectedType; // w/e we don't know the type
            }
            // Check the discriminator
            var discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty === null) {
                return expectedType; // the type does not have a discriminator. use it.
            }
            else {
                if (data[discriminatorProperty]) {
                    var discriminatorType = data[discriminatorProperty];
                    if (typeMap[discriminatorType]) {
                        return discriminatorType; // use the type given in the discriminator
                    }
                    else {
                        return expectedType; // discriminator did not map to a type
                    }
                }
                else {
                    return expectedType; // discriminator was not present (or an empty string)
                }
            }
        }
    };
    ObjectSerializer.serialize = function (data, type) {
        if (data === undefined) {
            return data;
        }
        else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        }
        else if (type.lastIndexOf('Array<', 0) === 0) {
            // string.startsWith pre es6
            var subType = type.replace('Array<', ''); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            var transformedData = [];
            for (var index in data) {
                var date = data[index];
                transformedData.push(ObjectSerializer.serialize(date, subType));
            }
            return transformedData;
        }
        else if (type === 'Date') {
            return data.toISOString();
        }
        else {
            if (enumsMap[type]) {
                return data;
            }
            if (!typeMap[type]) {
                // in case we dont know the type
                return data;
            }
            // Get the actual type of this object
            type = this.findCorrectType(data, type);
            // get the map for the correct type.
            var attributeTypes = typeMap[type].getAttributeTypeMap();
            var instance = {};
            for (var index in attributeTypes) {
                var attributeType = attributeTypes[index];
                instance[attributeType.baseName] = ObjectSerializer.serialize(data[attributeType.name], attributeType.type);
            }
            return instance;
        }
    };
    ObjectSerializer.deserialize = function (data, type) {
        // polymorphism may change the actual type.
        type = ObjectSerializer.findCorrectType(data, type);
        if (data === undefined) {
            return data;
        }
        else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        }
        else if (type.lastIndexOf('Array<', 0) === 0) {
            // string.startsWith pre es6
            var subType = type.replace('Array<', ''); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            var transformedData = [];
            for (var index in data) {
                var date = data[index];
                transformedData.push(ObjectSerializer.deserialize(date, subType));
            }
            return transformedData;
        }
        else if (type === 'Date') {
            return new Date(data);
        }
        else {
            if (enumsMap[type]) {
                // is Enum
                return data;
            }
            if (!typeMap[type]) {
                // dont know the type
                return data;
            }
            var instance = new typeMap[type]();
            var attributeTypes = typeMap[type].getAttributeTypeMap();
            for (var index in attributeTypes) {
                var attributeType = attributeTypes[index];
                instance[attributeType.name] = ObjectSerializer.deserialize(data[attributeType.baseName], attributeType.type);
            }
            return instance;
        }
    };
    return ObjectSerializer;
}());
exports.ObjectSerializer = ObjectSerializer;
var HttpBasicAuth = /** @class */ (function () {
    function HttpBasicAuth() {
        this.username = '';
        this.password = '';
    }
    HttpBasicAuth.prototype.applyToRequest = function (requestOptions) {
        requestOptions.auth = {
            username: this.username,
            password: this.password,
        };
    };
    return HttpBasicAuth;
}());
exports.HttpBasicAuth = HttpBasicAuth;
var ApiKeyAuth = /** @class */ (function () {
    function ApiKeyAuth(location, paramName) {
        this.location = location;
        this.paramName = paramName;
        this.apiKey = '';
    }
    ApiKeyAuth.prototype.applyToRequest = function (requestOptions) {
        if (this.location === 'query') {
            requestOptions.qs[this.paramName] = this.apiKey;
        }
        else if (this.location === 'header' && requestOptions && requestOptions.headers) {
            requestOptions.headers[this.paramName] = this.apiKey;
        }
    };
    return ApiKeyAuth;
}());
exports.ApiKeyAuth = ApiKeyAuth;
var OAuth = /** @class */ (function () {
    function OAuth() {
        this.accessToken = '';
    }
    OAuth.prototype.applyToRequest = function (requestOptions) {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers.Authorization = "Bearer " + this.accessToken;
        }
    };
    return OAuth;
}());
exports.OAuth = OAuth;
var VoidAuth = /** @class */ (function () {
    function VoidAuth() {
        this.username = '';
        this.password = '';
    }
    VoidAuth.prototype.applyToRequest = function (_) {
        // Do nothing
    };
    return VoidAuth;
}());
exports.VoidAuth = VoidAuth;
//# sourceMappingURL=models.js.map