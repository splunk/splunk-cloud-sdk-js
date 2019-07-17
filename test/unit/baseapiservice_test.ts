import { assert } from 'chai';
import 'mocha';
import BaseApiService from '../../src/baseapiservice';
import { ServiceClient } from '../../src/client';

describe('Test Tagged Template Literal', () => {
    it('should return a string with correct value', () => {
        const testClient = new ServiceClient({
            tokenSource: 'abc',
            defaultTenant: 'tenant'
        });
        const testService = new BaseApiService(testClient);
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
        const testService = new BaseApiService(testClient);
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
