const BaseApiService = require('./baseapiservice');
const co = require('co');
const { SEARCH_SERVICE_PREFIX } = require('./common/service_prefixes');
const { Observable } = require('rxjs/Observable');

/**
 * A base for an easy-to-use search interface
 */
class Search {
    /**
     * @private
     * @param {*} client 
     * @param {*} sid 
     */
    constructor(client, sid) {
        this.client = client;
        this.sid = sid;
    }

    /**
     * Returns the status of the search job
     * @returns {Promise<object>} job
     */
    status() {
        return this.client.getJob(this.sid);
    }

    /**
     * Polls the job until it is done processing
     * @returns {Promise} done
     */
    wait() {
        return this.client.waitForJob(this.sid);
    }

    /**
     * Submits a cancel job against this search job
     * @returns {Promise} done
     */
    cancel() {
        return this.client.createJobControlAction(this.sid, "cancel");
    }

    /** 
     * Pauses this search job
     * @returns {Promise} done
     */
    pause() {
        return this.client.createJobControlAction(this.sid, "pause");
    }

    /**
     * Resets the time to live on this search job
     * @returns {Promise} done
     */
    touch() {
        return this.client.createJobControlAction(this.sid, "touch");
    }

    /**
     * Returns an Rx.Observable that will return events from the 
     * job when it is done processing
     * @param {Object} [attrs]
     * @param {string} [attrs.batchSize] Number of events to fetch per call
     * @returns Observable
     */
    eventObserver(attrs) {
        const self = this;
        const args = attrs || {};
        const batchSize = args.batchSize || 30;

        return Observable.create(observable => {
            co(function* observe() {
                const job = yield self.client.waitForJob(self.sid);
                const batchIterator = self.client.iterateBatches(job.sid, batchSize, job.eventCount);
                let next = batchIterator.next();
                while (!next.done) {
                    const batch = yield next.value;
                    batch.results.forEach(e => observable.next(e));
                    next = batchIterator.next();
                }
                observable.complete();
            });
        });
    }
}

/**
 * Encapsulates search endpoints
 */
class SearchService extends BaseApiService {
    // TODO:(dp) this should _not_ be an object return type.
    /**
     * Get details of all current searches.
     * @param jobArgs {SearchService~JobsRequest}
     * @return {Promise<object>}
     */
    getJobs(jobArgs) {
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs);
    }

    // TODO:(dp) this should _not_ be a string return type.
    /**
     * Dispatch a search and return the newly created search job
     * @param jobArgs {SearchService~PostJobsRequest}
     * @return {Promise<string>}
     */
    createJob(jobArgs) {
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs);
    }

    // TODO:(dp) response is undefined in yaml spec
    /**
     * Returns the job resource with the given `id`.
     * @param {string} jobId
     * @return {Promise<SearchService~Job>}
     */
    getJob(jobId) {
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]));
    }

    // TODO:(dp) response should not be a string
    /**
     * @param {string} jobId
     * @param {SearchService~JobControlAction} action
     * @return {Promise<string>}
     */
    createJobControlAction(jobId, action) {
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'control']), { action });
    }

    // TODO:(dp) Handle other terminals other than DONE (when I figure out what they are)
    /**
     * @param {string} jobId
     * @param {number} [ pollInterval ]
     * @return {Promise<SearchService~Job>}
     */
    waitForJob(jobId, pollInterval) {
        const self = this;
        const interval = pollInterval || 250;
        return new Promise((resolve) => {
            this.getJob(jobId).then(job => {
                if (job.dispatchState === 'DONE') {
                    resolve(job);
                } else {
                    setTimeout(() => {
                        resolve(self.waitForJob(jobId, interval)); // Resolving with a promise which will then resolve- recursion with the event loop
                    }, pollInterval);
                }
            })
        });
    }

    /**
     * Returns results for the search job corresponding to "id".
     *         Returns results post-transform, if applicable.
     * @param jobId
     * @param {number} [ offset ]
     * @param {number} [ batchSize ]
     * @returns {Promise<object>}
     */
    getResults(jobId, offset, batchSize) {
        const args = {};
        if (offset) {
            args.offset = offset;
        }

        if (batchSize) {
            args.count = batchSize;
        }

        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'results']), args);
    }

    /**
     * Returns events for the search job corresponding to "id".
     *         Returns results post-transform, if applicable.
     * @param jobId
     * @param {number} [ offset ]
     * @param {number} [ batchSize ]
     * @returns {Promise<object>}
     */
    getEvents(jobId, offset, batchSize) {
        const args = {};
        if (offset) {
            args.offset = offset;
        }

        if (batchSize) {
            args.count = batchSize;
        }

        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'events']), args);
    }

    /**
     * Delete the search job with the given `id`, cancelling the search if it is running.
     * @param {string} jobId
     * @return {Promise}
     */
    deleteJob(jobId) {
        return this.client.delete(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]));
    }

    * iterateBatches(jobId, batchSize, max) {
        let start = 0;
        while (start < max) {
            yield this.getEvents(jobId, start, batchSize);
            start += batchSize;
        }
    }

    /**
     * Submits a search job and wraps the response in an object
     * for easier further processing.
     * @param {SearchService~NewSearchConfig} searchArgs 
     * @returns {Promise<Search>} search
     */
    submitSearch(searchArgs) {
        const self = this;
        return this.createJob(searchArgs)
            .then(sid => new Search(self, sid));
    }

}


