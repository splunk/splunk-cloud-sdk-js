/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import { Observable } from 'rxjs';
import BaseApiService from './baseapiservice';
import { QueryArgs, SplunkError } from './client';
import { SEARCH_SERVICE_PREFIX, SERVICE_CLUSTER_MAPPING } from './service_prefixes';

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

const _filterObject = (template: {[key: string]: any}, propertiesToRemove: string[]) : object => {
    const newObj: {[key: string] : { value: any }} = {};
    for (const key in template) {
        if (propertiesToRemove.indexOf(key) === -1) {
            newObj[key] = template[key];
        }
    }
    return newObj;
};

/**
 * A base for an easy-to-use search interface
 */
export class Search {
    private client: SearchService;
    public readonly jobId: SearchJob['sid'];
    private isCancelling: boolean;
    private resultObservableMemo?: Observable<any>;
    private statusObservableMemo?: Observable<SearchJob>;
    /**
     *
     * @param searchService
     * @param jobId
     */
    constructor(searchService: SearchService, jobId: string) {
        this.client = searchService;
        this.jobId = jobId;
        this.isCancelling = false;
    }

    /**
     * Returns the status of the search job
     * @return search job status description
     */
    public status = (): Promise<SearchJob> => {
        return this.client.getJob(this.jobId);
    }

    /**
     * Polls the job until it is done processing
     * @param updateInterval
     * @param statusCallback
     * @return search job status description
     */
    public wait = (updateInterval?: number, statusCallback?: (job: SearchJob) => any): Promise<SearchJob> => {
        const self = this;
        return this.client.waitForJob(this.jobId, updateInterval, statusCallback)
            .catch((err: Error) => {
                if (self.isCancelling && 'code' in err) {
                    const splunkErr = err as SplunkError;
                    if (splunkErr.httpStatusCode === 404) {
                        throw new SplunkSearchCancelError('Search has been canceled');
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
        return this.client.updateJob(this.jobId, { status: UpdateJobStatus.CANCELED });
    }

    /**
     * Returns the results from a search as a (promised) array. If 'args.offset'
     * is supplied, a window of results will be returned.  If an offset is not
     * supplied, all results will be fetched and concatenated.
     * @param args
     * @return A list of event objects
     */
    // TODO: backwardsCompatibleCount
    public getResults = (args: { count?: number, offset?: number } = {}): Promise<object> => {
        const count = args.count = args.count || 30;
        args.offset = args.offset || 0;
        const self = this;
        return self.status()
            .then(async (job: any) => {
                if (args.offset !== null) {
                    return self.client.listResults(self.jobId, args);
                    // .then(response => response.results);
                }
                const fetcher = (start: number) => self.client.listResults(self.jobId, (Object as any).assign({}, args, { offset: start }));
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
        if (!this.resultObservableMemo) {
            const self = this;
            const pollInterval = args.pollInterval || 500;
            const filteredArgs = _filterObject(args, ['pollInterval']);
            this.resultObservableMemo = Observable.create((observable: any) => {
                const promises: Array<Promise<any>> = [];
                self.wait(pollInterval, (job: SearchJob) => {
                    if (job.resultsAvailable && job.resultsAvailable > 0) { // Passes through arguments, so has the same semantics of offset == window
                        promises.push(self.getResults(filteredArgs).then(results => observable.next(results)));
                    }
                }).then(() => {
                    Promise.all(promises).then(() => observable.complete(), (err) => observable.error(err));
                });
            });
        }
        return this.resultObservableMemo as Observable<any>;
    }

    /**
     * A utility method that will return an Rx.Observable which will supply
     * status updates at a supplied interval until the job is ready.
     * @param updateInterval interval (in ms) at which to poll
     * @return An observable that will periodically poll for status on a job until it is complete
     */
    public statusObservable = (updateInterval: number): Observable<SearchJob> => {
        if (!this.statusObservableMemo) {
            this.statusObservableMemo = new Observable<SearchJob>((o: any) => {
                this.wait(updateInterval, (job: SearchJob) => o.next(job))
                    .then(() => o.complete(), (err: Error) => o.error(err));
            });
        }
        return this.statusObservableMemo;
    }
}

/**
 * Encapsulates search endpoints
 */
export class SearchService extends BaseApiService {
    /**
     * Get the matching list of search jobs.
     */
    public listJobs = (jobArgs: any = {}): Promise<SearchJob[]> => { // TODO: Flesh out JobsRequest
        return this.client.get(SERVICE_CLUSTER_MAPPING.search, this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs)
            .then(response => response.body as SearchJob[]);
    }

    /**
     * Creates a new SearchJob
     * @param jobArgs Arguments for the new search
     * @return
     */
    public createJob = (jobArgs: SearchArgs): Promise<SearchJob> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.search, this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs)
            .then(response => response.body as SearchJob);
    }


    /**
     * Returns the job resource with the given `id`.
     * @param jobId
     * @return Description of job
     */
    public getJob = (jobId: string): Promise<SearchJob> => {
        return this.client.get(SERVICE_CLUSTER_MAPPING.search, this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]))
            .then(response => response.body as SearchJob);
    }

    /**
     * action is applied to search job
     * @param jobId
     * @param update
     */
    public updateJob = (jobId: string, update: UpdateJob): Promise<UpdateJobResponse> => {
        return this.client.patch(SERVICE_CLUSTER_MAPPING.search, this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]), update)
            .then(response => response.body as UpdateJobResponse);
    }

