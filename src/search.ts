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

// import { Observable } from 'rxjs';
import { SearchServiceGen } from './generated/search/v2beta1/api';
import * as searchModels from './models/search';

export { searchModels };

// /**
//  * @private
//  */
// function* iterateBatches(func: (s: number, b: number) => Promise<object>, batchSize: number, max: number)
//     : Iterable<Promise<any>> {
//     let start = 0;
//     while (start < max) {
//         yield func(start, batchSize);
//         start += batchSize;
//     }
// }

// const _filterObject = (template: {[key: string]: any}, propertiesToRemove: string[]) : object => {
//     const newObj: {[key: string] : { value: any }} = {};
//     for (const key in template) {
//         if (propertiesToRemove.indexOf(key) === -1) {
//             newObj[key] = template[key];
//         }
//     }
//     return newObj;
// };

// /**
//  * A base for an easy-to-use search interface
//  */
// export class Search {
//     private client: SearchService;
//     public readonly jobId: string;
//     private isCancelling: boolean;
//     private resultObservableMemo?: Observable<any>;
//     private statusObservableMemo?: Observable<searchModels.SearchJobV2Alpha1>;
//     /**
//      *
//      * @param searchService
//      * @param jobId
//      */
//     constructor(searchService: SearchService, jobId: searchModels.SearchJobV2Alpha1['sid']) {
//         this.client = searchService;
//         this.jobId = jobId || '';
//         this.isCancelling = false;
//     }

//     /**
//      * Returns the status of the search job
//      * @return search job status description
//      */
//     public status = (): Promise<searchModels.SearchJobV2Alpha1> => {
//         return this.client.getJob(this.jobId);
//     }

//     /**
//      * Polls the job until it is done processing
//      * @param updateInterval
//      * @param statusCallback
//      * @return search job status description
//      */
//     public wait = (updateInterval?: number, statusCallback?: (job: searchModels.SearchJobV2Alpha1) => any): Promise<searchModels.SearchJobV2Alpha1> => {
//         const self = this;
//         return this.client.waitForJob(this.jobId, updateInterval, statusCallback)
//             .catch((err: Error) => {
//                 if (self.isCancelling && 'code' in err) {
//                     const splunkErr = err as SplunkError;
//                     if (splunkErr.httpStatusCode === 404) {
//                         throw new searchModels.SplunkSearchCancelError('Search has been canceled');
//                     } else {
//                         throw err;
//                     }
//                 } else {
//                     throw err;
//                 }
//             });
//     }

//     /**
//      * Submits a cancel job against this search job
//      * @return A promise that will be resolved when the cancel action is accepted by the service
//      */
//     public cancel = (): Promise<object> => {
//         this.isCancelling = true;
//         return this.client.updateJob(this.jobId, { status: searchModels.UpdateJobStatusEnum.Canceled });
//     }

//     /**
//      * Returns the results from a search as a (promised) array. If 'args.offset'
//      * is supplied, a window of results will be returned.  If an offset is not
//      * supplied, all results will be fetched and concatenated.
//      * @param args
//      * @return A list of event objects
//      */
//     public getResults = (args: searchModels.FetchResultsRequest = {}): Promise<object> => {
//         const count = args.count = args.count || 0;
//         args.offset = args.offset || 0;
//         const self = this;
//         return self.status()
//             .then(async (job: any) => {
//                 if (args.offset !== null) {
//                     return self.client.listResults(self.jobId, args);
//                     // .then(response => response.results);
//                 }
//                 const fetcher = (start: number) => self.client.listResults(self.jobId, (Object as any).assign({}, args, { offset: start }));
//                 const iterator = iterateBatches(fetcher, count, job.eventCount);
//                 let results: object[] = [];
//                 for (const batch of iterator) {
//                     const data = await batch;
//                     results = results.concat(data.results);
//                 }
//                 return results;
//             });
//     }

