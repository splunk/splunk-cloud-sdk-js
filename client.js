class SplunkError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

/* eslint-disable */
// Disabling eslint as it flags the hoisting of the err variable into the outer
// scope as an issue, but it's appropriate in this context.
/**
 * Interrogates the response, decodes if successful and throws if error
 * @private
 * @param {Response} response
 * @returns {Promise<object>}
 */
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

/**
 * Decodes the JSON into an object.  Returns a string if empty or an
 * error if unable to parse.
 * @private
 * @param {string} text
 * @returns {object}
 */
// TODO(david): Should we throw if response is empty? We may get here on DELETE
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

/**
 * This class acts as a raw proxy for Splunk SSC, implementing
 * authorization for requests, setting the proper headers,
 * and GET, POST, etc.  For the most part you shouldn't need
 * to use this class directly- look at the service proxies
 * that implement the actual endpoints.
 * TODO: Add links to actual endpoints, SSC name
 */
class ServiceClient {
    /**
   * Create a ServiceClient with the given URL and an auth token
   * @param {string} url Url to Splunk SSC instance
   * @param {string} token Authentication token
   * @param {string} tenantId Default tenant ID to use
   * TODO(david): figure out how to manage token refresh
   */
    constructor(url, token, tenantId) {
        this.token = token;
        this.url = url;
        this.tenant = tenantId;
    }

    /**
     * Set the default tenant for the client
     * @param {string} tenantId Default tenant ID
     */
    setTenant(tenantId) {
        this.tenant = tenantId;
    }

    /**
     *
     * @param servicePrefix
     * @param {array<string>} pathname
     * @param overrideTenant
     * @returns {string}
     */
    buildPath(servicePrefix, pathname, overrideTenant) {
        const effectiveTenant = overrideTenant || this.tenant;
        if (!effectiveTenant) {
            throw new Error('No tenant specified');
        }
        const path = `/api/${effectiveTenant}${servicePrefix}/${pathname.join('/')}`;
        const emptyElems = pathname.find(value => value.trim() === '');
        if (emptyElems) {
            throw new Error(`Empty elements in path: ${path}`);
        }
        return path;
    }

    /**
     * Builds the URL from a service + endpoint with query encoded in url
     * (concatenates the URL with the path)
     * @private
     * @param path
     * @param {Object} [query]
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
     * Builds headers required for request to Splunk SSC (auth, content-type, etc)
     * @returns {Headers}
     * @private
     */
    _buildHeaders() {
        // TODO: Cache
        return new Headers({
            Authorization: `Bearer ${this.token}`,
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
     * @returns {Promise<object>}
     */
    put(path, data) {
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
        return fetch(this.buildUrl(path), {
            method: 'DELETE',
            headers: this._buildHeaders(),
        }).then(response => {
            handleResponse(response).then(() => {});
        });
    }
}

module.exports.ServiceClient = ServiceClient;
