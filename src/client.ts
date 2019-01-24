/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/
import { AuthManager } from './auth_manager';
import agent from './version';

const DEFAULT_URLS = {
    api: 'https://api.splunkbeta.com',
    app: 'https://apps.splunkbeta.com',
};

export interface SplunkErrorParams {
    message: string;
    code?: string;
    httpStatusCode?: number;
    details?: object | any[];
    moreInfo?: string;
}

export class SplunkError extends Error implements SplunkErrorParams {
    public code?: string;
    public httpStatusCode?: number;
    public details?: object | any[];
    public moreInfo?: string;

    constructor(errorParams: SplunkErrorParams | string) {
        super(typeof errorParams === 'string' ? errorParams : errorParams.message);
        if (typeof errorParams !== 'string') {
            this.code = errorParams.code;
            this.details = errorParams.details;
            this.moreInfo = errorParams.moreInfo;
            this.httpStatusCode = errorParams.httpStatusCode;
        }
    }
}

/**
 * Interrogates the response, decodes if successful and throws if error
 * @private
 */
function handleResponse(response: Response): Promise<HTTPResponse> {
    if (response.ok) {
        if (
            response.headers.get('Content-Type') === ContentType.CSV ||
            response.headers.get('Content-Type') === ContentType.GZIP
        ) {
            return response
                .text()
                .then(text => ({ body: text, headers: response.headers, status: response.status }));
        } // else
        return response
            .text()
            .then(decodeJson)
            .then(json => ({ body: json, headers: response.headers, status: response.status }));
    } // else
    return response.text().then(text => {
        let err: Error;
        try {
            const json = JSON.parse(text);

            if (!json.message) {
                // TODO: This shouldn't go to production
                console.log(
                    `Malformed error message (no message) for endpoint: ${response.url}. Message: ${text}`
                );
            }
            err = new SplunkError({
                message: json.message,
                code: json.code,
                moreInfo: json.moreInfo,
                httpStatusCode: response.status,
                details: json.details,
            });
        } catch (ex) {
            const message = `${response.statusText} - unable to process response`;
            err = new SplunkError({
                message,
                httpStatusCode: response.status,
                details: { response: text },
            });
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
function decodeJson(text: string): object | string {
    if (text === '') {
        return text;
    }
    try {
        return JSON.parse(text);
    } catch (e) {
        throw new Error(`Unable to parse message: "${text}"`);
    }
}

export type ResponseHook = (response: Response, request: Request) => Promise<Response> | any;
export type TokenProviderFunction = () => string;
export interface ServiceClientArgs {
    /**
     * @deprecated Use urls instead
     */
    url?: string;
    urls?: {
        [key: string]: string;
    };
    tokenSource: AuthManager | string | TokenProviderFunction;
    defaultTenant?: string;
}

const _sleep = (millis: number): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(resolve, millis);
    });
};

/**
 * This function creates a ResponseHook that will retry requests that receive a 429 (too many requests) response
 * from the server a certain number of times (5 by default), increasing the wait time with each attempt. The wait
 * starts at 100ms by default and doubles with each retry attempt. If none of the retries come back with a response
 * other than 429 after it's max number of attempts, it will return the last response received.
 *
 * This ResponseHook can be installed like this:
 * ```javascript
 * client.addResponseHook(naiveExponentialBackoff({maxRetries: 5, timeout: 100, backoff: 2});
 * ```
 * @param maxRetries The number of times to retry this request before failing
 * @param timeout The _initial_ time to wait for the first retry attempt
 * @param backoff The multiplier that is applied to the previous timeout for this attempt
 * @param onRetry A callback that takes a response and a request. Will be called on every retry attempt.
 * @param onFailure A callback that takes a response and a request. Will be called after maxRetries are exhausted.
 */
export function naiveExponentialBackoff(
    {
        maxRetries = 5,
        timeout = 100,
        backoff = 2.0,
        onRetry = (response: Response, request: Request) => {
            /**/
        },
        onFailure = (response: Response, request: Request) => {
            /**/
        },
    } = {}
): ResponseHook {
    const retry: ResponseHook = async (response: Response, request: Request) => {
        let retries = 0;
        let myResponse = response;
        let currentTimeout = timeout;
        while (response.status === 429 && retries < maxRetries) {
            await _sleep(currentTimeout);
            retries += 1;
            currentTimeout *= backoff;
            myResponse = await fetch(request);
            onRetry(myResponse, request);
        }
        if (response.status === 429) {
            onFailure(myResponse, request);
        }
        return myResponse;
    };
    return retry;
}

/**
 * This class acts as a raw proxy for Splunk Cloud, implementing
 * authorization for requests, setting the proper headers,
 * and GET, POST, etc.  For the most part you shouldn't need
 * to use this class directly- look at the service proxies
 * that implement the actual endpoints.
 * TODO: Add links to actual endpoints, Splunk Cloud name
 */
export class ServiceClient {
    private readonly tokenSource: () => string;
    private readonly urls: {
        [key: string]: string;
    };
    private readonly tenant?: string;
    private responseHooks: ResponseHook[] = [];

    // -------------------------------------------------------------------------
    // Extra Shit
    // -------------------------------------------------------------------------
    public getURLS = () => {
        return this.urls;
    }
    public getToken = () => {
        return this.tokenSource();
    }
    public getTenant = () => {
        return this.tenant;
    }
    // -------------------------------------------------------------------------

    /**
     * Create a ServiceClient with the given URL and an auth token
     * @param args : ServiceClientArgs Url to Splunk Cloud instance
     * @param token Auth token
     * @param tenant Tenant to use for requests
     */
    constructor(args: ServiceClientArgs | string, token?: string, tenant?: string) {
        if (typeof args === 'string') {
            if (typeof token === 'string') {
                this.tokenSource = () => token;
            } else {
                throw new SplunkError({ message: 'No auth token supplied.' });
            }
            this.urls = { api: args };
            this.tenant = tenant;
        } else {
            const authManager = args.tokenSource;
            if (typeof authManager === 'string') {
                // If we have a string, wrap it in a lambda
                this.tokenSource = () => authManager;
            } else if (typeof authManager === 'function') {
                // If we have a function, just call it when we need a token
                this.tokenSource = authManager;
            } else if (typeof authManager !== 'undefined' && 'getAccessToken' in authManager) {
                // Else wrap a token manager.
                this.tokenSource = () => authManager.getAccessToken();
            } else {
                throw new SplunkError({ message: 'Unsupported token source' });
            }
            if (args.url !== undefined && args.urls === undefined) {
                // For backwards compatibility, form args.urls from args.url
                args.urls = { api: args.url };
            }
            this.urls = args.urls || DEFAULT_URLS;
            this.tenant = args.defaultTenant;
        }
    }

    /**
     * Adds a response hook to the list of response handlers. Each will be called with a response for each request
     * in defining order- if the callback returns a Response object, it will be substituted for the argument it was
     * called with.  This can be used for several things- logging requests (if it returns null it will not affect
     * the result), retrying failed requests (retry the request, and if successful, return the successful response),
     * etc.
     * @param hook A callback that takes a `Response` object and optionally returns a `Response`
     */
    public addResponseHook = (hook: ResponseHook) => {
        this.responseHooks.push(hook);
    }

    /**
     * Clears response hooks from the client
     */
    public clearResponseHooks = () => {
        this.responseHooks = [];
    }

    private invokeHooks = (response: Response, request: Request): Promise<Response> => {
        return this.responseHooks.reduce((result: Promise<Response>, cb: ResponseHook): Promise<
            Response
        > => {
            // Result starts as a known good Promise<Result>
            return result.then(chainResponse => {
                // Call the callback, get the result
                let cbResult;
                try {
                    cbResult = cb.call(null, chainResponse, request);
                } catch (err) {
                    cbResult = null;
                }
                // If the callback is a Promise, then it may be a Promise<Result>
                // if it isn't, then just return the last known good promise.
                // It may also be a Promise of something else.  If that's the
                // case, we need to wait until the promise resolves to check.
                if (cbResult instanceof Promise) {
                    return cbResult.then(output => {
                        if (output.ok !== undefined) {
                            return output;
                        }
                        // If it's not a response, substitute our last known
                        // good response.
                        return chainResponse;
                    });
                }
                return chainResponse;
            });
        }, Promise.resolve(response));
    }

    /**
     * Builds the URL from a service + endpoint with query encoded in url
     * (concatenates the URL with the path)
     */
    public buildUrl = (cluster: string, path: string, query?: QueryArgs): string => {
        const serviceCluster: string = this.urls[cluster] || DEFAULT_URLS.api;
        if (query && Object.keys(query).length > 0) {
            const encoder = encodeURIComponent;
            const queryEncoded = Object.keys(query)
                .filter(k => query[k] !== undefined && query[k] !== null) // filter out undefined and null
                .map(k => `${encoder(k)}=${encoder(String(query[k]))}`)
                .join('&');
            return `${serviceCluster}${path}?${queryEncoded}`;
        }
        return `${serviceCluster}${path}`;
    }

    /**
     * Builds headers required for request to Splunk Cloud (auth, content-type, etc)
     */
    private buildHeaders = (headers?: RequestHeaders): Headers => {
        // TODO: Cache

        const requestParamHeaders: Headers = new Headers({
            'Authorization': `Bearer ${this.tokenSource()}`,
            'Content-Type': ContentType.JSON,
            'Splunk-Client': `${agent.useragent}/${agent.version}`,
        });

        if (headers !== undefined && headers !== {}) {
            Object.keys(headers).forEach(key => {
                requestParamHeaders.append(key, headers[key]);
            });
        }
        return requestParamHeaders;
    }

    /**
     * Builds a path for a given service call
     * @param servicePrefix The name of the service, with version (search/v1)
     * @param segments An array of path elements that will be checked and added to the path (['jobs', jobId])
     * @param overrideTenant If supplied, this tenant will be used instead of the tenant associated with this client object
     * @return A fully qualified path to the resource
     */
    public buildPath = (
        servicePrefix: string,
        segments: string[],
        overrideTenant?: string
    ): string => {
        const effectiveTenant = overrideTenant || this.tenant;
        if (!effectiveTenant) {
            throw new Error('No tenant specified');
        }
        const path = `/${effectiveTenant}${servicePrefix}/${segments.join('/')}`;
        for (const elem of segments) {
            if (elem && elem.trim() === '') {
                throw new Error(`Empty elements in path: ${path}`);
            }
        }
        return path;
    }

    /**
     * Proxy for fetch that builds URL, applies headers and query string, and invokes hooks
     * before returning a `Response`
     * @param method HTTP Verb
     * @param path Path to the resource being requested
     * @param opts Request opts
     * @param data Body data (will be stringified if an object)
     */
    public fetch = (
        method: HTTPMethod,
        cluster: string,
        path: string,
        opts: RequestOptions = {},
        data?: any
    ): Promise<Response> => {
        const url = this.buildUrl(cluster, path, opts.query);
        const options = {
            method,
            headers: this.buildHeaders(opts.headers),
            body: typeof data !== 'string' ? JSON.stringify(data) : data,
        };
        const request = new Request(url, options);
        return fetch(request).then(response => this.invokeHooks(response, request));
    }

    /**
     * Performs a GET on the Splunk Cloud environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path Path portion of the URL to request from Splunk
     * @param opts Request options
     * @return
     */
    public get = (
        cluster: string,
        path: string,
        opts: RequestOptions = {}
    ): Promise<HTTPResponse> => {
        return this.fetch('GET', cluster, path, opts).then(handleResponse);
    }

    /**
     * Performs a POST on the Splunk Cloud environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path Path portion of the URL to request from Splunk
     * @param data Data object (to be converted to JSON) to supply as POST body
     * @param opts Request options
     * @return
     */
    public post = (
        cluster: string,
        path: string,
        data: any,
        opts: RequestOptions = {}
    ): Promise<HTTPResponse> => {
        return this.fetch('POST', cluster, path, opts, data).then(handleResponse);
    }

    /**
     * Performs a PUT on the Splunk Cloud environment with the supplied path.
     * for the most part this is an internal implementation, but is here in
     * case an api endpoint is unsupported by the sdk.
     * @param path Path portion of the url to request from Splunk
     * @param data Data object (to be converted to json) to supply as put body
     * @param opts Request options
     * @return
     */
    public put = (
        cluster: string,
        path: string,
        data: any,
        opts: RequestOptions = {}
    ): Promise<HTTPResponse> => {
        return this.fetch('PUT', cluster, path, opts, data).then(handleResponse);
    }

    /**
     * Performs a PATCH on the Splunk Cloud environment with the supplied path.
     * for the most part this is an internal implementation, but is here in
     * case an api endpoint is unsupported by the sdk.
     * @param path Path portion of the url to request from Splunk
     * @param data Data object (to be converted to json) to supply as patch body
     * @param opts Request options
     * @return
     */
    public patch = (
        cluster: string,
        path: string,
        data: object,
        opts: RequestOptions = {}
    ): Promise<HTTPResponse> => {
        return this.fetch('PATCH', cluster, path, opts, data).then(handleResponse);
    }

    /**
     * Performs a DELETE on the Splunk Cloud environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path Path portion of the URL to request from Splunk
     * @param data Data object (to be converted to json) to supply as delete body
     * @param opts Request options
     * @return
     */
    public delete = (
        cluster: string,
        path: string,
        data: object = {},
        opts: RequestOptions = {}
    ): Promise<HTTPResponse> => {
        return this.fetch('DELETE', cluster, path, opts, data).then(handleResponse);
    }
}

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Optional arguments for the HTTP request
 */
export interface RequestOptions {
    /**
     * key-value pairs that will be URL encoded and added to the URL query string
     */
    query?: QueryArgs;
    /**
     * Additional headers (beyond auth) to add for the request
     */
    headers?: RequestHeaders;
}

export interface QueryArgs {
    [key: string]: string | number | boolean | undefined;
}

export enum ContentType {
    CSV = 'text/csv',
    GZIP = 'application/gzip',
    JSON = 'application/json',
}

export interface RequestHeaders {
    [key: string]: string;
}

export interface HTTPResponse {
    body?: string | object;
    headers: Headers;
    status: number;
}
