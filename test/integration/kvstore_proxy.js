const { assert } = require('chai');
const config = require('../config');
const SplunkCloud = require('../../splunk').SplunkCloud;

const splunkCloudHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;
const testNamespace = config.testNamespace;
const testCollection = config.testCollection;
const testKVCollectionName = testNamespace + '.' + testCollection;

const { createKVCollectionDataset, createRecord } = require('./catalog_proxy.js');

const splunkCloud = new SplunkCloud(splunkCloudHost, token, tenantID);

describe('Integration tests for KVStore Endpoints', () => {
    const testIndex = 'integtestindex';
    const fields = [{ Direction: -1, Field: 'integ_testField1' }];
    let testDataset;

    before(async () => {
        testDataset = await createKVCollectionDataset(testNamespace, testCollection);
        return testDataset;
    });
    after(() => {
        if (testDataset != null) {
            splunkCloud.catalog
                .deleteDatasetByName(testDataset.name)
                .catch(err => console.log(`Error cleaning the test dataset: ${err}`));
        }
    });

    describe('Admin Endpoints', () => {
        describe('Ping Endpoint', () => {
            it('Should return a "healthy" response', () => {
                return splunkCloud.kvstore.getHealthStatus().then(response => {
                    assert.equal(response.status, 'healthy', 'response status should be `healthy`');
                });
            });
        });
    });

    describe('Stats Endpoints', () => {
        describe('Get the stats of a new collections', () => {
            it('Should return expected defaults', () => {
                return splunkCloud.kvstore.getCollectionStats(testKVCollectionName).then(statsResponse => {
                    assert.equal(statsResponse.count, 0);
                    assert.equal(statsResponse.nindexes, 1);
                    assert.equal(statsResponse.collection, testKVCollectionName);
                });
            });
        });
    });

    describe('Index Endpoints', () => {
        const testIndex = 'integtestindex';
        const fields = [{ Direction: -1, Field: 'integ_testField1' }];
        let testDataset;

        before(() => {
            return createKVCollectionDataset(testNamespace, testCollection);
        });

        describe('index endpoints', () => {
            describe('Validate creation and deletion of an index', () => {
                it('should create a new index', () =>
                    splunkCloud.kvstore
                        .createIndex(
                            {
                                Name: testIndex,
                                Collection: testCollection,
                                Namespace: testNamespace,
                                Fields: fields,
                            },
                            testKVCollectionName
                        )
                        .then(response => {
                            assert.strictEqual(response.name, testIndex);
                        }));

                it('should return the newly created index', () =>
                    splunkCloud.kvstore.listIndexes(testKVCollectionName).then(response => {
                        assert(response.length === 1);
                    }));

                it('should delete the specified index', () =>
                    splunkCloud.kvstore.deleteIndex(testIndex, testKVCollectionName).then(response => {
                        assert(!response);
                    }));

                it('should not return any index', () =>
                    splunkCloud.kvstore.listIndexes(testKVCollectionName).then(response => {
                        assert(response.length === 0);
                    }));
            });
        });

        describe('index endpoints - Error scenarios', () => {
            it('should throw 404 Not Found error because the namespace or the collection does not exist', () =>
                splunkCloud.kvstore
                    .createIndex(
                        {
                            Name: testIndex,
                            Collection: testCollection,
                            Namespace: testNamespace,
                            Fields: fields,
                        },
                        'testnamespace1',
                        'testcollection1'
                    )
                    .then(response => assert.fail(response), err => assert.equal(err.errorParams.httpStatusCode, 404)));

            /* TODO: (Commenting for now) Delete on a non-existing index is yielding a 200OK response. kvstore service updated codes at their end and this would be 204 (Being tracked here: splunkCloud-3101)
            it('should throw 404 index not found error as index being deleted does not exist', () =>
                splunkCloud.kvstore
                    .deleteIndex('testIndex2', testKVCollectionName)
                    .then(response => assert.fail(response), err => assert.equal(err.code, '404')));
            */
        });

        after(() => {
            if (testDataset != null) {
                splunkCloud.catalog
                    .deleteDatasetByName(testDataset.name)
                    .catch(err => console.log(`Error cleaning the test dataset: ${err}`));
            }
        });
    });

    describe('Record endpoints', () => {
        const integrationTestRecord = [
            {
                capacity_gb: 8,
                size: 'tiny',
                description: 'This is a tiny amount of GB',
                _raw: '',
            },
            {
                capacity_gb: 16,
                size: 'small',
                description: 'This is a small amount of GB',
                _raw: '',
            },
            {
                type: 'A',
                name: 'test_record',
                count_of_fields: 3,
            },
            {
                type: 'B',
                name: 'test_record',
                count_of_fields: 3,
            },
        ];

        describe('Test insertion, retrieval and deletion of the records', () => {
            let keys;
            it('should create a new record', () =>
                splunkCloud.kvstore
                    .insertRecords(testKVCollectionName, integrationTestRecord)
                    .then(response => {
                        assert.equal(
                            response.length,
                            4,
                            'Total number of newly created records should be 4'
                        );
                        keys = response;
                    }));

            it('should retrieve the newly created record by key', () =>
                splunkCloud.kvstore.getRecordByKey(testKVCollectionName, keys[0]).then(response => {
                    assert(response._key.length !== 0);
                    assert.equal(
                        response.capacity_gb,
                        8,
                        "The field 'capacity_gb' should contain the value '8'"
                    );
                    assert.equal(
                        response.description,
                        'This is a tiny amount of GB',
                        "The field 'description' should contain the value 'This is a tiny amount of GB'"
                    );
                    assert.equal(
                        response.size,
                        'tiny',
                        "The field 'size' should contain the value 'tiny'"
                    );
                }));

            it('should delete the newly created record by key', () =>
                splunkCloud.kvstore.deleteRecordByKey(testKVCollectionName, keys[0]).then(response => {
                    assert(!response);
                }));

            it('validate that after calling deleteRecordbyKey(), only 3 records are left', () =>
                splunkCloud.kvstore.listRecords(testKVCollectionName).then(response => {
                    assert.equal(
                        response.length,
                        3,
                        'The total number of remaining records after deletion process should be 3'
                    );
                    assert.equal(
                        response[0]._key,
                        keys[1],
                        "The '_key' value in response is incorrect"
                    );
                    assert.equal(
                        response[1]._key,
                        keys[2],
                        "The '_key' value in response is incorrect"
                    );
                    assert.equal(
                        response[2]._key,
                        keys[3],
                        "The '_key' value in response is incorrect"
                    );
                }));

            it('should retrieve the records based on a query', () =>
                splunkCloud.kvstore.listRecords(testKVCollectionName, { fields: 'type' }).then(response => {
                    assert.equal(response.length, 3);
                }));

            it('should delete the records based on a query', () =>
                splunkCloud.kvstore
                    .deleteRecords(testKVCollectionName, {
                        name: 'test_record',
                        count_of_fields: 3,
                    })
                    .then(response => {
                        assert(!response);
                    }));

            it('validate that after calling deleteRecords() based on query, no record is left', () => {
                return splunkCloud.kvstore.listRecords(testKVCollectionName).then(response => {
                    assert.equal(response.length, 0);
                });
            });

            it('should delete all the records', () =>
                splunkCloud.kvstore.deleteRecords(testKVCollectionName).then(response => {
                    assert(!response);
                }));

            it('validate that after calling deleteRecords(), no records should be returned', () =>
                splunkCloud.kvstore.queryRecords(testKVCollectionName).then(response => {
                    assert.equal(response.length, 0, 'No records should be returned');
                }));
        });
    });
});
