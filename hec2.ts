import BaseApiService from './baseapiservice';
import { HEC2_SERVICE_PREFIX } from './common/service_prefixes';

/**
 * Encapsulates HEC2 endpoints
 */
export class HEC2Service extends BaseApiService {
    /**
     * Create a structured event to be ingested by Splunk SSC via HEC2.
     */
    public createEvent(event: Event): Promise<Response> {
        return this.client.post(this.client.buildPath(HEC2_SERVICE_PREFIX, ['events']), event);
    }

    /**
     * Create structured events to be ingested by Splunk SSC via HEC2.
     */
    public createEvents(events: Event[]): Promise<Response> {
        return this.client.post(this.client.buildPath(HEC2_SERVICE_PREFIX, ['events']), HEC2Service.eventsToJSONs(events));
    }

    /**
     * Create unstructured event data to be ingested by Splunk SSC via HEC2.
     */
    public createRawEvent(event: Event): Promise<Response> {
        const queryParams: QueryParams = {};
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
}

/**
 * Fields - key/value pairs for inclusion in HEC2 events.
 */
interface Fields {
    [key: string]: string;
}

/**
 * Response - generic response from HEC2 endpoints.
 */
export type Response = object;

interface QueryParams {
    [key: string]: string;
}
