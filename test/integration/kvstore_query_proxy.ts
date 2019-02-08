import { assert } from 'chai';
import { SplunkCloud } from '../../src/splunk';
import config from '../config';
import { createKVCollectionDataset } from './catalog_proxy';
import { createRecord } from './kvstore_collections_proxy';

const splunkCloud = new SplunkCloud({ urls: { api: config.stagingApiHost, app: config.stagingAppsHost }, tokenSource: config.stagingAuthToken, defaultTenant: config.stagingTenant });

const testNamespace = config.testNamespace;

describe('Integration tests for KVStore Query Endpoints', () => {
    // Required for `createKVCollectionDataset` helper
    let testKVCollectionName: string;

    const recordOne = {
        TEST_KEY_01: 'A',
        TEST_KEY_02: 'B',
        TEST_KEY_03: 'C',
    };
    const recordTwo = {
        TEST_KEY_01: 'B',
        TEST_KEY_02: 'C',
        TEST_KEY_03: 'A',
    };
    const recordThree = {
        TEST_KEY_01: 'C',
        TEST_KEY_02: 'A',
        TEST_KEY_03: 'B',
    };

    beforeEach(() => {
        const testCollection = `jscoll${Date.now()}`;
        testKVCollectionName = `${testNamespace}.${testCollection}`;

        return createKVCollectionDataset(testNamespace, testCollection);
    });

    afterEach(() => {
        return splunkCloud.catalog.deleteDataset(testKVCollectionName);
    });

    // -------------------------------------------------------------------------
    // GET
    // -------------------------------------------------------------------------
    describe('Test GET Requests', () => {
        it('Should return no records on dataset creation', () => {
            // The data set should be created by the `beforeEach` hook
            return splunkCloud.kvstore.queryRecords(testKVCollectionName).then(queryRecordsResponse => {
                assert.equal(queryRecordsResponse.length, 0);
            });
        });
        it('Should return the record that was created', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(() => {
                    return splunkCloud.kvstore.queryRecords(testKVCollectionName);
                })
                .then(queryRecordsResponse => {
                    const firstRecord = queryRecordsResponse[0];

                    assert.equal(queryRecordsResponse.length, 1);
                    assert.equal(firstRecord.TEST_KEY_01, 'A');
                    assert.equal(firstRecord.TEST_KEY_02, 'B');
                    assert.equal(firstRecord.TEST_KEY_03, 'C');
                });
        });
    });

    // -------------------------------------------------------------------------
    // GET ?fields= parameter
    // -------------------------------------------------------------------------
    describe('Test GET ?fields= parameter Requests', () => {
        it('Should return the correct record after single record insert when using empty filter', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(() => {
                    return splunkCloud.kvstore.queryRecords(testKVCollectionName);
                })
                .then(queryRecordsResponse => {
                    const firstRecord = queryRecordsResponse[0];

                    assert.equal(queryRecordsResponse.length, 1);
                    assert.equal(firstRecord.TEST_KEY_01, 'A');
                    assert.equal(firstRecord.TEST_KEY_02, 'B');
                    assert.equal(firstRecord.TEST_KEY_03, 'C');
                });
        });
        it('Should filter records correctly using the fields parameter for include selection', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(() => {
                    const queryParameters = { fields: ['TEST_KEY_01'] };

                    return splunkCloud.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    const firstRecord = queryRecordsResponse[0];

                    assert.equal(queryRecordsResponse.length, 1);
                    assert.equal(firstRecord.TEST_KEY_01, 'A');
                });
        });
        it('Should filter records correctly using the fields parameter for exclude selection', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(() => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(() => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(() => {
                    const queryParameters = { fields: ['TEST_KEY_01:0'] };
                    return splunkCloud.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 3);
                    for (const recordObject of queryRecordsResponse) {
                        assert.equal(Object.keys(recordObject).length, 3);
                    }
                });
        });
        it('Should error when trying filter records using the fields parameter and both the include/exclude selection', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(() => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(() => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(() => {
                    const queryParameters = { fields: ['TEST_KEY_01,TEST_KEY_02:0'] };
                    return splunkCloud.kvstore
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
                .then(() => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(() => {
                    const queryParameters = { count: 1 };
                    return splunkCloud.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 1);
                });
        });
        it('Should error on when a negative out of bounds count is specified', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(() => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(() => {
                    const queryParameters = { count: -1 };
                    return splunkCloud.kvstore
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
                .then(() => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(() => {
                    const queryParameters = { count: 1000000 };
                    return splunkCloud.kvstore.queryRecords(testKVCollectionName, queryParameters);
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
                .then(() => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(() => {
                    const queryParameters = { offset: 1 };
                    return splunkCloud.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 1);
                });
        });
        it('Should error on when a negative out of bounds offset is specified', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(() => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(() => {
                    const queryParameters = { offset: -1 };
                    return splunkCloud.kvstore
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
                .then(() => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(() => {
                    const queryParameters = { offset: 1000000 };
                    return splunkCloud.kvstore.queryRecords(testKVCollectionName, queryParameters);
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
                .then(() => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(() => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(() => {
                    const queryParameters = { orderby: ['TEST_KEY_02'] };
                    return splunkCloud.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 3);
                    assert.equal(queryRecordsResponse[0].TEST_KEY_02, 'A');
                    assert.equal(queryRecordsResponse[1].TEST_KEY_02, 'B');
                    assert.equal(queryRecordsResponse[2].TEST_KEY_02, 'C');
                });
        });
        it('Should successfully return the records in default order when a non-existent key is specified', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(() => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(() => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(() => {
                    const queryParameters = { orderby: ['thisdoesntexistasakey'] };
                    return splunkCloud.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 3);
                    assert.equal(queryRecordsResponse[0].TEST_KEY_01, 'A');
                    assert.equal(queryRecordsResponse[1].TEST_KEY_01, 'B');
                    assert.equal(queryRecordsResponse[2].TEST_KEY_01, 'C');
                });
        });
    });
    // -------------------------------------------------------------------------
    // GET ?query= parameter
    // -------------------------------------------------------------------------
    describe('Test GET ?query= parameter Requests', () => {
        it('Should successfully return only element with matching values', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(() => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(() => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(() => {
                    const queryParameters = { query: '{"TEST_KEY_02":"A"}' };
                    return splunkCloud.kvstore.queryRecords(testKVCollectionName, queryParameters);
                })
                .then(queryRecordsResponse => {
                    assert.equal(queryRecordsResponse.length, 1);
                    assert.equal(queryRecordsResponse[0].TEST_KEY_02, 'A');
                    assert.equal(queryRecordsResponse[0].TEST_KEY_03, 'B');
                    assert.equal(queryRecordsResponse[0].TEST_KEY_01, 'C');
                });
        });
    });

    // --------
    // GET ?fields=count=offset=orderby=query= parameters
    // --------
    describe('Test GET ?fields=count=offset=orderby= parameters together', () => {
        it('Should successfully return the correct order of records', () => {
            return createRecord(testKVCollectionName, recordOne)
                .then(() => {
                    return createRecord(testKVCollectionName, recordTwo);
                })
                .then(() => {
                    return createRecord(testKVCollectionName, recordThree);
                })
                .then(() => {
                    const queryParameters = {
                        fields: ['TEST_KEY_01:0'],
                        count: 1,
                        offset: 1,
                        orderby: ['TEST_KEY_02'],
                        query: '{"TEST_KEY_02":"A"}',
                    };
                    return splunkCloud.kvstore.queryRecords(testKVCollectionName, queryParameters);
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
    });
});