    /**
     * Polls the service until the job is ready, then resolves returned promise
     * with the final job description (as found from `getJob`).
     * @param jobId
     * @param pollInterval in ms
     * @param callback optional function that will be called on every poll result
     */
    public waitForJob = (jobId: string, pollInterval?: number, callback?: (job: SearchJob) => object): Promise<SearchJob> => {
        const self = this;
        const interval = pollInterval || 500;
        return new Promise<SearchJob>((resolve: (job: SearchJob) => void, reject: (error: Error) => void) => {
            this.getJob(jobId).then(job => {
                if (callback) {
                    callback(job);
                }
                if (job.status === DispatchState.DONE) {
                    resolve(job);
                } else if (job.status === DispatchState.FAILED) {
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
     * Get {search_id} search results.
     */
    public listResults = (jobId: string, args: FetchResultsRequest = {}): Promise<SearchResults | ResultsNotReadyResponse> => {
        const queryArgs: QueryArgs = args || {};
        return this.client.get(SERVICE_CLUSTER_MAPPING.search, this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'results']), { query: queryArgs })
            .then(response => {
                if (typeof response.body === 'object') {
                    if ('results' in response.body) {
                        return response.body as SearchResults;
                    }
                    return response.body as ResultsNotReadyResponse;
                }
                throw new SplunkError({ message: `Unexpected response: ${response.body}` });
            });
    }

    /**
     * Submits a search job and wraps the response in an object
     * for easier further processing.
     *
     * @param searchArgs arguments for a new search job
     * @return a wrapper utility object for the search
     */
    public submitSearch = (searchArgs: SearchArgs): Promise<Search> => {
        const self = this;
        return this.createJob(searchArgs)
            .then(job => {
                return new Search(self, job.sid);
            });
    }
}

export enum DispatchState {
    DONE = 'done',
    FAILED = 'failed',
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

/**
 * Represents parameters on the search job mainly earliest and latest.
 */
export interface QueryParameters {
    /**
     * The earliest time in absolute or relative format to retrieve events  (only supported if the query supports time-ranges)
     * Default: "-24h@h"
     */
    earliest?: string;

    /**
     * The latest time in absolute or relative format to retrieve events  (only supported if the query supports time-ranges)
     * Default: "now"
     */
    latest?: string;

}

/**
 * Arguments for creating a search
 */
export interface SearchArgs {
    /**
     * Should SplunkD produce all fields (including those not explicitly mentioned in the SPL).
     * Default: false
     */
    extractAllFields?: boolean;

    /**
     * The number of seconds to run this search before finalizing.
     * Min: 1, Max: 21600, Default: 3600
     */
    maxTime?: number;

    /**
     * The module to run the search in.
     * Default: ""
     */
    module?: string;

    /**
     * parameters for the search job mainly earliest and latest.
     */
    queryParameters?: QueryParameters;

    /**
     * The SPL query string (in SPLv2)
     */
    query: string;

    /**
     * Converts a formatted time string from {start,end}_time into UTC seconds. The default value is the ISO-8601 format.
     */
    timeFormat?: string;

    /**
     * The System time at the time the search job was created. Specify a time string to set  the absolute time used for any relative time specifier in the search. Defaults to the current system time when the Job is created.
     */
    timeOfSearch?: string;

}

/**
 * Properties allowed (and possibly required) in fully constructed Searchjobs in POST payloads and responses
 */
export interface SearchJob {
    /**
     * Determine whether the Search service extracts all available fields in the data, including fields not mentioned in the SPL for the search job. Set to 'false' for better search peformance.
     * Default: false
     */
    extractAllFields?: boolean;

    /**
     * The number of seconds to run this search before finalizing.
     * Min: 1, Max: 21600, Default: 3600
     */
    maxTime?: number;

    /**
     * The module to run the search in.
     * Default: ""
     */
    module?: string;

    /**
     * Represents parameters on the search job such as 'earliest' and 'latest'.
     */
    queryParameters?: QueryParameters;

    /**
     * The SPL query string.
     */
    query: string;

    /**
     * Converts a formatted time string from {start,end}_time into UTC seconds. The default value is the ISO-8601 format.
     */
    timeFormat?: string;

    /**
     * The System time at the time the search job was created. Specify a time string to set  the absolute time used for any relative time specifier in the search. Defaults to the current system time when the Job is created.
     */
    timeOfSearch?: string;

    messages?: SearchJobMessage[];

    /**
     * An estimate of how far through the job is complete
     */
    percentComplete?: number;

    /**
     * The number of results Splunkd produced so far
     */
    resultsAvailable?: number;

    /**
     * The id assigned to the job
     */
    sid: string;

    /**
     * The current status of the job
     */
    status?: string;
}

export enum UpdateJobStatus {
    CANCELED = 'canceled',
    FINALIZED = 'finalized'
}

/**
 * Update a search job with a status.
 */
export interface UpdateJob {
    /**
     * Status to be patched to an existing search job
     */
    status: UpdateJobStatus;
}

/*
 * Response payload of a update job.
 */ 
export interface UpdateJobResponse {
    messages: SearchJobMessage[];
}
/**
 * Response when job results are not yet ready.
 */
export interface ResultsNotReadyResponse {
    nextLink: string;
    wait: string;
}

export enum messageTypes {
    Info = 'INFO',
    Debug = 'INFO',
    Fatal = 'FATAL',
    Error = 'ERROR'
}

/*
 * The message field in search results or search jobs.
 */
export interface SearchJobMessage {
    text?: string;
    type?: messageTypes;
}

/*
 * Results of a search job
 */
export interface SearchResults {
    messages: SearchJobMessage[];
    results: object[];
    fields: string[];
}

