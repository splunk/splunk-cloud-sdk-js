import BaseApiService from './baseapiservice';
import { QueryArgs } from './client';
import { ACTION_SERVICE_PREFIX, INGEST_SERVICE_PREFIX } from "./service_prefixes";

/**
 * Encapsulates Ingest service endpoints
 */
export class ActionService extends BaseApiService {
    /**
     * Create a structured event to be ingested by Splunk SSC via Ingest service.
     * @param event
     */
    public getActions = (): Promise<any> => {
        return this.client.get(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions']));
    }

    /**
     * Create structured events to be ingested by Splunk SSC via Ingest service.
     * @param events
     */
    public createAction = (action: Action): Promise<any> => {
        return this.client.post(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions']), action);
    }

}



// ActionKind reflects the kinds of actions supported by the Action service
enum ActionKind {

    email,
    webhook,
    sns,
}

// Action defines the fields for email, sns, and webhooks as one aggregated model
export interface Action {
    // Common action fields:
    // Name of action, all actions have this field
    Name: string ;
    // Kind of action (email, webhook, or sns), all actions have this field
    Kind: ActionKind ;
    // ID of action assigned by action service, all actions have this field
    ID: string ;
    // Email action fields:
    // HTMLPart to send via Email action
    HTMLPart :string ;
    // SubjectPart to send via Email action
    SubjectPart: string ;
    // TextPart to send via Email action
    TextPart: string ;
    // TemplateName to send via Email action
    TemplateName: string ;
    // Addresses to send to when Email action triggered
    Addresses :string[] ;
    // SNS action fields:
    // Topic to trigger SNS action
    Topic: string ;
    // Message to send via SNS or Webhook action
    Message: string ;
    // Webhook action fields:
    // WebhookURL to trigger Webhook action
    WebhookURL: string ;
    // Message string ;message" binding:"required"` (defined above)
}


// ActionStatusState reflects the status of the action

enum ActionStatusState {

    queue = "QUEUED",
    inProgress = "IN PROGRESS",
    done = "DONE",
    failed = "FAILED",
}

// ActionStatus defines the state information
interface ActionStatus {
    State: ActionStatusState;
    ID: string;
    Message: string;
}

// ActionError defines format for returned errors
interface ActionError {
    Code: string;
    Message: string;
}

// ActionNotificationKind defines the types of notifications
enum ActionNotificationKind {
    splunkEvent,
    rawJSON,
}

// ActionNotification defines the action notification format
interface ActionNotification {
    EmailImmediately: boolean;
    Severity: number;
    Kind: ActionNotificationKind;
    Tenant: string;
    UserID: string;
    Payload: any;
}

// SplunkEventPayload is the payload for a notification coming from Splunk
interface SplunkEventPayload {
    Index: string;
    Host: string;
    Source: string;
    Sourcetype: string;
    Raw: string;
    Time: string;
}
