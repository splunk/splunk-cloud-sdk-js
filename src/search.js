const BaseApiService = require('./baseapiservice');
const  { SEARCH_SERVICE_PREFIX } = require('./common/service_prefixes');
const { Observable } = require('rxjs/Observable');

/**
 * Encapsulates search endpoints
 */
class SearchService extends BaseApiService {
    // FIXME: this should _not_ be an object return type.
    /**
     * Get details of all current searches.
     * @param jobArgs {SearchService~JobsRequest}
     * @return {Promise<object>}
     */
    getJobs(jobArgs) {
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs);
    }

    // FIXME: this should _not_ be a string return type.
    /**
     * Dispatch a search and return the newly created search job
     * @param jobArgs {SearchService~PostJobsRequest}
     * @return {Promise<string>}
     */
    createJob(jobArgs) {
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs']), jobArgs);
    }

    // FIXME: response is undefined in yaml
    /**
     * Returns the job resource with the given `id`.
     * @param {string} jobId
     * @return {Promise<SearchService~Job>}
     */
    getJob(jobId) {
        return this.client.get(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId]));
    }

    // FIXME: response should not be a string
    /**
     * @param {string} jobId
     * @param {SearchService~JobControlAction} action
     * @return {Promise<string>}
     */
    createJobControlAction(jobId, action) {
        return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'control']), action);
    }

    // FIXME: Can't have a GET with a body
    /**
     * @param {string} jobId
     * @param {SearchService~FetchResultsRequest} resultsRequest
     */
    // getJobResults(jobId, resultsRequest) {
    //     return this.client.post(this.client.buildPath(SEARCH_SERVICE_PREFIX, ['jobs', jobId, 'control']), action);
    // }


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
 * create a new search
 * @typedef {object} SearchService~NewSearchConfig
 * @property {string} [ adhoc_search_level ] Use one of the following search modes. [ verbose | fast | smart ]
 * @property {string} [ earliest_time ] Specify a time string. Sets the earliest (inclusive), respectively,  time bounds for  the search
 * @property {string} [ exec_mode ] blocking | oneshot | normal  If set to normal, runs an asynchronous search. If set to blocking, returns the sid when the job is complete. If set to oneshot, returns results in the same call. In this case, you can specify the format for the output (for example, json output) using the output_mode parameter as described in GET search/jobs/export. Default format for output is xml.
 * @property {string} [ latest_time ] Specify a time string. Sets the latest (exclusive), respectively,  time bounds for the search.
 * @property {number} [ max_count ] The number of events that can be accessible in any given status bucket.
 * @property {number} [ max_time ] The number of seconds to run this search before finalizing. Specify 0 to never finalize.
 * @property {string} [ now ] current system time    Specify a time string to set the absolute time used for any relative time specifier in the search. Defaults to the current system time.
 * @property {string} search Search Query
 * @property {number} [ status_buckets ] The most status buckets to generate.
 * @property {string} [ time_format ] Used to convert a formatted time string from {start,end}_time into UTC seconds. The default value is the ISO-8601 format.
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
  * @property {string} [ earliest_time ] A time string representing the earliest (inclusive), respectively, time bounds for the results to be returned. If not specified, the range applies to all results found. 
  * @property {string} [ latest_time ] A time string representing the latest (exclusive), respectively,
            time bounds for the results to be returned. If not specified, the
            range applies to all results found.
  * @property {number} [ max_lines ] The maximum lines that any single event _raw field should contain.
            Specify 0 to specify no limit.
  * @property {string} [ segmentation ] The type of segmentation to perform on the data. This incudes an
            option to perform k/v segmentation.
  * @property {string} [ time_format ] Expression to convert a formatted time string from {start,end}_time
            into UTC seconds.
  */
module.exports = SearchService;
