/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import { Event, IngestResponse, IngestService } from './ingest';

interface PromiseInternal<T> {
    resolve: (r: T) => void;
    reject: (err: Error) => void;
}

/**
 * Provides the ability to keep a growing number of events queued up and sends them to HEC.
 * The events are flushed on a periodic interval or when the set capacity has been reached.
 */
export class EventBatcher {
    private ingest: IngestService;
    // Ingest service has a kinesis internal limit, ~1MiB 1048576 bytes
    private readonly batchSize: number = 1040000;
    private readonly batchCount: number;
    private readonly timeout: number;
    private queue: Event[];
    private timer: any;
    private promiseQueue: Array<PromiseInternal<IngestResponse>>;

    /**
     * @param ingest - Proxy for the Ingest API
     * @param batchSize - Size of events in bytes
     * @param batchCount - Number of events
     * @param timeout - Interval (milliseconds) to send the events and flush the queue
     */

    constructor(ingest: IngestService, batchSize: number, batchCount: number, timeout: any) {
        this.ingest = ingest;
        if (batchSize > 1040000) {
            this.batchSize = 1040000;
        } else {
            this.batchSize = batchSize;
        }
        // TODO: set some sane defaults so these 2 can be optional
        this.batchCount = batchCount;
        this.timeout = timeout;
        this.queue = [];
        this.timer = this.setTimer();
        this.promiseQueue = [];
    }

    /**
     * Add a new event to the array, sends all the events if the event limits are met.
     *
     * @param event - a single event
     */
    public add = (event: Event): Promise<IngestResponse> => {
        this.queue.push(event);
        return this.run();
    }

    /**
     * Creates a periodic task to send all the events.
     *
     * @return the timer created
     */
    private setTimer = (): any => {
        return setTimeout(() => {
            if (this.queue.length > 0) {
                return this.flush();
            }
        }, this.timeout);
    }

    /**
     * Reset the timer, update the timerId.
     */
    private resetTimer = () => {
        this.stopTimer();
        this.timer = this.setTimer();
    }

    /**
     * Clean up the events and timer.
     * @return Promise that will be completed when events are accepted by service
     */
    public flush = (): Promise<IngestResponse> => {
        this.resetTimer();
        const data = this.queue;
        this.queue = [];
        const promises = this.promiseQueue;
        this.promiseQueue = [];
        this.resetTimer();
        return this.ingest.postEvents(data)
            .then(response => {
                promises.forEach(p => p.resolve(response));
                return response;
            }, err => {
                promises.forEach(p => p.reject(err));
                throw err;
            });
    }

    /**
     * Process the events in the queue, sends them to HEC when the queue limits are met or exceeded.
     * If the events are sent, a Promise will be returned otherwise the event will be queued until the limit is reached.
     * A timer will run periodically to ensure that events don't stay queued too long.
     *
     * @return can return null if event has not been sent yet.
     */
    private run = (): Promise<IngestResponse> => {
        const maxCountReached = (this.queue.length >= this.batchCount);
        // TODO: is it okay to just import @types/node and call this good?
        const eventByteSize = JSON.stringify(this.queue).length;

        if (maxCountReached || eventByteSize >= this.batchSize) {
            return this.flush();
        }
        const promise = new Promise<IngestResponse>((resolve, reject) => this.promiseQueue.push({
            resolve,
            reject
        }));
        return promise;
    }

    /**
     * Perform flush operation if queue is non-empty
     */
    public stop = (): Promise<IngestResponse|{}> => {
        this.stopTimer();
        if (this.queue !== undefined && this.queue.length > 0) {
            return this.flush();
        }
        return Promise.resolve('Queue is empty, all events flushed');
    }

    /**
     * Stop the timer
     */
    private stopTimer = () => {
        clearTimeout(this.timer);
    }

}
