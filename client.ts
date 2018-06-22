
class SplunkError extends Error {
    public code: number;
    public source: object;
    constructor(message, code?: number, source?: object) {
        super(message);
        this.code = code;
        this.source = source;
    }
}

/**
 * Interrogates the response, decodes if successful and throws if error
 * @private
 */
function handleResponse(response: Response): Promise<object> {
    if (response.ok) {
        return response.text().then(decodeJson);
    }
    return response.text().then(function (text) {
        var err;
        try {
            var json = JSON.parse(text);
            if (!json.message) {
                // TODO: This shouldn't go to production
                console.log(`Malformed error message (no message) for endpoint: ${response.url}. Message: ${text}`);
            }
            err = new SplunkError(json.message, response.status, json);
        } catch (ex) {
            err = new SplunkError(`Unknown error: ${text}`, response.status);
        }
        throw err;
    });
}

/**
 * Decodes the JSON into an object.  Returns a string if empty or an
 * error if unable to parse.
 * @private
 */
// TODO(david): Should we throw if response is empty? We may get here on DELETE
function decodeJson(text: string): object {
    if (text === '') {
        return {};
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
export class ServiceClient {
    private token: string;
    private url: string;
    private tenant: string;

    /**
     * Create a ServiceClient with the given URL and an auth token
     * @param {string} url Url to Splunk SSC instance
     * @param {string} token Authentication token
     * @param {string} tenant Default tenant ID to use
     * TODO(david): figure out how to manage token refresh
     */
    constructor(url: string, token: string, tenant: string) {
        this.token = token;
        this.url = url;
        this.tenant = tenant;
    }

    /**
     * Set the default tenant for the client
     * @param {string} tenantId Default tenant ID
     */
    setTenant(tenant: string) {
        this.tenant = tenant;
    }

    /**
     * @private
     */
    buildPath(servicePrefix: string, pathname: Array<string>, overrideTenant?: string): string {
        const effectiveTenant = overrideTenant || this.tenant;
        if (!effectiveTenant) {
            throw new Error("No tenant specified");
        }
        const path = `/${effectiveTenant}${servicePrefix}/${pathname.join("/")}`;
        for (const elem in pathname) {
            if (elem.trim() === '') {
                throw new Error(`Empty elements in path: ${path}`)
            }
        }
        return path;
    }

    /**
     * Builds the URL from a service + endpoint with query encoded in url
     * (concatenates the URL with the path)
     * @private
     */
    buildUrl(path: string, query?: object): string {
        if (query && Object.keys(query).length > 0) {
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
     * @private
     */
    _buildHeaders(): Headers {
        // TODO: Cache
        return new Headers({
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        });
    }

    /**
     * Performs a GET on the Splunk SSC environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     */
    get(path: string, query?: object): Promise<object> {
        return fetch(this.buildUrl(path, query), {
            method: 'GET',
            /* eslint-disable no-underscore-dangle */
            headers: this._buildHeaders()
        }).then(response => handleResponse(response));
    }

    /**
     * Performs a POST on the Splunk SSC environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     */
    post(path: string, data: any, query?: object): Promise<object> {
        return fetch(this.buildUrl(path, query), {
            method: "POST",
            body: typeof data !== "string" ? JSON.stringify(data) : data,
            headers: this._buildHeaders()
        }).then(response => handleResponse(response));
    }

    /**
     * Performs a PUT on the splunk ssc environment with the supplied path.
     * for the most part this is an internal implementation, but is here in
     * case an api endpoint is unsupported by the sdk.
     */
    put(path: string, data: any): Promise<object> {
        return fetch(this.buildUrl(path), {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: this._buildHeaders()
        }).then(response => handleResponse(response));
    }

    /**
     * Performs a PATCH on the splunk ssc environment with the supplied path.
     * for the most part this is an internal implementation, but is here in
     * case an api endpoint is unsupported by the sdk.
     */
    patch(path: string, data: object): Promise<object> {
        return fetch(this.buildUrl(path), {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: this._buildHeaders()
        }).then(response => handleResponse(response));
    }

    /**
     * Performs a DELETE on the Splunk SSC environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     */
    // FIXME: Why does delete have a body?
    delete(path: string, data?: object): Promise<any> {
        let deleteData = data;
        if (data === undefined || data == null) {
            deleteData = {};
        }
        return fetch(this.buildUrl(path), {
            method: 'DELETE',
            body: JSON.stringify(deleteData),
            headers: this._buildHeaders()
        }).then(response => handleResponse(response));
    }
}
