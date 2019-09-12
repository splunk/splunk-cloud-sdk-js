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
import 'isomorphic-fetch';
import 'mocha';
import sleep = require('sleep-promise');
import { HTTPResponse, RequestQueueManagerParams, ServiceClient } from '../../client';
import { QueryArgs } from '../../src/client';
import config from '../config';
import { RetryServer } from './test_retry_server';

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
            }).catch((err) => {
                assert.typeOf(err, 'object');
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
            }).catch((err) => {
                assert.typeOf(err, 'object');
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
            }).catch((err) => {
                assert.typeOf(err, 'object');
            });
        });
    });

    describe('DELETE', () => {
        it('should return a promise', () => {
            const promise = s.delete('api', '/basic');
            promise.catch((err) => {
                assert.typeOf(err, 'object');
            });
        });
    });

    describe('Errors', () => {
        it('should throw on an error response', () => {
            return s.get('api', '/error').then(() => {
                assert.fail('Should have caught a rejected promise');
            }).catch((err) => {
                assert.typeOf(err, 'object');
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
                }).catch((err) => {
                    assert.typeOf(err, 'object');
                });
        });

        it('should allow multiple callbacks that don\'t change response', () => {
            for (let i = 0; i < 5; i++) {
                s.addResponseHook(() => { return; });
            }
            return s.get('api', '/basic')
                .then(httpResponse => {
                    assert.property(httpResponse.body, 'foo');
                }).catch((err) => {
                    assert.typeOf(err, 'object');
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
                }).catch((err) => {
                    assert.typeOf(err, 'object');
                });
        });

        it('should handle exceptions', () => {
            s.addResponseHook(() => {
                throw new Error('unexpected error');
            });
            return s.get('api', '/basic')
                .then(response => {
                    assert.property(response.body, 'foo');
                }).catch((err) => {
                    assert.typeOf(err, 'object');
                });
        });
    });
});

describe('Retry 429 errors', () => {
    const server = new RetryServer();
    const [ initialTimeout, exponent, retries ] = [ 100, 1.6, 5 ];
    const s = new ServiceClient({
        urls: { local: 'http://localhost:3333' },
        tokenSource: () => 'None',
        requestQueueManagerParams: new RequestQueueManagerParams(
            {
                initialTimeout,
                exponent,
                retries,
                maxInFlight: 3,
                enableRetryHeader: true,
            }
        )});
    before(() => {
        server.start();
        s.clearResponseHooks();
    });
    it('should still throw after retries', () => {
        let lastResponse : Response | undefined;
        let lastRequest : Request | undefined;
        s.addResponseHook((response, request) => {
            lastResponse = response;
            lastRequest = request;
        });
        return s.get('local', '/always_busy').then((response) => {
            throw new Error('Should have thrown');
        }, (error) => {
            assert(error.httpStatusCode = 429);
            if (lastRequest !== undefined) {
                if (lastRequest.headers.has('Retry')) {
                    const [retryTime, retryCount] = lastRequest.headers.get('Retry')!.split(':');
                    let expectedRetryElapsed = 0;
                    for (let i = 0; i < retries; i++) {
                        expectedRetryElapsed += initialTimeout * exponent ** i;
                    }
                    const retryElapsed = Date.now() - parseInt(retryTime, 10);
                    assert.equal(parseInt(retryCount, 10), retries);
                    assert.approximately(retryElapsed, expectedRetryElapsed, expectedRetryElapsed * 0.1);
                } else {
                    throw new Error('Retry header not set');
                }
            } else {
                throw new Error('Request not set');
            }
        });
    });
    it('should only allow three requests at a time', async () => {
        const requests: Array<Promise<HTTPResponse>> = [];
        for (let i = 0; i < 6; i++) {
            requests.push(s.get('local', '/logjam'));
        }
        const bigPromise = Promise.all(requests);
        await sleep(50);
        await s.get('local', '/endjam', { queue: 'control' });
        const responses = await bigPromise;
        assert.isTrue(responses.filter(r => r.status !== 200).length === 0);
        assert.equal(responses.length, 6);
        assert.equal(responses.filter(r => r.headers.has('Retry')).length, 3); // Only the first 3 blocked
    });
    after(() => {
        server.stop();
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
            }).catch((err) => {
                assert.typeOf(err, 'object');
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
            }).catch((err) => {
                assert.typeOf(err, 'object');
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
            }).catch((err) => {
                assert.typeOf(err, 'object');
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
            }).catch((err) => {
                assert.typeOf(err, 'object');
            });
    });

    it('should use a default URL', () => {
        const s = new ServiceClient({
            tokenSource: config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });

        assert.equal(s.buildUrl('api', s.buildPath('/foo', ['bar'])), `https://api.scp.splunk.com/${config.stubbyTenant}/foo/bar`);
    });

    it('should marshal query params as array as foo=1,2', () => {
        const s = new ServiceClient({
            tokenSource: config.stubbyAuthToken,
            defaultTenant: config.stubbyTenant
        });

        const query = { foo: ['1', '2'] } as QueryArgs;
        const actual = s.buildUrl('api', '/test', query);

        assert.equal(actual, `https://api.scp.splunk.com/test?foo=${encodeURIComponent('1,2')}`);
    });
});

