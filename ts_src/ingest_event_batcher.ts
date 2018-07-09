import { Event, IngestService } from './ingest';

/**
 * Provides the ability to keep a growing number of events queued up and sends them to HEC.
 * The events are flushed on a periodic interval or when the set capacity has been reached.
 */
export class EventBatcher {
    private ingest: IngestService;
    private readonly batchSize: number;
    private readonly batchCount: number;
    private readonly timeout: number;
    private queue: Event[];
    private timer: number;

    /**
     * @param ingest - Proxy for the Ingest API
     * @param batchSize - Size of events in bytes
     * @param batchCount - Number of events
     * @param timeout - Interval (milliseconds) to send the events and flush the queue
     */

    constructor(ingest: IngestService, batchSize: number, batchCount: number, timeout: number) {
        this.ingest = ingest;
        // TODO: set some sane defaults so these 3 can be optional
        this.batchSize = batchSize;
        this.batchCount = batchCount;
        this.timeout = timeout;
        this.queue = [];
        this.timer = this.setTimer();
    }

    /**
     * Add a new event to the array, sends all the events if the event limits are met.
     *
     * @param event - a single event
     */
    public add(event: Event): Promise<object> | null {
        this.queue.push(event);
        return this.run();
    }

    /**
     * Creates a periodic task to send all the events.
     *
     * @return the timer created
     */
    private setTimer(): number {
        return setTimeout(() => {
            if (this.queue.length > 0) {
                this.flush();
            }
        }, this.timeout);
    }

    /**
     * Reset the timer, update the timerId.
     */
    private resetTimer() {
        this.stop();
        this.timer = this.setTimer();
    }

    /**
     * Clean up the events and timer.
     */
    public flush(): Promise<any> {
        const data = this.queue;
        this.queue = [];
        this.resetTimer();
        return this.ingest.createEvents(data);
    }

    /**
     * Process the events in the queue, sends them to HEC when the queue limits are met or exceeded.
     * If the events are sent, a Promise will be returned otherwise the event will be queued until the limit is reached.
     * A timer will run periodically to ensure that events don't stay queued too long.
     *
     * @return can return null if event has not been sent yet.
     */
    private run(): Promise<any> | null {
        const maxCountReached = (this.queue.length >= this.batchCount);
        // TODO: is it okay to just import @types/node and call this good?
        const eventByteSize = JSON.stringify(this.queue).length;

        if (maxCountReached || eventByteSize >= this.batchSize) {
            return this.flush();
        }
        return null;
    }

    /**
     * Stop the timer
     */
    public stop() {
        clearTimeout(this.timer);
    }

}
