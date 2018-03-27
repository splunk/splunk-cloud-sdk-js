import {ApiProxy} from "./apiproxy"
import {NovaEvent} from "./models/nova_event"

let SERVICE_PREFIX='/v1';

export class NovaProxy extends ApiProxy {
    constructor(client) {
        super(client);
        this.Event = NovaEvent;
    }

    sendEvent(event) {
        return this.client.post(`${SERVICE_PREFIX}/events`, [event]);
    }

    queryEvents(query) {
        return this.client.get(`${SERVICE_PREFIX}/events`, query)
        .then(function(data) {
            return new NovaSearchResults(data.metadata, data.fields, data.events);
        });
    }

}


class NovaSearchResults {
    constructor(metadata, fields, events) {
        this.metadata = metadata;
        this.fields = fields;
        this.events = events.map(e => new NovaSearchResult(e));
    }
}

class NovaSearchResult {
    constructor(fields) {
        for (var field in fields) {
            this[field] = fields[field];
        }
    }

    getDate() {
        return new Date(Date.parse(this.time));
    }
}

