/**
 * Copyright 2019 Splunk, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"): you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { assert } from 'chai';
import { SplunkCloud } from '../../splunk';
import config from '../config';
import { createKVCollectionDataset } from './catalog_proxy';

const splunkCloud = new SplunkCloud({
    urls: {
        api: config.stagingApiHost,
    },
    tokenSource: config.stagingAuthToken,
    defaultTenant: config.stagingTenant,
});

const testNamespace = config.testNamespace;

describe('Integration tests for KVStore Collection Endpoints', () => {
    const recordOne = {
        TEST_KEY_01: 'A',
        TEST_KEY_02: 'B',
        TEST_KEY_03: 'C',
        order: 1,
    };
    const recordTwo = {
        TEST_KEY_01: 'B',
        TEST_KEY_02: 'C',
        TEST_KEY_03: 'A',
        order: 2,
    };
    const recordThree = {
        TEST_KEY_01: 'C',
        TEST_KEY_02: 'A',
        TEST_KEY_03: 'B',
        order: 3,
    };
    // Required for `createKVCollectionDataset` helper
    let testKVCollectionName: string;
    let initialListRecordsResponse: Array<{ [key: string]: string }>;
    let testKVCollectionID: string;

    before(() => {
        const testCollection = `jscoll${Date.now()}`;
        return createKVCollectionDataset(testNamespace, testCollection).then(kvds => {
            testKVCollectionID = kvds!.id;
            testKVCollectionName = `${kvds!.module}.${kvds!.name}`;
            return splunkCloud.kvstore.listRecords(testKVCollectionName).then(res => {
                initialListRecordsResponse = res as Array<{ [key: string]: string }>;
            });
        });
    });

    after(() => {
        return splunkCloud.catalog.deleteDatasetById(testKVCollectionID);
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
                    assert.equal(listRecordsResponse.length, 3);
                    const firstRecord: any = listRecordsResponse.find(x => x.order === 1) || {};
                    assert.equal(firstRecord.TEST_KEY_01, 'A');
                    assert.equal(firstRecord.TEST_KEY_02, 'B');
                    assert.equal(firstRecord.TEST_KEY_03, 'C');
                    const secondRecord: any = listRecordsResponse.find(x => x.order === 2) || {};
                    assert.equal(secondRecord.TEST_KEY_01, 'B');
                    assert.equal(secondRecord.TEST_KEY_02, 'C');
                    assert.equal(secondRecord.TEST_KEY_03, 'A');
                    const thirdRecord: any = listRecordsResponse.find(x => x.order === 3) || {};
                    assert.equal(thirdRecord.TEST_KEY_01, 'C');
                    assert.equal(thirdRecord.TEST_KEY_02, 'A');
                    assert.equal(thirdRecord.TEST_KEY_03, 'B');
                });
        });
    });

    // -------------------------------------------------------------------------
    // GET ?fields= parameter
    // -------------------------------------------------------------------------
    describe('Test GET ?fields= parameter Requests', () => {
        it('Should return all records when using empty filter', () => splunkCloud.kvstore.listRecords(testKVCollectionName)
            .then(listRecordsResponse => {
                assert.equal(listRecordsResponse.length, 3);
                const firstRecord: any = listRecordsResponse.find(x => x.order === 1) || {};
                assert.equal(firstRecord.TEST_KEY_01, 'A');
                assert.equal(firstRecord.TEST_KEY_02, 'B');
                assert.equal(firstRecord.TEST_KEY_03, 'C');
                const secondRecord: any = listRecordsResponse.find(x => x.order === 2) || {};
                assert.equal(secondRecord.TEST_KEY_01, 'B');
                assert.equal(secondRecord.TEST_KEY_02, 'C');
                assert.equal(secondRecord.TEST_KEY_03, 'A');
                const thirdRecord: any = listRecordsResponse.find(x => x.order === 3) || {};
                assert.equal(thirdRecord.TEST_KEY_01, 'C');
                assert.equal(thirdRecord.TEST_KEY_02, 'A');
                assert.equal(thirdRecord.TEST_KEY_03, 'B');
            })
        );
        it('Should filter records correctly using the fields parameter for include selection', () => {
            const queryParameters = { fields: ['TEST_KEY_01'] };
            return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters)
                .then(listRecordsResponse => {
                    assert.equal(listRecordsResponse.length, 3);
                    assert.exists(listRecordsResponse.find(x => x.TEST_KEY_01 === 'A'));
                    assert.exists(listRecordsResponse.find(x => x.TEST_KEY_01 === 'B'));
                    assert.exists(listRecordsResponse.find(x => x.TEST_KEY_01 === 'C'));
                });
        });
        it('Should filter records correctly using the fields parameter for exclude selection', () => {
            const queryParameters = { fields: ['TEST_KEY_01:0'] };
            return splunkCloud.kvstore.listRecords(testKVCollectionName, queryParameters)
                .then(listRecordsResponse => {
                    assert.equal(listRecordsResponse.length, 3);
                    for (const record of listRecordsResponse) {
                        assert.equal(Object.keys(record).length, 5);
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
    return splunkCloud.kvstore.insertRecord(collection, record as { [key: string]: string })
        .then(response => {
            assert.notEqual(response._key, null);
            assert.typeOf(response._key, 'string');
            return response;
        });
}
