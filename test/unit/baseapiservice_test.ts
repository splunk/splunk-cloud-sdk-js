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
import BaseApiService from '../../src/baseapiservice';
import { ServiceClient } from '../../src/client';

class TestApiService extends BaseApiService {
    constructor(service: ServiceClient) {
        super(service);
    }

    public getServiceCluster(): string {
        return 'cluster';
    }

    public getServicePrefix(): string {
        return 'prefix';
    }

}

describe('Test Tagged Template Literal', () => {
    it('should return a string with correct value', () => {
        const testClient = new ServiceClient({
            tokenSource: 'abc',
            defaultTenant: 'tenant'
        });
        const testService = new TestApiService(testClient);
        const mapping = {
            my_name: 'myName',
        };
        const tlAtEnd = testService.template`this is ${'my_name'}`(mapping);
        assert.equal(tlAtEnd, `this is myName`);
        const tlAtBegin = testService.template`${'my_name'} is js sdk`(mapping);
        assert.equal(tlAtBegin, `myName is js sdk`);
        const tlInMiddle = testService.template`hello! ${'my_name'} is js sdk`(mapping);
        assert.equal(tlInMiddle, `hello! myName is js sdk`);

        const qualifier = testService.template`/some/path/${'qualifier'}`({ qualifier: 'some.string.here?and=qualifier' });
        assert.equal(qualifier, `/some/path/some.string.here?and=qualifier`);

        const atSymbol = testService.template`/some/path/${'email'}`({ email: 'hello@example.com' });
        assert.equal(atSymbol, `/some/path/hello@example.com`);
    });

    it('should throw an error when no match found or with empty map', () => {
        const testClient = new ServiceClient({
            tokenSource: 'abc',
            defaultTenant: 'tenant'
        });
        const mapping = {
            myName: 'myName',
        };
        const testService = new TestApiService(testClient);
        try {
            testService.template`this is ${'my_name'}`({});
            assert.fail();
        } catch (err) {
            assert.equal(err.message, 'failed to reformat template string. mapping cannot be empty or undefined.');
        }
        try {
            testService.template`this is ${'my_name'}`(mapping);
            assert.fail();
        } catch (err) {
            assert.equal(err.message, 'failed to reformat template string. mapping for template expression my_name is not found in the template literals.');
        }
    });

});
