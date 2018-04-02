import {ApiProxy} from "./apiproxy"
import {SEARCH_SERVICE_PREFIX} from "./common/constants"
import {buildPath} from "./common/utils"

/**
 * Encapsulates search endpoints
 */
export class SearchProxy extends ApiProxy {
    constructor(client) {
        super(client);
    }

    static buildPostJobRequest(query) {
        return new PostJobsRequestBuilder(query);
    }

    /**
     * Dispatch a search and return the newly created search job
     * @param jobArgs {(object|PostJobsRequest)}
     * @return {Promise<SearchProxy~Job>}
     */
    createJob(jobArgs) {
        return this.client.post(buildPath(SEARCH_SERVICE_PREFIX,'/jobs'), jobArgs);
    }

    /**
     * Dispatch a search and return the newly created search job
     * @param jobArgs {(object|PostJobsRequest)}
     * @return {Promise<string>} The results as a string (concatenated json or CSV)
     */
    createJobSync(jobArgs) {
        return this.client.post(buildPath(SEARCH_SERVICE_PREFIX,'/jobs/sync'), jobArgs);
    }

    /**
     * Returns the job resource with the given `id`.
     * @param {string} jobId
     * @return {Promise<SearchProxy~Job>}
     */
    getJob(jobId) {
        return this.client.get(buildPath(SEARCH_SERVICE_PREFIX,`/jobs/${jobId}`));
    }

    /**
     * Delete the search job with the given `id`, cancelling the search if it is running.
     * @param {string} jobId
     * @return {Promise}
     */
    deleteJob(jobId) {
        return this.client.delete(buildPath(SEARCH_SERVICE_PREFIX,`/jobs/${jobId}`));
    }
}

/**
 * The output format for search results. One of "CSV", "JSON", "JSON_COLS", "JSON_ROWS"
 * @typedef {string} SearchProxy~JobFormat
 */

/**
 * The current status of the search job.
 * One of "QUEUED", "PARSING", "RUNNING", "PAUSED", "FINALIZING", "FAILED", "DONE"
 * @typedef {string} SearchProxy~JobStatus
 */

/**
 * Test Job
 * @typedef {Object} SearchProxy~Job
 * @property {string} id
 * @property {string} query - The SPL query string.
 * @property {number} duration - Time in seconds that the search executed.
 * @property {SearchProxy~JobFormat} format - The output format for search results.
 * @property {number} limit - The number of events to process before the job is automatically finalized. Set to 0 to disable automatic finalization.
 * @property {object} performance - not yet defined
 * @property {number} priority
 * @property {number} progress - A number between 0 and 1.0 that indicates the approximate progress of the search.
 * @property {number} resultCount - The total number of results returned by the search.
 * @property {number} scanCount - The number of events that have been scanned by the search
 * @property {SearchProxy~JobStatus} status
 * @property {number} timeout - Cancel the search after this many seconds of inactivity. Set to 0 to disable timeout.
 * @property {number} ttl - The time, in seconds, after the search has been completed until the search job expires and results are deleted.
 */

/**
 * Request/Response payloads
 * @typedef {Object} SearchProxy~PostJobsRequest
 * @property {string} query - The SPL query string. (Required)
 * @property {SearchProxy~JobFormat} format - Specify the output format for search results. (Default JSON)
 * @property {number} timeout - Cancel the search after this many seconds of inactivity. Set to 0 to disable timeout. (Default 30)
 * @property {number} ttl - The time, in seconds, after the search has completed until the search job expires and results are deleted.
 * @property {number} limit - The number of events to process before the job is automatically finalized. Set to 0 to disable automatic finalization.
 */

class PostJobsRequestBuilder {
    constructor(query) {
        this.query = query;
    }

    withFormat(format) {
        this.format = format;
        return this;
    }

    withTimeout(timeout) {
        this.timeout = timeout;
        return this;
    }

    withTtl(ttl) {
        this.ttl = ttl;
        return this;
    }

    withLimit(limit) {
        this.limit = limit;
        return this;
    }
}
