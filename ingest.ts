/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import BaseApiService from './baseapiservice';
import { QueryArgs } from './client';
import { INGEST_SERVICE_PREFIX } from './service_prefixes';

/**
 * Encapsulates Ingest service endpoints
 */
export class IngestService extends BaseApiService {
    /**
     * Create a structured event to be ingested by Splunk SSC via Ingest service.
     * @param event
     */
    public createEvent = (event: Event): Promise<any> => {
        return this.client.post(this.client.buildPath(INGEST_SERVICE_PREFIX, ['events']), event)
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Create structured events to be ingested by Splunk SSC via Ingest service.
     * @param events
     */
    public createEvents = (events: Event[]): Promise<any> => {
        return this.client.post(this.client.buildPath(INGEST_SERVICE_PREFIX, ['events']), IngestService.eventsToJSONs(events))
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Create unstructured event data to be ingested by Splunk SSC via Ingest service.
     * @param event
     */
    public createRawEvent = (event: Event): Promise<any> => { // TODO: may want to support other types, like string and object
        const queryParams: QueryArgs = {};
        // Convert event properties to a flat object of keys and JSON stringified values, omitting the "event"
        // key which will be the body of the POST
        Object.keys(event).forEach((key: string) => {
            if (key !== 'event') {
                queryParams[key] = event[key];
            }
        });
        return this.client.post(this.client.buildPath(INGEST_SERVICE_PREFIX, ['raw']), event.event, queryParams)
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Create metrics to be ingested by Splunk SSC.
     * @param metrics
     */
    public createMetrics = (metrics: MetricEvent[]): Promise<any> => {
        return this.client.post(this.client.buildPath(INGEST_SERVICE_PREFIX, ['metrics']), metrics)
            .then(response => response.Body)
            .then(responseBody => responseBody);
    }

    /**
     * Create an Ingest service-compatible string consisting of concatenated JSON events.
     */
    private static eventsToJSONs(events: Event[]): string {
        // Convert Objects to JSON strings and concatenate them together
        return events.map(evt => JSON.stringify(evt)).join('');
    }
}

/**
 * Event - a Splunk event accepted by Ingest service.
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
    event: string | object;

    [key: string]: any;
}

/**
 * Fields - key/value pairs for inclusion in Ingest service events.
 */
interface Fields {
    [key: string]: string;
}

/**
 * MetricEvent - Common payload to specify multiple related Splunk metrics.
 * @property attributes Default attributes for related Splunk metrics.
 * @property body Specify multiple related metrics e.g. Memory, CPU etc.
 * @property host The host value to assign to the event data. This is typically the hostname of the client from which you're sending data.
 * @property id Optional ID uniquely identifies the metric data. It is used to deduplicate the data if same data is set multiple times. If ID is not specified, it will be assigned by the system.
 * @property nanos Optional nanoseconds part of the timestamp (integer).
 * @property source The source value to assign to the event data. For example, if you're sending data from an app you're developing, you could set this key to the name of the app.
 * @property sourcetype The sourcetype value to assign to the event data.
 * @property timestamp Epoch time in milliseconds (integer).
 */
interface MetricEvent {
    attributes: MetricAttributes;
    body: Metric[];
    host: string;
    source: string;
    sourcetype: string;
    timestamp: number;
    id?: string;
    nanos?: number;
}

/**
 * MetricAttributes - Default attributes for related Splunk metrics.
 * @property If set, individual Metrics will inherit these dimensions and can override any/all of them.
 * @property If set, individual Metrics will inherit this type and can optionally override.
 * @property If set, individual Metrics will inherit this unit and can optionally override.
 */
interface MetricAttributes {
    defaultDimension?: object;
    defaultType?: string;
    defaultUnit?: string;
}

/**
 * Metric - Specify individual metric data.
 * @property Dimensions allow metrics to be classified e.g. {"Server":"nginx", "Region":"us-west-1", ...}
 * @property Name of the metric e.g. CPU, Memory etc.
 * @property Type of metric. Default is g for gauge.
 * @property Unit of the metric e.g. percent, megabytes, seconds etc.
 * @property Value of the metric.
 */
interface Metric {
    dimensions: object;
    name: string;
    type: string;
    unit: string;
    value: number;
}
