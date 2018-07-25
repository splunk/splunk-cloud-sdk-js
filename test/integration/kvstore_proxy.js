const {assert} = require('chai');
const config = require('../config');
const SplunkSSC = require('../../splunk');

const sscHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;
const testnamespace = config.testNamespace;
const testcollection = config.testCollection;

const ssc = new SplunkSSC(sscHost, token, tenantID);

describe('Integration tests for KVStore Endpoints', () => {
    const testIndex = "integtestindex";
    const fields = [
        {Direction: -1, Field: "integ_testField1"}
    ];
    let testDataset;

    before(() => ssc.catalog.createDataset({
        name: testcollection,
        owner: "splunk",
        kind: "kvcollection",
        capabilities: "1101-00000:11010",
        module: testnamespace,
    }).then(response => {
        testDataset = response;
    }));


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
                return ssc.kvstore.getCollectionStats(testnamespace, testcollection).then(statsResponse => {
                    assert.equal(statsResponse.count, 0);
                    assert.equal(statsResponse.nindexes, 1);
                    // This is a bug, the `ns` property is actually the
                    // collection and will need to be updated when kv
                    // store fixes it
                    // See https://jira.splunk.com/browse/SSC-4205
                    assert.equal(statsResponse.ns, testcollection);
                });
            });
        });
    });

    describe("Integration tests for KVStore Index endpoints", () => {
        describe('Validate creation and deletion of an index', () => {
            it("should create a new index", () => ssc.kvstore.createIndex({
                Name: testIndex,
                Collection: testcollection,
                Namespace: testnamespace,
                Fields: fields
            }, testnamespace, testcollection).then(response => {
                assert(response.name === testIndex);
            }));

            it('should return the newly created index', () => ssc.kvstore.listIndexes(testnamespace, testcollection).then(response => {
                assert(response.length === 1);
            }));

            it('should delete the specified index', () => ssc.kvstore.deleteIndex(testIndex, testnamespace, testcollection).then((response) => {
                assert(!response);
            }));

            it('should not return any index', () => ssc.kvstore.listIndexes(testnamespace, testcollection).then(response => {
                assert(response.length === 0);
            }));
        });

        describe("index endpoints - Error scenarios", () => {
            it('should throw 500 internal server error', () => ssc.kvstore.createIndex({
                Name: testIndex,
                Collection: testcollection,
                Namespace: testnamespace,
                Fields: fields
            }, "testnamespace1", "testcollection1").then(response =>
                assert.fail(response), err => assert.equal(err.code, "500")
            ));

            it('should throw 404 index not found error', () => ssc.kvstore.deleteIndex("testIndex2", testnamespace, testcollection).then((response) =>
                assert.fail(response), err => assert.equal(err.code, "404")
            ));
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
            it("should create a new record", () => ssc.kvstore.insertRecords(testnamespace, testcollection, integrationTestRecord).then(response => {
                assert.equal(response.length, 4, "Total number of newly created records should be 4");
                keys = response;
            }));

            it("should retrieve the newly created record by key", () => ssc.kvstore.getRecordByKey(testnamespace, testcollection, keys[0]).then(response => {
                assert(response._key.length !== 0);
                assert.equal(response.capacity_gb, 8, "The field 'capacity_gb' should contain the value '8'");
                assert.equal(response.description, "This is a tiny amount of GB", "The field 'description' should contain the value 'This is a tiny amount of GB'");
                assert.equal(response.size, "tiny", "The field 'size' should contain the value 'tiny'");
            }));

            it("should delete the newly created record by key", () => ssc.kvstore.deleteRecordByKey(testnamespace, testcollection, keys[0]).then(response => {
                assert(!response);
            }));

            it("validate that after calling deleteRecordbyKey(), only 3 records are left", () => ssc.kvstore.queryRecords(testnamespace, testcollection).then(response => {
                assert.equal(response.length, 3, "The total number of remaining records after deletion process should be 3");
                assert.equal(response[0]._key, keys[1], "The '_key' value in response is incorrect");
                assert.equal(response[1]._key, keys[2], "The '_key' value in response is incorrect");
                assert.equal(response[2]._key, keys[3], "The '_key' value in response is incorrect");
            }));

            it("should retrieve the records based on a query", () => ssc.kvstore.queryRecords(testnamespace, testcollection, "{\"name\": \"test_record\",\"count_of_fields\": 3}").then(response => {
                assert(response.length === 2);
                assert.equal(response[0].type, "A", "The field 'type' should contain the value 'A'");
                assert.equal(response[1].type, "B", "The field 'type' should contain the value 'B'");
            }));

            it("should delete the records based on a query", () => ssc.kvstore.deleteRecords(testnamespace, testcollection, "{\"name\": \"test_record\",\"count_of_fields\": 3}").then(response => {
                assert(!response);
            }));

            it("validate that after calling deleteRecords() based on query, only 1 record is left", () => ssc.kvstore.queryRecords(testnamespace, testcollection).then(response => {
                assert(response.length === 1);
                assert.equal(response[0].capacity_gb, 16, "The field 'capacity_gb' should contain the value '16'");
            }));

            it("should delete all the records", () => ssc.kvstore.deleteRecords(testnamespace, testcollection).then(response => {
                assert(!response);
            }));

            it("validate that after calling deleteRecords(), no records should be returned", () => ssc.kvstore.queryRecords(testnamespace, testcollection).then(response => {
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

