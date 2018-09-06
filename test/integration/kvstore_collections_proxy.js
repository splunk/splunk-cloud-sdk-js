const { assert } = require('chai');
const config = require('../config');
const SplunkCloud = require('../../splunk');

const splunkCloudHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;

const testNamespace = config.testNamespace;
const testCollection = config.testCollection;

const { ContentType } = require('../../client.ts');
const { createKVCollectionDataset, createRecord } = require('./catalog_proxy.js');

const splunkCloud = new SplunkCloud(splunkCloudHost, token, tenantID);

const testKVCollectionName = testNamespace + '.' + testCollection;

describe('Integration tests for KVStore Collection Endpoints', () => {
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
            return splunkCloud.catalog
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
            return splunkCloud.kvstore.listRecords(testKVCollectionName).then(listRecordsResponse => {
                assert.equal(listRecordsResponse.length, 0);
            });
        });
        it('Should return the record that was created', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return splunkCloud.kvstore.listRecords(testKVCollectionName);
                })
                .then(listRecordsResponse => {
                    const firstRecord = listRecordsResponse[0];

                    assert.equal(listRecordsResponse.length, 1);
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
                    return splunkCloud.kvstore.listRecords(testKVCollectionName, '');
                })
                .then(listRecordsResponse => {
                    const firstRecord = listRecordsResponse[0];

                    assert.equal(listRecordsResponse.length, 1);
                    assert.equal(firstRecord['TEST_KEY_01'], 'A');
                    assert.equal(firstRecord['TEST_KEY_02'], 'B');
                    assert.equal(firstRecord['TEST_KEY_03'], 'C');
                });
        });
        it('Should filter records correctly using the fields parameter for include selection', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    const queryParameters = { fields: 'TEST_KEY_01' };

                    return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters);
                })
                .then(listRecordsResponse => {
                    const firstRecord = listRecordsResponse[0];

                    assert.equal(listRecordsResponse.length, 1);
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
                    return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters);
                })
                .then(listRecordsResponse => {
                    const firstRecord = listRecordsResponse[0];

                    assert.equal(listRecordsResponse.length, 3);
                    for (var index = 0; index < listRecordsResponse.length; index++) {
                        recordObject = listRecordsResponse[index];
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
                    return splunkCloud.kvstore
                        .listRecords(testKVCollectionName, queryParameters)
                        .then(listRecordsResponse => {
                            assert.fail(
                                listRecordsResponse,
                                null,
                                'The listRecords endpoint should not have succeeded'
                            );
                        })
                        .catch(error => {
                            assert.notEqual(
                                error,
                                null,
                                `the listRecords endpoint should not support
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
                    return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters);
                })
                .then(listRecordsResponse => {
                    assert.equal(listRecordsResponse.length, 1);
                });
        });
        it('Should error on when a negative out of bounds count is specified', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    const queryParameters = { count: '-1' };
                    return splunkCloud.kvstore
                        .listRecords(testKVCollectionName, queryParameters)
                        .then(listRecordsResponse => {
                            assert.fail(
                                listRecordsResponse,
                                null,
                                `The listRecords endpoint should not have
                                succeeded when provided a negative value for
                                the count query parameter`
                            );
                        })
                        .catch(error => {
                            assert.notEqual(
                                error,
                                null,
                                `the listRecords endpoint should not support
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
                    return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters);
                })
                .then(listRecordsResponse => {
                    assert.equal(listRecordsResponse.length, 2);
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
                    return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters);
                })
                .then(listRecordsResponse => {
                    assert.equal(listRecordsResponse.length, 1);
                });
        });
        it('Should error on when a negative out of bounds offset is specified', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    const queryParameters = { offset: '-1' };
                    return splunkCloud.kvstore
                        .listRecords(testKVCollectionName, queryParameters)
                        .then(listRecordsResponse => {
                            assert.fail(
                                listRecordsResponse,
                                null,
                                `The listRecords endpoint should not have
                                succeeded when provided a negative value for
                                the offset query parameter`
                            );
                        })
                        .catch(error => {
                            assert.notEqual(
                                error,
                                null,
                                `the listRecords endpoint should not support
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
                    return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters);
                })
                .then(listRecordsResponse => {
                    assert.equal(listRecordsResponse.length, 0);
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
                    return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters);
                })
                .then(listRecordsResponse => {
                    assert.equal(listRecordsResponse.length, 3);
                    assert.equal('A', listRecordsResponse[0]['TEST_KEY_02']);
                    assert.equal('B', listRecordsResponse[1]['TEST_KEY_02']);
                    assert.equal('C', listRecordsResponse[2]['TEST_KEY_02']);
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
                    return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters);
                })
                .then(listRecordsResponse => {
                    assert.equal(listRecordsResponse.length, 3);
                    assert.equal('A', listRecordsResponse[0]['TEST_KEY_01']);
                    assert.equal('B', listRecordsResponse[1]['TEST_KEY_01']);
                    assert.equal('C', listRecordsResponse[2]['TEST_KEY_01']);
                });
        });
    });

    // --------
    // GET ?fields=count=offset=orderby= parameters
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
                    };
                    return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters);
                })
                .then(listRecordsResponse => {
                    assert.equal(listRecordsResponse.length, 1);
                    assert.equal('B', listRecordsResponse[0]['TEST_KEY_02']);
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
                    `the listRecords endpoint requires a namespace and a
                        collection to be provided on record creation`
                );
            });
        });
    });

    describe('Test GetCollections', () => {
        it('Should successfully return all the collections present in the given tenant', () => {
            return splunkCloud.kvstore.getCollections()
                .then(getCollectionsResponse => {
                    assert(getCollectionsResponse.length >= 1, "Atleast one collection should be returned");
                });
        });
    });

    describe('Test ExportCollection', () => {
        it('Should successfully return the csv format of records file', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(createRecordResponse => {
                    return splunkCloud.kvstore.exportCollection(testKVCollectionName, ContentType.CSV);
                })
                .then(exportCollectionResponse => {
                    assert.isNotEmpty(exportCollectionResponse);
                });
        });

        it('Should successfully return the gzip format of records file', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(createRecordResponse => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(createRecordResponse => {
                    return splunkCloud.kvstore.exportCollection(testKVCollectionName, ContentType.GZIP);
                })
                .then(exportCollectionResponse => {
                    assert.isNotEmpty(exportCollectionResponse);
                });
        });
    });
});
