const {assert} = require("chai");
const config = require("../config");
const SplunkSSC = require("../../splunk");

const testnamespace = config.testNamespace;
const testcollection = config.testCollection;

const splunk = new SplunkSSC(`http://${config.stubbyHost}:8882`, config.stubbyAuthToken, config.stubbyTenant);

describe('Stubby tests for Kvstore Index Endpoints', () => {
    describe('Get all indexes', () => {
        it('should return all the indexes present in the given collection and namespace', () => splunk.kvstore.listIndexes(testnamespace, testcollection).then(indexes => {
            assert.typeOf(indexes, 'array', 'response data should be an array');
            indexes.forEach(index => {
                assert('name' in index, 'index should contain key: name');
                index.fields.forEach(field => {
                    assert('field' in field, 'index field should contain key: field');
                    assert('direction' in field, 'index field should contain key: direction');
                })
            });
        }));
    });

    describe('Post a new index', () => {
        it('should create a new index', () => {
            const testIndex =
                {
                    "name": "TEST_INDEX_02",
                    "namespace": testnamespace,
                    "collection": testcollection,
                    "fields": [
                        {
                            "field": "TEST_FIELD_01",
                            "direction": -1
                        }
                    ]
                };
            return splunk.kvstore.createIndex(testIndex, testnamespace, testcollection).then(response => {
                assert(!response)
            });
        });
    });

    describe('Delete an index', () => {
        it('should return no response body', () => splunk.kvstore.deleteIndex('TEST_INDEX_01', testnamespace, testcollection).then(response => {
            assert(!response);
        }));
    });
});
