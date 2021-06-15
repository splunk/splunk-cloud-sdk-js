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
import { buildSplunkError, SplunkError, SplunkErrorParams } from './errors';
import agent from './version';

export { SplunkError, SplunkErrorParams };

export const DEFAULT_URLS = {
    api: 'https://api.scp.splunk.com',
    app: 'https://app.scp.splunk.com',
};

export const REQUEST_STATUS = {
    queued: 'queued',
    retried: 'retried'
};

const SEARCH_SUBMIT_QUEUE = 'search-submit';

type ResponseRequest = [Response, Request];

/**
 * Internal class that holds the state for a pending service request promise (including the promise and it's callbacks).
 */
class RequestFutureHolder {
    private unsetErrorHandler = (reason?: any) => {
        throw new Error('Unexpectedly don\'t have an error handler');
    }
    private unsetSuccessHandler = (value?: PromiseLike<ResponseRequest> | ResponseRequest) => {
        throw new Error('Unexpectedly don\'t have a success handler');
    }
    public promise: Promise<ResponseRequest>;
    public request: Request;
    public onError: (reason?: any) => void = this.unsetErrorHandler;
    public onSuccess: (value?: PromiseLike<ResponseRequest> | ResponseRequest) => void = this
        .unsetSuccessHandler;
    public statusCallback?: (requestStatus: RequestStatus) => void;

    constructor(request: Request, requestStatusCallback?: (requestStatus: RequestStatus) => void) {
        this.request = request;
        this.promise = new Promise<ResponseRequest>((onSuccess, onError) => {
            this.onSuccess = onSuccess;
            this.onError = onError;
        });
        this.statusCallback = requestStatusCallback;
    }
}

interface RequestQueueParams {
    initialTimeout: number;
    exponent: number;
    retries: number;
    maxInFlight: number;
    enableRetryHeader?: boolean;
}

/*
 * These defaults are used when nothing is specified in the client specification. If we decide to enable retries
 * for all clients by default, this should be removed in favor of DefaultQueueManagerParams below.
 */
const DEFAULT_REQUEST_QUEUE_PARAMS = {
    initialTimeout: 1000,
    exponent: 2.0,
    retries: 0,
    maxInFlight: 3,
    enableRetryHeader: false,
};

/*
 * Define hostname in the format of scheme://domain:port and can get a hostname with tenant scope enabled
 */
export class Hostname {
    private domain: string;
    private region: string;
    private port: string;
    private scheme: string;

    constructor(domain: string, region: string, scheme?: string, port?: string | '') {
        this.domain = domain.trim();
        if (this.domain.charAt(this.domain.length - 1) === '/') {
            this.domain = this.domain.substring(0, this.domain.length - 1);
        }

        this.region = region;
        this.port = port ? port : '';
        this.scheme = scheme ? scheme : 'https';
    }

    // Get a hostname with region/tenant prefix added
    public getHostname(path: string, tenant?: string,): string {
        let hostname = `${this.scheme}://`;

        if (path.substring(0, 7).toLowerCase() === '/system') {
            if (this.region === '') {
                throw Error('region value can not be empty.');
            }

            hostname = `${hostname}region-${this.region}.${escape(this.domain)}`;
        } else {
            hostname = `${hostname}${tenant}.${escape(this.domain)}`;
        }

        if (this.port.trim() !== '') {
            hostname = `${hostname}:${this.port}`;
        }

        return hostname;
    }
}

/**
 * RequestQueueManagerParams allows for configuration of retry behaviors. The constructor takes two parameters,
 * the first is the set of parameters to use when there are
 */
export class RequestQueueManagerParams {
    public defaults: RequestQueueParams;
    public overrides: Map<string, RequestQueueParams>;

    constructor(
        defaults: RequestQueueParams = DEFAULT_REQUEST_QUEUE_PARAMS,
        overrides: Map<string, RequestQueueParams> = new Map()
    ) {
        this.defaults = defaults;
        this.overrides = overrides;
    }
}

/**
 * This class holds the future defaults for request queues.
 */
