const { assert } = require('chai');
const config = require('../config');
const SplunkSSC = require('../../splunk');

const sscHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const testNamespace = config.testNamespace;
const testCollection = config.testCollection;

const { createKVCollectionDataset, createRecord } = require('./catalog_proxy.js');

const ssc = new SplunkSSC(sscHost, token, tenantID);

const testKVCollectionName = testNamespace + '.' + testCollection;

describe('Integration tests for KVStore Query Endpoints', () => {
    // Required for `createKVCollectionDataset` helper
    let testDataset;

    var recordOne = {
        TEST_KEY_01: 'A',
        TEST_KEY_02: 'B',
        TEST_KEY_03: 'C',
    };
    var recordTwo = {
        TEST_KEY_01: 'B',
        TEST_KEY_02: 'C',
        TEST_KEY_03: 'A',
    };
    var recordThree = {
        TEST_KEY_01: 'C',
        TEST_KEY_02: 'A',
        TEST_KEY_03: 'B',
    };

    beforeEach(async () => {
        testDataset = await createKVCollectionDataset(testNamespace, testCollection);
        return testDataset;
    });
    afterEach(() => {
        if (testDataset != null) {
            return ssc.catalog
                .deleteDatasetByName(testDataset.name)
                .catch(err => console.log(`Error cleaning the test dataset: ${err}`));
        }
    });

    // -------------------------------------------------------------------------
    // GET
    // -------------------------------------------------------------------------
    describe('Test GET Requests', () => {
        it('Should return no records on dataset creation', () => {
            // The data set should be created by the `beforeEach` hook
            return ssc.kvstore.queryRecords(testKVCollectionName).then(queryRecordsResponse => {
                assert.equal(queryRecordsResponse.length, 0);
            });
        });
        it('Should return the record that was created', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return ssc.kvstore.queryRecords(testKVCollectionName);
                })
                .then(queryRecordsResponse => {
                    const firstRecord = queryRecordsResponse[0];

                    assert.equal(queryRecordsResponse.length, 1);
                    assert.equal(firstRecord['TEST_KEY_01'], 'A');
                    assert.equal(firstRecord['TEST_KEY_02'], 'B');
                    assert.equal(firstRecord['TEST_KEY_03'], 'C');
                });
        });
    });

    // -------------------------------------------------------------------------
    // GET ?fields= parameter
    // -------------------------------------------------------------------------
    describe('Test GET ?fields= parameter Requests', () => {
        it('Should return the correct record after single record insert when using empty filter', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    const queryParameters = '';
                    return ssc.kvstore.queryRecords(testKVCollectionName, '');
                })
                .then(queryRecordsResponse => {
                    const firstRecord = queryRecordsResponse[0];

                    assert.equal(queryRecordsResponse.length, 1);
                    assert.equal(firstRecord['TEST_KEY_01'], 'A');
                    assert.equal(firstRecord['TEST_KEY_02'], 'B');
                    assert.equal(firstRecord['TEST_KEY_03'], 'C');
                });
        });
        it('Should filter records correctly using the fields parameter for include selection', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    const queryParameters = { fields: 'TEST_KEY_01' };

                    return ssc.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    const firstRecord = queryRecordsResponse[0];

                    assert.equal(queryRecordsResponse.length, 1);
                    assert.equal(firstRecord['TEST_KEY_01'], 'A');
                });
        });
        it('Should filter records correctly using the fields parameter for exclude selection', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(createRecordResponse => {
                    const queryParameters = { fields: 'TEST_KEY_01:0' };
                    return ssc.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    const firstRecord = queryRecordsResponse[0];

                    assert.equal(queryRecordsResponse.length, 3);
                    for (var index = 0; index < queryRecordsResponse.length; index++) {
                        recordObject = queryRecordsResponse[index];
                        assert(Object.keys(recordObject).length, 3);
                    }
                });
        });
        it('Should error when trying filter records using the fields parameter and both the include/exclude selection', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(createRecordResponse => {
                    const queryParameters = { fields: 'TEST_KEY_01,TEST_KEY_02:0' };
                    return ssc.kvstore
                        .queryRecords(testKVCollectionName, queryParameters)
                        .then(queryRecordsResponse => {
                            assert.fail(
                                queryRecordsResponse,
                                null,
                                'The queryRecords endpoint should not have succeeded'
                            );
                        })
                        .catch(error => {
                            assert.notEqual(
                                error,
                                null,
                                `the queryRecords endpoint should not support
                                both include and exclude filter options`
                            );
                        });
                });
        });
    });

    // -------------------------------------------------------------------------
    // GET ?count= parameter
    // -------------------------------------------------------------------------
    describe('Test GET ?count= parameter Requests', () => {
        it('Should successfully return the correct count after record insertion', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    const queryParameters = { count: '1' };
                    return ssc.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 1);
                });
        });
        it('Should error on when a negative out of bounds count is specified', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    const queryParameters = { count: '-1' };
                    return ssc.kvstore
                        .queryRecords(testKVCollectionName, queryParameters)
                        .then(queryRecordsResponse => {
                            assert.fail(
                                queryRecordsResponse,
                                null,
                                `The queryRecords endpoint should not have
                                succeeded when provided a negative value for
                                the count query parameter`
                            );
                        })
                        .catch(error => {
                            assert.notEqual(
                                error,
                                null,
                                `the queryRecords endpoint should not support
                                negative count arguments`
                            );
                        });
                });
        });
        it('Should return the full list of records when a positive out of bounds value is specified', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    const queryParameters = { count: '1000000' };
                    return ssc.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 2);
                });
        });
    });

    // -------------------------------------------------------------------------
    // GET ?offset= parameter
    // -------------------------------------------------------------------------
    describe('Test GET ?offset= parameter Requests', () => {
        it('Should successfully return the correct count after an offset is specified', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    const queryParameters = { offset: '1' };
                    return ssc.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 1);
                });
        });
        it('Should error on when a negative out of bounds offset is specified', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    const queryParameters = { offset: '-1' };
                    return ssc.kvstore
                        .queryRecords(testKVCollectionName, queryParameters)
                        .then(queryRecordsResponse => {
                            assert.fail(
                                queryRecordsResponse,
                                null,
                                `The queryRecords endpoint should not have
                                succeeded when provided a negative value for
                                the offset query parameter`
                            );
                        })
                        .catch(error => {
                            assert.notEqual(
                                error,
                                null,
                                `the queryRecords endpoint should not support
                                negative offset options`
                            );
                        });
                });
        });
        it('Should return an empty list of records when a positive out of bounds value is specified', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    const queryParameters = { offset: '1000000' };
                    return ssc.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 0);
                });
        });
    });

    // -------------------------------------------------------------------------
    // GET ?orderby= parameter
    // -------------------------------------------------------------------------
    describe('Test GET ?orderby= parameter Requests', () => {
        it('Should successfully return the correct order of records', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(createRecordResponse => {
                    const queryParameters = { orderby: 'TEST_KEY_02' };
                    return ssc.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 3);
                    assert.equal('A', queryRecordsResponse[0]['TEST_KEY_02']);
                    assert.equal('B', queryRecordsResponse[1]['TEST_KEY_02']);
                    assert.equal('C', queryRecordsResponse[2]['TEST_KEY_02']);
                });
        });
        it('Should successfully return the records in default order when a non-existent key is specified', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(createRecordResponse => {
                    const queryParameters = { orderby: 'thisdoesntexistasakey' };
                    return ssc.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 3);
                    assert.equal('A', queryRecordsResponse[0]['TEST_KEY_01']);
                    assert.equal('B', queryRecordsResponse[1]['TEST_KEY_01']);
                    assert.equal('C', queryRecordsResponse[2]['TEST_KEY_01']);
                });
        });
    });
    // -------------------------------------------------------------------------
    // GET ?query= parameter
    // -------------------------------------------------------------------------
    describe('Test GET ?query= parameter Requests', () => {
        it('Should successfully return only element with matching values', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(createRecordResponse => {
                    const queryParameters = { query: '{"TEST_KEY_02":"A"}' };
                    return ssc.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 1);
                    assert.equal('A', queryRecordsResponse[0]['TEST_KEY_02']);
                    assert.equal('B', queryRecordsResponse[0]['TEST_KEY_03']);
                    assert.equal('C', queryRecordsResponse[0]['TEST_KEY_01']);
                });
        });
    });

    // --------
    // GET ?fields=count=offset=orderby=query= parameters
    // --------
    describe('Test GET ?fields=count=offset=orderby= parameters together', () => {
        it('Should successfully return the correct order of records', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(createRecordResponse => {
                    const queryParameters = {
                        fields: 'TEST_KEY_01:0',
                        count: '1',
                        offset: '1',
                        orderby: 'TEST_KEY_02',
                        query: '{"TEST_KEY_02":"A"}',
                    };
                    return ssc.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 0);
                });
        });
    });

    // -------------------------------------------------------------------------
    // POST
    // -------------------------------------------------------------------------
    describe('Test POST Requests', () => {
        it('Should successfully create a record', () => {
            // Testing happens in `createRecord function`
            return createRecord(testKVCollectionName, recordOne);
        });

        // A namespace AND collection are required to create a kvcollection
        // dataset, you cannot do one without the other.
        it('Should error when a namespace and collection are not specified for record creation', () => {
            return createRecord(null, null, recordOne).catch(error => {
                assert.notEqual(
                    error,
                    null,
                    `the queryRecords endpoint requires a namespace and a
                        collection to be provided on record creation`
                );
            });
        });
    });
});
