import BaseApiService from './baseapiservice';
import { QueryArgs } from './client';
import { HEC2_SERVICE_PREFIX } from './common/service_prefixes';

/**
 * Encapsulates HEC2 endpoints
 */
export class HEC2Service extends BaseApiService {
    /**
     * Create a structured event to be ingested by Splunk SSC via HEC2.
     */
    public createEvent(event: Event): Promise<any> {
        return this.client.post(this.client.buildPath(HEC2_SERVICE_PREFIX, ['events']), event);
    }

    /**
     * Create structured events to be ingested by Splunk SSC via HEC2.
     */
    public createEvents(events: Event[]): Promise<any> {
        return this.client.post(this.client.buildPath(HEC2_SERVICE_PREFIX, ['events']), HEC2Service.eventsToJSONs(events));
    }

    /**
     * Create unstructured event data to be ingested by Splunk SSC via HEC2.
     */
    public createRawEvent(event: Event): Promise<any> {
        const queryParams: QueryArgs = {};
        // Convert event properties to a flat object of keys and JSON stringified values, omitting the "event"
        // key which will be the body of the POST
        Object.keys(event).forEach((key: string) => {
            if (key !== 'event') {
                queryParams[key] = event[key];
            }
        });
        return this.client.post(this.client.buildPath(HEC2_SERVICE_PREFIX, ['raw']), event.event, queryParams);
    }

    /**
     * Create metrics to be ingested by Splunk SSC.
     * @param metrics
     */
    public createMetrics(metrics: MetricEvent[]): Promise<any> {
        return this.client.post(this.client.buildPath(HEC2_SERVICE_PREFIX, ['metrics']), metrics);
    }

    /**
     * Create a HEC2-compatible string consisting of concatenated JSON events.
     * @return Returns a HEC2-compatible string consisting of concatenated JSON events.
     */
    private static eventsToJSONs(events: Event[]): string {
        // Convert Objects to JSON strings and concatenate them together
        return events.map(evt => JSON.stringify(evt)).join('');
    }
}

/**
 * Event - a Splunk event accepted by HEC2.
 */
export interface Event {
    /**
     * Epoch time in seconds.
     */
    time?: number;
    /**
     * A sourcetype determines how Splunk formats data during the indexing process.
     */
    sourcetype?: string;
    /**
     * A source identifies where the event originated.
     */
    source?: string;
    /**
     * The host name or IP address of the network device that generated the event.
     */
    host?: string;
    /**
     * Index where the event is to be stored.
     */
    index?: string;
    /**
     * Key/value pairs to associate with the event.
     */
    fields?: Fields;
    /**
     * Event Object or string payload.
     */
    event: string|object;

    [key: string]: any;
}

/**
 * Fields - key/value pairs for inclusion in HEC2 events.
 */
interface Fields {
    [key: string]: string;
}

/**
 * MetricEvent - Common payload to specify multiple related Splunk metrics.
 * @typedef {Object} HEC2Service~MetricEvent
 * @property {HEC2Service~MetricAttributes} attributes Default attributes for related Splunk metrics.
 * @property {HEC2Service~Metric[]} body Specify multiple related metrics e.g. Memory, CPU etc.
 * @property {string} host The host value to assign to the event data. This is typically the hostname of the client from which you're sending data.
 * @property {string} id Optional ID uniquely identifies the metric data. It is used to deduplicate the data if same data is set multiple times. If ID is not specified, it will be assigned by the system.
 * @property {number} nanos Optional nanoseconds part of the timestamp (integer).
 * @property {string} source The source value to assign to the event data. For example, if you're sending data from an app you're developing, you could set this key to the name of the app.
 * @property {string} sourcetype The sourcetype value to assign to the event data.
 * @property {number} timestamp Epoch time in milliseconds (integer).
 */
interface MetricEvent {
    attributes: MetricAttributes;
    body: Metric[];
    host: string;
    id?: string;
    nanos?: number;
    source: string;
    sourceType: string;
    timestamp: number;
}

/**
 * MetricAttributes - Default attributes for related Splunk metrics.
 * @typedef {Object} HEC2Service~MetricAttributes
 * @property {Object} defaultDimensions Optional. If set, individual Metrics will inherit these dimensions and can override any/all of them.
 * @property {string} defaultType Optional. If set, individual Metrics will inherit this type and can optionally override.
 * @property {string} defaultUnit Optional. If set, individual Metrics will inherit this unit and can optionally override.
 */
interface MetricAttributes {
    defaultDimension?: object;
    defaultType?: string;
    defaultUnit?: string;
}

/**
 * Metric - Specify individual metric data.
 * @typedef {Object} HEC2Service~Metric
 * @property {Object} dimensions Dimensions allow metrics to be classified e.g. {"Server":"nginx", "Region":"us-west-1", ...}
 * @property {string} name Name of the metric e.g. CPU, Memory etc.
 * @property {string} type Type of metric. Default is g for gauge.
 * @property {string} unit Unit of the metric e.g. percent, megabytes, seconds etc.
 * @property {number} value Value of the metric.
 */
interface Metric {
    dimensions: object;
    name: string;
    type: string;
    unit: string;
    value: number;
}
