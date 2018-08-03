const { assert } = require('chai');
const config = require('../config');
const SplunkSSC = require('../../splunk');

const sscHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;
const testNamespace = config.testNamespace;
const testCollection = config.testCollection;

const ssc = new SplunkSSC(sscHost, token, tenantID);

describe('Integration tests for KVStore Endpoints', () => {
    const testIndex = "integtestindex";
    const fields = [
        { Direction: -1, Field: "integ_testField1" }
    ];
    let testDataset;

    before(() => createDataset(testNamespace, testCollection));
    describe('Integration tests for KVStore Admin Endpoints', () => {
        describe('Ping Endpoint', () => {
            it('Should return a "healthy" response', () => {
                return ssc.kvstore.getHealthStatus().then(response => {
                    assert.equal(response.status, 'healthy', 'response status should be `healthy`');
                });
            });
        });
    });

    describe('Integration tests for KVStore Collection Stats Endpoints', () => {
        describe('Get the stats of a new collections', () => {
            it('Should return expected defaults', () => {
                return ssc.kvstore
                    .getCollectionStats(testNamespace, testCollection)
                    .then(statsResponse => {
                        assert.equal(statsResponse.count, 0);
                        assert.equal(statsResponse.nindexes, 1);
                        // This is a bug, the `ns` property is actually the
                        // collection and will need to be updated when kv
                        // store fixes it
                        // See https://jira.splunk.com/browse/SSC-4205
                        assert.equal(statsResponse.ns, testCollection);
                    });
            });
        });
    });

    describe('Integration tests for KVStore Index Endpoints', () => {
        const testIndex = 'integtestindex';
        const fields = [{ Direction: -1, Field: 'integ_testField1' }];
        let testDataset;

        before(() => {
            return createDataset(testNamespace, testCollection);
        });

        describe('index endpoints', () => {
            describe('Validate creation and deletion of an index', () => {
                it('should create a new index', () =>
                    ssc.kvstore
                        .createIndex(
                            {
                                Name: testIndex,
                                Collection: testCollection,
                                Namespace: testNamespace,
                                Fields: fields,
                            },
                            testNamespace,
                            testCollection
                        )
                        .then(response => {
                            assert(response.name === testIndex);
                        }));

                it('should return the newly created index', () =>
                    ssc.kvstore.listIndexes(testNamespace, testCollection).then(response => {
                        assert(response.length === 1);
                    }));

                it('should delete the specified index', () =>
                    ssc.kvstore.deleteIndex(testIndex, testNamespace, testCollection).then(response => {
                        assert(!response);
                    }));

                it('should not return any index', () =>
                    ssc.kvstore.listIndexes(testNamespace, testCollection).then(response => {
                        assert(response.length === 0);
                    }));
            });
        });

        describe('index endpoints - Error scenarios', () => {
            it('should throw 404 Not Found error because the namespace or the collection does not exist', () =>
                ssc.kvstore
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
                    .then(response => assert.fail(response), err => assert.equal(err.code, '404')));

            it('should throw 404 index not found error as index being deleted does not exist', () =>
                ssc.kvstore
                    .deleteIndex('testIndex2', testNamespace, testCollection)
                    .then(response => assert.fail(response), err => assert.equal(err.code, '404')));
        });

        after(() => {
            if (testDataset != null) {
                ssc.catalog
                    .deleteDatasetByName(testDataset.name)
                    .catch(err => console.log(`Error cleaning the test dataset: ${err}`));
            }
        });
    });

    describe("Integration tests for KVStore Record endpoints", () => {
        const integrationTestRecord = [
            {
                "capacity_gb": 8,
                "size": "tiny",
                "description": "This is a tiny amount of GB",
                "_raw": ""
            },
            {
                "capacity_gb": 16,
                "size": "small",
                "description": "This is a small amount of GB",
                "_raw": ""
            },
            {
                "type": "A",
                "name": "test_record",
                "count_of_fields": 3
            },
            {
                "type": "B",
                "name": "test_record",
                "count_of_fields": 3
            }
        ];

        describe('Test insertion, retrieval and deletion of the records', () => {
            let keys;
            it("should create a new record", () => ssc.kvstore.insertRecords(testNamespace, testCollection, integrationTestRecord).then(response => {
                assert.equal(response.length, 4, "Total number of newly created records should be 4");
                keys = response;
            }));

            it("should retrieve the newly created record by key", () => ssc.kvstore.getRecordByKey(testNamespace, testCollection, keys[0]).then(response => {
                assert(response._key.length !== 0);
                assert.equal(response.capacity_gb, 8, "The field 'capacity_gb' should contain the value '8'");
                assert.equal(response.description, "This is a tiny amount of GB", "The field 'description' should contain the value 'This is a tiny amount of GB'");
                assert.equal(response.size, "tiny", "The field 'size' should contain the value 'tiny'");
            }));

            it("should delete the newly created record by key", () => ssc.kvstore.deleteRecordByKey(testNamespace, testCollection, keys[0]).then(response => {
                assert(!response);
            }));

            it("validate that after calling deleteRecordbyKey(), only 3 records are left", () => ssc.kvstore.listRecords(testNamespace, testCollection).then(response => {
                assert.equal(response.length, 3, "The total number of remaining records after deletion process should be 3");
                assert.equal(response[0]._key, keys[1], "The '_key' value in response is incorrect");
                assert.equal(response[1]._key, keys[2], "The '_key' value in response is incorrect");
                assert.equal(response[2]._key, keys[3], "The '_key' value in response is incorrect");
            }));

            it("should retrieve the records based on a query", () => ssc.kvstore.listRecords(testNamespace, testCollection, {"fields": "type"}).then(response => {
                console.log("RESPONSE")
                console.log(response)
                assert.equal(response.length, 3);
            }));

            it("should delete the records based on a query", () => ssc.kvstore.deleteRecords(testNamespace, testCollection, {"name": "test_record","count_of_fields": 3}).then(response => {
                assert(!response);
            }));

            it("validate that after calling deleteRecords() based on query, no record is left", () => {
                return ssc.kvstore.listRecords(testNamespace, testCollection).then(response => {
                    assert.equal(response.length, 0);
                });
            });

            it("should delete all the records", () => ssc.kvstore.deleteRecords(testNamespace, testCollection).then(response => {
                assert(!response);
            }));

            it("validate that after calling deleteRecords(), no records should be returned", () => ssc.kvstore.queryRecords(testNamespace, testCollection).then(response => {
                assert.equal(response.length, 0, "No records should be returned");
            }));
        });
    });

    after(() => {
        if (testDataset != null) {
            ssc.catalog
                .deleteDatasetByName(testDataset.name)
                .catch(err => console.log(`Error cleaning the test dataset: ${err}`));
        }
    });
});

