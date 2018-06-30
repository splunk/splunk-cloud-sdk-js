import { Observable } from 'rxjs/Observable';
import BaseApiService from './baseapiservice';
import { QueryArgs } from "./client";
import { Event } from "./ingest";
import {SEARCH_SERVICE_PREFIX} from "./service_prefixes";

export class SplunkSearchCancelError extends Error {
}

/**
 * @private
 */
function* iterateBatches(func: (s: number, b: number) => Promise<object>, batchSize: number, max: number)
    : IterableIterator<Promise<any>> {
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
     */
    constructor(service: SearchService, sid: string) {
        this.client = service;
        this.sid = sid;
        this.isCancelling = false;
    }

    /**
     * Returns the status of the search job
     */
    public status(): Promise<object> {
        return this.client.getJob(this.sid);
    }

    /**
     * Polls the job until it is done processing
     */
    public wait(updateInterval: number, statusCallback: (job: Job) => any): Promise<any> {
        const self = this;
        return this.client.waitForJob(this.sid, updateInterval, statusCallback)
            .catch((err: Error) => {
                if (self.isCancelling /* TODO: fix && job.sid. === 404 */) {
                    throw new SplunkSearchCancelError("Search has been cancelled");
                } else {
                    throw err;
                }
            });
    }

    /**
     * Submits a cancel job against this search job
     */
    public cancel(): Promise<object> {
        this.isCancelling = true;
        return this.client.createJobControlAction(this.sid, Action.CANCEL);
    }

    /**
     * Pauses this search job
     */
    public pause(): Promise<object> {
        return this.client.createJobControlAction(this.sid, Action.PAUSE);
    }

    /**
     * Resets the time to live on this search job
     */
    public touch(): Promise<object> {
        return this.client.createJobControlAction(this.sid, Action.TOUCH);
    }

    /**
     * Returns the results from a search as a (promised) array. If 'args.offset'
     * is supplied, a window of results will be returned.  If an offset is not
     * supplied, all results will be fetched and concatenated.
     */
    // TODO: backwardsCompatibleCount
    public getResults(args: FetchResultsRequest = {}): Promise<object[]> {
        const count = args.count = args.count || 30;
        args.offset = args.offset || 0;
        const self = this;
        return self.status()
            .then(async (job: any) => {
                if (args.offset != null) {
                    return self.client.getResults(self.sid, args)
                        .then(response => response.results);
                }
                const fetcher = (start: number) => self.client.getResults(self.sid,(Object as any).assign({}, args, { offset: start }));
                const iterator = iterateBatches(fetcher, count, job.eventCount);
                let results: object[] = [];
                for (const batch of iterator) {
                    const data = await batch;
                    results = results.concat(data.results);
                }
                return results;
            });
    }

    /**
     * Returns an observable that will poll the job and return results, updating
     * until the job is final. If offset and count are specified in the
     * args, this method will return that window of results.  If neither are
     * specified (or only count is specified), all results available will
     * be fetched.
     * @param {object} [args]
     * @param {number} [args.pollInterval]
     * @param {number} [args.offset]
     * @param {number} [args.count]
     * @returns {Observable}
     */
    public resultObservable(args: any = {}): Observable<any> { // TODO: make resultObservableOptions interface
        const self = this;
        const pollInterval = args.pollInterval || 500; // Increasing the default
        return Observable.create((observable: any) => {
            const promises: any[] = [];
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
    // /**
    //  * Returns an Rx.Observable that will return events from the
    //  * job when it is done processing
    //  * @deprecated
    //  * @param {Object} [attrs]
    //  * @param {string} [attrs.count] Number of events to fetch per call
    //  * @returns Observable
    //  */
    // public eventObserver(attrs: object) {
    //     console.log('eventObserver has been renamed to eventObservable.  This function will be removed in the next release');
    //     return this.eventObservable(attrs);
    // }

    /**
     * Returns an Rx.Observable that will return events from the
     * job when it is done processing
     * @param [attrs]
     * @param [attrs.count] Number of events to fetch per call
     * @returns Observable
     */
    public eventObservable(attrs: {count: number} = {count: 30}): Observable<any> { // TODO: eventObservableOptions interface
        const self = this;
        return Observable.create(async (observable: any) => {
            const job = await self.client.waitForJob(self.sid);
            const fetchEvents = (start: number) => self.client.getEvents(self.sid, {count: attrs.count, offset: start});
            const batchIterator = iterateBatches(fetchEvents, attrs.count, job.eventCount);
            for (const promise of batchIterator) {
                const batch: any = await promise;
                batch.results.forEach((e: Event) => observable.next(e));
            }
            observable.complete();
        });
    }

    public statusObservable(updateInterval: number): Observable<Job> {
        return new Observable<Job>((o: any) => {
            this.wait(updateInterval, (job: Job) => o.next(job))
                .then(() => o.complete(), (err: Error) => o.error(err));
        });
    }
}

/**
 * Encapsulates search endpoints
 */
export class SearchService extends BaseApiService {
    // TODO:(dp) this should _not_ be an object return type.
    /**
     * Get details of all current searches.
     */
    public getJobs(jobArgs: any = {}): Promise<Job[]> { // TODO: Flesh out JobsRequest
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs)
            .then((o: object) => o as Job[]);
    }

    // TODO:(dp) this should _not_ be a string return type.
    // TODO:(dp) In JS, having this as a one-off string worked.  In TypeScript, I don't want to
    // plumb through everything as a string or object, so I'm breaking the rule of proxying the
    // endpoints directly as the new API will follow the rule of returning an object
    /**
     * Dispatch a search and return the newly created search job id
     * @param jobArgs {PostJobsRequest}
     * @return {Promise<string>}
     */
    public createJob(jobArgs?: object): Promise<Job["sid"]> {
        const self = this;
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs)
            .then((sid: Job["sid"]) => sid);
    }

    // TODO:(dp) response should not be a string
    /**
     */
    // TODO: support ttl value via JobControlActionRequest
    public createJobControlAction(jobId: string, action: string): Promise<object> {  // TODO: Flesh out what this returns
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'control']), {action});
    }

    // TODO:(dp) response is undefined in yaml spec
    /**
     * Returns the job resource with the given `id`.
     */
    public getJob(jobId: string): Promise<Job> {
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]))
            .then(o => o as Job);
    }

    // TODO:(dp) Handle other terminals other than DONE (when I figure out what they are)
    /**
     */
    public waitForJob(jobId: string, pollInterval?: number, callback?: (job: Job) => object) {
        const self = this;
        const interval = pollInterval || 250;
        return new Promise<Job>((resolve: (job: Job) => void, reject: (error: Error) => void) => {
            this.getJob(jobId).then(job => {
                if (callback) {
                    callback(job);
                }
                if (job.dispatchState === DispatchState.DONE) {
                    resolve(job);
                } else if (job.dispatchState === DispatchState.FAILED) {
                    const error = new Error("Job failed");
                    // error.job = job; // TODO: Make this a better error where we can highlight what went wrong.
                    reject(error);
                } else {
                    setTimeout(() => {
                        // Resolving with a promise which will then resolve- recursion with the event loop
                        self.waitForJob(jobId, interval, callback).then(j => resolve(j));
                    }, interval);
                }
            }).catch(err => reject(err));
        });
    }

    /**
     * Returns results for the search job corresponding to "id".
     * Returns results post-transform, if applicable.
     */
    // TODO: Flesh out the results type
    public getResults(jobId: string, args?: FetchResultsRequest): Promise<{ results: object[] }> {
        const queryArgs: QueryArgs = args || {};
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'results']), queryArgs)
            .then((o: object) => o as { results: object[] });
    }

    /**
     * Returns events for the search job corresponding to "id".
     *         Returns results post-transform, if applicable.
     */
    public getEvents(jobId: string, args?: { offset?: number, count?: number }): Promise<any> {
        const queryArgs: QueryArgs = args || {};
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'events']), queryArgs);
    }

    /**
     * Delete the search job with the given `id`, cancelling the search if it is running.
     */
    public deleteJob(jobId: string): Promise<object> {
        return this.client.delete(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]));
    }

    /**
     * Submits a search job and wraps the response in an object
     * for easier further processing.
     *
     * @param searchArgs arguments for a new search job
     */
    public submitSearch(searchArgs: PostJobsRequest): Promise<Search> {
        const self = this;
        return this.createJob(searchArgs)
            .then(sid => new Search(self, sid));
    }
}

