/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import BaseApiService from './baseapiservice';
import { INGEST_SERVICE_PREFIX, SERVICE_CLUSTER_MAPPING } from './service_prefixes';

/**
 * Encapsulates Ingest service endpoints
 */
export class IngestService extends BaseApiService {
    /**
     * Post structured events to be ingested by Splunk Cloud via Ingest service.
     * @param events
     * @return promise that will be resolved when the ingest service has accepted the events for indexing
     */
    public postEvents = (events: Event[]): Promise<IngestResponse> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.ingest, this.client.buildPath(INGEST_SERVICE_PREFIX, ['events']), events)
            .then(response => response.body as IngestResponse);
    }

    /**
     * Post metrics to be ingested by Splunk Cloud.
     * @param metrics
     * @return promise that will be resolved when the ingest service has accepted the metrics for indexing
     */
    public postMetrics = (metrics: MetricEvent[]): Promise<IngestResponse> => {
        return this.client.post(SERVICE_CLUSTER_MAPPING.ingest, this.client.buildPath(INGEST_SERVICE_PREFIX, ['metrics']), metrics)
            .then(response => response.body as IngestResponse);
    }
}

/**
 * Event - a Splunk event accepted by Ingest service.
 */
export interface Event {
    /**
     * Specifies a JSON object that contains explicit custom fields to be defined at index time.
     */
    attributes?: EventAttributes;
    /**
     * JSON object for the event.
     */
    body: [any] | number | string | object;
    /**
     * The host value assigned to the event data. Typically, this is the hostname of the client from which you are sending data.
     */
    host?: string;
    /**
     * An optional ID that uniquely identifies the event data. It is used to deduplicate the data if same data is set multiple times.
     * If ID is not specified, it will be assigned by the system.
     */
    id?: string;
    /**
     * Optional nanoseconds part of the timestamp.
     */
    nanos?: number;
    /**
     * The source value to assign to the event data. For example, if you are sending data from an app that you are developing,
     * set this key to the name of the app.
     */
    source?: string;
    /**
     * The sourcetype value assigned to the event data.
     */
    sourcetype?: string;
    /**
     * Epoch time in milliseconds.
     */
    timestamp?: number;
}

/**
 * Attributes - a JSON object that contains explicit custom fields to be defined at index time.
 */
export interface EventAttributes {
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
export interface MetricEvent {
    /**
     * Default attributes for related Splunk metrics.
     */
    attributes?: MetricAttributes;
    /**
     * Specifies multiple related metrics e.g. Memory, CPU etc.
     */
    body: Metric[];
    /**
     * The host value assigned to the event data. Typically, this is the hostname of the client from which you are sending data.
     */
    host?: string;
    /**
     * An optional ID that uniquely identifies the metric data. It is used to deduplicate the data if same data is set multiple times.
     * If ID is not specified, it will be assigned by the system.
     */
    id?: string;
    /**
     * Optional nanoseconds part of the timestamp.
     */
    nanos?: number;
    /**
     * The source value to assign to the event data. For example, if you are sending data from an app that you are developing,
     * set this key to the name of the app.
     */
    source?: string;
    /**
     * The sourcetype value assigned to the event data.
     */
    sourcetype?: string;
    /**
     * Epoch time in milliseconds.
     */
    timestamp?: number;
}

/**
 * MetricAttributes - Default attributes for related Splunk metrics.
 * @property If set, individual Metrics will inherit these dimensions and can override any/all of them.
 * @property If set, individual Metrics will inherit this type and can optionally override.
 * @property If set, individual Metrics will inherit this unit and can optionally override.
 */
export interface MetricAttributes {
    /**
     * Optional. If set, individual metrics inherit these dimensions and can override any and/or all of them.
     */
    defaultDimension?: object;
    /**
     * Optional. If set, individual metrics inherit this type and can optionally override.
     */
    defaultType?: string;
    /**
     * Optional. If set, individual metrics inherit this unit and can optionally override.
     */
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
export interface Metric {
    /**
     * Dimensions allow metrics to be classified e.g. {"Server":"nginx", "Region":"us-west-1", ...}
     */
    dimensions?: object;
    /**
     * Name of the metric e.g. CPU, Memory etc.
     */
    name: string;
    /**
     * Type of metric. Default is g for gauge.
     */
    type?: string;
    /**
     * Unit of the metric e.g. percent, megabytes, seconds etc.
     */
    unit?: string;
    /**
     * Value of the metric.
     */
    value?: number;
}

export interface IngestResponse {
    code: string;
    message: string;
}
