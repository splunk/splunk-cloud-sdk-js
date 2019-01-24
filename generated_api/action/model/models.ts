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
export * from './notification';
export * from './splunkEventPayload';
export * from './webhookAction';
export * from './webhookActionMutable';

import localVarRequest = require('request');

import { Action } from './action';
import { ActionCommon } from './actionCommon';
import { ActionMutable } from './actionMutable';
import { ActionMutableCommon } from './actionMutableCommon';
import { ActionResult } from './actionResult';
import { DeprecatedAction } from './deprecatedAction';
import { DeprecatedActionCommon } from './deprecatedActionCommon';
import { DeprecatedActionMutable } from './deprecatedActionMutable';
import { DeprecatedActionMutableCommon } from './deprecatedActionMutableCommon';
import { DeprecatedEmailAction } from './deprecatedEmailAction';
import { DeprecatedSNSAction } from './deprecatedSNSAction';
import { DeprecatedWebhookAction } from './deprecatedWebhookAction';
import { EmailAction } from './emailAction';
import { EmailActionMutable } from './emailActionMutable';
import { ModelError } from './modelError';
import { MutableDeprecatedEmailAction } from './mutableDeprecatedEmailAction';
import { MutableDeprecatedSNSAction } from './mutableDeprecatedSNSAction';
import { MutableDeprecatedWebhookAction } from './mutableDeprecatedWebhookAction';
import { Notification } from './notification';
import { SplunkEventPayload } from './splunkEventPayload';
import { WebhookAction } from './webhookAction';
import { WebhookActionMutable } from './webhookActionMutable';

/* tslint:disable:no-unused-variable */
const primitives = ['string', 'boolean', 'double', 'integer', 'long', 'float', 'number', 'any'];

const enumsMap: { [index: string]: any } = {
    'Action.KindEnum': Action.KindEnum,
    'ActionCommon.KindEnum': ActionCommon.KindEnum,
    'ActionResult.StateEnum': ActionResult.StateEnum,
    'DeprecatedAction.KindEnum': DeprecatedAction.KindEnum,
    'DeprecatedActionCommon.KindEnum': DeprecatedActionCommon.KindEnum,
    'DeprecatedEmailAction.KindEnum': DeprecatedEmailAction.KindEnum,
    'DeprecatedSNSAction.KindEnum': DeprecatedSNSAction.KindEnum,
    'DeprecatedWebhookAction.KindEnum': DeprecatedWebhookAction.KindEnum,
    'EmailAction.KindEnum': EmailAction.KindEnum,
    'Notification.KindEnum': Notification.KindEnum,
    'WebhookAction.KindEnum': WebhookAction.KindEnum,
};

const typeMap: { [index: string]: any } = {
    Action,
    ActionCommon,
    ActionMutable,
    ActionMutableCommon,
    ActionResult,
    DeprecatedAction,
    DeprecatedActionCommon,
    DeprecatedActionMutable,
    DeprecatedActionMutableCommon,
    DeprecatedEmailAction,
    DeprecatedSNSAction,
    DeprecatedWebhookAction,
    EmailAction,
    EmailActionMutable,
    ModelError,
    MutableDeprecatedEmailAction,
    MutableDeprecatedSNSAction,
    MutableDeprecatedWebhookAction,
    Notification,
    SplunkEventPayload,
    WebhookAction,
    WebhookActionMutable,
};

export class ObjectSerializer {
    public static findCorrectType(data: any, expectedType: string) {
        if (data === undefined) {
            return expectedType;
        } else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        } else if (expectedType === 'Date') {
            return expectedType;
        } else {
            if (enumsMap[expectedType]) {
                return expectedType;
            }

            if (!typeMap[expectedType]) {
                return expectedType; // w/e we don't know the type
            }

            // Check the discriminator
            const discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty === null) {
                return expectedType; // the type does not have a discriminator. use it.
            } else {
                if (data[discriminatorProperty]) {
                    const discriminatorType = data[discriminatorProperty];
                    if (typeMap[discriminatorType]) {
                        return discriminatorType; // use the type given in the discriminator
                    } else {
                        return expectedType; // discriminator did not map to a type
                    }
                } else {
                    return expectedType; // discriminator was not present (or an empty string)
                }
            }
        }
    }

    public static serialize(data: any, type: string) {
        if (data === undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf('Array<', 0) === 0) {
            // string.startsWith pre es6
            let subType: string = type.replace('Array<', ''); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            const transformedData: any[] = [];
            for (const index in data) {
                const date = data[index];
                transformedData.push(ObjectSerializer.serialize(date, subType));
            }
            return transformedData;
        } else if (type === 'Date') {
            return data.toISOString();
        } else {
            if (enumsMap[type]) {
                return data;
            }
            if (!typeMap[type]) {
                // in case we dont know the type
                return data;
            }

            // Get the actual type of this object
            type = this.findCorrectType(data, type);

            // get the map for the correct type.
            const attributeTypes = typeMap[type].getAttributeTypeMap();
            const instance: { [index: string]: any } = {};
            for (const index in attributeTypes) {
                const attributeType = attributeTypes[index];
                instance[attributeType.baseName] = ObjectSerializer.serialize(
                    data[attributeType.name],
                    attributeType.type
                );
            }
            return instance;
        }
    }

    public static deserialize(data: any, type: string) {
        // polymorphism may change the actual type.
        type = ObjectSerializer.findCorrectType(data, type);
        if (data === undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf('Array<', 0) === 0) {
            // string.startsWith pre es6
            let subType: string = type.replace('Array<', ''); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            const transformedData: any[] = [];
            for (const index in data) {
                const date = data[index];
                transformedData.push(ObjectSerializer.deserialize(date, subType));
            }
            return transformedData;
        } else if (type === 'Date') {
            return new Date(data);
        } else {
            if (enumsMap[type]) {
                // is Enum
                return data;
            }

            if (!typeMap[type]) {
                // dont know the type
                return data;
            }
            const instance = new typeMap[type]();
            const attributeTypes = typeMap[type].getAttributeTypeMap();
            for (const index in attributeTypes) {
                const attributeType = attributeTypes[index];
                instance[attributeType.name] = ObjectSerializer.deserialize(
                    data[attributeType.baseName],
                    attributeType.type
                );
            }
            return instance;
        }
    }
}

export interface Authentication {
    /**
     * Apply authentication settings to header and query params.
     */
    applyToRequest(requestOptions: localVarRequest.Options): void;
}

export class HttpBasicAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    public applyToRequest(requestOptions: localVarRequest.Options): void {
        requestOptions.auth = {
            username: this.username,
            password: this.password,
        };
    }
}

export class ApiKeyAuth implements Authentication {
    public apiKey: string = '';

    constructor(private location: string, private paramName: string) {}

    public applyToRequest(requestOptions: localVarRequest.Options): void {
        if (this.location === 'query') {
            (requestOptions.qs as any)[this.paramName] = this.apiKey;
        } else if (this.location === 'header' && requestOptions && requestOptions.headers) {
            requestOptions.headers[this.paramName] = this.apiKey;
        }
    }
}

export class OAuth implements Authentication {
    public accessToken: string = '';

    public applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers.Authorization = `Bearer ${this.accessToken}`;
        }
    }
}

export class VoidAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    public applyToRequest(_: localVarRequest.Options): void {
        // Do nothing
    }
}
