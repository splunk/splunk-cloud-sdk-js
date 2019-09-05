// tslint:disable
/**
 * Copyright 2019 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Provisioner
 * With the Provisioner Service, you can provision your tenant and manage it
 *
 * OpenAPI spec version: v1beta1.3 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import BaseApiService from '../../../baseapiservice';
import {
    CreateProvisionJobBody,
    InviteBody,
    InviteInfo,
    Invites,
    ProvisionJobInfo,
    ProvisionJobs,
    TenantInfo,
    Tenants,
    UpdateInviteBody,
} from '../../../models/provisioner';
import { SplunkError } from '../../../client';

export const PROVISIONER_SERVICE_PREFIX: string = '/provisioner/v1beta1';
export const PROVISIONER_SERVICE_CLUSTER: string = 'api';

/**
 * Provisioner
 * Version: v1beta1.3
 * With the Provisioner Service, you can provision your tenant and manage it
 */
export abstract class ProvisionerServiceGen extends BaseApiService {
    /**
     * Creates an invite to invite a person to the tenant using their email address
     * @param inviteBody
     * @param queryParams Query parameters to be sent with the request
     * @return InviteInfo
     */
    public createInvite = (inviteBody: InviteBody, queryParams?: object): Promise<InviteInfo> => {
        const path = `/provisioner/v1beta1/invites`;
        return this.client.post(PROVISIONER_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), inviteBody, { query: queryParams })
            .then(response => response.body as InviteInfo);
    }
    /**
     * Creates a new job that provisions a new tenant and subscribes apps to the tenant
     * @param createProvisionJobBody
     * @param queryParams Query parameters to be sent with the request
     * @return ProvisionJobInfo
     */
    public createProvisionJob = (createProvisionJobBody: CreateProvisionJobBody, queryParams?: object): Promise<ProvisionJobInfo> => {
        const path = `/system/provisioner/v1beta1/jobs/tenants/provision`;
        return this.client.post(PROVISIONER_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), createProvisionJobBody, { query: queryParams })
            .then(response => response.body as ProvisionJobInfo);
    }
    /**
     * Deletes an invite in the given tenant
     * @param inviteId
     * @param queryParams Query parameters to be sent with the request
     */
    public deleteInvite = (inviteId: string, queryParams?: object): Promise<object> => {
        const path_params = {
            inviteId: inviteId
        };
        const path = this.template`/provisioner/v1beta1/invites/${'inviteId'}`(path_params);
        return this.client.delete(PROVISIONER_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: queryParams })
            .then(response => response.body as object);
    }
    /**
     * Gets an invite in the given tenant
     * @param inviteId
     * @param queryParams Query parameters to be sent with the request
     * @return InviteInfo
     */
    public getInvite = (inviteId: string, queryParams?: object): Promise<InviteInfo> => {
        const path_params = {
            inviteId: inviteId
        };
        const path = this.template`/provisioner/v1beta1/invites/${'inviteId'}`(path_params);
        return this.client.get(PROVISIONER_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: queryParams })
            .then(response => response.body as InviteInfo);
    }
    /**
     * Gets details of a specific provision job
     * @param jobId
     * @param queryParams Query parameters to be sent with the request
     * @return ProvisionJobInfo
     */
    public getProvisionJob = (jobId: string, queryParams?: object): Promise<ProvisionJobInfo> => {
        const path_params = {
            jobId: jobId
        };
        const path = this.template`/system/provisioner/v1beta1/jobs/tenants/provision/${'jobId'}`(path_params);
        return this.client.get(PROVISIONER_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: queryParams })
            .then(response => response.body as ProvisionJobInfo);
    }
    /**
     * Gets a specific tenant
     * @param tenantName
     * @param queryParams Query parameters to be sent with the request
     * @return TenantInfo
     */
    public getTenant = (tenantName: string, queryParams?: object): Promise<TenantInfo> => {
        const path_params = {
            tenantName: tenantName
        };
        const path = this.template`/system/provisioner/v1beta1/tenants/${'tenantName'}`(path_params);
        return this.client.get(PROVISIONER_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: queryParams })
            .then(response => response.body as TenantInfo);
    }
    /**
     * Lists the invites in a given tenant
     * @param queryParams Query parameters to be sent with the request
     * @return Invites
     */
    public listInvites = (queryParams?: object): Promise<Invites> => {
        const path = `/provisioner/v1beta1/invites`;
        return this.client.get(PROVISIONER_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: queryParams })
            .then(response => response.body as Invites);
    }
    /**
     * Lists all provision jobs created by the user
     * @param queryParams Query parameters to be sent with the request
     * @return ProvisionJobs
     */
    public listProvisionJobs = (queryParams?: object): Promise<ProvisionJobs> => {
        const path = `/system/provisioner/v1beta1/jobs/tenants/provision`;
        return this.client.get(PROVISIONER_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: queryParams })
            .then(response => response.body as ProvisionJobs);
    }
    /**
     * Lists all tenants that the user can read
     * @param queryParams Query parameters to be sent with the request
     * @return Tenants
     */
    public listTenants = (queryParams?: object): Promise<Tenants> => {
        const path = `/system/provisioner/v1beta1/tenants`;
        return this.client.get(PROVISIONER_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: queryParams })
            .then(response => response.body as Tenants);
    }
    /**
     * Updates an invite in the given tenant
     * @param inviteId
     * @param updateInviteBody
     * @param queryParams Query parameters to be sent with the request
     * @return InviteInfo
     */
    public updateInvite = (inviteId: string, updateInviteBody: UpdateInviteBody, queryParams?: object): Promise<InviteInfo> => {
        const path_params = {
            inviteId: inviteId
        };
        const path = this.template`/provisioner/v1beta1/invites/${'inviteId'}`(path_params);
        return this.client.patch(PROVISIONER_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), updateInviteBody, { query: queryParams })
            .then(response => response.body as InviteInfo);
    }
}
