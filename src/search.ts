/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import { Observable } from 'rxjs';
import BaseApiService from './baseapiservice';
import { QueryArgs, SplunkError } from './client';
import { Event } from './ingest';
import { SEARCH_SERVICE_PREFIX } from './service_prefixes';

export class SplunkSearchCancelError extends Error {
}

/**
 * @private
 */
function* iterateBatches(func: (s: number, b: number) => Promise<object>, batchSize: number, max: number)
    : Iterable<Promise<any>> {
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
    private readonly sid: Job['sid'];
    private isCancelling: boolean;

    /**
     *
     * @param searchService
     * @param sid
     */
    constructor(searchService: SearchService, sid: Job['sid']) {
        this.client = searchService;
        this.sid = sid;
        this.isCancelling = false;
    }

    /**
     * Returns the status of the search job
     * @return search job status description
     */
    public status = (): Promise<Job> => {
        return this.client.getJob(this.sid);
    }

    /**
     * Polls the job until it is done processing
     * @param updateInterval
     * @param statusCallback
     * @return search job status description
     */
    public wait = (updateInterval: number, statusCallback: (job: Job) => any): Promise<Job> => {
        const self = this;
        return this.client.waitForJob(this.sid, updateInterval, statusCallback)
            .catch((err: Error) => {
                if (self.isCancelling && 'code' in err) {
                    const splunkErr = err as SplunkError;
                    if (splunkErr.errorParams.httpStatusCode === 404) {
                        throw new SplunkSearchCancelError('Search has been cancelled');
                    } else {
                        throw err;
                    }
                } else {
                    throw err;
                }
            });
    }

    /**
     * Submits a cancel job against this search job
     * @return A promise that will be resolved when the cancel action is accepted by the service
     */
    public cancel = (): Promise<object> => {
        this.isCancelling = true;
        return this.client.createJobControlAction(this.sid, Action.CANCEL);
    }

    /**
     * Resets the time to live on this search job
     * @return A promise that will be resolved when the touch action is accepted by the service
     */
    public touch = (): Promise<object> => {
        return this.client.createJobControlAction(this.sid, Action.TOUCH);
    }

    /**
     * Returns the results from a search as a (promised) array. If 'args.offset'
     * is supplied, a window of results will be returned.  If an offset is not
     * supplied, all results will be fetched and concatenated.
     * @param args
     * @return A list of event objects
     */
    // TODO: backwardsCompatibleCount
    public getResults = (args: FetchResultsRequest = {}): Promise<object[]> => {
        const count = args.count = args.count || 30;
        args.offset = args.offset || 0;
        const self = this;
        return self.status()
            .then(async (job: any) => {
                if (args.offset != null) {
                    return self.client.getResults(self.sid, args)
                        .then(response => response.results);
                }
                const fetcher = (start: number) => self.client.getResults(self.sid, (Object as any).assign({}, args, { offset: start }));
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
     * @param args
     * @return An observable that will pass each result object as it is received
     */
    public resultObservable = (args: ResultObservableOptions = {}): Observable<any> => {
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

    /**
     * Returns an Rx.Observable that will return events from the
     * job when it is done processing
     * @return An observable that will pass each event object as it is received
     */
    public eventObservable = (attrs: EventObservableOptions = {}): Observable<any> => {
        const self = this;
        const count = attrs.count || 30;
        return Observable.create(async (observable: any) => {
            const job = await self.client.waitForJob(self.sid);
            const fetchEvents = (start: number) => self.client.getEvents(self.sid, { count: attrs.count, offset: start });
            const batchIterator = iterateBatches(fetchEvents, count, job.eventCount);
            for (const promise of batchIterator) {
                const batch: any = await promise;
                batch.results.forEach((e: Event) => observable.next(e));
            }
            observable.complete();
        });
    }

    /**
     * A utility method that will return an Rx.Observable which will supply
     * status updates at a supplied interval until the job is ready.
     * @param updateInterval interval (in ms) at which to poll
     * @return An observable that will periodically poll for status on a job until it is complete
     */
    public statusObservable = (updateInterval: number): Observable<Job> => {
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
    /**
     * Get details of all current searches.
     */
    public getJobs = (jobArgs: any = {}): Promise<Job[]> => { // TODO: Flesh out JobsRequest
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs)
            .then(response => response.body as Job[]);
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
    public createJob = (jobArgs?: object): Promise<Job['sid']> => {
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs)
            .then(response => response.body as string);
    }

    public createJobControlAction = (jobId: string, action: string): Promise<object> => {  // TODO: Flesh out what this returns
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'control']), { action })
            .then(response => response.body as object);
    }

    /**
     * Returns the job resource with the given `id`.
     * @param jobId
     * @return Description of job
     */
    public getJob = (jobId: string): Promise<Job> => {
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]))
            .then(response => response.body as Job);
    }

    /**
     * Polls the service until the job is ready, then resolves returned promise
     * with the final job description (as found from `getJob`).
     * @param jobId
     * @param pollInterval in ms
     * @param callback optional function that will be called on every poll result
     */
    public waitForJob = (jobId: Job['sid'], pollInterval?: number, callback?: (job: Job) => object): Promise<Job> => {
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
                    const error = new Error('Job failed');
                    // error.job = job; // TODO: Make this a better error where we can highlight what went wrong.
                    reject(error);
                } else {
                    setTimeout(() => {
                        // Resolving with a promise which will then resolve- recursion with the event loop
                        self.waitForJob(jobId, interval, callback).then(resolve);
                    }, interval);
                }
            }).catch(reject);
        });
    }

    /**
     * Returns results for the search job corresponding to "id".
     * Returns results post-transform, if applicable.
     */
    // TODO: Flesh out the results type
    public getResults = (jobId: string, args: FetchResultsRequest = {}): Promise<{ results: object[] }> => {
        const queryArgs: QueryArgs = args || {};
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'results']), queryArgs)
            .then(response => response.body as { results: object[] });
    }

    /**
     * Returns events for the search job corresponding to "id".
     *         Returns results post-transform, if applicable.
     * @return an array of event objects
     */
    public getEvents = (jobId: string, args?: { offset?: number, count?: number }): Promise<any> => {
        const queryArgs: QueryArgs = args || {};
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'events']), queryArgs)
            .then(response => response.body);
    }

    /**
     * Delete the search job with the given `id`, cancelling the search if it is running.
     * @return Promise that will be resolved when the job has been deleted
     */
    public deleteJob = (jobId: string): Promise<object> => {
        return this.client.delete(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]))
            .then(response => response.body as object);
    }

    /**
     * Submits a search job and wraps the response in an object
     * for easier further processing.
     *
     * @param searchArgs arguments for a new search job
     * @return a wrapper utility object for the search
     */
    public submitSearch = (searchArgs: PostJobsRequest): Promise<Search> => {
        const self = this;
        return this.createJob(searchArgs)
            .then(sid => new Search(self, sid));
    }
}

