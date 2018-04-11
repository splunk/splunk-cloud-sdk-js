const ApiProxy = require('./apiproxy');
const NovaEvent = require('./models/nova_event');
const { EVENT_SERVICE_PREFIX } = require('./common/service_prefixes');
const { buildPath } = require('./common/utils');

class NovaSearchResult {
    /* eslint-disable */
    constructor(fields) {
        for (var field in fields) {
            this[field] = fields[field];
        }
    }

    getDate() {
        return new Date(Date.parse(this.time));
    }
}

class NovaSearchResults {
    constructor(metadata, fields, events) {
        this.metadata = metadata;
        this.fields = fields;
        this.events = events.map(e => new NovaSearchResult(e));
    }
}

class NovaProxy extends ApiProxy {
    constructor(client) {
        super(client);
        this.Event = NovaEvent;
    }

    sendEvent(event) {
        return this.client.post(buildPath(EVENT_SERVICE_PREFIX, '/events'), [event]);
    }

    queryEvents(query) {
        return this.client
            .get(buildPath(EVENT_SERVICE_PREFIX, '/events'), query)
            .then(data => new NovaSearchResults(data.metadata, data.fields, data.events));
    }
}

module.exports.NovaProxy = NovaProxy;
