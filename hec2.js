const BaseApiService = require('./baseapiservice');
const { HEC2_SERVICE_PREFIX } = require('./common/service_prefixes');

/**
 * Encapsulates HEC2 endpoints
 */
class HEC2Service extends BaseApiService {
    /**
     * Create a structured event to be ingested by Splunk SSC via HEC2.
     * @param {Object|HEC2Service~Event} event
     * @return {Promise<HEC2Service~Response>}
     */
    createEvent(event) {
        return this.client.post(this.client.buildPath(HEC2_SERVICE_PREFIX, ['events']), event);
    }

    /**
     * Create structured events to be ingested by Splunk SSC via HEC2.
     * @param {Object|HEC2Events} events
     * @return {Promise<HEC2Service~Response>}
     */
    createEvents(events) {
        return this.client.post(this.client.buildPath(HEC2_SERVICE_PREFIX, ['events']), events.toJSONs());
    }

    /**
     * Create unstructured event data to be ingested by Splunk SSC via HEC2.
     * @param {Object|HEC2Service~Event} eventData
     * @return {Promise<HEC2Service~Response>}
     */
    createRawEvent(event) {
        var queryParams = {};
        // Convert event properties to a flat object of keys and JSON stringified values, omitting the "event"
        // key which will be the body of the POST
        for (var key in event) {
            if (key == 'event')
                continue;
            queryParams[key] = JSON.stringify(event[key]);
        }
        return this.client.post(this.client.buildPath(HEC2_SERVICE_PREFIX, ['raw']), event['event'], queryParams);
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