/**
 * create a new search
 * @typedef {object} SearchService~NewSearchConfig
 * @property {string} [ adhocSearchLevel ] Use one of the following search modes. [ verbose | fast | smart ]
 * @property {string} [ earliestTime ] Specify a time string. Sets the earliest (inclusive), respectively,  time bounds for  the search
 * @property {string} [ latestTime ] Specify a time string. Sets the latest (exclusive), respectively,  time bounds for the search.
 * @property {number} [ maxCount ] The number of events that can be accessible in any given status bucket.
 * @property {number} [ maxTime ] The number of seconds to run this search before finalizing. Specify 0 to never finalize.
 * @property {string} [ now ] current system time    Specify a time string to set the absolute time used for any relative time specifier in the search. Defaults to the current system time.
 * @property {string} query Search Query
 * @property {number} [ statusBuckets ] The most status buckets to generate.
 * @property {string} [ timeFormat ] Used to convert a formatted time string from {start,end}_time into UTC seconds. The default value is the ISO-8601 format.
 * @property {number} [ timeout ] The number of seconds to keep this search after processing has stopped.
 */

/**
  * @typedef {object} SearchService~PostJobsRequest
  * @property {number} [ count ] Maximum number of entries to return. Set value to 0 to get all available entries.
  * @property {number} [ offset ] Index of first item to return.
  * @property {string} [ search ] Response filter, where the response field values are matched against this search expression. eg. search=foo matches on any field with the string foo in the name. 
  */

/**
  * @typedef {object} SearchService~JobControlAction
  * @property {String} Action 'The control action to execute\: pause, unpause, finalize, cancel, touch, setttl, setpriority, enablepreview, disablepreview.'
  * @property {number} [ ttl ] Only accept with action=settl. Change the ttl of the search.
  */

/**
  * @typedef {object} SearchService~FetchResultsRequest
  * @property {number} [ count ] The maximum number of results to return. If value is set to 0, then all available results are returned.
  * @property {number} [ offset ] The first result (inclusive) from which to begin returning data. This value is 0-indexed. Default value is 0.
  * @property {string} [ f ] A field to return for the event set.
  * @property {string} [ search ] The post processing search to apply to results. Can be any valid search language string.
  */

/**
  * @typedef {object} SearchService~FetchEventsRequest
  * @property {number} [ count ] The maximum number of results to return. If value is set to 0, then all available results are returned.
  * @property {number} [ offset ] The first result (inclusive) from which to begin returning data. This value is 0-indexed. Default value is 0.
  * @property {string} [ f ] A field to return for the event set.
  * @property {string} [ search ] The post processing search to apply to results. Can be any valid search language string.
  * @property {string} [ earliestTime ] A time string representing the earliest (inclusive), respectively, time bounds for the results to be returned. If not specified, the range applies to all results found.
  * @property {string} [ latestTime ] A time string representing the latest (exclusive), respectively,
            time bounds for the results to be returned. If not specified, the
            range applies to all results found.
  * @property {number} [ maxLines ] The maximum lines that any single event _raw field should contain.
            Specify 0 to specify no limit.
  * @property {string} [ segmentation ] The type of segmentation to perform on the data. This incudes an
            option to perform k/v segmentation.
  * @property {string} [ timeFormat ] Expression to convert a formatted time string from {start,end}_time
            into UTC seconds.
  */
module.exports = SearchService;
