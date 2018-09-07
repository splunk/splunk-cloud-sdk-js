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
 * Encapsulates Ingest service endpoints
 */
var IngestService = /** @class */ (function (_super) {
    __extends(IngestService, _super);
    function IngestService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Create structured events to be ingested by Splunk Cloud via Ingest service.
         * @param events
         * @return promise that will be resolved when the ingest service has accepted the events for indexing
         */
        _this.createEvents = function (events) {
            return _this.client.post(_this.client.buildPath('/ingest/v2', ['events']), events)
                .then(function (response) { return response.body; });
        };
        /**
         * Create metrics to be ingested by Splunk Cloud.
         * @param metrics
         * @return promise that will be resolved when the ingest service has accepted the metrics for indexing
         */
        _this.createMetrics = function (metrics) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.INGEST_SERVICE_PREFIX, ['metrics']), metrics)
                .then(function (response) { return response.body; });
        };
        return _this;
    }
    return IngestService;
}(baseapiservice_1["default"]));
exports.IngestService = IngestService;
//# sourceMappingURL=ingest.js.map