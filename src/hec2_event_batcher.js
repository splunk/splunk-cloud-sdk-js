/**
 * Provides the ability to keep a growing number of events queued up and sends them to HEC.
 * The events are flushed on a periodic interval or when the set capacity has been reached.
 *
 * @param {HEC2Service} hec2 - Proxies for the HEC2 APIs
 * @param {int} batchSize - Size of events in bytes
 * @param {int} batchCount - Number of events
 * @param {int} timeout - Interval (milliseconds) to send the events and flush the queue
 */
class EventBatcher {

    constructor(hec2, batchSize, batchCount, timeout) {
        this.hec2 = hec2;
        this.batchSize = batchSize;
        this.batchCount = batchCount;
        this.timeout = timeout;
        this.queue = [];
        this.timerId = this.setTimer();
    }

    /**
     * Add a new event to the array, sends all the events if the event limits are met.
     *
     * @param {HEC2Service~Event} event - a single event or group of events
     * @return {Promise<HEC2Service~Response>}
     */
    add(event) {
        this.queue.push(event);
        return this.run();
    }

    /**
     * Creates a periodic task to send all the events.
     *
     * @return {int} timerId - unique id of the timer created
     * @private
     */
    setTimer() {
        return setTimeout(() => {
            if (this.queue.length > 0) {
                this.flush();
            }
        }, this.timeout)
    }

    /**
     * Reset the timer, update the timerId.
     * @private
     */
    resetTimer() {
        this.stop();
        this.timerId = this.setTimer();
    }

    /**
     * Clean up the events and timer.
     *
     * @return {Promise<HEC2Service~Response>}
     */
    flush() {
        const data = this.queue;
        this.queue = [];
        this.resetTimer();
        return this.hec2.createEvents(data);
    }

    /**
     * Process the events in the queue, sends them to HEC when the queue limits are met or exceeded.
     * If the events are sent a Promise will be returned, otherwise the event will be queue until the limit is reached.
     * A timer will run periodically to ensure that events don't stay queued too long.
     *
     * @return {Promise<HEC2Service~Response>} - can return null if event has not been sent yet.
     * @private
     */
    run() {
        const maxCountReached = (this.queue.length >= this.batchCount);
        const eventByteSize = Buffer.byteLength(JSON.stringify(this.queue), "utf8");

        if (maxCountReached || eventByteSize >= this.batchSize) {
            return this.flush();
        }
        return null;
    }

    /**
     * Stop the timer
     */
    stop() {
        clearTimeout(this.timerId);
    }

}

module.exports = EventBatcher;
