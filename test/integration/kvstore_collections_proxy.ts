import { assert } from 'chai';
import { SplunkCloud } from '../../src/splunk';
import config from '../config';
import { createKVCollectionDataset } from './catalog_proxy';

const splunkCloud = new SplunkCloud({ urls: { api: config.stagingApiHost, app: config.stagingAppsHost }, tokenSource: config.stagingAuthToken, defaultTenant: config.stagingTenant });

const testNamespace = config.testNamespace;

describe('Integration tests for KVStore Collection Endpoints', () => {
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
    // Required for `createKVCollectionDataset` helper
    let testKVCollectionName: string;
    let initialListRecordsResponse: Array<{[key: string]: string}>;

    before(() => {
        const testCollection = `jscoll${Date.now()}`;
        testKVCollectionName = `${testNamespace}.${testCollection}`;
        return createKVCollectionDataset(testNamespace, testCollection).then(() =>
            splunkCloud.kvstore.listRecords(testKVCollectionName).then(res => {
                initialListRecordsResponse = res as Array<{[key: string]: string}>;
            })
        );
    });

    after(() => {
        return splunkCloud.catalog.deleteDataset(testKVCollectionName);
    });

    // -------------------------------------------------------------------------
    // POST
    // -------------------------------------------------------------------------
    describe('Test POST Requests', () => {
        it('Should successfully create a record', () => {
            // Testing happens in `createRecord function`
            return createRecord(testKVCollectionName, recordOne).then((response) => {
                assert.isNotEmpty(response);
                return createRecord(testKVCollectionName, recordTwo);
            }).then((response) => {
                assert.isNotEmpty(response);
                return createRecord(testKVCollectionName, recordThree);
            }).then((response) => {
                assert.isNotEmpty(response);
            });
        });
    });

    // -------------------------------------------------------------------------
    // GET
    // -------------------------------------------------------------------------
    describe('Test GET Requests', () => {
        it('Should return no records on dataset creation', () => {
            // The dataset and initialListRecordsResponse should be created by the `before` hook
            assert.equal(initialListRecordsResponse.length, 0);
        });
        it('Should return the records that were created', () => {
            return splunkCloud.kvstore.listRecords(testKVCollectionName)
                .then(listRecordsResponse => {
                    const firstRecord = listRecordsResponse[0];

                    assert.equal(listRecordsResponse.length, 3);
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
        it('Should return all records when using empty filter', () => splunkCloud.kvstore.listRecords(testKVCollectionName)
                .then(listRecordsResponse => {
                    const firstRecord = listRecordsResponse[0];

                    assert.equal(listRecordsResponse.length, 3);
                    assert.equal(firstRecord.TEST_KEY_01, 'A');
                    assert.equal(firstRecord.TEST_KEY_02, 'B');
                    assert.equal(firstRecord.TEST_KEY_03, 'C');
                })
        );
        it('Should filter records correctly using the fields parameter for include selection', () => {
            const queryParameters = { fields: ['TEST_KEY_01'] };
            return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters)
                .then(listRecordsResponse => {
                    const firstRecord = listRecordsResponse[0];

                    assert.equal(listRecordsResponse.length, 3);
                    assert.equal(firstRecord.TEST_KEY_01, 'A');
                });
        });
        it('Should filter records correctly using the fields parameter for exclude selection', () => {
            const queryParameters = { fields: ['TEST_KEY_01:0'] };
            return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters)
                .then(listRecordsResponse => {
                    assert.equal(listRecordsResponse.length, 3);
                    for (const record of listRecordsResponse) {
                        assert.equal(Object.keys(record).length, 3);
                    }
                });
        });
        it('Should error when trying filter records using the fields parameter and both the include/exclude selection', () => {
            const queryParameters = { fields: ['TEST_KEY_01,TEST_KEY_02:0'] };
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

    // -------------------------------------------------------------------------
    // GET ?count= parameter
    // -------------------------------------------------------------------------
    describe('Test GET ?count= parameter Requests', () => {
        it('Should successfully return the correct count after record insertion', () => {
            const queryParameters = { count: 1 };
            return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters)
                .then(listRecordsResponse => {
                    assert.equal(listRecordsResponse.length, 1);
                });
        });
    });

    // -------------------------------------------------------------------------
    // GET ?offset= parameter
    // -------------------------------------------------------------------------
    describe('Test GET ?offset= parameter Requests', () => {
        it('Should successfully return the correct count after an offset is specified', () => {
            const queryParameters = { offset: 1 };
            return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters)
                .then(listRecordsResponse => {
                    // Offset of 1 means that records 2 and 3 should be returned
                    assert.equal(listRecordsResponse.length, 2);
                });
        });
    });

    // -------------------------------------------------------------------------
    // GET ?orderby= parameter
    // -------------------------------------------------------------------------
    describe('Test GET ?orderby= parameter Requests', () => {
        it('Should successfully return the correct order of records', () => {
            const queryParameters = { orderby: ['TEST_KEY_02'] };
            return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters)
                .then(listRecordsResponse => {
                    assert.equal(listRecordsResponse.length, 3);
                    assert.equal(listRecordsResponse[0].TEST_KEY_02, 'A');
                    assert.equal(listRecordsResponse[1].TEST_KEY_02, 'B');
                    assert.equal(listRecordsResponse[2].TEST_KEY_02, 'C');
                });
        });
    });

    // --------
    // GET ?fields=count=offset=orderby= parameters
    // --------
    describe('Test GET ?fields=count=offset=orderby= parameters together', () => {
        it('Should successfully return the correct order of records', () => {
            const queryParameters = {
                fields: ['TEST_KEY_01:0'],
                count: 1,
                offset: 1,
                orderby: ['TEST_KEY_02'],
            };
            return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters)
                .then(listRecordsResponse => {
                    assert.equal(listRecordsResponse.length, 1);
                    assert.equal(listRecordsResponse[0].TEST_KEY_02, 'B');
                });
        });
    });

});

export function createRecord(collection: string, record: object): Promise<object> {
    return splunkCloud.kvstore.insertRecord(collection, record as {[key: string]: string})
        .then(response => {
            assert.notEqual(response._key, null);
            assert.typeOf(response._key, 'string');
            return response;
        });
}