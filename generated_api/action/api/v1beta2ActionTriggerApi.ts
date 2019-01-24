/**
 * Action Service
 * A service that receives incoming notifications and uses pre-defined templates (action objects) to turn those notifications into meaningful actions.
 *
 * OpenAPI spec version: v1beta2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import localVarRequest = require('request');
import http = require('http');
import Promise = require('bluebird');

/* tslint:disable:no-unused-locals */
import { Notification } from '../model/notification';

import { ObjectSerializer, Authentication, HttpBasicAuth, ApiKeyAuth, OAuth, VoidAuth } from '../model/models';

let defaultBasePath = 'https://api.splunkbeta.com';

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

export enum V1beta2ActionTriggerApiApiKeys {
}

export class V1beta2ActionTriggerApi {
    protected _basePath = defaultBasePath;
    protected defaultHeaders : any = {};
    protected _useQuerystring : boolean = false;

    protected authentications = {
        'default': <Authentication>new VoidAuth(),
    }

    constructor(basePath?: string);
    constructor(basePathOrUsername: string, password?: string, basePath?: string) {
        if (password) {
            if (basePath) {
                this.basePath = basePath;
            }
        } else {
            if (basePathOrUsername) {
                this.basePath = basePathOrUsername
            }
        }
    }

    set useQuerystring(value: boolean) {
        this._useQuerystring = value;
    }

    set basePath(basePath: string) {
        this._basePath = basePath;
    }

    get basePath() {
        return this._basePath;
    }

    public setDefaultAuthentication(auth: Authentication) {
        this.authentications.default = auth;
    }

    public setApiKey(key: V1beta2ActionTriggerApiApiKeys, value: string) {
        (this.authentications as any)[V1beta2ActionTriggerApiApiKeys[key]].apiKey = value;
    }

    /**
     * 
     * @summary Trigger an action from a notification.
     * @param actionName The name of the action to trigger.
     * @param tenant Tenant name/identifier
     * @param notification The payload for the action.
     */
    public triggerAction (actionName: string, tenant: string, notification: Notification, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body?: any;  }> {
        const localVarPath = this.basePath + '/{tenant}/action/v1beta2/actions/{action_name}'
            .replace('{' + 'action_name' + '}', encodeURIComponent(String(actionName)))
            .replace('{' + 'tenant' + '}', encodeURIComponent(String(tenant)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'actionName' is not null or undefined
        if (actionName === null || actionName === undefined) {
            throw new Error('Required parameter actionName was null or undefined when calling triggerAction.');
        }

        // verify required parameter 'tenant' is not null or undefined
        if (tenant === null || tenant === undefined) {
            throw new Error('Required parameter tenant was null or undefined when calling triggerAction.');
        }

        // verify required parameter 'notification' is not null or undefined
        if (notification === null || notification === undefined) {
            throw new Error('Required parameter notification was null or undefined when calling triggerAction.');
        }

        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'POST',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
            body: ObjectSerializer.serialize(notification, "Notification")
        };

        this.authentications.default.applyToRequest(localVarRequestOptions);

        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                (<any>localVarRequestOptions).formData = localVarFormParams;
            } else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body?: any;  }>((resolve, reject) => {
            localVarRequest(localVarRequestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    }
}