const config = require('../config');
const SplunkSSC = require('../../splunk');
const { assert } = require('chai');

const sscHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const client = new SplunkSSC(sscHost, token, tenantID);

const namespace = config.testNamespace;
const collection = config.testCollection;

describe('Integration tests for KVStore Admin Endpoints', () => {
    describe('Ping Endpoint', () => {
        it('Should return a "healty" response', () => {
            return client.kvstore.getHealthStatus().then(response => {
                assert.equal(response.status, 'healthy', 'response status should be `healthy`');
            });
        });
    });
});

describe('Integration tests for KVStore Collection Stats Endpoints', () => {
    describe('Get the stats of a new collections', () => {
        it('Should return expected defaults', () => {
            client.catalog
                .createDataset({
                    name: collection,
                    kind: 'kvcollection',
                    owner: 'Splunk',
                    module: namespace,
                    capabilities: '1101-00000:11010',
                })
                .then(resultDataset => {
                    client.kvstore
                        .getCollectionStats(namespace, collection)
                        .then(statsResponse => {
                            assert.equal(statsResponse.count, 0);
                            assert.equal(statsResponse.nindexes, 1);
                            assert.equal(statsResponse.ns, namespace);

                            client.catalog.deleteDataset(resultDataset.id);
                        });
                });
        });
    });
});
