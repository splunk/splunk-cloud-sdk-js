import {NovaProxy} from './nova';
import {SearchProxy} from './search';
import 'isomorphic-fetch';
import { Base64 } from 'js-base64';


class SplunkError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

function handleResponse(response) {
    if (response.ok) {
        return response.text().then(decodeJson);
    } else {
        return response.text().then(function(text) {
            var err;
            try {
                var json = JSON.parse(text);
                err = new SplunkError(json.message, response.status);
                err.code = json.code;
            } catch(ex) {
                var err = new SplunkError(`Unknown error: ${text}`, response.status);
            }
            throw err;
        });
    }
    if (!response.ok) {
        var text = response.text();
        try {
            throw new Error(decodeJson(text).message);
        } catch(err) {
            throw new Error(`Unknown error: ${text}`);
        }
    }
}

function decodeJson(text) {
    if (text != "") {
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error(`Unable to parse message: "${text}"`);
        }
    } else {
        return "";
    }
}

/**
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

    buildUrl(path) {
        return this.url + path;
    }

    login() {
        // TODO: Check token
        if (!this.token) {
            this.token = Base64.encode(`${this.user}:${this.pass}`);
        }
    }

    _buildHeaders() {
        // TODO: Cache
        return new Headers({
            'Authorization': `Basic ${this.token}`,
            'Content-Type': 'application/json'
        });
    }

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
}