/**
 * create a new search
 */
export interface PostJobsRequest {
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
     * The Module to run the search in.
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
    VERBOSE = 'verbose',
    FAST = 'fast',
    SMART = 'smart',
}

export interface Job { // TODO: not in spec
    dispatchState: DispatchState; // TODO: enum
    eventCount: number;
    sid: string;
    status: string; // TODO: ??
}

export enum DispatchState {
    DONE = 'DONE',
    FAILED = 'FAILED',
}

export interface PostJobsRequest {
    count?: number;
    offset?: number;
    search?: string;
}

export interface JobControlActionRequest {
    /**
     * Action The control action to execute
     */
    action: Action;
    /**
     * Only accept with action=settl. Change the ttl of the search.
     */
    ttl?: number;
}

export enum Action {
    FINALIZE = 'finalize',
    CANCEL = 'cancel',
    TOUCH = 'touch',
    SETTTL = 'setttl',
    SETPRIORITY = 'setpriority', // TODO: this should need a priority level for JobControlActionRequest
    ENABLEPREVIEW = 'enablepreview',
    DISABLEPREVIEW = 'disablepreview',
}

export interface FetchResultsRequest {
    offset?: number;
    count?: number;
    f?: string;
    search?: string;
    [key: string]: any;
}

export interface ResultObservableOptions {
    pollInterval?: number;
    offset?: number;
    count?: number;
}

export interface EventObservableOptions {
    /**
     * Number of events to fetch per call
     */
    count?: number;
}

export interface FetchEventsRequest {
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
