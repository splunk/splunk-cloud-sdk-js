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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var baseapiservice_1 = require("./baseapiservice");
var service_prefixes_1 = require("./service_prefixes");
var SplunkSearchCancelError = /** @class */ (function (_super) {
    __extends(SplunkSearchCancelError, _super);
    function SplunkSearchCancelError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SplunkSearchCancelError;
}(Error));
exports.SplunkSearchCancelError = SplunkSearchCancelError;
/**
 * @private
 */
function iterateBatches(func, batchSize, max) {
    var start;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                start = 0;
                _a.label = 1;
            case 1:
                if (!(start < max)) return [3 /*break*/, 3];
                return [4 /*yield*/, func(start, batchSize)];
            case 2:
                _a.sent();
                start += batchSize;
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
/**
 * A base for an easy-to-use search interface
 */
var Search = /** @class */ (function () {
    /**
     *
     * @param searchService
     * @param sid
     */
    function Search(searchService, sid) {
        var _this = this;
        /**
         * Returns the status of the search job
         * @return search job status description
         */
        this.status = function () {
            return _this.client.getJob(_this.sid);
        };
        /**
         * Polls the job until it is done processing
         * @param updateInterval
         * @param statusCallback
         * @return search job status description
         */
        this.wait = function (updateInterval, statusCallback) {
            var self = _this;
            return _this.client.waitForJob(_this.sid, updateInterval, statusCallback)["catch"](function (err) {
                if (self.isCancelling && 'code' in err) {
                    var splunkErr = err;
                    if (splunkErr.errorParams.httpStatusCode === 404) {
                        throw new SplunkSearchCancelError('Search has been cancelled');
                    }
                    else {
                        throw err;
                    }
                }
                else {
                    throw err;
                }
            });
        };
        /**
         * Submits a cancel job against this search job
         * @return A promise that will be resolved when the cancel action is accepted by the service
         */
        this.cancel = function () {
            _this.isCancelling = true;
            return _this.client.createJobControlAction(_this.sid, Action.CANCEL);
        };
        /**
         * Resets the time to live on this search job
         * @return A promise that will be resolved when the touch action is accepted by the service
         */
        this.touch = function () {
            return _this.client.createJobControlAction(_this.sid, Action.TOUCH);
        };
        /**
         * Returns the results from a search as a (promised) array. If 'args.offset'
         * is supplied, a window of results will be returned.  If an offset is not
         * supplied, all results will be fetched and concatenated.
         * @param args
         * @return A list of event objects
         */
        // TODO: backwardsCompatibleCount
        this.getResults = function (args) {
            if (args === void 0) { args = {}; }
            var count = args.count = args.count || 30;
            args.offset = args.offset || 0;
            var self = _this;
            return self.status()
                .then(function (job) { return __awaiter(_this, void 0, void 0, function () {
                var e_1, _a, fetcher, iterator, results, iterator_1, iterator_1_1, batch, data, e_1_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (args.offset != null) {
                                return [2 /*return*/, self.client.getResults(self.sid, args)
                                        .then(function (response) { return response.results; })];
                            }
                            fetcher = function (start) { return self.client.getResults(self.sid, Object.assign({}, args, { offset: start })); };
                            iterator = iterateBatches(fetcher, count, job.eventCount);
                            results = [];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, 7, 8]);
                            iterator_1 = __values(iterator), iterator_1_1 = iterator_1.next();
                            _b.label = 2;
                        case 2:
                            if (!!iterator_1_1.done) return [3 /*break*/, 5];
                            batch = iterator_1_1.value;
                            return [4 /*yield*/, batch];
                        case 3:
                            data = _b.sent();
                            results = results.concat(data.results);
                            _b.label = 4;
                        case 4:
                            iterator_1_1 = iterator_1.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_1_1 = _b.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (iterator_1_1 && !iterator_1_1.done && (_a = iterator_1["return"])) _a.call(iterator_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/, results];
                    }
                });
            }); });
        };
        /**
         * Returns an observable that will poll the job and return results, updating
         * until the job is final. If offset and count are specified in the
         * args, this method will return that window of results.  If neither are
         * specified (or only count is specified), all results available will
         * be fetched.
         * @param args
         * @return An observable that will pass each result object as it is received
         */
        this.resultObservable = function (args) {
            if (args === void 0) { args = {}; }
            var self = _this;
            var pollInterval = args.pollInterval || 500; // Increasing the default
            return rxjs_1.Observable.create(function (observable) {
                var promises = [];
                self.wait(pollInterval, function (job) {
                    if (job.eventCount > 0) { // Passes through arguments, so has the same semantics of offset == window
                        promises.push(self.getResults(args).then(function (results) { return observable.next(results); }));
                    }
                }).then(function () {
                    Promise.all(promises).then(function () { return observable.complete(); });
                });
            });
        };
        /**
         * Returns an Rx.Observable that will return events from the
         * job when it is done processing
         * @return An observable that will pass each event object as it is received
         */
        this.eventObservable = function (attrs) {
            if (attrs === void 0) { attrs = {}; }
            var self = _this;
            var count = attrs.count || 30;
            return rxjs_1.Observable.create(function (observable) { return __awaiter(_this, void 0, void 0, function () {
                var e_2, _a, job, fetchEvents, batchIterator, batchIterator_1, batchIterator_1_1, promise, batch, e_2_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, self.client.waitForJob(self.sid)];
                        case 1:
                            job = _b.sent();
                            fetchEvents = function (start) { return self.client.getEvents(self.sid, { count: attrs.count, offset: start }); };
                            batchIterator = iterateBatches(fetchEvents, count, job.eventCount);
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 7, 8, 9]);
                            batchIterator_1 = __values(batchIterator), batchIterator_1_1 = batchIterator_1.next();
                            _b.label = 3;
                        case 3:
                            if (!!batchIterator_1_1.done) return [3 /*break*/, 6];
                            promise = batchIterator_1_1.value;
                            return [4 /*yield*/, promise];
                        case 4:
                            batch = _b.sent();
                            batch.results.forEach(function (e) { return observable.next(e); });
                            _b.label = 5;
                        case 5:
                            batchIterator_1_1 = batchIterator_1.next();
                            return [3 /*break*/, 3];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_2_1 = _b.sent();
                            e_2 = { error: e_2_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (batchIterator_1_1 && !batchIterator_1_1.done && (_a = batchIterator_1["return"])) _a.call(batchIterator_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                            return [7 /*endfinally*/];
                        case 9:
                            observable.complete();
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        /**
         * A utility method that will return an Rx.Observable which will supply
         * status updates at a supplied interval until the job is ready.
         * @param updateInterval interval (in ms) at which to poll
         * @return An observable that will periodically poll for status on a job until it is complete
         */
        this.statusObservable = function (updateInterval) {
            return new rxjs_1.Observable(function (o) {
                _this.wait(updateInterval, function (job) { return o.next(job); })
                    .then(function () { return o.complete(); }, function (err) { return o.error(err); });
            });
        };
        this.client = searchService;
        this.sid = sid;
        this.isCancelling = false;
    }
    return Search;
}());
exports.Search = Search;
/**
 * Encapsulates search endpoints
 */
var SearchService = /** @class */ (function (_super) {
    __extends(SearchService, _super);
    function SearchService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Get details of all current searches.
         */
        _this.getJobs = function (jobArgs) {
            if (jobArgs === void 0) { jobArgs = {}; }
            return _this.client.get(_this.client.buildPath(service_prefixes_1.SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs)
                .then(function (response) { return response.body; });
        };
        // TODO:(dp) this should _not_ be a string return type.
        // TODO:(dp) In JS, having this as a one-off string worked.  In TypeScript, I don't want to
        // plumb through everything as a string or object, so I'm breaking the rule of proxying the
        // endpoints directly as the new API will follow the rule of returning an object
        /**
         * Dispatch a search and return the newly created search job id
         * @param jobArgs {PostJobsRequest}
         * @return {Promise<string>}
         */
        _this.createJob = function (jobArgs) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs)
                .then(function (response) { return response.body; });
        };
        _this.createJobControlAction = function (jobId, action) {
            return _this.client.post(_this.client.buildPath(service_prefixes_1.SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'control']), { action: action })
                .then(function (response) { return response.body; });
        };
        /**
         * Returns the job resource with the given `id`.
         * @param jobId
         * @return Description of job
         */
        _this.getJob = function (jobId) {
            return _this.client.get(_this.client.buildPath(service_prefixes_1.SEARCH_SERVICE_PREFIX, ['jobs', jobId]))
                .then(function (response) { return response.body; });
        };
        /**
         * Polls the service until the job is ready, then resolves returned promise
         * with the final job description (as found from `getJob`).
         * @param jobId
         * @param pollInterval in ms
         * @param callback optional function that will be called on every poll result
         */
        _this.waitForJob = function (jobId, pollInterval, callback) {
            var self = _this;
            var interval = pollInterval || 250;
            return new Promise(function (resolve, reject) {
                _this.getJob(jobId).then(function (job) {
                    if (callback) {
                        callback(job);
                    }
                    if (job.dispatchState === DispatchState.DONE) {
                        resolve(job);
                    }
                    else if (job.dispatchState === DispatchState.FAILED) {
                        var error = new Error('Job failed');
                        // error.job = job; // TODO: Make this a better error where we can highlight what went wrong.
                        reject(error);
                    }
                    else {
                        setTimeout(function () {
                            // Resolving with a promise which will then resolve- recursion with the event loop
                            self.waitForJob(jobId, interval, callback).then(function (j) { return resolve(j); });
                        }, interval);
                    }
                })["catch"](function (err) { return reject(err); });
            });
        };
        /**
         * Returns results for the search job corresponding to "id".
         * Returns results post-transform, if applicable.
         */
        // TODO: Flesh out the results type
        _this.getResults = function (jobId, args) {
            if (args === void 0) { args = {}; }
            var queryArgs = args || {};
            return _this.client.get(_this.client.buildPath(service_prefixes_1.SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'results']), queryArgs)
                .then(function (response) { return response.body; });
        };
        /**
         * Returns events for the search job corresponding to "id".
         *         Returns results post-transform, if applicable.
         * @return an array of event objects
         */
        _this.getEvents = function (jobId, args) {
            var queryArgs = args || {};
            return _this.client.get(_this.client.buildPath(service_prefixes_1.SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'events']), queryArgs)
                .then(function (response) { return response.body; });
        };
        /**
         * Delete the search job with the given `id`, cancelling the search if it is running.
         * @return Promise that will be resolved when the job has been deleted
         */
        _this.deleteJob = function (jobId) {
            return _this.client["delete"](_this.client.buildPath(service_prefixes_1.SEARCH_SERVICE_PREFIX, ['jobs', jobId]))
                .then(function (response) { return response.body; });
        };
        /**
         * Submits a search job and wraps the response in an object
         * for easier further processing.
         *
         * @param searchArgs arguments for a new search job
         * @return a wrapper utility object for the search
         */
        _this.submitSearch = function (searchArgs) {
            var self = _this;
            return _this.createJob(searchArgs)
                .then(function (sid) { return new Search(self, sid); });
        };
        return _this;
    }
    return SearchService;
}(baseapiservice_1["default"]));
exports.SearchService = SearchService;
var SearchLevel;
(function (SearchLevel) {
    SearchLevel["VERBOSE"] = "verbose";
    SearchLevel["FAST"] = "fast";
    SearchLevel["SMART"] = "smart";
})(SearchLevel = exports.SearchLevel || (exports.SearchLevel = {}));
var DispatchState;
(function (DispatchState) {
    DispatchState["DONE"] = "DONE";
    DispatchState["FAILED"] = "FAILED";
})(DispatchState || (DispatchState = {}));
var Action;
(function (Action) {
    Action["FINALIZE"] = "finalize";
    Action["CANCEL"] = "cancel";
    Action["TOUCH"] = "touch";
    Action["SETTTL"] = "setttl";
    Action["SETPRIORITY"] = "setpriority";
    Action["ENABLEPREVIEW"] = "enablepreview";
    Action["DISABLEPREVIEW"] = "disablepreview";
})(Action || (Action = {}));
//# sourceMappingURL=search.js.map