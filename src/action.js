"use strict";
/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var baseapiservice_1 = require("./baseapiservice");
var service_prefixes_1 = require("./service_prefixes");
/**
 * Encapsulates Action service endpoints
 */
var ActionService = /** @class */ (function (_super) {
    __extends(ActionService, _super);
    function ActionService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Get all actions in action service.
         * @returns Promise of all actions
         */
        _this.getActions = function () {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.ACTION_SERVICE_PREFIX, ['actions']))
                .then(function (response) { return response.body; });
        };
        /**
         * Get an action by name
         * @param name name of the action
         * @return Promise of an action
         */
        _this.getAction = function (name) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.ACTION_SERVICE_PREFIX, ['actions', name]))
                .then(function (response) { return response.body; });
        };
        /**
         * Delete an action by name
         * @param name name of the action
         * @return Promise of object
         */
        _this.deleteAction = function (name) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.ACTION_SERVICE_PREFIX, ['actions', name]))
                .then(function (response) { return response.body; });
        };
        /**
         * Create an action
         * @param action input action
         * @return Promise of an action
         */
        _this.createAction = function (action) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.ACTION_SERVICE_PREFIX, ['actions']), action)
                .then(function (response) { return response.body; });
        };
        /**
         * Update an action
         * @param name name of the action
         * @param action action updates
         * @return Promise of an action
         */
        _this.updateAction = function (name, action) {
            return _this.client.patch(_this.client.buildPath(service_prefixes_1.ACTION_SERVICE_PREFIX, ['actions', name]), action)
                .then(function (response) { return response.body; });
        };
        /**
         * Trigger an action
         * @param name name of the action
         * @param notification action notification
         * @return Promise of actionTriggerResponse
         */
        _this.triggerAction = function (name, notification) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.ACTION_SERVICE_PREFIX, ['actions', name]), notification)
                .then(function (response) {
                var key = 'location';
                if (response.headers.has(key)) {
                    var responseStr = response.headers.get(key);
                    if (responseStr != null && responseStr.match('\/status\/')) {
                        var parts = responseStr.split('/status/');
                        if (parts.length === 2) {
                            return Promise.resolve({
                                'StatusID': parts[1],
                                'StatusURL': responseStr
                            });
                        }
                    }
                }
                return response.body;
            });
        };
        /**
         * Get action status
         * @param name name of the action
         * @param statusId statusId
         * @return Promise of actionStatus
         */
        _this.getActionStatus = function (name, statusId) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.ACTION_SERVICE_PREFIX, ['actions', name, 'status', statusId]))
                .then(function (response) { return response.body; });
        };
        return _this;
    }
    return ActionService;
}(baseapiservice_1["default"]));
exports.ActionService = ActionService;
// ActionKind reflects the kinds of actions supported by the Action service
var ActionKind;
(function (ActionKind) {
    ActionKind["email"] = "email";
    ActionKind["webhook"] = "webhook";
    ActionKind["sns"] = "sns";
})(ActionKind || (ActionKind = {}));
// ActionStatusState reflects the status of the action
var ActionStatusState;
(function (ActionStatusState) {
    ActionStatusState["queue"] = "QUEUED";
    ActionStatusState["running"] = "RUNNING";
    ActionStatusState["done"] = "DONE";
    ActionStatusState["failed"] = "FAILED";
})(ActionStatusState || (ActionStatusState = {}));
// ActionNotificationKind defines the types of notifications
var ActionNotificationKind;
(function (ActionNotificationKind) {
    ActionNotificationKind["splunkEvent"] = "splunkEvent";
    ActionNotificationKind["rawJSON"] = "rawJSON";
})(ActionNotificationKind || (ActionNotificationKind = {}));
//# sourceMappingURL=action.js.map