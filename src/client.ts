/**
 * Copyright 2019 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import { AuthManager } from './auth_manager';
import agent from './version';

export const DEFAULT_URLS = {
    api: 'https://api.scp.splunk.com',
    app: 'https://apps.scp.splunk.com'
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
        super(typeof errorParams === 'string' ? errorParams : JSON.stringify(errorParams));
        if (typeof errorParams !== 'string') {
            this.code = errorParams.code;
            this.details = errorParams.details;
            this.moreInfo = errorParams.moreInfo;
            this.httpStatusCode = errorParams.httpStatusCode;
        }
    }
}

/**
 * Interrogates the response. Decodes the response if successful or throws an error.
 */
function handleResponse(response: Response): Promise<HTTPResponse> {
    if (response.ok) {
        if (response.headers.get('Content-Type') === ContentType.CSV || response.headers.get('Content-Type') === ContentType.GZIP) {
            return response.text()
                .then(text => ({ body: text, headers: response.headers, status: response.status }));
        } // else
        return response.text()
            .then(decodeJson)
            .then(json => ({ body: json, headers: response.headers, status: response.status }));
    } // else
    return response.text().then(text => {
        let err: Error;
        try {
            const json = JSON.parse(text);

            if (!json.message) {
                err = new SplunkError({ message: `Malformed error message (no message) for endpoint: ${response.url}. Message: ${text}` });
            } else {
                err = new SplunkError({ message: json.message, code: json.code, moreInfo: json.moreInfo, httpStatusCode: response.status, details: json.details });
            }
        } catch (ex) {
            const message = `${response.statusText} - unable to process response`;
            err = new SplunkError({ message, httpStatusCode: response.status, details: { response: text } });
        }
        throw err;
    });
}

/**
 * Decodes the JSON into an object. Returns a string if empty or an
 * error if unable to parse the text as JSON.
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
     * The default tenant to use for requests.
     */
    defaultTenant?: string;
    /**
     * A function that returns a token, a string that is a token, or an object that contains a
     * function named `getAccessToken` that returns a token.
     */
    tokenSource: AuthManager | string | TokenProviderFunction;
    /**
     * An object of key-value pairs, where the keys represent a Splunk Cloud Platform cluster, and values are the base URL for the cluster.
     * Example: `{ "api": "https://api.scp.splunk.com" }`
     */
    urls?: {
        [key: string]: string;
    };
}

const _sleep = (millis: number) : Promise<void> => {
    return new Promise(resolve => {
        setTimeout(resolve, millis);
    });
};

/**
 * This function creates a `ResponseHook` that retries requests that receive a 429 Too Many Requests response
 * from the server. By default, 5 retry attempts are made.
 * The ResponseHook increases the wait time with each attempt. By default, the wait starts at 100ms,
 * then doubles with each retry attempt. If none of the retry attempts returns a response
 * other than 429 after the maxiumum number of attempts, the last response that was received is returned.
 *
 * Install the ResponseHook as follows:
 * ```javascript
 * client.addResponseHook(naiveExponentialBackoff({maxRetries: 5, timeout: 100, backoff: 2});
 * ```
 * @param maxRetries The number of times to retry this request before failing.
 * @param timeout The initial time to wait for the first retry attempt.
 * @param backoff The multiplier to apply to the previous timeout for this attempt.
 * @param onRetry A callback that takes a response and a request and is called on every retry attempt.
 * @param onFailure A callback that takes a response and a request and is called after the maximum number of retries are exhausted.
 */
