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
 */

import { assert } from 'chai';
import 'mocha';
import { config as pemConfig, createCertificate, ModuleConfiguration } from 'pem';
import * as forwarders from '../../src/services/forwarders';
import { SplunkCloud } from '../../src/splunk';
import config from '../config';

if (process.env.CI) {
    const openSSLPath = '/usr/bin/openssl';
    console.log(`settings custom openssl path for pem module to: ${openSSLPath}`);
    pemConfig({
        pathOpenSSL: openSSLPath
    } as ModuleConfiguration);
}

const tenantID = config.stagingTenant;

const splunkCloud = new SplunkCloud({
    urls: {
        api: config.stagingApiHost,
        app: config.stagingAppsHost,
    },
    tokenSource: config.stagingAuthToken,
    defaultTenant: tenantID,
});

describe('Integration tests with forwarders service APIs', () => {
    before(() => {
        return splunkCloud.forwarders.deleteCertificates();
    });

    after(() => {
        return splunkCloud.forwarders.deleteCertificates();
    });

    it('should allow listing all certificates on a tenant', () => {
        return splunkCloud.forwarders.listCertificates().then(response => {
            const certLists = response as forwarders.CertificateInfo[];
            assert.equal(certLists.length, 0);
        });
    });
    it('should allow deleting all certificates on a tenant', () => {
        return splunkCloud.forwarders.deleteCertificates().then(async () => {
            const certlists = await splunkCloud.forwarders.listCertificates();
            assert.equal(certlists.length, 0);
        });
    });
    it('should allow adding a certificate to a tenant', async () => {
        const certLists = await splunkCloud.forwarders.listCertificates();
        const certOptions = {
            country: 'US',
            state: 'California',
            locality: 'San Francisco',
            organization: 'Splunk',
            commonName: 'forwarder_01',
            selfSigned: true
        };
        return createCertificate(certOptions, async (err, keys) => {
            assert.notOk(err, err ? err.message : 'known error');

            const pem = keys.certificate;
            const certInfo = await splunkCloud.forwarders.addCertificate({ pem });
            assert.equal(certInfo.issuer, 'CN=forwarder_01,O=Splunk,L=San Francisco,ST=California,C=US');
            assert.equal(certInfo.subject, 'CN=forwarder_01,O=Splunk,L=San Francisco,ST=California,C=US');

            const aftCertList = await splunkCloud.forwarders.listCertificates();
            assert.equal(aftCertList.length, certLists.length + 1);

            return splunkCloud.forwarders.deleteCertificate(`${certInfo.slot}`);
        });
    });
});
