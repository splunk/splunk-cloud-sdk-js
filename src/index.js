import 'isomorphic-fetch';
import { Observable } from 'rxjs/Observable';
import { Base64 } from 'js-base64';
import { NovaProxy } from './nova';
import { SearchProxy } from './search';
import { CatalogProxy } from './catalog';

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
    if (text === '') {
        return '';
    }
    try {
        return JSON.parse(text);
    } catch (e) {
        throw new Error(`Unable to parse message: "${text}"`);
    }
}
/* eslint-disable import/prefer-default-export */
/**
 * This class is a Splunk SSC client.
 * @property {NovaProxy} nova - Proxies for events APIs
 * @property {SearchProxy} search - Proxies for the search APIs
 * @property {CatalogProxy} catalog - Proxies for the catalog APIs
 */
export class Splunk {
    constructor(url, userOrToken, pass) {
        if (pass) {
            this.user = userOrToken;
            this.pass = pass;
            this.token = null;
        } else {
            this.token = userOrToken;
        }
        this.url = url;

        // Add api proxies
        this.nova = new NovaProxy(this);
        this.search = new SearchProxy(this);
        this.catalog = new CatalogProxy(this);
    }
    /**
     * Builds the URL from a service + endpoint with query encoded in url
     * (concatenates the URL with the path)
     * @private
     * @param path
     * @param {Object} query
     * @returns {string}
     */
    buildUrl(path, query) {
        if (query) {
            const encoder = encodeURIComponent;
            const queryEncoded = Object.keys(query)
                .map(k => `${encoder(k)}=${encoder(query[k])}`)
                .join('&');
            return `${this.url}${path}?${queryEncoded}`;
        }
        return `${this.url}${path}`;
    }

    /**
     * If we haven't logged in, log in and cache the token
     * TODO: This endpoint is expected to change as auth service comes online.
     * Should be and remain idempotent
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
            Authorization: `Basic ${this.token}`,
            'Content-Type': 'application/json',
        });
    }
    /**
     * Performs a GET on the Splunk SSC environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path - Path portion of the URL to request from Splunk
     * @param {Object} query - Object that contains query parameters
     * @returns {Promise<object>}
     */
    get(path, query) {
        this.login();
        return fetch(this.buildUrl(path, query), {
            method: 'GET',
            /* eslint-disable no-underscore-dangle */
            headers: this._buildHeaders(),
        }).then(response => handleResponse(response));
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
            method: 'POST',
            body: JSON.stringify(data),
            headers: this._buildHeaders(),
        }).then(response => handleResponse(response));
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
            method: 'PUT',
            body: JSON.stringify(data),
            headers: this._buildHeaders(),
        }).then(response => handleResponse(response));
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
            method: 'DELETE',
            headers: this._buildHeaders(),
        }).then((response) => {
            handleResponse(response, 204);
            return {};
        });
    }
    /* eslint-disable no-restricted-syntax */
    /**
     * Performs a search and returns an Observable of
     * Splunk events for the search.
     * @param searchArgs
     * @returns {Observable}
     */
    searchObserver(searchArgs) {
        this.login();
        const promise = this.search.createJobSync(searchArgs);
        return Observable.create((observable) => {
            promise.then((data) => {
                for (const evt of data.results) {
                    observable.next(evt);
                }
                observable.complete();
            }, (err) => {
                observable.error(err);
            });
        });
    }
}
