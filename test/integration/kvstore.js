const {assert} = require('chai');
const config = require('../config');
const SplunkSSC = require('../../splunk');

const sscHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;
const testnamespace = config.testNamespace;
const testcollection = config.testCollection;

const ssc = new SplunkSSC(sscHost, token, tenantID);

describe('Integration tests for KVStore Index Endpoints', () => {
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

    describe("index endpoints", () => {
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
                assert(!response)
            }));

            it('should not return any index', () => ssc.kvstore.listIndexes(testnamespace, testcollection).then(response => {
                assert(response.length === 0);
            }));
        });
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

    after(() => {
        ssc.catalog.deleteDatasetByName(testDataset.name).catch(err => console.log(`Error cleaning the test dataset: ${  err}`))
    });
});