function createDataset(namespace, collection) {
    // Gets the datasets
    return (
        ssc.catalog
            .getDatasets()
            // Filters the data set
            .then(datasets => {
                return datasets.filter(element => {
                    if (element['module'] == testNamespace && element['name'] == testCollection) {
                        return element;
                    }
                });
            })
            // Deletes the dataset should only be one data set
            .then(datasets => {
                return Promise.all(
                    datasets.map(dataset => {
                        return ssc.catalog.deleteDataset(dataset.id);
                    })
                );
            })
            // Creates the data sets
            .then(() => {
                return ssc.catalog.createDataset({
                    name: testCollection,
                    owner: 'splunk',
                    kind: 'kvcollection',
                    capabilities: '1101-00000:11010',
                    module: testNamespace,
                });
            })
            // Finally set the dataset for testing
            .then(response => {
                testDataset = response;
            })
            .catch(error => {
                console.log('An error was encountered while cleaning up datasests');
                console.log(error);
            })
    );
}

function createRecord(namespace, collection, record) {
    return ssc.kvstore
        .insertRecord(namespace, collection, record)
        .then(response => {
            assert.notEqual(response['_key'], null);
            assert.typeOf(response['_key'], 'string');
            return response;
        })
        .catch(error => {
            throw error;
        });
}

module.exports = {
    createDataset: createDataset,
    createRecord: createRecord,
};
