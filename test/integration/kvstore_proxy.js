const config = require('../config');
const SplunkSSC = require('../../splunk');
const { assert } = require('chai');

const sscHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const splunkSSCClient = new SplunkSSC(sscHost, token, tenantID);

const namespace = config.testNamespace;
const collection = config.testCollection;

describe('Integration tests for KVStore Admin Endpoints', () => {
    describe('Ping Endpoint', () => {
        it('Should return a "healty" response', () => {
            return splunkSSCClient.kvstore.getHealthStatus().then(response => {
                assert.equal(response.status, 'healthy', 'response status should be `healthy`');
            });
        });
    });
});

describe('Integration tests for KVStore Collection Stats Endpoints', () => {
    describe('Get the stats of a new collections', () => {
        it('Should return expected defaults', () => {
            splunkSSCClient.catalog
                .createDataset({
                    name: collection,
                    kind: 'kvcollection',
                    owner: 'Splunk',
                    module: namespace,
                    capabilities: '1101-00000:11010',
                })
                .then(resultDataset => {
                    splunkSSCClient.kvstore
                        .getCollectionStats(namespace, collection)
                        .then(statsResponse => {
                            assert.equal(response.count, 0, 'status cound should be 0');
                            assert.equal(response.nindexes, 1, 'status index count should be 1');
                            assert.equal(
                                response.ns,
                                namespace,
                                `status namespace should be ${namespace}`
                            );

                            splunkSSCClient.catalog.deleteDataset(resultDataset.id);
                        });
                });
        });
    });
});
