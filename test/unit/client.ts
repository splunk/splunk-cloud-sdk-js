import { assert } from 'chai';
import 'mocha';
import { DEFAULT_URLS, ServiceClient } from '../../src/client';

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