export class DefaultQueueManagerParams extends RequestQueueManagerParams {
    constructor() {
        super(
            {
                retries: 4,
                initialTimeout: 500,
                exponent: 2,
                maxInFlight: 3,
            },
            new Map<string, RequestQueueParams>([
                [
                    SEARCH_SUBMIT_QUEUE,
                    {
                        retries: 6,
                        initialTimeout: 1000,
                        exponent: 1.6,
                        maxInFlight: 3,
                    },
                ],
            ])
        );
    }
}

/**
 * Internal class that holds multiple RequestQueues.  Will auto-create a queue for a given name if it doesn't exist.
 */
class RequestQueueManager {
    private queues = new Map<string, RequestQueue>();
    private params: RequestQueueManagerParams;

    constructor(params: RequestQueueManagerParams = new RequestQueueManagerParams()) {
        this.params = params;
    }

    public add(queueName: string, request: Request, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<ResponseRequest> {
        return this.getQueue(queueName).add(request, requestStatusCallback);
    }

    private getQueue(queueName: string): RequestQueue {
        if (!this.queues.has(queueName)) {
            const queue = new RequestQueue(
                this.params.overrides.get(queueName) || this.params.defaults
            );
            this.queues.set(queueName, queue);
        }
        return this.queues.get(queueName)!;
    }
}

/**
 * Internal class that manages requests- the intent is to keep the requests largely in order and not flood the server
 * when it is already overloaded. When the client gets a backoff signal (429), it should not continue to make new
 * requests until the request is successfully completed. Rather than a strict serial execution, this implementation will
 * allow a certain number of 'in-flight' requests to lend the specified degree of parallelism.
 */
class RequestQueue {
    private retryStatuses = new Set([429, 503]);
    private queue: RequestFutureHolder[] = [];
    private inFlight = new Set<RequestFutureHolder>();
    private params: RequestQueueParams;

    constructor(params: RequestQueueParams) {
        this.params = params;
    }

    /**
     * Enqueue a request for execution as soon as possible.  Returns a Promise that contains both the final request
     * used and the resultant response, ready for calling a ResponseHook.
     */
    public async add(request: Request, requestStatusCallback?: (requestStatus: RequestStatus) => void): Promise<ResponseRequest> {
        // TODO: There are optimizations we can make here to prevent pushing/popping when the queue is empty and there is room in inFlight
        const holder = new RequestFutureHolder(request, requestStatusCallback);
        this.queue.push(holder);
        if (holder.statusCallback !== undefined) {
            setTimeout(holder.statusCallback, 0, { request, status: REQUEST_STATUS.queued });
        }
        this.dispatch_requests();
        return holder.promise;
    }

    /**
     * Looks for pending requests that can be dispatched, and dispatches them if there is a slot available.
     */
    private dispatch_requests() {
        if (this.inFlight.size < this.params.maxInFlight) {
            const holder = this.queue.shift();
            if (holder !== undefined) {
                this.inFlight.add(holder);
                // tslint:disable-next-line:no-floating-promises
                this.dispatch(holder)
                    .then(holder.onSuccess, holder.onError)
                    .then(() => {
                        this.inFlight.delete(holder);
                        this.dispatch_requests();
                    });
            }
        }
    }

