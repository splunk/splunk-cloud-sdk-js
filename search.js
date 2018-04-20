'use strict';

const BaseApiService = require('./baseapiservice');
const  { SEARCH_SERVICE_PREFIX } = require('./common/service_prefixes');
const { Observable } = require('rxjs/Observable');

/**
 * Encapsulates search endpoints
 */
class SearchService extends BaseApiService {
    /**
     * Dispatch a search and return the newly created search job
     * @param jobArgs {SearchService~PostJobsRequest}
     * @return {Promise<SearchService~Job>}
     */
    createJob(jobArgs) {
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs);
    }

    /**
     * Dispatch a search and return the newly created search job
     * @param jobArgs {SearchService~PostJobsRequest}
     * @return {Promise<string>} The results as a string (concatenated json or CSV)
     */
    createJobSync(jobArgs) {
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', 'sync']), jobArgs);
    }

    /**
     * Returns the job resource with the given `id`.
     * @param {string} jobId
     * @return {Promise<SearchService~Job>}
     */
    getJob(jobId) {
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]));
    }

    /**
     * Returns results for the search job corresponding to "id".
     *         Returns results post-transform, if applicable.
     * @param jobId
     * @returns {Promise<object>}
     */
    getResults(jobId) {
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'results']));
    }

    /**
     * Delete the search job with the given `id`, cancelling the search if it is running.
     * @param {string} jobId
     * @return {Promise}
     */
    deleteJob(jobId) {
        return this.client.delete(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]));
    }

    /**
     * Performs a search and returns an Observable of
     * Splunk events for the search.
     * @param searchArgs
     * @returns {Observable}
     */
    searchObserver(searchArgs) {
        /* Not actually a sync method, but named as such in the API */
        const promise = this.createJobSync(searchArgs);
        return Observable.create(observable => {
            promise.then(
                data => {
                    /* eslint-disable-next-line no-restricted-syntax */
                    for (const evt of data.results) {
                        observable.next(evt);
                    }
                    observable.complete();
                },
                err => {
                    observable.error(err);
                }
            );
        });
    }
}

/**
 * The output format for search results. One of "CSV", "JSON", "JSON_COLS", "JSON_ROWS"
 * @typedef {string} SearchService~JobFormat
 */

/**
 * The current status of the search job.
 * One of "QUEUED", "PARSING", "RUNNING", "PAUSED", "FINALIZING", "FAILED", "DONE"
 * @typedef {string} SearchService~JobStatus
 */

/**
 * Test Job
 * @typedef {Object} SearchService~Job
 * @property {string} id
 * @property {string} query - The SPL query string.
 * @property {number} duration - Time in seconds that the search executed.
 * @property {SearchService~JobFormat} format - The output format for search results.
 * @property {number} limit
 *  - The number of events to process before the job is automatically finalized.
 *    Set to 0 to disable automatic finalization.
 * @property {object} performance - not yet defined
 * @property {number} priority
 * @property {number} progress
 *  - A number between 0 and 1.0 that indicates the approximate progress of the search.
 * @property {number} resultCount - The total number of results returned by the search.
 * @property {number} scanCount - The number of events that have been scanned by the search
 * @property {SearchService~JobStatus} status
 * @property {number} timeout
 *  - Cancel the search after this many seconds of inactivity. Set to 0 to disable timeout.
 * @property {number} ttl
 *  - The time, in seconds, after the search has been completed
 *    until the search job expires and results are deleted.
 */

/**
 * Request/Response payloads
 * @typedef {Object} SearchService~PostJobsRequest
 * @property {string} query - The SPL query string. (Required)
 * @property {SearchService~JobFormat} format
 *  - Specify the output format for search results. (Default JSON)
 * @property {number} timeout
 *  - Cancel the search after this many seconds of inactivity.
 *    Set to 0 to disable timeout. (Default 30)
 * @property {number} ttl
 *  - The time, in seconds, after the search has completed
 *    until the search job expires and results are deleted.
 * @property {number} limit
 *  - The number of events to process before the job is automatically finalized.
 *    Set to 0 to disable automatic finalization.
 */

module.exports = SearchService;
