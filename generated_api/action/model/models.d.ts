export * from './action';
export * from './actionCommon';
export * from './actionMutable';
export * from './actionMutableCommon';
export * from './actionResult';
export * from './deprecatedAction';
export * from './deprecatedActionCommon';
export * from './deprecatedActionMutable';
export * from './deprecatedActionMutableCommon';
export * from './deprecatedEmailAction';
export * from './deprecatedSNSAction';
export * from './deprecatedWebhookAction';
export * from './emailAction';
export * from './emailActionMutable';
export * from './modelError';
export * from './mutableDeprecatedEmailAction';
export * from './mutableDeprecatedSNSAction';
export * from './mutableDeprecatedWebhookAction';
export * from './splunkEventPayload';
export * from './webhookAction';
export * from './webhookActionMutable';
import localVarRequest = require('request');
export declare class ObjectSerializer {
    static findCorrectType(data: any, expectedType: string): any;
    static serialize(data: any, type: string): any;
    static deserialize(data: any, type: string): any;
}
export interface Authentication {
    /**
     * Apply authentication settings to header and query params.
     */
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class HttpBasicAuth implements Authentication {
    username: string;
    password: string;
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class ApiKeyAuth implements Authentication {
    private location;
    private paramName;
    apiKey: string;
    constructor(location: string, paramName: string);
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class OAuth implements Authentication {
    accessToken: string;
    applyToRequest(requestOptions: localVarRequest.Options): void;
}
export declare class VoidAuth implements Authentication {
    username: string;
    password: string;
    applyToRequest(_: localVarRequest.Options): void;
}