//     /**
//      * Returns an observable that will poll the job and return results, updating
//      * until the job is final. If offset and count are specified in the
//      * args, this method will return that window of results.  If neither are
//      * specified (or only count is specified), all results available will
//      * be fetched.
//      * @param args
//      * @return An observable that will pass each result object as it is received
//      */
//     public resultObservable = (args: searchModels.ResultObservableOptions = {}): Observable<any> => {
//         if (!this.resultObservableMemo) {
//             const self = this;
//             const pollInterval = args.pollInterval || 500;
//             const filteredArgs = _filterObject(args, ['pollInterval']);
//             this.resultObservableMemo = Observable.create((observable: any) => {
//                 const promises: Array<Promise<any>> = [];
//                 return self.wait(pollInterval, (job: searchModels.SearchJobV2Alpha1) => {
//                     if (job.resultsAvailable && job.resultsAvailable > 0) { // Passes through arguments, so has the same semantics of offset == window
//                         promises.push(self.getResults(filteredArgs).then(results => observable.next(results)));
//                     }
//                 }).then(() => {
//                     Promise.all(promises).then(() => observable.complete(), (err) => observable.error(err));
//                 });
//             });
//         }
//         return this.resultObservableMemo as Observable<any>;
//     }

//     /**
//      * A utility method that will return an Rx.Observable which will supply
//      * status updates at a supplied interval until the job is ready.
//      * @param updateInterval interval (in ms) at which to poll
//      * @return An observable that will periodically poll for status on a job until it is complete
//      */
//     public statusObservable = (updateInterval: number): Observable<searchModels.SearchJobV2Alpha1> => {
//         if (!this.statusObservableMemo) {
//             this.statusObservableMemo = new Observable<searchModels.SearchJobV2Alpha1>((o: any) => {
//                 this.wait(updateInterval, (job: searchModels.SearchJobV2Alpha1) => o.next(job))
//                     .then(() => o.complete(), (err: Error) => o.error(err));
//             });
//         }
//         return this.statusObservableMemo;
//     }
// }

/**
 * Splunk Search Service
 * Use the Search service to dispatch, review, and manage searches and search jobs. You can also finalize or cancel running search jobs, retrieve search results and events, and request search-related configurations from the Metadata Catalog service.
 */
export class SearchService extends SearchServiceGen {
    /**
     * Polls the service until the job is ready, then resolves returned promise
     * with the final job description (as found from `getJob`).
     * @param sid The search ID.
     * @param pollInterval in ms
     * @param callback optional function that will be called on every poll result
     */
    public waitForJob = (sid: string, pollInterval?: number, callback?: (job: searchModels.SearchJob) => object): Promise<searchModels.SearchJob> => {
        const self = this;
        const interval = pollInterval || 500;
        return new Promise<searchModels.SearchJob>((resolve: (job: searchModels.SearchJob) => void, reject: (error: Error) => void) => {
            return this.getJob(sid).then(job => {
                if (callback) {
                    callback(job);
                }
                if (job.status === searchModels.SearchStatus.Done) {
                    resolve(job);
                } else if (job.status === searchModels.SearchStatus.Failed) {
                    const error = new Error('Job failed');
                    // error.job = job; // TODO: Make this a better error where we can highlight what went wrong.
                    reject(error);
                } else {
                    setTimeout(() => {
                        // Resolving with a promise which will then resolve- recursion with the event loop
                        return self.waitForJob(sid, interval, callback).then(resolve, reject);
                    }, interval);
                }
            }).catch(reject);
        });
    }

    // /**
    //  * Submits a search job and wraps the response in an object
    //  * for easier further processing.
    //  *
    //  * @param searchArgs arguments for a new search job
    //  * @return a wrapper utility object for the search
    //  */
    // public submitSearch = (searchArgs: searchModels.SearchJobV2Alpha1): Promise<Search> => {
    //     const self = this;
    //     return this.createJob(searchArgs)
    //         .then(job => {
    //             return new Search(self, job.sid);
    //         });
    // }
}