    /**
     * Actually dispatches a request, retrying if it receives a transient error.
     */
    private async dispatch(holder: RequestFutureHolder): Promise<ResponseRequest> {
        let retry = 0;
        let timeout = this.params.initialTimeout;
        const initialTime = Date.now();
        let response: Response;
        let needsRetry = false;
        let currentRequest: Request;
        do {
            currentRequest = holder.request.clone();
            if (retry > 0 && this.params.enableRetryHeader) {
                // The following cannot be set unless gateway adds the header to Access-Control-Allow-Headers
                // TODO: Enable by default when allowed by gateway
                currentRequest.headers.set('Retry', `${initialTime}:${retry}`);
                if (holder.statusCallback !== undefined) {
                    setTimeout(holder.statusCallback, 0, { status: REQUEST_STATUS.retried, request: currentRequest });
                }
            }
            response = await fetch(currentRequest);
            if (this.retryStatuses.has(response.status)) {
                needsRetry = true;
                retry += 1;
                if (retry <= this.params.retries) {
                    await _sleep(timeout);
                    timeout = timeout * this.params.exponent;
                }
            } else {
                needsRetry = false;
            }
        } while (needsRetry && retry <= this.params.retries);
        return [response, currentRequest];
    }
}

/**
 * Interrogates the response. Decodes the response if successful or throws an error.
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
                err = buildSplunkError({
                    message: `Malformed error message (no message) for endpoint: ${response.url}.`,
                    code: json.code,
                    moreInfo: json.moreInfo,
                    httpStatusCode: response.status,
                    details: {
                        response: text,
                    },
                });
            } else {
                err = buildSplunkError({
                    message: json.message,
                    code: json.code,
                    moreInfo: json.moreInfo,
                    httpStatusCode: response.status,
                    details: json.details,
                });
            }
        } catch (ex) {
            err = buildSplunkError({
                message: `${response.statusText} - unable to process response`,
                httpStatusCode: response.status,
                details: {
                    response: text,
                },
            });
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
export type TokenProviderAsyncFunction = () => Promise<string>;

export interface ServiceClientArgs {
    /**
     * The default tenant to use for requests.
     */
    defaultTenant?: string;
    /**
     * An async function that returns a token, a string that is a token, or an object that contains an
     * async function named `getAccessToken` that returns a token.
     */
    tokenSource: AuthManager | string | TokenProviderAsyncFunction;
    /**
     * An object of key-value pairs, where the keys represent a Splunk Cloud Platform cluster, and values are the base URL for the cluster.
     * Example: `{ "api": "https://api.scp.splunk.com" }`
     */
    urls?: {
        [key: string]: string;
    };

    /**
     * Parameters that govern how messages are passed to the service, including how they are retried (and how
     * back-off is applied) upon transient errors like an HTTP 429.
     */
    requestQueueManagerParams?: RequestQueueManagerParams;

    hostname?: Hostname;
}

const _sleep = (millis: number): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(resolve, millis);
    });
};

/**
 * This class acts as a raw proxy for Splunk Cloud, implementing
 * authorization for requests, setting the proper headers, calling HTTP methods, etc.
 * Do not use this class directly. Instead, use the service proxies that implement
 * the service endpoints.
 */
export class ServiceClient {
    private readonly tokenSource: () => Promise<string>;
    private readonly urls: {
        [key: string]: string;
    };
    private readonly tenant?: string;
    private readonly hostname: Hostname | null;

    private readonly authManager?: AuthManager;
    private responseHooks: ResponseHook[] = [];
    private queueManager: RequestQueueManager;

