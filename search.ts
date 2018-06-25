/* eslint-disable no-restricted-syntax */
import { Observable } from 'rxjs/Observable';
import BaseApiService from './baseapiservice';
import { SEARCH_SERVICE_PREFIX } from './common/service_prefixes';

export class SplunkSearchCancelError extends Error {
}

/**
 * @private
 */
function* iterateBatches(func: (s: number, b: number) => Promise<object>, batchSize: number, max: number): IterableIterator<Promise<object>> {
    let start = 0;
    while (start < max) {
        yield func(start, batchSize);
        start += batchSize;
    }
}

/**
 * A base for an easy-to-use search interface
 */
export class Search {
    private client: SearchService;
    private sid: string;
    private isCancelling: boolean;
    /**
     * @private
     */
    constructor(service: SearchService, sid: string) {
        this.client = service;
        this.sid = sid;
        this.isCancelling = false;
    }

    /**
     * Returns the status of the search job
     */
    status(): Promise<object> {
        return this.client.getJob(this.sid);
    }

    /**
     * Polls the job until it is done processing
     */
    wait(updateInterval: number, statusCallback: (job: Job) => null): Promise<any> {
        const self = this;
        return this.client.waitForJob(this.sid, updateInterval, statusCallback)
            .catch(err => {
                if (self.isCancelling && err.code === 404) {
                    throw new SplunkSearchCancelError("Search has been cancelled");
                } else {
                    throw err;
                }
            });
    }

    /**
     * Submits a cancel job against this search job
     */
    cancel(): Promise<object> {
        this.isCancelling = true;
        return this.client.createJobControlAction(this.sid, "cancel");
    }

    /**
     * Pauses this search job
     */
    pause(): Promise<object> {
        return this.client.createJobControlAction(this.sid, "pause");
    }

    /**
     * Resets the time to live on this search job
     */
    touch(): Promise<object> {
        return this.client.createJobControlAction(this.sid, "touch");
    }

    /**
     * Returns the results from a search as a (promised) array. If 'args.offset'
     * is supplied, a window of results will be returned.  If an offset is not
     * supplied, all results will be fetched and concatenated.
     */
    getResults(args: { batchSize?: number, offset?: number }): Promise<Array<object>> {
        // eslint-disable-next-line no-param-reassign
        args = args || {};
        args.batchSize = args.batchSize || 30;
        const self = this;
        return self.status()
            .then(async (job) => {
                if (args.offset != null) {
                    return self.client.getResults(self.sid, args)
                        .then(response => response.results);
                }
                const fetcher = (start) => self.client.getResults(self.sid, Object.assign({}, args, { offset: start }));
                const iterator = iterateBatches(fetcher, batchSize, job.eventCount);
                let results = [];
                for (const batch of iterator) {
                    // eslint-disable-next-line no-await-in-loop
                    const data = await batch
                    results = Array.concat(results, data.results);
                }
                return results;
            });
    }

    /**
     * Returns an observable that will poll the job and return results, updating
     * until the job is final. If offset and batchSize are specified in the
     * args, this method will return that window of results.  If neither are
     * specified (or only batchSize is specified), all results available will
     * be fetched.
     * @param {object} [args]
     * @param {number} [args.pollInterval]
     * @param {number} [args.offset]
     * @param {number} [args.batchSize]
     * @returns {Observable}
     */
    resultObservable(args) {
        const self = this;
        // eslint-disable-next-line no-param-reassign
        args = args || {};
        const pollInterval = args.pollInterval || 500; // Increasing the default
        return Observable.create(observable => {
            const promises = [];
            self.wait(pollInterval, (job: Job) => {
                if (job.eventCount > 0) { // Passes through arguments, so has the same semantics of offset == window
                    promises.push(self.getResults(args).then(results => observable.next(results)));
                }
            }).then(() => {
                Promise.all(promises).then(() => observable.complete());
            });
        });
    }

    // TODO: Remove this misnamed function in next major release
    /**
     * Returns an Rx.Observable that will return events from the
     * job when it is done processing
     * @deprecated
     * @param {Object} [attrs]
     * @param {string} [attrs.batchSize] Number of events to fetch per call
     * @returns Observable
     */
    eventObserver(attrs) {
        console.log('eventObserver has been renamed to eventObservable.  This function will be removed in the next release');
        return this.eventObservable(attrs);
    }

    /**
     * Returns an Rx.Observable that will return events from the
     * job when it is done processing
     * @param {Object} [attrs]
     * @param {number} [attrs.batchSize] Number of events to fetch per call
     * @returns Observable
     */
    eventObservable(attrs) {
        const self = this;
        const args = attrs || {};
        const batchSize = args.batchSize || 30;

        return Observable.create(async observable => {
            const job = await self.client.waitForJob(self.sid);
            const fetchEvents = (start) => self.client.getEvents(self.sid, start, batchSize);
            const batchIterator = iterateBatches(fetchEvents, batchSize, job.eventCount);
            for (const promise of batchIterator) {
                // eslint-disable-next-line no-await-in-loop
                const batch = await promise;
                batch.results.forEach(e => observable.next(e));
            }
            observable.complete();
        });
    }

    statusObservable(updateInterval) {
        return new Observable<Job>((observable) => {
            this.wait(updateInterval, (job) => observable.next(job))
                .then(() => observable.complete(), (err: Error) => observable.error(err))
        })
    }

}

/**
 * Encapsulates search endpoints
 */
