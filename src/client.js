"use strict";
/*
Copyright © 2018 Splunk Inc.
SPLUNK CONFIDENTIAL – Use or disclosure of this material in whole or in part
without a valid written license from Splunk Inc. is PROHIBITED.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
exports.__esModule = true;
require("isomorphic-fetch");
var version_1 = require("./version");
var SplunkError = /** @class */ (function (_super) {
    __extends(SplunkError, _super);
    function SplunkError(errorParams) {
        var _this = _super.call(this, errorParams.message) || this;
        _this.errorParams = errorParams;
        return _this;
    }
    return SplunkError;
}(Error));
exports.SplunkError = SplunkError;
/**
 * Interrogates the response, decodes if successful and throws if error
 * @private
 */
function handleResponse(response) {
    if (response.ok) {
        if (response.headers.get('Content-Type') === ContentType.CSV || response.headers.get('Content-Type') === ContentType.GZIP) {
            return response.text()
                .then(function (text) { return ({ body: text, headers: response.headers }); });
        } // else
        return response.text()
            .then(decodeJson)
            .then(function (json) { return ({ body: json, headers: response.headers }); });
    } // else
    return response.text().then(function (text) {
        var err;
        try {
            var json = JSON.parse(text);
            if (!json.message) {
                // TODO: This shouldn't go to production
                console.log("Malformed error message (no message) for endpoint: " + response.url + ". Message: " + text);
            }
            err = new SplunkError({ message: json.message, code: json.code, moreInfo: json.moreInfo, httpStatusCode: response.status, details: json.details });
        }
        catch (ex) {
            var message = response.statusText + " - unable to process response";
            console.error(message, ex);
            err = new SplunkError({ message: message, httpStatusCode: response.status, details: { response: text } });
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
function decodeJson(text) {
    // TODO: change to returning object
    if (text === '') {
        return text;
    }
    try {
        return JSON.parse(text);
    }
    catch (e) {
        throw new Error("Unable to parse message: \"" + text + "\"");
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
var ServiceClient = /** @class */ (function () {
    /**
     * Create a ServiceClient with the given URL and an auth token
     * @param url - Url to Splunk Cloud instance
     * @param token - Authentication token
     * @param tenant - Default tenant ID to use
     * TODO(david): figure out how to manage token refresh
     */
    function ServiceClient(url, token, tenant) {
        this.token = token;
        this.url = url;
        this.tenant = tenant;
    }
    /**
     * Builds the URL from a service + endpoint with query encoded in url
     * (concatenates the URL with the path)
     */
    ServiceClient.prototype.buildUrl = function (path, query) {
        if (query && Object.keys(query).length > 0) {
            var encoder_1 = encodeURIComponent;
            var queryEncoded = Object.keys(query)
                .filter(function (k) { return query[k] != null; }) // filter out undefined and null
                .map(function (k) { return encoder_1(k) + "=" + encoder_1(String(query[k])); })
                .join('&');
            return "" + this.url + path + "?" + queryEncoded;
        }
        return "" + this.url + path;
    };
    /**
     * Builds headers required for request to Splunk Cloud (auth, content-type, etc)
     */
    ServiceClient.prototype.buildHeaders = function (headers) {
        // TODO: Cache
        var requestParamHeaders = new Headers({
            'Authorization': "Bearer " + this.token,
            'Content-Type': ContentType.JSON,
            'Splunk-Client': version_1["default"].useragent + "/" + version_1["default"].version
        });
        if (headers !== undefined && headers !== {}) {
            Object.keys(headers).forEach(function (key) {
                requestParamHeaders.append(key, headers[key]);
            });
        }
        return requestParamHeaders;
    };
    /**
     * Builds a path for a given service call
     * @param servicePrefix The name of the service, with version (search/v1)
     * @param pathname An array of path elements that will be checked and added to the path (['jobs', jobId])
     * @param overrideTenant If supplied, this tenant will be used instead of the tenant associated with this client object
     * @return A fully qualified path to the resource
     */
    ServiceClient.prototype.buildPath = function (servicePrefix, pathname, overrideTenant) {
        var e_1, _a;
        var effectiveTenant = overrideTenant || this.tenant;
        if (!effectiveTenant) {
            throw new Error('No tenant specified');
        }
        var path = "/" + effectiveTenant + servicePrefix + "/" + pathname.join('/');
        try {
            for (var pathname_1 = __values(pathname), pathname_1_1 = pathname_1.next(); !pathname_1_1.done; pathname_1_1 = pathname_1.next()) {
                var elem = pathname_1_1.value;
                if (elem && elem.trim() === '') {
                    throw new Error("Empty elements in path: " + path);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (pathname_1_1 && !pathname_1_1.done && (_a = pathname_1["return"])) _a.call(pathname_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return path;
    };
    /**
     * Performs a GET on the Splunk Cloud environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path Path portion of the URL to request from Splunk
     * @param query Object that contains query parameters
     * @return
     */
    ServiceClient.prototype.get = function (path, query, headers) {
        return fetch(this.buildUrl(path, query), {
            method: 'GET',
            headers: this.buildHeaders(headers)
        })["catch"](function (e) { throw new SplunkError({ message: e.message }); })
            .then(function (response) { return handleResponse(response); });
    };
    /**
     * Performs a POST on the Splunk Cloud environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path Path portion of the URL to request from Splunk
     * @param data Data object (to be converted to JSON) to supply as POST body
     * @param query Object that contains query parameters
     * @return
     */
    ServiceClient.prototype.post = function (path, data, query) {
        return fetch(this.buildUrl(path, query), {
            method: 'POST',
            body: typeof data !== 'string' ? JSON.stringify(data) : data,
            headers: this.buildHeaders()
        })["catch"](function (e) { throw new SplunkError({ message: e.message }); })
            .then(function (response) { return handleResponse(response); });
    };
    /**
     * Performs a PUT on the Splunk Cloud environment with the supplied path.
     * for the most part this is an internal implementation, but is here in
     * case an api endpoint is unsupported by the sdk.
     * @param path Path portion of the url to request from Splunk
     * @param data Data object (to be converted to json) to supply as put body
     * @return
     */
    ServiceClient.prototype.put = function (path, data) {
        return fetch(this.buildUrl(path), {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: this.buildHeaders()
        })["catch"](function (e) { throw new SplunkError({ message: e.message }); })
            .then(function (response) { return handleResponse(response); });
    };
    /**
     * Performs a PATCH on the Splunk Cloud environment with the supplied path.
     * for the most part this is an internal implementation, but is here in
     * case an api endpoint is unsupported by the sdk.
     * @param path Path portion of the url to request from Splunk
     * @param data Data object (to be converted to json) to supply as patch body
     * @return
     */
    ServiceClient.prototype.patch = function (path, data) {
        return fetch(this.buildUrl(path), {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: this.buildHeaders()
        })["catch"](function (e) { throw new SplunkError({ message: e.message }); })
            .then(function (response) { return handleResponse(response); });
    };
    /**
     * Performs a DELETE on the Splunk Cloud environment with the supplied path.
     * For the most part this is an internal implementation, but is here in
     * case an API endpoint is unsupported by the SDK.
     * @param path Path portion of the URL to request from Splunk
     * @param data Data object (to be converted to json) to supply as delete body
     * @param query Object that contains query parameters
     * @return
     */
    ServiceClient.prototype["delete"] = function (path, data, query) {
        var deleteData = data;
        if (data === undefined || data == null) {
            deleteData = {};
        }
        return fetch(this.buildUrl(path, query), {
            method: 'DELETE',
            body: JSON.stringify(deleteData),
            headers: this.buildHeaders()
        })["catch"](function (e) { throw new SplunkError({ message: e.message }); })
            .then(function (response) { return handleResponse(response); });
    };
    return ServiceClient;
}());
exports.ServiceClient = ServiceClient;
var ContentType;
(function (ContentType) {
    ContentType["CSV"] = "text/csv";
    ContentType["GZIP"] = "application/gzip";
    ContentType["JSON"] = "application/json";
})(ContentType = exports.ContentType || (exports.ContentType = {}));
//# sourceMappingURL=client.js.map