import {NovaProxy} from './nova';
import {SearchProxy} from './search';
import 'isomorphic-fetch';
import { Base64 } from 'js-base64';
import { Observable } from 'rxjs/Observable';

class SplunkError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

/* eslint-disable */
// Disabling eslint as it flags the hoisting of the err variable into the outer
// scope as an issue, but it's appropriate in this context.
function handleResponse(response) {
    if (response.ok) {
        return response.text().then(decodeJson);
    }
    return response.text().then(function(text) {
        var err;
        try {
            var json = JSON.parse(text);
            err = new SplunkError(json.message, response.status);
        } catch (ex) {
            err = new SplunkError(`Unknown error: ${text}`, response.status);
        }
        throw err;
    });
}
/* eslint-enable */

function decodeJson(text) {
    if (text == "") {
        return "";
    }
    try {
        return JSON.parse(text);
    } catch (e) {
        throw new Error(`Unable to parse message: "${text}"`);
    }
}

/**
 * This class is a Splunk SSC client.
 * @property {SearchProxy} search - Proxies for the search APIs
 */
export class Splunk {
    constructor(url, user_or_token, pass) {
        if (pass) {
            this.user = user_or_token;
            this.pass = pass;
            this.token = null;
        } else {
            this.token = user_or_token;
        }
        this.url = url;

        // Add api proxies
        this.nova = new NovaProxy(this);
        this.search = new SearchProxy(this);
    }

    /**
     * Builds the URL from a service + endpoint path
     * (concatenates the URL with the path)
     * @private
     * @param path
     * @returns {string}
     */
    buildUrl(path) {
        return this.url + path;
    }

    /**
     * If we haven't logged in, log in and cache the token
     * TODO: This endpoint is expected to change as auth service comes online.  Should be and remain idempotent
     */
    login() {
        // TODO: Check token
        if (!this.token) {
            this.token = Base64.encode(`${this.user}:${this.pass}`);
        }
    }

    /**
     * Builds headers required for request to Splunk SSC (auth, content-type, etc)
     * @returns {Headers}
     * @private
     */
    _buildHeaders() {
        // TODO: Cache
        return new Headers({
            'Authorization': `Basic ${this.token}`,
            'Content-Type': 'application/json'
        });
    }

    /**
     * Performs a GET on the Splunk SSC environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path - Path portion of the URL to request from Splunk
     * @returns {Promise<object>}
     */
    get(path) {
        this.login();
        return fetch(this.buildUrl(path), {
            method: "GET",
            headers: this._buildHeaders()
        })
        .then(function(response) {
            return handleResponse(response);
        });
    }

    /**
     * Performs a POST on the Splunk SSC environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path - Path portion of the URL to request from Splunk
     * @param data - Data object (to be converted to JSON) to supply as POST body
     * @returns {Promise<object>}
     */
    post(path, data) {
        this.login();
        return fetch(this.buildUrl(path), {
            method: "POST",
            body: JSON.stringify(data),
            headers: this._buildHeaders()
        }).then(function(response) {
            return handleResponse(response);
        });
    }

    /**
     * Performs a put on the splunk ssc environment with the supplied path.
     * for the most part this is an internal implementation, but is here in
     * case an api endpoint is unsupported by the sdk.
     * @param path - path portion of the url to request from splunk
     * @param data - data object (to be converted to json) to supply as put body
     * @returns {promise<object>}
     */
    put(path, data) {
        this.login();
        return fetch(this.buildUrl(path), {
            method: "PUT",
            body: JSON.stringify(data),
            headers: this._buildHeaders()
        }).then(function(response) {
            return handleResponse(response);
        });
    }

    /**
     * Performs a DELETE on the Splunk SSC environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path - Path portion of the URL to request from Splunk
     * @returns {Promise<object>}
     */
    delete(path) {
        this.login();
        return fetch(this.buildUrl(path), {
            method: "DELETE",
            headers: this._buildHeaders()
        }).then(function(response) {
            handleResponse(response, 204);
            return {};
        });
    }

    /**
     * Performs a search and returns an Observable of
     * Splunk events for the search.
     * @param searchArgs
     * @returns {Observable}
     */
    searchObserver(searchArgs) {
        this.login();

        /* Not actually a sync method, but named as such in the API */
        /* eslint-disable-next-line no-sync */
        var promise = this.search.createJobSync(searchArgs);
        return Observable.create(function(observable) {
            promise.then(function(data) {
                for (var evt of data.results) {
                    observable.next(evt);
                }
                observable.complete();
            }, function(err) {
                observable.error(err);
            });
        });
    }
}
