const BaseApiService = require('./baseapiservice');
const { HEC2_SERVICE_PREFIX } = require('./common/service_prefixes');

/**
 * Encapsulates HEC2 endpoints
 */
class HEC2Service extends BaseApiService {
    /**
     * Send a structured event to be ingested by Splunk SSC via HEC2.
     * @param {Object|HEC2Service~Event} event
     * @return {Promise<HEC2Service~Response>}
     */
    sendEvent(event) {
        return this.client.post(this.client.buildPath(HEC2_SERVICE_PREFIX, ['events']), event);
    }

    /**
     * Send structured events to be ingested by Splunk SSC via HEC2.
     * @param {Object|HEC2Events} events
     * @return {Promise<HEC2Service~Response>}
     */
    sendEvents(events) {
        return this.client.post(this.client.buildPath(HEC2_SERVICE_PREFIX, ['events']), events.toJSONs());
    }
}

/**
 * HEC2 Events 
 */
class HEC2Events {
    constructor() {
        this.events = [];
    }

    /**
     * Add event to this collection.
     * @param {Object|HEC2Service~Event} event HEC2-compatible event
     * @return {HEC2Events}
     */
    add(event) {
        this.events.push(event);
        return this;
    }

    /**
     * Create a HEC2-compatible string consisting of concatenated JSON events.
     * @return {string} Returns a HEC2-compatible string consisting of concatenated JSON events.
     */
    toJSONs() {
        // Convert Objects to JSON strings and concatenate them together
        return this.events.map(function (evt) { return JSON.stringify(evt); }).join("");
    }
}

/**
 * Event - a Splunk event accepted by HEC2.
 * @typedef {Object} HEC2Service~Event
 * @property {number} time Epoch time in seconds.
 * @property {string} sourcetype A sourcetype determines how Splunk formats data during the indexing process.
 * @property {string} source A source identifies where the event originated.
 * @property {string} host The host name or IP address of the network device that generated the event.
 * @property {string} index Index where the event is to be stored.
 * @property {HEC2Service~Fields} fields Key/value pairs to associate with the event.
 * @property {Object|string} event Event Object or string payload.
 */

/**
 * Fields - field key/value pairs for inclusion in HEC2 events.
 * @typedef {Object.<string, string>} HEC2Service~Fields
 */

/**
 * Response - generic response from HEC2 endpoints.
 * @typedef {Object.<string, Object>} HEC2Service~Response
 */

module.exports.HEC2Service = HEC2Service;
module.exports.HEC2Events = HEC2Events;