class SearchService extends BaseApiService {
    // TODO:(dp) this should _not_ be an object return type.
    /**
     * Get details of all current searches.
     */
    getJobs(jobArgs: object): Promise<Array<Job>> { // TODO: Flesh out JobsRequest
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs)
            .then(o => o as Array<Job>);
    }

    // TODO:(dp) this should _not_ be a string return type.
    // TODO:(dp) In JS, having this as a one-off string worked.  In TypeScript, I don't want to
    // plumb through everything as a string or object, so I'm breaking the rule of proxying the
    // endpoints directly as the new API will follow the rule of returning an object
    /**
     * Dispatch a search and return the newly created search job
     * @param jobArgs {SearchService~PostJobsRequest}
     * @return {Promise<string>}
     */
    createJob(jobArgs?: object): Promise<Job> {
        const self = this;
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs)
            .then((sid) => self.getJob(sid));
    }

    // TODO:(dp) response is undefined in yaml spec
    /**
     * Returns the job resource with the given `id`.
     */
    getJob(jobId: string): Promise<Job> {
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]))
            .then(o => o as Job);
    }

    // TODO:(dp) response should not be a string
    /**
     */
    createJobControlAction(jobId: string, action: { action: string }): Promise<any> {  // TODO: Flesh out what this returns
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'control']), { action });
    }

    // TODO:(dp) Handle other terminals other than DONE (when I figure out what they are)
    /**
     */
    waitForJob(jobId: string, pollInterval?: number, callback?: (job: Job) => any) {
        const self = this;
        const interval = pollInterval || 250;
        return new Promise<Job>((resolve, reject) => {
            this.getJob(jobId).then(job => {
                if (callback) {
                    callback(job);
                }
                if (job.dispatchState === 'DONE') {
                    resolve(job);
                } else if (job.dispatchState === 'FAILED') {
                    const error = new Error("Job failed");
                    // error.job = job; // TODO: Make this a better error where we can highlight what went wrong.
                    reject(error);
                } else {
                    setTimeout(() => {
                        resolve(self.waitForJob(jobId, interval, callback)); // Resolving with a promise which will then resolve- recursion with the event loop
                    }, pollInterval);
                }
            }).catch(err => reject(err));
        });
    }

    /**
     * Returns results for the search job corresponding to "id".
     * Returns results post-transform, if applicable.
     */
    getResults(jobId: string, args: { offset?: number, count?: number }): Promise<{ results: Array<object> }> { // TODO: Flesh out the results type
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'results']), args)
            .then(o => o as { results: Array<object> })
    }

    /**
     * Returns events for the search job corresponding to "id".
     *         Returns results post-transform, if applicable.
     */
    getEvents(jobId: string, args?: { offset?: number, count?: number }) { // TODO: this has changed in dev
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'events']), args);
    }

    /**
     * Delete the search job with the given `id`, cancelling the search if it is running.
     */
    deleteJob(jobId: string): Promise<any> {
        return this.client.delete(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]));
    }

    /**
     * Submits a search job and wraps the response in an object
     * for easier further processing.
     */
    submitSearch(searchArgs: PostJobsRequest): Promise<Search> {
        const self = this;
        return this.createJob(searchArgs)
            .then(job => new Search(self, job.sid));
    }

}

/**
 * create a new search
 */
interface PostJobsRequest {
    /**
     * Use one of the following search modes. [ verbose | fast | smart ]
     */
    adhocSearchLevel?: SearchLevel;

    /**
     * Specify a time string. Sets the earliest (inclusive), respectively,  time bounds for  the search
     */
    earliestTime?: string;

    /**
     * Specify a time string. Sets the latest (exclusive), respectively,  time bounds for the search.
     */
    latestTime?: string;

    /**
     * The number of events that can be accessible in any given status bucket.
     */
    maxCount?: number;

    /**
     * The number of seconds to run this search before finalizing. Specify 0 to never finalize.
     */
    maxTime?: number;

    /**
     * current system time Specify a time string to set the absolute time used for any relative time specifier in the search. Defaults to the current system time.
     */
    now?: string;

    /**
     * Search Query
     */
    query: string;

    /**
     * The most status buckets to generate.
     */
    statusBuckets?: number;

    /**
     * Used to convert a formatted time string from {start,end}_time into UTC seconds. The default value is the ISO-8601 format.
     */
    timeFormat?: string;

    /**
     * The number of seconds to keep this search after processing has stopped.
     */
    timeout?: number;

}

enum SearchLevel {
    VERBOSE,
    FAST,
    SMART,
}

interface Job { // TODO: not in spec
    dispatchState: string; // TODO: enum
    eventCount: number;
    sid: string;

}

interface PostJobsRequest {
    count?: number;
    offset?: number;
    search?: string;
}

interface JobControlAction {
    action: string;
    ttl?: number;
}

interface FetchResultsRequest {
    count?: number;
    offset?: number;
    f?: string;
    search?: string;
}

interface FetchEventsRequest {
    /**
     * The maximum number of results to return. If value is set to 0, then all available results are returned.
     */
    count?: number;

    /**
     * The first result (inclusive) from which to begin returning data. This value is 0-indexed. Default value is 0.
     */
    offset?: number;

    /**
     * A field to return for the event set.
     */
    f?: string;

    /**
     * The post processing search to apply to results. Can be any valid search language string.
     */
    search?: string;

    /**
     * A time string representing the earliest (inclusive), respectively, time bounds for the results to be returned. If not specified, the range applies to all results found.
     */
    earliestTime?: string;

    /**
     * A time string representing the latest (exclusive), respectively,
     * time bounds for the results to be returned. If not specified, the
     * range applies to all results found.
     */
    latestTime?: string;

    /**
     * The maximum lines that any single event _raw field should contain.
     * Specify 0 to specify no limit.
     */
    maxLines?: number;

    /**
     * The type of segmentation to perform on the data. This includes an
     * option to perform k/v segmentation.
     */
    segmentation?: string;

    /**
     * Expression to convert a formatted time string from {start,end}_time
     * into UTC seconds.
     */
    timeFormat?: string;
}