export function naiveExponentialBackoff({maxRetries = 5,
                                         timeout = 100,
                                         backoff = 2.0,
                                         onRetry=(response: Response, request: Request) => {/**/},
                                         onFailure=(response: Response, request: Request) =>{/**/}
                                        } = {}) : ResponseHook {
    const retry : ResponseHook = async (response: Response, request: Request) => {
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
 * authorization for requests, setting the proper headers, calling HTTP methods, etc.
 * Do not use this class directly. Instead, use the service proxies that implement
 * the service endpoints.
 */
export class ServiceClient {
    private readonly tokenSource: () => string;
    private readonly urls: {
        [key: string]: string;
    };
    private readonly tenant?: string;
    private responseHooks: ResponseHook[] = [];

    /**
     * Creates a `ServiceClient` object with the given `ServiceClientArgs` object.
     * @param args A `ServiceClientArgs` object.
     */
    constructor(args: ServiceClientArgs) {
        const tokenSourceProvider = args.tokenSource;
        if (typeof tokenSourceProvider === 'string') {
            // If we have a string, wrap it in a lambda
            this.tokenSource = () => tokenSourceProvider;
        } else if (typeof tokenSourceProvider === 'function') {
            // If we have a function, just call it when we need a token
            this.tokenSource = tokenSourceProvider;
        } else if (typeof tokenSourceProvider !== 'undefined' && 'getAccessToken' in tokenSourceProvider) {
            // Else wrap a token manager.
            this.tokenSource = () => tokenSourceProvider.getAccessToken();
        } else {
            throw new SplunkError({ message: 'Unsupported token source' });
        }
        this.urls = args.urls || DEFAULT_URLS;
        this.tenant = args.defaultTenant;
    }

    /**
     * Adds a response hook to the list of response handlers. Each response hook is called with a response for each request,
     * in the order it was defined. If the callback returns a `Response` object, the `Response` object replaces the argument it was
     * called with.
     * You can use a response hook for different purposes. For example, use a response hook as a logging request--if the
     * callback returns `null`,  it does not affect the result. Use a response hook for retrying failed requests--retry
     * the request, and if successful, return the response.
     * @param hook A callback that takes a `Response` object and optionally returns a `Response` object.
     */
    public addResponseHook = (hook: ResponseHook) => {
        this.responseHooks.push(hook);
    }

    /**
     * Clears response hooks from the client.
     */
    public clearResponseHooks = () => {
        this.responseHooks = [];
    }

    private invokeHooks = (response: Response, request: Request): Promise<Response> => {
        return this.responseHooks.reduce((result: Promise<Response>, cb: ResponseHook): Promise<Response> => {
            // Result starts as a known good Promise<Result>
            return result.then((chainResponse) => {
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
     * Builds the URL from a service + endpoint, with the query encoded in the URL
     * (concatenates the URL with the path).
     *
     * If the query contains an array value, the query is encoded as `foo=1,2`
     * rather than `foo=1&foo=2`. Some services expect the latter form, but
     * only the former format is supported at this time.
     *
     * @param cluster The cluster endpoint to target (`api` or `app`).
     * @param path The path to the resource that is being requested.
     * @param query The `QueryArgs` object.
     * @return A fully-qualified URL.
     */
    public buildUrl = (cluster: string, path: string, query?: QueryArgs): string => {
        const serviceCluster : string = this.urls[cluster] || DEFAULT_URLS.api;
        const basePath = `${serviceCluster}${escape(path)}`;
        if (query && Object.keys(query).length > 0) {
            const queryEncoded = Object.keys(query)
                .filter(k => query[k] !== undefined && query[k] !== null) // filter out undefined and null
                .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(String(query[k]))}`)
                .join('&');
            return `${basePath}?${queryEncoded}`;
        }
        return basePath;
    }

    /**
     * Builds headers that are required for a request to Splunk Cloud, such as:
     * "Authorization", "Content-Type", and "Splunk-Client".
     * @param headers Additional headers to use for each request
     * @return A key-values map of headers
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
     * Builds a path for a request to a service.
     * @param servicePrefix The name of the service with its version, for example "search/v1".
     * @param segments An array of path elements that are checked and added to the path, for example "['jobs', jobId]".
     * @param overrideTenant The tenant to use instead of the tenant that is associated with this client object.
     * @return A fully-qualified path to the resource.
     */
    public buildPath = (servicePrefix: string, segments: string[], overrideTenant?: string): string => {
        const effectiveTenant = overrideTenant || this.tenant;
        if (!effectiveTenant && segments[0] !== 'system') {
            throw new Error('No tenant specified');
        }
        const path = segments[0] === 'system' ? `/${segments.join('/')}` : `/${effectiveTenant}${servicePrefix}/${segments.join('/')}`;
        for (const elem of segments) {
            if (elem && elem.trim() === '') {
                throw new Error(`Empty elements in path: ${path}`);
            }
        }
        return path;
    }

    /**
     * A proxy for fetch that builds the URL, applies headers and the query string, and invokes hooks
     * before returning a `Response` object.
     * @param method The HTTP request method (GET, POST, PATCH, or DELETE).
     * @param cluster The cluster endpoint to target (`api` or `app`).
     * @param path The path to the resource that is being requested.
     * @param opts Request options.
     * @param data Data for the request body. Objects are converted to strings.
     */
    public fetch = (method: HTTPMethod, cluster: string, path: string, opts: RequestOptions = {}, data?: any): Promise<Response> => {
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
     * Performs a GET request on the specified path.
     * This implementation is internal but can be used for APIs that are not supported by an SDK.
     * @param cluster The cluster endpoint to target (`api` or `app`).
     * @param path The path to the resource that is being requested.
     * @param opts Request options.
     * @return An `HTTPResponse` object.
     */
    public get = (cluster: string, path: string, opts: RequestOptions = {}): Promise<HTTPResponse> => {
        return this.fetch('GET', cluster, path, opts)
            .then(handleResponse);
    }

    /**
     * Performs a POST request on the specified path.
     * This implementation is internal but can be used for APIs that are not supported by an SDK.
     * @param cluster The cluster endpoint to target (`api` or `app`).
     * @param path The path to the resource that is being requested.
     * @param data A data object that is converted to JSON and used as the request body.
     * @param opts Request options.
     * @return An `HTTPResponse` object.
     */
    public post = (cluster: string, path: string, data: any = null, opts: RequestOptions = {}): Promise<HTTPResponse> => {
        return this.fetch('POST', cluster, path, opts, data)
            .then(handleResponse);
    }

    /**
     * Performs a PUT request on the specified path.
     * This implementation is internal but can be used for APIs that are not supported by an SDK.
     * @param cluster The cluster endpoint to target (`api` or `app`).
     * @param path The path to the resource that is being requested.
     * @param data A data object that is converted to JSON and used as the request body.
     * @param opts Request options.
     * @return An `HTTPResponse` object.
     */
    public put = (cluster: string, path: string, data: any, opts: RequestOptions = {}): Promise<HTTPResponse> => {
        return this.fetch('PUT', cluster, path, opts, data)
            .then(handleResponse);
    }

    /**
     * Performs a PATCH request on the specified path.
     * This implementation is internal but can be used for APIs that are not supported by an SDK.
     * @param cluster The cluster endpoint to target (`api` or `app`).
     * @param path The path to the resource that is being requested.
     * @param data A data object that is converted to JSON and used as the request body.
     * @param opts Request options.
     * @return An `HTTPResponse` object.
     */
    public patch = (cluster: string, path: string, data: object, opts: RequestOptions = {}): Promise<HTTPResponse> => {
        return this.fetch('PATCH', cluster, path, opts, data)
            .then(handleResponse);
    }

    /**
     * Performs a DELETE request on the specified path.
     * This implementation is internal but can be used for APIs that are not supported by an SDK.
     * @param cluster The cluster endpoint to target (`api` or `app`).
     * @param path The path to the resource that is being requested.
     * @param data A data object that is converted to JSON and used as the request body.
     * @param opts Request options.
     * @return An `HTTPResponse` object.
     */
    public delete = (cluster: string, path: string, data: object = {}, opts: RequestOptions = {}): Promise<HTTPResponse> => {
        return this.fetch('DELETE', cluster, path, opts, data)
            .then(handleResponse);
    }
}

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';


/**
 * Optional arguments for the HTTP request
 */
export interface RequestOptions {
    /**
     * Key-value pairs that are URL-encoded and added to the URL query string.
     */
    query?: QueryArgs;
    /**
     * Additional headers (other than "Authorization") to add to the request.
     */
    headers?: RequestHeaders;
}

export interface QueryArgs {
    [key: string]: any;
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
