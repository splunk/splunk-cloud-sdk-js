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
import { DEFAULT_URLS, Hostname, ServiceClient, SplunkError, SplunkErrorParams } from '../../src/client';

describe('Test SDK client', () => {
    it('should return a correct url with client tenant', () => {
        const testClient = new ServiceClient({
            tokenSource: 'abc',
            defaultTenant: 'test'
        });
        const path = testClient.buildPath('/search/v2alpha2', ['jobs']);
        assert.equal(path, '/test/search/v2alpha2/jobs');
    });

    it('should return a correct url when tenant is override', () => {
        const testClient = new ServiceClient({
            tokenSource: 'abc',
            defaultTenant: 'test'
        });
        const path = testClient.buildPath('/search/v2alpha2', ['jobs'], 'test2');
        assert.equal(path, '/test2/search/v2alpha2/jobs');
    });

    it('should ignore defaultTenant when endpoint path starts with system', () => {
        const testClient = new ServiceClient({
            tokenSource: 'abc',
            defaultTenant: 'test'
        });
        const path = testClient.buildPath('', ['system', 'search', 'v2alpha2', 'jobs']);
        assert.equal(path, '/system/search/v2alpha2/jobs');
    });

    it('should throw an error when tenant is not defined', () => {
        const testClient = new ServiceClient({
            tokenSource: 'abc'
        });
        try{
            testClient.buildPath('/search/v2alpha2', ['jobs']);
            assert.fail();
        } catch (err) {
            assert.equal(err.message, 'No tenant specified');
        }
    });

    it('should return a tenant scoped url with hostname set', () => {
        const testClient = new ServiceClient(
            { tokenSource:'abc',
                defaultTenant: 'test',
                hostname: new Hostname('scs.splunk.com','region1')
            });

        let path = testClient.buildUrl('','/test/search/v2alpha2', );
        assert.equal(path, 'https://test.scs.splunk.com/test/search/v2alpha2');

        path = testClient.buildUrl('','/system/search/v2alpha2', );
        assert.equal(path, 'https://region-region1.scs.splunk.com/system/search/v2alpha2');
    });
});

describe('ServiceClient.buildUrl()', () => {
    const client = new ServiceClient({ tokenSource: 'abc' });
    // 4 elements per test case: cluster, path, queryArgs, expected output of buildUrl
    const tests = [
        { c: DEFAULT_URLS.api, p: '/tenant/service/v1beta1', q: {}, x: `${DEFAULT_URLS.api}/tenant/service/v1beta1` },
        { c: DEFAULT_URLS.api, p: '/tenant/service/v1beta1/my.entity.here?with=qualifier', q: {}, x: `${DEFAULT_URLS.api}/tenant/service/v1beta1/my.entity.here%3Fwith%3Dqualifier` },
        { c: DEFAULT_URLS.api, p: '/tenant/service/v1beta1/endpoint/my@example.com', q: {}, x: `${DEFAULT_URLS.api}/tenant/service/v1beta1/endpoint/my@example.com` },
    ];

    for (const test of tests) {
        it(`should encode URL correctly - ${JSON.stringify(test)}`, () => {
            const actual = client.buildUrl(test.c, test.p, test.q);
            assert.equal(actual, test.x);
        });
    }
});

describe('SplunkError constructor', () => {
    // 2 elements per test case: SplunkError() co-or arg, expected SplunkError properties
    const tests = [
        { m: 'hello', x: { message: 'hello' } as SplunkErrorParams },
        { m: { message: 'msg', code: '123', httpStatusCode: 401, details:  { deets: 'detailed!' }, moreInfo: 'less' }, x: { message: 'msg', code: '123', httpStatusCode: 401, details: { deets: 'detailed!' }, moreInfo: 'less' } },
    ];

    for (const test of tests) {
        it(`should encode URL correctly - ${JSON.stringify(test)}`, () => {
            const actual : SplunkError = new SplunkError(test.m);
            assert.equal(actual.message, test.x.message);
            assert.equal(actual.code, test.x.code);
            assert.equal(actual.httpStatusCode, test.x.httpStatusCode);
            assert.deepEqual(actual.details, test.x.details);
            assert.equal(actual.moreInfo, test.x.moreInfo);
        });
    }
});
