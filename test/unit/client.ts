import { assert } from 'chai';
import 'mocha';
import { ServiceClient } from '../../src/client';

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
});
