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
    public getAction = (id: Action["name"]): Promise<Action> => {
        return this.client.get(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', id]))
            .then(response => response as Action);
    }

    /**
     * Create a structured event to be ingested by Splunk SSC via Ingest service.
     * @param event
     */
    public deleteAction = (id: Action["name"]): Promise<any> => {
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
    public updateAction = (id: Action["name"], action: ActionUpdateFields): Promise<Action> => {
        return this.client.patch(this.client.buildPath(ACTION_SERVICE_PREFIX, ['actions', id]), action)
            .then(response => response as Action);
    }

    /**
     * Create structured events to be ingested by Splunk SSC via Ingest service.
     * @param events
     */
    public triggerAction = (id: Action["name"], notification: ActionNotification): Promise<ActionTriggerResponse> => {
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
    public getActionStatus = (id: Action["name"], statusId: string): Promise<ActionStatus> => {
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
    name: string ;
    // Kind of action (email, webhook, or sns), all actions have this field
    kind: ActionKind;
    // ID of action assigned by action service, all actions have this field
    id: string ;
    // Email action fields:
    // HTMLPart to send via Email action
    htmlPart :string ;
    // SubjectPart to send via Email action
    subjectPart: string ;
    // TextPart to send via Email action
    textPart: string ;
    // TemplateName to send via Email action
    templateName: string ;
    // Addresses to send to when Email action triggered
    addresses :string[] ;
    // SNS action fields:
    // Topic to trigger SNS action
    topic: string ;
    // Message to send via SNS or Webhook action
    message: string ;
    // Webhook action fields:
    // WebhookURL to trigger Webhook action
    webhookUrl: string ;
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
    state: ActionStatusState;
    id: string;
    message: string;
}

// ActionTriggerResponse for returning status url and parsed statusID (if possible)
interface ActionTriggerResponse {
    statusId?:  string;
    statusUrl?: string;
}


// ActionError defines format for returned errors
interface ActionError {
    code: string;
    message: string;
}

// ActionNotificationKind defines the types of notifications
enum ActionNotificationKind {
    splunkEvent = "splunkEvent",
    rawJSON = "rawJSON",
}

// ActionNotification defines the action notification format
interface ActionNotification {
    emailImmediately: boolean;
    severity: number;
    kind: ActionNotificationKind;
    tenant: string;
    userId: string;
    payload: any;
}

// SplunkEventPayload is the payload for a notification coming from Splunk
interface SplunkEventPayload {
    index: string;
    host: string;
    source: string;
    sourcetype: string;
    raw: string;
    time: string;
}

// ActionUpdateFields defines the fields that may be updated for an existing Action
interface ActionUpdateFields {
    // ID of action assigned by action service, all actions have this field
    id: string;
    // Email action fields:
    // HTMLPart to send via Email action
    htmlPart: string;
    // SubjectPart to send via Email action
    subjectPart: string;
    // TextPart to send via Email action
    textPart: string;
    // TemplateName to send via Email action
    templateName: string;
    // Addresses to send to when Email action triggered
    addresses: string[];
    // SNS action fields:
    // Topic to trigger SNS action
    topic: string;
    // Message to send via SNS or Webhook action
    message: string;
    // Webhook action fields:
    // WebhookURL to trigger Webhook action
    webhookUrl: string;
    // Message string `json:"message" binding:"required"` (defined above)
}