/**
 * create a new search
 */
interface PostJobsRequest {
    /**
     * Use one of the following search modes.
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
     * The module setting for spl parser populate related configures.
     */
    module?: string;

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

export enum SearchLevel {
    VERBOSE = "verbose",
    FAST = "fast",
    SMART = "smart",
}

export interface Job { // TODO: not in spec
    dispatchState: DispatchState; // TODO: enum
    eventCount: number;
    sid: string;
    status: string; // TODO: ??
}

enum DispatchState {
    DONE = 'DONE',
    FAILED = 'FAILED',
}

interface PostJobsRequest {
    count?: number;
    offset?: number;
    search?: string;
}

interface JobControlActionRequest {
    /**
     * Action The control action to execute
     */
    action: Action;
    /**
     * Only accept with action=settl. Change the ttl of the search.
     */
    ttl?: number;
}

enum Action {
    PAUSE = "pause",
    UNPAUSE = "unpause",
    FINALIZE = "finalize",
    CANCEL = "cancel",
    TOUCH = "touch",
    SETTTL = "setttl",
    SETPRIORITY = "setpriority", // TODO: this should need a priority level for JobControlActionRequest
    ENABLEPREVIEW = "enablepreview",
    DISABLEPREVIEW = "disablepreview",
}

interface FetchResultsRequest {
    offset?: number;
    count?: number;
    f?: string;
    search?: string;
    [key: string]: any;
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
