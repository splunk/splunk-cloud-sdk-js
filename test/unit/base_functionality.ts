import { assert } from 'chai';
import 'isomorphic-fetch';
import 'mocha';
import { naiveExponentialBackoff, ServiceClient, SplunkError } from '../../client';
import config from '../config';

const stubbyUrl = `http://${config.stubbyHost}:8882`;

describe('Basic client functionality', () => {
    const s = new ServiceClient({
        urls: { api: stubbyUrl },
        tokenSource: () => config.stubbyAuthToken,
        defaultTenant: config.stubbyTenant
    });
    describe('GET', () => {
        it('should return a promise', () => {
            const promise = s.get('api', '/basic');
            assert.typeOf(promise, 'Promise');
            return promise.then((data) => {
                assert.property(data.body, 'foo');
                assert.equal(data.status, 200);
            });
        });
    });

    describe('POST', () => {
        it('should return a promise', () => {
            const promise = s.post('api', '/basic', { robin: 'hood' });
            assert.typeOf(promise, 'Promise');
            return promise.then((data) => {
                assert.typeOf(data.body, 'object');
                assert.property(data.body, 'friar');
                const bodyObj = data.body as any;
                assert.equal(bodyObj.friar, 'tuck');
                assert.equal(data.status, 200);
            });
        });
    });

    describe('PUT', () => {
        it('should return a promise', () => {
            const promise = s.put('api', '/basic', { walrus: 'carpenter' });
            assert.typeOf(promise, 'Promise');
            return promise.then((data) => {
                assert.typeOf(data.body, 'object');
                const bodyObj = data.body as any;
                assert.equal(bodyObj.oysters, 'sad');
                assert.equal(data.status, 200);
            });
        });
    });

    describe('DELETE', () => {
        it('should return a promise', () => {
            const promise = s.delete('api', '/basic');
            assert.typeOf(promise, 'Promise');
            return promise;
        });
    });

    describe('Errors', () => {
        it('should throw on an error response', () => {
            return s.get('api', '/error').then(() => {
                assert.fail('Should have caught a rejected promise');
            }).catch((err) => {
                assert.typeOf(err, 'Error');
                assert.equal(err.message, 'error response');
            });

        });
    });

    describe('Path building', () => {
        it('Catch empty path elements', () => {
            try {
                s.buildPath('/PREFIX', ['foo', ' '], 'TENANT');
                assert.fail('Should have thrown an error');
            } catch (err) {
                assert.property(err, 'message');
                assert.match(err.message, /\/TENANT\/PREFIX\/foo\/ /);
            }
        });
    });

    describe('Middleware', () => {
        afterEach(() => s.clearResponseHooks());

        it('should allow a callback to execute without affecting flow', () => {
            let extractedUrl: string;
            s.addResponseHook((response) => extractedUrl = response.url);
            return s.get('api', '/basic')
                .then(httpResponse => {
                    assert.property(httpResponse.body, 'foo');
                    assert.match(extractedUrl, /\/basic$/);
                });
        });

        it('should allow multiple callbacks that don\'t change response', () => {
            for (let i = 0; i < 5; i++) {
                s.addResponseHook(() => { return; });
            }
            return s.get('api', '/basic')
                .then(httpResponse => {
                    assert.property(httpResponse.body, 'foo');
                });
        });

        it('should allow changing of a response inflight', () => {
            s.addResponseHook(response => {
                if (!response.ok) {
                    return s.fetch('GET', 'api', '/basic', {});
                }
            }); // Totally different URL
            return s.get('api', '/something_that_does_not_exist')
                .then(httpResponse => {
                    assert.property(httpResponse.body, 'foo');
                });
        });

        it('should allow retry on 429', () => {
            let retries = 0;
            let failed = false;
            s.addResponseHook(naiveExponentialBackoff({ maxRetries: 3, onRetry: () => retries += 1, onFailure: () => failed = true }));
            return s.get('api', '/too_many_requests')
                .then(httpResponse => {
                    assert.property(httpResponse.body, 'foo');
                }, (err: SplunkError) => {
                    assert.equal(err.httpStatusCode, 429);
                    assert.equal(retries, 3);
                    assert.ok(failed);
                });
        });

        it('should backoff exponentially on 429', () => {
            const timeout = 50;
            const backoff = 2;
            const expectedTime = timeout + timeout * backoff + timeout * backoff * backoff;
            s.addResponseHook(naiveExponentialBackoff({ timeout, backoff, maxRetries: 3 }));
            const start = Date.now();
            return s.get('api', '/too_many_requests')
                .then(httpResponse => {
                    assert.property(httpResponse.body, 'foo');
                }, () => {
                    const elapsed = Date.now() - start;
                    // setTimeout is not exact
                    assert.isAtLeast(elapsed, expectedTime);
                    assert.isAtMost(elapsed, expectedTime * 2);
                });
        });

        it('should succeed with a backoff in place', () => {
            s.addResponseHook(naiveExponentialBackoff());
            const promise = s.get('api', '/basic');
            assert.typeOf(promise, 'Promise');
            return promise.then((data) => {
                assert.property(data.body, 'foo');
                assert.equal(data.status, 200);
            });
        });

        it('should handle exceptions', () => {
            s.addResponseHook(() => {
                throw new Error('unexpected error');
            });
            return s.get('api', '/basic')
                .then(response => {
                    assert.property(response.body, 'foo');
                });
        });
    });

});

