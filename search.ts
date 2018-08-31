/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import {Observable} from 'rxjs';
import BaseApiService from './baseapiservice';
import {QueryArgs, SplunkError} from './client';
import {Event} from './ingest';
import {SEARCH_SERVICE_PREFIX} from './service_prefixes';

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
    private readonly sid: string;
    private isCancelling: boolean;

    /**
     *
     * @param searchService
     * @param sid
     */
    constructor(searchService: SearchService, sid: string) {
        this.client = searchService;
        this.sid = sid;
        this.isCancelling = false;
    }

    /**
     * Returns the status of the search job
     * @return search job status description
     */
    public status = (): Promise<SearchJob> => {
        return this.client.getJob(this.sid);
    };

    /**
     * Polls the job until it is done processing
     * @param updateInterval
     * @param statusCallback
     * @return search job status description
     */
    public wait = (updateInterval: number, statusCallback: (job: SearchJob) => any): Promise<SearchJob> => {
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
    };

    /**
     * Submits a cancel job against this search job
     * @return A promise that will be resolved when the cancel action is accepted by the service
     */
    public cancel = (): Promise<object> => {
        this.isCancelling = true;
        return this.client.patchJob(this.sid, {action: 'cancel'});
    };

    /**
     * Resets the time to live on this search job
     * @return A promise that will be resolved when the touch action is accepted by the service
     */
    public touch = (): Promise<object> => {
        return this.client.patchJob(this.sid, {action: 'touch'});
    };

    /**
     * Returns the results from a search as a (promised) array. If 'args.offset'
     * is supplied, a window of results will be returned.  If an offset is not
     * supplied, all results will be fetched and concatenated.
     * @param args
     * @return A list of event objects
     */
        // TODO: backwardsCompatibleCount
    public getResults = (args: FetchResultsRequest = {}): Promise<object> => {
        const count = args.count = args.count || 30;
        args.offset = args.offset || 0;
        const self = this;
        return self.status()
            .then(async (job: any) => {
                if (args.offset != null) {
                    return self.client.getResults(self.sid, args);
                    // .then(response => response.results);
                }
                const fetcher = (start: number) => self.client.getResults(self.sid, (Object as any).assign({}, args, {offset: start}));
                const iterator = iterateBatches(fetcher, count, job.eventCount);
                let results: object[] = [];
                for (const batch of iterator) {
                    const data = await batch;
                    results = results.concat(data.results);
                }
                return results;
            });
    };

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
            self.wait(pollInterval, (job: SearchJob) => {
                if (job.resultsAvailable && job.resultsAvailable > 0) { // Passes through arguments, so has the same semantics of offset == window
                    promises.push(self.getResults(args).then(results => observable.next(results)));
                }
            }).then(() => {
                Promise.all(promises).then(() => observable.complete());
            });
        });
    };

    /**
     * A utility method that will return an Rx.Observable which will supply
     * status updates at a supplied interval until the job is ready.
     * @param updateInterval interval (in ms) at which to poll
     * @return An observable that will periodically poll for status on a job until it is complete
     */
    public statusObservable = (updateInterval: number): Observable<SearchJob> => {
        return new Observable<SearchJob>((o: any) => {
            this.wait(updateInterval, (job: SearchJob) => o.next(job))
                .then(() => o.complete(), (err: Error) => o.error(err));
        });
    }
}

/**
 * Encapsulates search endpoints
 */
export class SearchService extends BaseApiService {
    /**
     * Get the matching list of search jobs.
     */
    public getJobs = (jobArgs: any = {}): Promise<SearchJob[]> => { // TODO: Flesh out JobsRequest
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs)
            .then(response => response.body as SearchJob[]);
    };

    /**
     * Creates a new SearchJob
     * @param jobArgs Arguments for the new search
     * @return
     */
    public createJob = (jobArgs: SearchJobBase): Promise<SearchJob> => {
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs)
            .then(response => response.body as SearchJob);
    };


    /**
     * Returns the job resource with the given `id`.
     * @param jobId
     * @return Description of job
     */
    public getJob = (jobId: string): Promise<SearchJob> => {
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]))
            .then(response => response.body as SearchJob);
    };

    /**
     * action is applied to search job
     * @param jobId
     * @param update
     */
    public patchJob = (jobId: string, update: PatchJob): Promise<object> => {
        return this.client.patch(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]), update)
            .then(response => response.body as object);
    };

    /**
     * Polls the service until the job is ready, then resolves returned promise
     * with the final job description (as found from `getJob`).
     * @param jobId
     * @param pollInterval in ms
     * @param callback optional function that will be called on every poll result
     */
    public waitForJob = (jobId: SearchJob['sid'], pollInterval?: number, callback?: (job: SearchJob) => object): Promise<SearchJob> => {
        const self = this;
        const interval = pollInterval || 250;
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
                        self.waitForJob(jobId, interval, callback).then(j => resolve(j));
                    }, interval);
                }
            }).catch(err => reject(err));
        });
    };

    /**
     * Get {search_id} search results.
     */
        // TODO: Flesh out the results type
    public getResults = (jobId: string, args: FetchResultsRequest = {}): Promise<object> => {
        const queryArgs: QueryArgs = args || {};
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'results']), queryArgs)
            .then(response => response.body as object);
    };

    /**
     * Submits a search job and wraps the response in an object
     * for easier further processing.
     *
     * @param searchArgs arguments for a new search job
     * @return a wrapper utility object for the search
     */
    public submitSearch = (searchArgs: SearchJobBase): Promise<Search> => {
        const self = this;
        return this.createJob(searchArgs)
            .then(job => new Search(self, job.sid));
    }
}

enum DispatchState {
    DONE = 'done',
    FAILED = 'failed',
}

interface FetchResultsRequest {
    offset?: number;
    count?: number;
    f?: string;
    search?: string;

    [key: string]: any;
}

interface ResultObservableOptions {
    pollInterval?: number;
    offset?: number;
    count?: number;
}

/**
 * Represents parameters on the search job mainly earliest and latest.
 */
export interface SearchParameters {
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
 * Properties allowed (and possibly required) in fully constructed Searchjobs in POST payloads and responses
 */
export interface SearchJobBase {
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
    parameters?: SearchParameters;

    /**
     * The SPL query string (in SPLv2)
     */
    query: string;

    /**
     * Used to convert a formatted time string from {start,end}_time into UTC seconds. The default value is the ISO-8601 format.
     */
    timeFormat?: string;

    /**
     * The System time at the time the search job was created. Specify a time string to set  the absolute time used for any relative time specifier in the search. Defaults to the current system time when the Job is created.
     */
    timeOfSearch?: string;

}

/*
FIXME: questions
Will all defined fields be supplied in a SearchJob response?
What are the valid fields for status?
What is the format of the response for /results?
What is the result format of patch job?
 */


/**
 * Fully constructed search job including readonly fields.
 */
interface SearchJob extends SearchJobBase {
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
    status: string;
}

/**
 * Patch a search job with an action.
 */
interface PatchJob {
    /**
     * Action to be taken on an existing search job.
     */
    action: 'cancel' | 'finalize' | 'touch' | 'save';
}

