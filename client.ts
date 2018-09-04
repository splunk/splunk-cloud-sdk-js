/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/

import 'isomorphic-fetch';
import agent from './version';

export interface SplunkErrorParams {
    message: string;
    code?: string;
    httpStatusCode?:number;
    details?:object;
    moreInfo?:string;
}

export class SplunkError extends Error implements SplunkErrorParams {

    public errorParams: SplunkErrorParams;

    constructor(errorParams: SplunkErrorParams) {
        super(errorParams.message);
        this.errorParams = errorParams;
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
            err = new SplunkError({ message:json.message,code:json.code,moreInfo:json.moreInfo,httpStatusCode:response.status,details:json.details } );
        } catch (ex) {
            const message = `${response.statusText} - unable to process response`;
            console.error(message, ex);
            err = new SplunkError( { message,httpStatusCode:response.status,details: { response: text } } );
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

/**
 * This class acts as a raw proxy for Splunk Cloud, implementing
 * authorization for requests, setting the proper headers,
 * and GET, POST, etc.  For the most part you shouldn't need
 * to use this class directly- look at the service proxies
 * that implement the actual endpoints.
 * TODO: Add links to actual endpoints, Splunk Cloud name
 */
export class ServiceClient {
    private readonly token: string;
    private readonly url: string;
    private readonly tenant?: string;

    /**
     * Create a ServiceClient with the given URL and an auth token
     * @param url - Url to Splunk Cloud instance
     * @param token - Authentication token
     * @param tenant - Default tenant ID to use
     * TODO(david): figure out how to manage token refresh
     */
    constructor(url: string, token: string, tenant?: string) {
        this.token = token;
        this.url = url;
        this.tenant = tenant;
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
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': ContentType.JSON,
            // Disabled until we sort out CORS issue
            // 'splunk-client':`${agent.useragent}/${agent.version}`,
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
     * Performs a GET on the Splunk Cloud environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path Path portion of the URL to request from Splunk
     * @param query Object that contains query parameters
     * @return
     */
    public get(path: string, query?: QueryArgs, headers?: RequestHeaders): Promise<HTTPResponse> {
        return fetch(this.buildUrl(path, query), {
            method: 'GET',
            headers: this.buildHeaders(headers),
        }).catch( e => {throw new SplunkError({ message: e.message })})
          .then((response: Response) => handleResponse(response));
    }

    /**
     * Performs a POST on the Splunk Cloud environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path Path portion of the URL to request from Splunk
     * @param data Data object (to be converted to JSON) to supply as POST body
     * @param query Object that contains query parameters
     * @return
     */
    public post(path: string, data: any, query?: QueryArgs): Promise<HTTPResponse> {
        return fetch(this.buildUrl(path, query), {
            method: 'POST',
            body: typeof data !== 'string' ? JSON.stringify(data) : data,
            headers: this.buildHeaders(),
        }).catch( e => {throw new SplunkError({ message: e.message })})
          .then((response: Response) => handleResponse(response));
    }

    /**
     * Performs a PUT on the Splunk Cloud environment with the supplied path.
     * for the most part this is an internal implementation, but is here in
     * case an api endpoint is unsupported by the sdk.
     * @param path Path portion of the url to request from Splunk
     * @param data Data object (to be converted to json) to supply as put body
     * @return
     */
    public put(path: string, data: any): Promise<HTTPResponse> {
        return fetch(this.buildUrl(path), {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: this.buildHeaders(),
        }).catch( e => {throw new SplunkError({ message: e.message })})
          .then((response: Response) => handleResponse(response));
    }

    /**
     * Performs a PATCH on the Splunk Cloud environment with the supplied path.
     * for the most part this is an internal implementation, but is here in
     * case an api endpoint is unsupported by the sdk.
     * @param path Path portion of the url to request from Splunk
     * @param data Data object (to be converted to json) to supply as patch body
     * @return
     */
    public patch(path: string, data: object): Promise<HTTPResponse> {
        return fetch(this.buildUrl(path), {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: this.buildHeaders(),
        }).catch( e => {throw new SplunkError({ message: e.message })})
          .then((response: Response) => handleResponse(response));
    }

    /**
     * Performs a DELETE on the Splunk Cloud environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path Path portion of the URL to request from Splunk
     * @param data Data object (to be converted to json) to supply as delete body
     * @param query Object that contains query parameters
     * @return
     */
    public delete(path: string, data?: object, query?: QueryArgs): Promise<HTTPResponse> {
        let deleteData = data;
        if (data === undefined || data == null) {
            deleteData = {};
        }
        return fetch(this.buildUrl(path, query), {
            method: 'DELETE',
            body: JSON.stringify(deleteData),
            headers: this.buildHeaders(),
        }).catch( e => {throw new SplunkError({ message: e.message })})
          .then((response: Response) => handleResponse(response));
    }
}

export interface QueryArgs {
    [key: string]: string | number | undefined;
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
