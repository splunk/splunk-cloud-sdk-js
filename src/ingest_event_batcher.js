"use strict";
/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/
exports.__esModule = true;
/**
 * Provides the ability to keep a growing number of events queued up and sends them to HEC.
 * The events are flushed on a periodic interval or when the set capacity has been reached.
 */
var EventBatcher = /** @class */ (function () {
    /**
     * @param ingest - Proxy for the Ingest API
     * @param batchSize - Size of events in bytes
     * @param batchCount - Number of events
     * @param timeout - Interval (milliseconds) to send the events and flush the queue
     */
    function EventBatcher(ingest, batchSize, batchCount, timeout) {
        var _this = this;
        /**
         * Add a new event to the array, sends all the events if the event limits are met.
         *
         * @param event - a single event
         */
        this.add = function (event) {
            _this.queue.push(event);
            return _this.run();
        };
        /**
         * Creates a periodic task to send all the events.
         *
         * @return the timer created
         */
        this.setTimer = function () {
            return setTimeout(function () {
                if (_this.queue.length > 0) {
                    _this.flush();
                }
            }, _this.timeout);
        };
        /**
         * Reset the timer, update the timerId.
         */
        this.resetTimer = function () {
            _this.stop();
            _this.timer = _this.setTimer();
        };
        /**
         * Clean up the events and timer.
         * @return Promise that will be completed when events are accepted by service
         */
        // TODO: This shouldn't be any
        this.flush = function () {
            var data = _this.queue;
            _this.queue = [];
            _this.resetTimer();
            return _this.ingest.createEvents(data);
        };
        /**
         * Process the events in the queue, sends them to HEC when the queue limits are met or exceeded.
         * If the events are sent, a Promise will be returned otherwise the event will be queued until the limit is reached.
         * A timer will run periodically to ensure that events don't stay queued too long.
         *
         * @return can return null if event has not been sent yet.
         */
        this.run = function () {
            var maxCountReached = (_this.queue.length >= _this.batchCount);
            // TODO: is it okay to just import @types/node and call this good?
            var eventByteSize = JSON.stringify(_this.queue).length;
            if (maxCountReached || eventByteSize >= _this.batchSize) {
                return _this.flush();
            }
            return null;
        };
        /**
         * Stop the timer
         */
        this.stop = function () {
            clearTimeout(_this.timer);
        };
        this.ingest = ingest;
        // TODO: set some sane defaults so these 3 can be optional
        this.batchSize = batchSize;
        this.batchCount = batchCount;
        this.timeout = timeout;
        this.queue = [];
        this.timer = this.setTimer();
    }
    return EventBatcher;
}());
exports.EventBatcher = EventBatcher;
//# sourceMappingURL=ingest_event_batcher.js.map