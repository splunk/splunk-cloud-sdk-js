/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import { AuthManager } from './auth_manager';
import agent from './version';

const DEFAULT_URL = 'https://api.splunkbeta.com';

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

    constructor(errorParams: SplunkErrorParams) {
        super(errorParams.message);
        this.code = errorParams.code;
        this.details = errorParams.details;
        this.moreInfo = errorParams.moreInfo;
        this.httpStatusCode = errorParams.httpStatusCode;
    }
}

/**
 * Interrogates the response, decodes if successful and throws if error
 * @private
 */
function handleResponse(response: Response): Promise<HTTPResponse> {

    if (response.ok) {
        if (response.headers.get('Content-Type') === ContentType.CSV || response.headers.get('Content-Type') === ContentType.GZIP) {
            return response.text()
                .then(text => ({ body: text, headers: response.headers }));
        } // else
        return response.text()
            .then(decodeJson)
            .then(json => ({ body: json, headers: response.headers }));
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
            err = new SplunkError({ message: json.message, code: json.code, moreInfo: json.moreInfo, httpStatusCode: response.status, details: json.details });
        } catch (ex) {
            const message = `${response.statusText} - unable to process response`;
            err = new SplunkError({ message, httpStatusCode: response.status, details: { response: text } });
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
function decodeJson(text: string): any {
    // TODO: change to returning object
    if (text === '') {
        return text;
    }
    try {
        return JSON.parse(text);
    } catch (e) {
        throw new Error(`Unable to parse message: "${text}"`);
    }
}

export type ResponseHook = (response: Response) => Promise<Response> | any;
export type TokenProviderFunction = () => string;
export interface ServiceClientArgs {
    url?: string;
    tokenSource: AuthManager | string | TokenProviderFunction;
    defaultTenant?: string;
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
    private readonly url: string;
    private readonly tenant?: string;
    private responseHooks: ResponseHook[] = [];

    /**
     * Create a ServiceClient with the given URL and an auth token
     * @param args : ServiceClientArgs Url to Splunk Cloud instance
     */
    constructor(args: ServiceClientArgs | string, token?: string, tenant?: string) {
        if (typeof args === 'string') {
            if (typeof token === 'string') {
                this.tokenSource = () => token;
            } else {
                throw new SplunkError({ message: 'No auth token supplied.' });
            }
            this.url = args;
            this.tenant = tenant;
        } else {
            const authManager = args.tokenSource;
            if (typeof authManager === 'string') {
                // If we have a string, wrap it in a lambda
                this.tokenSource = () => authManager;
            } else if (typeof authManager === 'function') {
                // If we have a function, just call it when we need a token
                this.tokenSource = authManager;
            } else {
                // Else wrap a token manager.
                this.tokenSource = () => authManager.getAccessToken();
            }
            this.url = args.url || DEFAULT_URL;
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
    public addResponseHook(hook: ResponseHook) {
        this.responseHooks.push(hook);
    }

    /**
     * Clears response hooks from the client
     */
    public clearResponseHooks() {
        this.responseHooks = [];
    }

    private invokeHooks(response: Response): Promise<Response> {
        return this.responseHooks.reduce((result: Promise<Response>, cb: ResponseHook): Promise<Response> => {
            // Result starts as a known good Promise<Result>
            return result.then((chainResponse) => {
                // Call the callback, get the result
                let cbResult;
                try {
                    cbResult = cb.call(null, chainResponse);
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
    private buildUrl(path: string, query?: QueryArgs): string {
        if (query && Object.keys(query).length > 0) {
            const encoder = encodeURIComponent;
            const queryEncoded = Object.keys(query)
                .filter(k => query[k] != null) // filter out undefined and null
                .map(k => `${encoder(k)}=${encoder(String(query[k]))}`)
                .join('&');

            return `${this.url}${path}?${queryEncoded}`;
        }

        return `${this.url}${path}`;
    }

    /**
     * Builds headers required for request to Splunk Cloud (auth, content-type, etc)
     */
    private buildHeaders(headers?: RequestHeaders): Headers {
        // TODO: Cache

        const requestParamHeaders: Headers = new Headers({
            'Authorization': `Bearer ${this.tokenSource()}`,
            'Content-Type': ContentType.JSON,
            'Splunk-Client': `${agent.useragent}/${agent.version}`,
        });

        if (headers !== undefined && headers !== {}) {
            Object.keys(headers).forEach(key => {
                requestParamHeaders.append(key, headers[key])
            })
        }
        return requestParamHeaders;
    }

    /**
     * Builds a path for a given service call
     * @param servicePrefix The name of the service, with version (search/v1)
     * @param pathname An array of path elements that will be checked and added to the path (['jobs', jobId])
     * @param overrideTenant If supplied, this tenant will be used instead of the tenant associated with this client object
     * @return A fully qualified path to the resource
     */
    public buildPath(servicePrefix: string, pathname: string[], overrideTenant?: string): string {
        const effectiveTenant = overrideTenant || this.tenant;
        if (!effectiveTenant) {
            throw new Error('No tenant specified');
        }
        const path = `/${effectiveTenant}${servicePrefix}/${pathname.join('/')}`;
        for (const elem of pathname) {
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
    public fetch(method: HTTPMethod, path: string, opts: RequestOptions = {}, data?: any): Promise<Response> {
        const url = this.buildUrl(path, opts.query)
        const options = {
            method,
            headers: this.buildHeaders(opts.headers),
            body: typeof data !== 'string' ? JSON.stringify(data) : data,
        }

        return fetch(url, options).then(response => this.invokeHooks(response));

    }

    /**
     * Performs a GET on the Splunk Cloud environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path Path portion of the URL to request from Splunk
     * @param opts Request options
     * @return
     */
    public get(path: string, opts: RequestOptions = {}): Promise<HTTPResponse> {
        return this.fetch('GET', path, opts)
            .then((response: Response) => handleResponse(response));
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
    public post(path: string, data: any, opts: RequestOptions = {}): Promise<HTTPResponse> {
        return this.fetch('POST', path, opts, data)
            .then((response: Response) => handleResponse(response));
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
    public put(path: string, data: any, opts: RequestOptions = {}): Promise<HTTPResponse> {
        return this.fetch('PUT', path, opts, data)
            .then((response: Response) => handleResponse(response));
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
    public patch(path: string, data: object, opts: RequestOptions = {}): Promise<HTTPResponse> {
        return this.fetch('PATCH', path, opts, data)
            .then((response: Response) => handleResponse(response));
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
    public delete(path: string, data: object = {}, opts: RequestOptions = {}): Promise<HTTPResponse> {
        return this.fetch('DELETE', path, opts, data)
            .then((response: Response) => handleResponse(response));
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
}
