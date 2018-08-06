import BaseApiService from './baseapiservice';
import { ACTION_SERVICE_PREFIX, INGEST_SERVICE_PREFIX } from "./service_prefixes";

/**
 * Encapsulates Ingest service endpoints
 */
export class ActionService extends BaseApiService {
    /**
     * Create a structured event to be ingested by Splunk SSC via Ingest service.
     * @param event
     */
    public getActions = (): Promise<Action[]> => {
        return this.client.get(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions']))
            .then(response => response as Action[]);
    }

    /**
     * Create a structured event to be ingested by Splunk SSC via Ingest service.
     * @param event
     */
    public getAction = (id: Action["Name"]): Promise<Action> => {
        return this.client.get(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', id]))
            .then(response => response as Action);
    }

    /**
     * Create a structured event to be ingested by Splunk SSC via Ingest service.
     * @param event
     */
    public deleteAction = (id: Action["Name"]): Promise<any> => {
        return this.client.delete(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', id]));
    }


    /**
     * Create structured events to be ingested by Splunk SSC via Ingest service.
     * @param events
     */
    public createAction = (action: Action): Promise<Action> => {
        return this.client.post(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions']), action)
            .then(response => response as Action);
    }

    /**
     * Create structured events to be ingested by Splunk SSC via Ingest service.
     * @param events
     */
    public updateAction = (id: Action["Name"], action: ActionUpdateFields): Promise<Action> => {
        return this.client.patch(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', id]), action)
            .then(response => response as Action);
    }

    /**
     * Create structured events to be ingested by Splunk SSC via Ingest service.
     * @param events
     */
    public triggerAction = (id: Action["Name"], notification: ActionNotification): Promise<ActionTriggerResponse> => {
        return this.client.post(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', id]), notification)
            .then(response => {
                const responseStr = response.toString();
                if (responseStr.includes("/status/")) {
                    const parts = responseStr.split("/status/")
                    if (parts.length === 2) {
                        return Promise.resolve({
                            "StatusID": parts[1],
                            "StatusURL": responseStr
                        } as ActionTriggerResponse)
                    }
                }
                return response as ActionTriggerResponse;
            });
    };

    /**
     * Create structured events to be ingested by Splunk SSC via Ingest service.
     * @param events
     */
    public getActionStatus = (id: Action["Name"], statusId: string): Promise<ActionStatus> => {
        return this.client.get(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', id, "status", statusId]))
            .then(response => response as ActionStatus);
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

// ActionTriggerResponse for returning status url and parsed statusID (if possible)
interface ActionTriggerResponse {
    StatusID?:  string;
    StatusURL?: string;
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

// ActionUpdateFields defines the fields that may be updated for an existing Action
interface ActionUpdateFields {
    // ID of action assigned by action service, all actions have this field
    ID: string;
    // Email action fields:
    // HTMLPart to send via Email action
    HTMLPart: string;
    // SubjectPart to send via Email action
    SubjectPart: string;
    // TextPart to send via Email action
    TextPart: string;
    // TemplateName to send via Email action
    TemplateName: string;
    // Addresses to send to when Email action triggered
    Addresses: string[];
    // SNS action fields:
    // Topic to trigger SNS action
    Topic: string;
    // Message to send via SNS or Webhook action
    Message: string;
    // Webhook action fields:
    // WebhookURL to trigger Webhook action
    WebhookURL: string;
    // Message string `json:"message" binding:"required"` (defined above)
}
