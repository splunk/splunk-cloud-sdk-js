const { assert } = require('chai');
const config = require('../config');
const SplunkSSC = require('../../splunk');

const testNamespace = config.testNamespace;
const testCollection = config.testCollection;

const splunk = new SplunkSSC(
    `http://${config.stubbyHost}:8882`,
    config.stubbyAuthToken,
    config.stubbyTenant
);

describe('Stubby tests for Kvstore Index Endpoints', () => {
    describe('Get all indexes', () => {
        it('should return all the indexes present in the given collection and namespace', () => {
            return splunk.kvstore.listIndexes(testCollection).then(indexes => {
                assert.typeOf(indexes, 'array', 'response data should be an array');
                indexes.forEach(index => {
                    assert('name' in index, 'index should contain key: name');
                    index.fields.forEach(field => {
                        assert('field' in field, 'index field should contain key: field');
                        assert('direction' in field, 'index field should contain key: direction');
                    });
                });
            });
        });
    });

    describe('Post a new index', () => {
        it('should create a new index', () => {
            const testIndex = {
                name: 'TEST_INDEX_02',
                namespace: testNamespace,
                collection: testCollection,
                fields: [
                    {
                        field: 'TEST_FIELD_01',
                        direction: -1,
                    },
                ],
            };
            return splunk.kvstore.createIndex(testIndex, testCollection).then(response => {
                assert.notEqual(response, null);
            });
        });
    });

    describe('Delete an index', () => {
        it('should return no response body', () => {
            return splunk.kvstore.deleteIndex('TEST_INDEX_01', testCollection).then(response => {
                assert.notEqual(response, null);
            });
        });
    });
});

describe('Stubby tests for Kvstore Record Endpoints', () => {
    describe('Insert new records', () => {
        const testRecords = [
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
        ];
        it('should return an array of keys of the newly created records in the given collection and namespace', () =>
            splunk.kvstore.insertRecords(testCollection, testRecords).then(keys => {
                assert.typeOf(keys, 'array', 'response data should be an array');
                assert.equal(keys.length, 3);
            }));
    });

    describe('Get record by key', () => {
        it('should return a record corresponding to the given key', () =>
            splunk.kvstore.getRecordByKey(testCollection, 'TEST_RECORD_KEY_01').then(record => {
                assert.equal(record._key, 'TEST_RECORD_KEY_01');
                assert.equal(record.capacity_gb, 8);
                assert.equal(record.description, 'This is a tiny amount of GB');
                assert.equal(record.size, 'tiny');
            }));
    });

    describe('Delete a record by key', () => {
        it('should return no response body', () =>
            splunk.kvstore
                .deleteRecordByKey(testCollection, 'TEST_RECORD_KEY_01')
                .then(response => {
                    assert(!response);
                }));
    });

    describe('Get all the records', () => {
        it('should return all the records present in the given collection and namespace', () =>
            splunk.kvstore.queryRecords(testCollection).then(records => {
                assert.typeOf(records, 'array', 'response data should be an array');
                assert.deepEqual(records.length, 2, 'Two records should be returned');
                assert.equal(records[0]._key, 'TEST_RECORD_KEY_01');
                assert.equal(records[1]._key, 'TEST_RECORD_KEY_02');
            }));
    });

    describe('Get all the records based on the given query', () => {
        it('should return all the records present in the given collection and namespace that matches the given query', () =>
            splunk.kvstore.queryRecords(testCollection).then(records => {
                assert.typeOf(records, 'array', 'response data should be an array');
                assert.equal(records.length, 2);
                assert.equal(records[0]._key, 'TEST_RECORD_KEY_01');
                assert.equal(records[0].capacity_gb, 8);
                assert.equal(records[0].description, 'This is a tiny amount of GB');
                assert.equal(records[0].size, 'tiny');
            }));
    });

    describe('Delete all the records', () => {
        it('should return no response body', () =>
            splunk.kvstore.deleteRecords(testCollection).then(response => {
                assert(!response);
            }));
    });

    describe('Delete a record based on the query', () => {
        it('should return no response body', () =>
            splunk.kvstore
                .deleteRecords(testCollection, '{"size": "tiny", "capacity_gb": 8}')
                .then(response => {
                    assert(!response);
                }));
    });
});