describe('Service client args', () => {
    it('should take a url, a token, and a tenant', () => {
        const s = new ServiceClient({
            urls: { api: stubbyUrl },
            tokenSource: () => config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });
        assert.equal(s.buildPath('/prefix', ['path']), `/${config.stubbyTenant}/prefix/path`);
        return s.get('api', '/basic')
            .then(response => {
                assert.property(response.body, 'foo');
            });
    });

    it('should take an args object', () => {
        const s = new ServiceClient({
            urls: { api: stubbyUrl },
            tokenSource: config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });
        assert.equal(s.buildPath('/prefix', ['path']), `/${config.stubbyTenant}/prefix/path`);
        return s.get('api', '/basic')
            .then(response => {
                assert.property(response.body, 'foo');
            });
    });

    it('should take a function that returns a token', () => {
        const s = new ServiceClient({
            urls: { api: stubbyUrl },
            tokenSource: () => config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });
        assert.equal(s.buildPath('/prefix', ['path']), `/${config.stubbyTenant}/prefix/path`);
        return s.get('api', '/basic')
            .then(response => {
                assert.property(response.body, 'foo');
            });

    });

    it('should take a token manager (like splunk-cloud-auth)', () => {
        function getAccessToken () { return config.stubbyAuthToken; }

        const s = new ServiceClient({
            urls: { api: stubbyUrl },
            tokenSource: getAccessToken,
            defaultTenant: config.stubbyTenant
        });
        assert.equal(s.buildPath('/prefix', ['path']), `/${config.stubbyTenant}/prefix/path`);
        return s.get('api', '/basic')
            .then(response => {
                assert.property(response.body, 'foo');
            });
    });

    it('should use a default URL', () => {
        const s = new ServiceClient({
            tokenSource: config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });

        assert.equal(s.buildUrl('api', s.buildPath('/foo', ['bar'])), `https://api.splunkbeta.com/${config.stubbyTenant}/foo/bar`);
    });
});

describe('Service client with a url string instead of args object', () => {
    const s = new ServiceClient(
        stubbyUrl,
        config.stubbyAuthToken,
        config.stubbyTenant
    );
    describe('GET', () => {
        it('should return a promise when service client is created with a url string instead of args object', () => {
            assert.equal(s.buildUrl('api', s.buildPath('', ['basic'])), `${stubbyUrl}/${config.stubbyTenant}/basic`);
            const promise = s.get('api', '/basic');
            assert.typeOf(promise, 'Promise');
            return promise.then((data) => data.body).then(body => {
                assert.property(body, 'foo');
            });
        });
    });
});

describe('Service client with a ServiceClientArgs object initialized with a url string', () => {
    const s = new ServiceClient({
        url: stubbyUrl,
        tokenSource: config.stubbyAuthToken,
        defaultTenant: config.stubbyTenant
    });
    describe('GET', () => {
        it('should return a promise when service client is created with a ServiceClientArgs object initialized with a url string', () => {
            assert.equal(s.buildUrl('api', s.buildPath('', ['basic'])), `${stubbyUrl}/${config.stubbyTenant}/basic`);
            const promise = s.get('api', '/basic');
            assert.typeOf(promise, 'Promise');
            return promise.then((data) => data.body).then(body => {
                assert.property(body, 'foo');
            });
        });
    });
});
