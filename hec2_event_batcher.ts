import { Event, HEC2Service } from './hec2';
import Timer = NodeJS.Timer; // TODO: is this an okay import?

/**
 * Provides the ability to keep a growing number of events queued up and sends them to HEC.
 * The events are flushed on a periodic interval or when the set capacity has been reached.
 *
 * @param hec2 - Proxies for the HEC2 APIs
 * @param batchSize - Size of events in bytes
 * @param batchCount - Number of events
 * @param timeout - Interval (milliseconds) to send the events and flush the queue
 */
export class EventBatcher {
    private hec2: HEC2Service;
    private readonly batchSize: number;
    private readonly batchCount: number;
    private readonly timeout: number;
    private queue: Event[];
    private timer: Timer;

    constructor(hec2: HEC2Service, batchSize: number, batchCount: number, timeout: number) {
        this.hec2 = hec2;
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
    public add(event: Event): Promise<object>|null {
        this.queue.push(event);
        return this.run();
    }

    /**
     * Creates a periodic task to send all the events.
     *
     * @return the timer created
     */
    private setTimer(): Timer {
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
        return this.hec2.createEvents(data);
    }

    /**
     * Process the events in the queue, sends them to HEC when the queue limits are met or exceeded.
     * If the events are sent, a Promise will be returned otherwise the event will be queued until the limit is reached.
     * A timer will run periodically to ensure that events don't stay queued too long.
     *
     * @return can return null if event has not been sent yet.
     */
    private run(): Promise<any>|null {
        const maxCountReached = (this.queue.length >= this.batchCount);
        // TODO: is it okay to just import @types/node and call this good?
        const eventByteSize = Buffer.byteLength(JSON.stringify(this.queue), "utf8");

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
