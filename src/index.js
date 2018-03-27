import {NovaProxy} from './nova';
import {SearchProxy} from './search';
import 'isomorphic-fetch';
import { Base64 } from 'js-base64';


function assertResponse(response) {
    if (!response.ok) {
        // TODO: Make this an error model
        throw "This should be an error model"
    }
}

function decodeJson(text) {
    try {
        return JSON.parse(text);
    } catch (e) {
        throw new Error(`Unable to parse message: "${text}"`);
    }
}

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
            return response.text();
        })
        .then(decodeJson);
    }

    post(path, data) {
        this.login();
        return fetch(this.buildUrl(path), {
            method: "POST",
            body: JSON.stringify(data),
            headers: this._buildHeaders()
        }).then(function(response) {
            return response.text();
        }).then(decodeJson);
    }

    /**
     * Temporary method for allowing sync
     * searches as they do not return json
     * @param path
     * @param data
     * @returns {Promise<string>}
     * @deprecated
     */
    postRaw(path, data) {
        this.login()
        return fetch(this.buildUrl(path), {
            method: "POST",
            body: JSON.stringify(data),
            headers: this._buildHeaders()
        }).then(function(response) {
            return response.text();
        });
    }

    put(path, data) {
        this.login();
        return fetch(this.buildUrl(path), {
            method: "PUT",
            body: JSON.stringify(data),
            headers: this._buildHeaders()
        }).then(function(response) {
            return response.text();
        }).then(decodeJson);
    }


    delete(path) {
        this.login();
        return fetch(this.buildUrl(path), {
            method: "DELETE",
            headers: this._buildHeaders()
        }).then(function(response) {
            assertResponse(response, 204);
            return {};
        });
    }
}