    /**
     * Creates a `ServiceClient` object with the given `ServiceClientArgs` object.
     * @param args A `ServiceClientArgs` object.
     */
    constructor(args: ServiceClientArgs) {
        const tokenSourceProvider = args.tokenSource;
        if (typeof tokenSourceProvider === 'string') {
            // If we have a string, wrap it in a promise
            this.tokenSource = () => new Promise<string>(resolve => resolve(tokenSourceProvider));
        } else if (typeof tokenSourceProvider === 'function') {
            // If we have an async function, just call it when we need a token
            this.tokenSource = tokenSourceProvider;
        } else if (
            typeof tokenSourceProvider !== 'undefined' &&
            'getAccessToken' in tokenSourceProvider
        ) {
            // Else wrap a token manager.
            this.authManager = tokenSourceProvider;
            this.tokenSource = (() => {
                const authManager = this.authManager;
                return () => authManager.getAccessToken();
            })();
        } else {
            throw new SplunkError({ message: 'Unsupported token source' });
        }
        this.urls = args.urls || DEFAULT_URLS;
        this.tenant = args.defaultTenant;
        this.hostname = args.hostname || null;

        this.queueManager = new RequestQueueManager(args.requestQueueManagerParams);
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


        const hostname = this.hostname !== null ? this.hostname.getHostname(path, this.tenant) : this.urls[cluster] || DEFAULT_URLS.api;

        const basePath = `${hostname}${escape(path)}`;

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
    private buildHeaders = async (headers?: RequestHeaders): Promise<Headers> => {
        // TODO: Cache

        const token = await this.tokenSource();
        const requestParamHeaders: Headers = new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': ContentType.JSON,
            'Splunk-Client': `${agent.useragent}/${agent.version}`,
        });
        if (headers !== undefined && headers !== {}) {
            Object.keys(headers).forEach(key => {
                if (key.toLowerCase() === 'content-type') {
                    requestParamHeaders.set(key, headers[key]);
                } else {
                    requestParamHeaders.append(key, headers[key]);
                }
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
    public buildPath = (
        servicePrefix: string,
        segments: string[],
        overrideTenant?: string
    ): string => {
        const effectiveTenant = overrideTenant || this.tenant;
        if (!effectiveTenant && segments[0] !== 'system') {
            throw new Error('No tenant specified');
        }
        const path =
            segments[0] === 'system'
                ? `/${segments.join('/')}`
                : `/${effectiveTenant}${servicePrefix}/${segments.join('/')}`;
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
    public fetch = async (
        method: HTTPMethod,
        cluster: string,
        path: string,
        opts: RequestOptions = {},
        data?: any
    ): Promise<Response> => {
        const url = this.buildUrl(cluster, path, opts.query);
        const queue = opts.queue || ServiceClient.queueFromPath(path, method);
        const headers = await this.buildHeaders(opts.headers);
        const type = headers.get('Content-Type');
        let contentTypeForm = false;
        if (type !== null) {
            contentTypeForm = type.includes('multipart/form-data');
        }
        const options = {
            method,
            headers,
            body: contentTypeForm ? data : JSON.stringify(data),
        };
        const request = new Request(url, options);
        const requestStatusCallback = opts.statusCallback;
        return this.queueManager
            .add(queue, request, requestStatusCallback)
            .then(responseRequest => this.invokeHooks(...responseRequest));
    }


    /**
     * Performs a GET request on the specified path.
     * This implementation is internal but can be used for APIs that are not supported by an SDK.
     * @param cluster The cluster endpoint to target (`api` or `app`).
     * @param path The path to the resource that is being requested.
     * @param opts Request options.
     * @return An `HTTPResponse` object.
     */
    public get = (
        cluster: string,
        path: string,
        opts: RequestOptions = {}
    ): Promise<HTTPResponse> => {
        return this.fetch('GET', cluster, path, opts).then(handleResponse);
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
    public post = (
        cluster: string,
        path: string,
        data: any = null,
        opts: RequestOptions = {}
    ): Promise<HTTPResponse> => {
        return this.fetch('POST', cluster, path, opts, data).then(handleResponse);
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
    public put = (
        cluster: string,
        path: string,
        data: any,
        opts: RequestOptions = {}
    ): Promise<HTTPResponse> => {
        return this.fetch('PUT', cluster, path, opts, data).then(handleResponse);
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
    public patch = (
        cluster: string,
        path: string,
        data: object,
        opts: RequestOptions = {}
    ): Promise<HTTPResponse> => {
        return this.fetch('PATCH', cluster, path, opts, data).then(handleResponse);
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
    public delete = (
        cluster: string,
        path: string,
        data: object = {},
        opts: RequestOptions = {}
    ): Promise<HTTPResponse> => {
        return this.fetch('DELETE', cluster, path, opts, data).then(handleResponse);
    }

    private static queueFromPath(path: string, method: HTTPMethod): string {
        if (method === 'POST' && path.match('/search/.*/jobs$')) {
            return SEARCH_SUBMIT_QUEUE;
        }
        const service = path.split('/')[2]; // Default is service from the URL
        if (service) {
            return service;
        }
        return 'default';
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
    /**
     * Named retry queue to use (default is the name of the service)
     */
    queue?: string;
    /**
     * Callback function used to retrieve the status of a request
     */
    statusCallback?: (requestStatus: RequestStatus) => void;
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

export interface RequestStatus {
    status: string;
    request?: object;
}
