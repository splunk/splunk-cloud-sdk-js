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
import { Action } from '../model/action';
import { ActionMutable } from '../model/actionMutable';
import { ActionResult } from '../model/actionResult';
import { Notification } from '../model/notification';
import { ServiceError } from '../model/serviceError';

import { ObjectSerializer, Authentication, HttpBasicAuth, ApiKeyAuth, OAuth, VoidAuth } from '../model/models';

let defaultBasePath = 'https://api.splunkbeta.com';

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

export enum V1beta2ApiApiKeys {
}

export class V1beta2Api {
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

    public setApiKey(key: V1beta2ApiApiKeys, value: string) {
        (this.authentications as any)[V1beta2ApiApiKeys[key]].apiKey = value;
    }

    /**
     * 
     * @summary Create an action object template.
     * @param tenant Tenant name/identifier
     * @param authorization Access token provided by the user (obtained from a known identity provider).
     * @param action The action object template to create.
     */
    public createAction (tenant: string, authorization: string, action: Action, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: Action;  }> {
        const localVarPath = this.basePath + '/{tenant}/action/v1beta2/actions'
            .replace('{' + 'tenant' + '}', encodeURIComponent(String(tenant)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'tenant' is not null or undefined
        if (tenant === null || tenant === undefined) {
            throw new Error('Required parameter tenant was null or undefined when calling createAction.');
        }

        // verify required parameter 'authorization' is not null or undefined
        if (authorization === null || authorization === undefined) {
            throw new Error('Required parameter authorization was null or undefined when calling createAction.');
        }

        // verify required parameter 'action' is not null or undefined
        if (action === null || action === undefined) {
            throw new Error('Required parameter action was null or undefined when calling createAction.');
        }

        localVarHeaderParams['Authorization'] = ObjectSerializer.serialize(authorization, "string");
        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'POST',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
            body: ObjectSerializer.serialize(action, "Action")
        };

        this.authentications.default.applyToRequest(localVarRequestOptions);

        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                (<any>localVarRequestOptions).formData = localVarFormParams;
            } else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: Action;  }>((resolve, reject) => {
            localVarRequest(localVarRequestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    body = ObjectSerializer.deserialize(body, "Action");
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    }
    /**
     * 
     * @summary Delete an action object template.
     * @param tenant Tenant name/identifier
     * @param authorization Access token provided by the user (obtained from a known identity provider).
     * @param actionName The name of the action object to retrieve.
     */
    public deleteAction (tenant: string, authorization: string, actionName: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body?: any;  }> {
        const localVarPath = this.basePath + '/{tenant}/action/v1beta2/actions/{action_name}'
            .replace('{' + 'tenant' + '}', encodeURIComponent(String(tenant)))
            .replace('{' + 'action_name' + '}', encodeURIComponent(String(actionName)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'tenant' is not null or undefined
        if (tenant === null || tenant === undefined) {
            throw new Error('Required parameter tenant was null or undefined when calling deleteAction.');
        }

        // verify required parameter 'authorization' is not null or undefined
        if (authorization === null || authorization === undefined) {
            throw new Error('Required parameter authorization was null or undefined when calling deleteAction.');
        }

        // verify required parameter 'actionName' is not null or undefined
        if (actionName === null || actionName === undefined) {
            throw new Error('Required parameter actionName was null or undefined when calling deleteAction.');
        }

        localVarHeaderParams['Authorization'] = ObjectSerializer.serialize(authorization, "string");
        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'DELETE',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
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
    /**
     * 
     * @summary Return a specific action object.
     * @param tenant Tenant name/identifier
     * @param authorization Access token provided by the user (obtained from a known identity provider).
     * @param actionName The name of the action object to retrieve.
     */
    public getAction (tenant: string, authorization: string, actionName: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: Action;  }> {
        const localVarPath = this.basePath + '/{tenant}/action/v1beta2/actions/{action_name}'
            .replace('{' + 'tenant' + '}', encodeURIComponent(String(tenant)))
            .replace('{' + 'action_name' + '}', encodeURIComponent(String(actionName)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'tenant' is not null or undefined
        if (tenant === null || tenant === undefined) {
            throw new Error('Required parameter tenant was null or undefined when calling getAction.');
        }

        // verify required parameter 'authorization' is not null or undefined
        if (authorization === null || authorization === undefined) {
            throw new Error('Required parameter authorization was null or undefined when calling getAction.');
        }

        // verify required parameter 'actionName' is not null or undefined
        if (actionName === null || actionName === undefined) {
            throw new Error('Required parameter actionName was null or undefined when calling getAction.');
        }

        localVarHeaderParams['Authorization'] = ObjectSerializer.serialize(authorization, "string");
        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };

        this.authentications.default.applyToRequest(localVarRequestOptions);

        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                (<any>localVarRequestOptions).formData = localVarFormParams;
            } else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: Action;  }>((resolve, reject) => {
            localVarRequest(localVarRequestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    body = ObjectSerializer.deserialize(body, "Action");
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    }
    /**
     * 
     * @summary Get triggered action's execution status.
     * @param tenant Tenant name/identifier
     * @param authorization Access token provided by the user (obtained from a known identity provider).
     * @param actionName Name of the triggered action.
     * @param statusId ID for the action status.
     */
    public getActionStatus (tenant: string, authorization: string, actionName: string, statusId: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: ActionResult;  }> {
        const localVarPath = this.basePath + '/{tenant}/action/v1beta2/actions/{action_name}/status/{status_id}'
            .replace('{' + 'tenant' + '}', encodeURIComponent(String(tenant)))
            .replace('{' + 'action_name' + '}', encodeURIComponent(String(actionName)))
            .replace('{' + 'status_id' + '}', encodeURIComponent(String(statusId)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'tenant' is not null or undefined
        if (tenant === null || tenant === undefined) {
            throw new Error('Required parameter tenant was null or undefined when calling getActionStatus.');
        }

        // verify required parameter 'authorization' is not null or undefined
        if (authorization === null || authorization === undefined) {
            throw new Error('Required parameter authorization was null or undefined when calling getActionStatus.');
        }

        // verify required parameter 'actionName' is not null or undefined
        if (actionName === null || actionName === undefined) {
            throw new Error('Required parameter actionName was null or undefined when calling getActionStatus.');
        }

        // verify required parameter 'statusId' is not null or undefined
        if (statusId === null || statusId === undefined) {
            throw new Error('Required parameter statusId was null or undefined when calling getActionStatus.');
        }

        localVarHeaderParams['Authorization'] = ObjectSerializer.serialize(authorization, "string");
        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };

        this.authentications.default.applyToRequest(localVarRequestOptions);

        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                (<any>localVarRequestOptions).formData = localVarFormParams;
            } else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: ActionResult;  }>((resolve, reject) => {
            localVarRequest(localVarRequestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    body = ObjectSerializer.deserialize(body, "ActionResult");
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    }
    /**
     * 
     * @summary Get the list of created action object templates.
     * @param tenant Tenant name/identifier
     * @param authorization Access token provided by the user (obtained from a known identity provider).
     */
    public getActions (tenant: string, authorization: string, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: Array<Action>;  }> {
        const localVarPath = this.basePath + '/{tenant}/action/v1beta2/actions'
            .replace('{' + 'tenant' + '}', encodeURIComponent(String(tenant)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'tenant' is not null or undefined
        if (tenant === null || tenant === undefined) {
            throw new Error('Required parameter tenant was null or undefined when calling getActions.');
        }

        // verify required parameter 'authorization' is not null or undefined
        if (authorization === null || authorization === undefined) {
            throw new Error('Required parameter authorization was null or undefined when calling getActions.');
        }

        localVarHeaderParams['Authorization'] = ObjectSerializer.serialize(authorization, "string");
        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };

        this.authentications.default.applyToRequest(localVarRequestOptions);

        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                (<any>localVarRequestOptions).formData = localVarFormParams;
            } else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: Array<Action>;  }>((resolve, reject) => {
            localVarRequest(localVarRequestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    body = ObjectSerializer.deserialize(body, "Array<Action>");
                    if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response: response, body: body });
                    } else {
                        reject({ response: response, body: body });
                    }
                }
            });
        });
    }
    /**
     * 
     * @summary Trigger an action from a notification.
     * @param tenant Tenant name/identifier
     * @param authorization Access token provided by the user (obtained from a known identity provider).
     * @param actionName The name of the action object to retrieve.
     * @param notification The payload for the action.
     */
    public triggerAction (tenant: string, authorization: string, actionName: string, notification: Notification, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body?: any;  }> {
        const localVarPath = this.basePath + '/{tenant}/action/v1beta2/actions/{action_name}'
            .replace('{' + 'tenant' + '}', encodeURIComponent(String(tenant)))
            .replace('{' + 'action_name' + '}', encodeURIComponent(String(actionName)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'tenant' is not null or undefined
        if (tenant === null || tenant === undefined) {
            throw new Error('Required parameter tenant was null or undefined when calling triggerAction.');
        }

        // verify required parameter 'authorization' is not null or undefined
        if (authorization === null || authorization === undefined) {
            throw new Error('Required parameter authorization was null or undefined when calling triggerAction.');
        }

        // verify required parameter 'actionName' is not null or undefined
        if (actionName === null || actionName === undefined) {
            throw new Error('Required parameter actionName was null or undefined when calling triggerAction.');
        }

        // verify required parameter 'notification' is not null or undefined
        if (notification === null || notification === undefined) {
            throw new Error('Required parameter notification was null or undefined when calling triggerAction.');
        }

        localVarHeaderParams['Authorization'] = ObjectSerializer.serialize(authorization, "string");
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
    /**
     * 
     * @summary Update an action template object.
     * @param tenant Tenant name/identifier
     * @param authorization Access token provided by the user (obtained from a known identity provider).
     * @param actionName The name of the action object to retrieve.
     * @param actionMutable The desired updates to the action object.
     */
    public updateAction (tenant: string, authorization: string, actionName: string, actionMutable: ActionMutable, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.ClientResponse; body: Action;  }> {
        const localVarPath = this.basePath + '/{tenant}/action/v1beta2/actions/{action_name}'
            .replace('{' + 'tenant' + '}', encodeURIComponent(String(tenant)))
            .replace('{' + 'action_name' + '}', encodeURIComponent(String(actionName)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this.defaultHeaders);
        let localVarFormParams: any = {};

        // verify required parameter 'tenant' is not null or undefined
        if (tenant === null || tenant === undefined) {
            throw new Error('Required parameter tenant was null or undefined when calling updateAction.');
        }

        // verify required parameter 'authorization' is not null or undefined
        if (authorization === null || authorization === undefined) {
            throw new Error('Required parameter authorization was null or undefined when calling updateAction.');
        }

        // verify required parameter 'actionName' is not null or undefined
        if (actionName === null || actionName === undefined) {
            throw new Error('Required parameter actionName was null or undefined when calling updateAction.');
        }

        // verify required parameter 'actionMutable' is not null or undefined
        if (actionMutable === null || actionMutable === undefined) {
            throw new Error('Required parameter actionMutable was null or undefined when calling updateAction.');
        }

        localVarHeaderParams['Authorization'] = ObjectSerializer.serialize(authorization, "string");
        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'PATCH',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
            body: ObjectSerializer.serialize(actionMutable, "ActionMutable")
        };

        this.authentications.default.applyToRequest(localVarRequestOptions);

        if (Object.keys(localVarFormParams).length) {
            if (localVarUseFormData) {
                (<any>localVarRequestOptions).formData = localVarFormParams;
            } else {
                localVarRequestOptions.form = localVarFormParams;
            }
        }
        return new Promise<{ response: http.ClientResponse; body: Action;  }>((resolve, reject) => {
            localVarRequest(localVarRequestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    body = ObjectSerializer.deserialize(body, "Action");
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
