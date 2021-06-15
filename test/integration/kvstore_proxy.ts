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
import { Dataset } from '../../services/catalog';
import { PingResponseStatusEnum } from '../../services/kvstore';
import { SplunkCloud } from '../../splunk';
import config from '../config';
import { createKVCollectionDataset } from './catalog_proxy';

const splunkCloud = new SplunkCloud({ urls: { api: config.stagingApiHost, app: config.stagingAppsHost }, tokenSource: config.stagingAuthToken, defaultTenant: config.stagingTenant });

const testNamespace = config.testNamespace;
const testCollection = config.testCollection;
let testKVCollectionName: string;


describe('Integration tests for KVStore Endpoints', () => {
    let testDataset: Dataset | null;

    before(() => {
        return createKVCollectionDataset(testNamespace, testCollection).then(ds => {
            assert.isNotNull(ds);
            testDataset = ds;
            testKVCollectionName = `${ds!.module}.${ds!.name}`;
        });
    });

    after(() => {
        if (testDataset !== undefined) {
            const td = testDataset;
            if (td !== null) {
                return splunkCloud.catalog
                    .deleteDataset(td.id as string)
                    .catch(err => console.log(`Error cleaning the test dataset: ${err}`));
            }
        }
    });

    describe('Admin Endpoints', () => {
        describe('Ping Endpoint', () => {
            it('Should return a "healthy" response', () => {
                return splunkCloud.kvstore.ping().then(response => {
                    assert.equal(response.status, PingResponseStatusEnum.Healthy);
                });
            });
        });
    });

    describe('Index Endpoints', () => {
        const testIndex = `integtestindex${Date.now()}`;
        const fields = [{ direction: -1, field: 'integ_testField1' }];

        describe('index endpoints', () => {
            describe('Validate creation and deletion of an index', () => {
                it('should create a new index', () => {
                    return splunkCloud.kvstore
                        .createIndex(testKVCollectionName, {
                            fields,
                            name: testIndex,
                        })
                        .then(response => {
                            assert.strictEqual(response.name, testIndex);
                        });
                });

                it('should return the newly created index', () => {
                    return splunkCloud.kvstore.listIndexes(testKVCollectionName).then(response => {
                        assert.equal(response.length, 1);
                    });
                });

                // it('should delete the specified index', () => {
                //     return splunkCloud.kvstore.deleteIndex(testKVCollectionName, testIndex).then(response => {
                //         assert.isEmpty(response);
                //     });
                // });

                // it('should not return any index', () => {
                //     return splunkCloud.kvstore.listIndexes(testKVCollectionName).then(response => {
                //         assert.equal(response.length, 0);
                //     });
                // });
            });
        });

        describe('index endpoints - Error scenarios', () => {
            it('should throw 404 Not Found error because the namespace or the collection does not exist', () => {
                return splunkCloud.kvstore.createIndex(
                    `missing${Date.now()}`,
                    {
                        fields,
                        name: testIndex,
                    })
                    .then(response => assert.fail(response), err => assert.equal(err.httpStatusCode, 404));
            });

            /* TODO: (Commenting for now) Delete on a non-existing index is yielding a 200OK response. kvstore service updated codes at their end and this would be 204 (Being tracked here: splunkCloud-3101)
             */
            // it('should throw 404 index not found error as index being deleted does not exist', () =>
            //     splunkCloud.kvstore
            //         .deleteIndex(testKVCollectionName, `invalid${config.testCollection}`)
            //         .then(response => assert.fail(response), err => assert.equal(err.code, '404')));

        });
    });

    describe('Record endpoints', () => {
        const integrationTestRecords = [
            {
                capacity_gb: 8,
                size: 0.01,
                description: 'This is a tiny amount of GB',
                _raw: '',
            },
            {
                capacity_gb: 16,
                size: 1,
                description: 'This is a small amount of GB',
                _raw: '',
            },
            {
                type: 'A',
                name: 'test_record',
                count_of_fields: 3,
            },
            {
                type: 'B',
                name: 'test_record',
                count_of_fields: 3,
            },
        ];

        describe('Test inserting/updating records via putRecords', () => {
            const oldRecord = {
                lazy: 'dog',
            };
            const newRecord = {
                quick: 'fox',
                brown: 'fox',
            };
            const newKey = `newkey${Date.now()}`;
            let oldKey: string;

            before('should create an existing record via insertRecord', () =>
                splunkCloud.kvstore
                    .insertRecord(testKVCollectionName, oldRecord)
                    .then((response) => {
                        oldKey = response.key;
                    })
            );

            after('should clean up records created and updated', () =>
                splunkCloud.kvstore.deleteRecordByKey(testKVCollectionName, oldKey)
                    .then(() =>
                        splunkCloud.kvstore.deleteRecordByKey(testKVCollectionName, newKey))
            );

            it('should update an existing record via putRecord', () =>
                splunkCloud.kvstore
                    .putRecord(testKVCollectionName, oldKey, { lazy: 'god' })
                    .then(putResponse => {
                        assert.isObject(putResponse);
                        assert.equal(putResponse.key, oldKey);
                    })
            );

            it('should create a new record via putRecord', () =>
                splunkCloud.kvstore
                    .putRecord(testKVCollectionName, newKey, newRecord)
                    .then(putResponse => {
                        assert.isObject(putResponse);
                        assert.equal(putResponse.key, newKey);
                    })
            );
        });

        describe('Test insertion, retrieval and deletion of the records', () => {
            let keys: string[];
            before('should create new records via insertRecords', () => {
                return splunkCloud.kvstore.insertRecords(testKVCollectionName, integrationTestRecords as any).then(response => {
                    keys = response as string[];
                    assert.equal(keys.length, 4);
                });
            });

            it('should retrieve the newly created record by key', () => {
                return splunkCloud.kvstore.getRecordByKey(testKVCollectionName, keys[0]).then(response => {
                    assert.notEqual(response.size, '0');
                    assert.equal(response.capacity_gb, '8');
                    assert.equal(response.description, 'This is a tiny amount of GB');
                    assert.equal(response.size, '0.01');
                });
            });

            it('should delete the newly created record by key', () => {
                return splunkCloud.kvstore.deleteRecordByKey(testKVCollectionName, keys[0]).then(response => {
                    assert.isEmpty(response);
                });
            });

            it('validate that after calling deleteRecordbyKey(), only 3 records are left', () => {
                return splunkCloud.kvstore.listRecords(testKVCollectionName).then(res => {
                    const response = res as object[];
                    assert.equal(response.length, 3);

                    const keyElements: string[] = [];
                    response.forEach(val => {
                        const v = val as { [key: string]: string };
                        keyElements.push(v._key);
                    });

                    assert.equal(keyElements[0], keys[1]);
                    assert.equal(keyElements[1], keys[2]);
                    assert.equal(keyElements[2], keys[3]);
                });
            });

            it('should retrieve the records based on a query', () => {
                return splunkCloud.kvstore.listRecords(testKVCollectionName, { fields: ['type'] })
                    .then(response => {
                        assert.equal(response.length, 3);
                    });
            });

            it('should delete the records based on a query', () => {
                const query = '{ name: "test_record", count_of_fields: 3, }';
                return splunkCloud.kvstore.deleteRecords(testKVCollectionName, { query })
                    .then(response => {
                        assert.isEmpty(response);
                    });
            });

            it('validate that after calling deleteRecords() based on query, no record is left', () => {
                return splunkCloud.kvstore.listRecords(testKVCollectionName).then(response => {
                    assert.equal(response.length, 0);
                });
            });

            it('should delete all the records', () => {
                return splunkCloud.kvstore.deleteRecords(testKVCollectionName).then(response => {
                    assert.isEmpty(response);
                });
            });

            it('validate that after calling deleteRecords(), no records should be returned', () => {
                return splunkCloud.kvstore.queryRecords(testKVCollectionName).then(response => {
                    assert.equal(response.length, 0);
                });
            });
        });
    });
});
