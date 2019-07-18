/**
 * Copyright 2019 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { ingestModels, IngestService } from './ingest';

interface PromiseInternal<T> {
    resolve: (r: T) => void;
    reject: (err: Error) => void;
}

/**
 * The default batch size for the EventBatcher.
 */
export const DEFAULT_BATCH_SIZE = 1040000;

/**
 * Provides the ability to keep a growing number of events queued up and sends them to
 * the ingest service.
 * The events are flushed on a periodic interval or when the set capacity has been reached.
 */
export class EventBatcher {
    private ingest: IngestService;
    // Ingest service has a kinesis internal limit, ~1MiB 1048576 bytes
    private readonly batchSize: number = DEFAULT_BATCH_SIZE;
    private readonly batchCount: number;
    private readonly timeout: number;
    private queue: ingestModels.Event[];
    private timer: any;
    private promiseQueue: Array<PromiseInternal<ingestModels.HTTPResponse>>;

    /**
     * @param ingest The proxy for the Ingest service API.
     * @param batchSize The size of events, in bytes.
     * @param batchCount The number of events.
     * @param timeout The interval to send the events and flush the queue, in milliseconds.
     */

    constructor(ingest: IngestService, batchSize: number, batchCount: number, timeout: any) {
        this.ingest = ingest;
        if (batchSize > DEFAULT_BATCH_SIZE) {
            this.batchSize = DEFAULT_BATCH_SIZE;
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
     * Adds a new event to the array and sends all of the events if the event limits are met.
     *
     * @param event A single event.
     */
    public add = (event: ingestModels.Event): Promise<ingestModels.HTTPResponse> => {
        this.queue.push(event);
        return this.run();
    }

    /**
     * Creates a periodic task to send all of the events.
     *
     * @return The timer that was created.
     */
    private setTimer = (): any => {
        return setTimeout(() => {
            if (this.queue.length > 0) {
                return this.flush();
            }
        }, this.timeout);
    }

    /**
     * Resets the timer and updates the timer ID.
     */
    private resetTimer = () => {
        this.stopTimer();
        this.timer = this.setTimer();
    }

    /**
     * Cleans up the events and timer.
     * @return A promise to be completed when the events are accepted by the service.
     */
    public flush = (): Promise<ingestModels.HTTPResponse> => {
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
     * Processes the events in the queue and sends them to the HTTP Event Collector (HEC)
     * when the queue limits are met or exceeded.
     * If the events are sent, a promise is returned. Otherwise, the event is queued until the limit is reached.
     * A timer runs periodically to ensure that events do not stay queued too long.
     *
     * @return `null` if the event has not yet been sent.
     */
    private run = (): Promise<ingestModels.HTTPResponse> => {
        const maxCountReached = (this.queue.length >= this.batchCount);
        // TODO: is it okay to just import @types/node and call this good?
        const eventByteSize = JSON.stringify(this.queue).length;

        if (maxCountReached || eventByteSize >= this.batchSize) {
            return this.flush();
        }
        const promise = new Promise<ingestModels.HTTPResponse>((resolve, reject) => this.promiseQueue.push({
            resolve,
            reject
        }));
        return promise;
    }

    /**
     * Performs a flush operation if the queue is not empty.
     */
    public stop = (): Promise<ingestModels.HTTPResponse|{}> => {
        this.stopTimer();
        if (this.queue !== undefined && this.queue.length > 0) {
            return this.flush();
        }
        return Promise.resolve('Queue is empty, all events flushed');
    }

    /**
     * Stops the timer.
     */
    private stopTimer = () => {
        clearTimeout(this.timer);
    }

}
