// tslint:disable
/**
 * Copyright 2020 Splunk, Inc.
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
 * Splunk Forwarder Service
 * Send data from a Splunk forwarder to the Splunk Forwarder service in Splunk Cloud Services.
 *
 * OpenAPI spec version: v2beta1.3 (recommended default)
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import {
    Certificate,
    CertificateInfo,
} from '../models';
import BaseApiService from "../../../../baseapiservice";
import { ForwardersServiceExtensions } from "../../../../service_extensions/forwarders";
import { SplunkError } from '../../../../client';

export const FORWARDERS_SERVICE_PREFIX: string = '/forwarders/v2beta1';
export const FORWARDERS_SERVICE_CLUSTER: string = 'api';

/**
 * Splunk Forwarder Service
 * Version: v2beta1.3
 * Send data from a Splunk forwarder to the Splunk Forwarder service in Splunk Cloud Services.
 */
export class GeneratedForwardersService extends BaseApiService {
    getServiceCluster() : string {
        return FORWARDERS_SERVICE_CLUSTER
    }

    getServicePrefix() : string {
        return FORWARDERS_SERVICE_PREFIX;
    }
    /**
     * Adds a certificate to a vacant slot on a tenant.
     * @param certificate
     * @param args parameters to be sent with the request
     * @return CertificateInfo
     */
    public addCertificate = (certificate?: Certificate, args?: object): Promise<CertificateInfo> => {
        if (!certificate) {
            throw new SplunkError({ message: `Bad Request: certificate is empty or undefined` });
        }
        const path = `/forwarders/v2beta1/certificates`;
        return this.client.post(FORWARDERS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), certificate, { query: args })
            .then(response => response.body as CertificateInfo);
    }
    /**
     * Removes a certificate on a particular slot on a tenant.
     * @param slot
     * @param args parameters to be sent with the request
     */
    public deleteCertificate = (slot: string, args?: object): Promise<object> => {
        const path_params = {
            slot: slot
        };
        const path = this.template`/forwarders/v2beta1/certificates/${'slot'}`(path_params);
        return this.client.delete(FORWARDERS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as object);
    }
    /**
     * Removes all certificates on a tenant.
     * @param args parameters to be sent with the request
     */
    public deleteCertificates = (args?: object): Promise<object> => {
        const path = `/forwarders/v2beta1/certificates`;
        return this.client.delete(FORWARDERS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as object);
    }
    /**
     * Returns a list of all certificates for a tenant.
     * @param args parameters to be sent with the request
     * @return Array<CertificateInfo>
     */
    public listCertificates = (args?: object): Promise<Array<CertificateInfo>> => {
        const path = `/forwarders/v2beta1/certificates`;
        return this.client.get(FORWARDERS_SERVICE_CLUSTER, this.client.buildPath('', path.split('/').slice(1)), { query: args })
            .then(response => response.body as Array<CertificateInfo>);
    }
}
export type ForwardersService = GeneratedForwardersService & ForwardersServiceExtensions;
export const ForwardersService = ForwardersServiceExtensions(GeneratedForwardersService);
