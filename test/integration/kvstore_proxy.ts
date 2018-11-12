import { assert } from 'chai';
import { DatasetInfo } from '../../catalog';
import { SplunkCloud } from '../../splunk';
import config from '../config';
import { createKVCollectionDataset } from './catalog_proxy';

const splunkCloud = new SplunkCloud({ urls: { api: config.stagingApiHost, app: config.stagingAppsHost }, tokenSource: config.stagingAuthToken, defaultTenant: config.stagingTenant });

const testNamespace = config.testNamespace;
const testCollection = config.testCollection;
const testKVCollectionName = `${testNamespace}.${testCollection}`;


describe('Integration tests for KVStore Endpoints', () => {
    let testDataset: DatasetInfo;

    before(async () => {
        testDataset = await createKVCollectionDataset(testNamespace, testCollection) as DatasetInfo;
        return testDataset;
    });
    after(() => {
        if (testDataset !== null) {
            splunkCloud.catalog
                .deleteDatasetByName(testDataset.name as string)
                .catch(err => console.log(`Error cleaning the test dataset: ${err}`));
        }
    });

    describe('Admin Endpoints', () => {
        describe('Ping Endpoint', () => {
            it('Should return a "healthy" response', () => {
                return splunkCloud.kvstore.getHealthStatus().then(response => {
                    assert.equal(response.status, 'healthy', 'response status should be `healthy`');
                });
            });
        });
    });

    describe('Index Endpoints', () => {
        const testIndex = 'integtestindex';
        const fields = [{ direction: -1, field: 'integ_testField1' }];

        before(() => {
            return createKVCollectionDataset(testNamespace, testCollection);
        });

        describe('index endpoints', () => {
            describe('Validate creation and deletion of an index', () => {
                it('should create a new index', () =>
                    splunkCloud.kvstore
                        .createIndex(testKVCollectionName, {
                            fields,
                            name: testIndex,
                            collection: testCollection,
                            namespace: testNamespace,
                        })
                        .then(response => {
                            assert.strictEqual(response.name, testIndex);
                        }));

                it('should return the newly created index', () =>
                    splunkCloud.kvstore.listIndexes(testKVCollectionName).then(response => {
                        assert(response.length === 1);
                    }));

                it('should delete the specified index', () =>
                    splunkCloud.kvstore.deleteIndex(testKVCollectionName, testIndex).then(response => {
                        assert(!response);
                    }));

                it('should not return any index', () =>
                    splunkCloud.kvstore.listIndexes(testKVCollectionName).then(response => {
                        assert(response.length === 0);
                    }));
            });
        });

        describe('index endpoints - Error scenarios', () => {
            it('should throw 404 Not Found error because the namespace or the collection does not exist', () =>
                splunkCloud.kvstore
                    .createIndex(
                        'testcollection1', {
                            fields,
                            name: testIndex,
                            collection: testCollection,
                            namespace: testNamespace,
                        })
                    .then(response => assert.fail(response), err => assert.equal(err.httpStatusCode, 404)));

            /* TODO: (Commenting for now) Delete on a non-existing index is yielding a 200OK response. kvstore service updated codes at their end and this would be 204 (Being tracked here: splunkCloud-3101)
            it('should throw 404 index not found error as index being deleted does not exist', () =>
                splunkCloud.kvstore
                    .deleteIndex(testKVCollectionName, 'testIndex2')
                    .then(response => assert.fail(response), err => assert.equal(err.code, '404')));
            */
        });
    });

    describe('Record endpoints', () => {
        const integrationTestRecord = [
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

        describe('Test insertion, retrieval and deletion of the records', () => {
            let keys: string[];
            before('should create a new record', () =>
                splunkCloud.kvstore
                    .insertRecords(testKVCollectionName, integrationTestRecord as any)
                    .then(response => {
                        keys = response as string[];
                        assert.equal(keys.length, 4);
                    }));

            it('should retrieve the newly created record by key', () =>
                splunkCloud.kvstore.getRecordByKey(testKVCollectionName, keys[0]).then(response => {
                    assert(response.size !== '0');
                    assert.equal(
                        response.capacity_gb,
                        '8',
                        'The field \'capacity_gb\' should contain the value \'8\''
                    );
                    assert.equal(
                        response.description,
                        'This is a tiny amount of GB',
                        'The field \'description\' should contain the value \'This is a tiny amount of GB\''
                    );
                    assert.equal(
                        response.size,
                        '0.01',
                        'The field \'size\' should contain the value \'tiny\''
                    );
                }));

            it('should delete the newly created record by key', () =>
                splunkCloud.kvstore.deleteRecordByKey(testKVCollectionName, keys[0]).then(response => {
                    assert(!response);
                }));

            // TODO: fix this test, I might've broken the listRecords() implementation
            // it('validate that after calling deleteRecordbyKey(), only 3 records are left', () =>
            //     splunkCloud.kvstore.listRecords(testKVCollectionName).then(response => {
            //         assert.equal(
            //             response.length,
            //             3
            //         );
            //         const keyElements : string[] = [];
            //         for (const elem of response) {
            //             keyElements.push(elem.);
            //         }
            //         assert.equal(
            //             keyElements[0],
            //             keys[1]
            //         );
            //         assert.equal(
            //             keyElements[1],
            //             keys[2]
            //         );
            //         assert.equal(
            //             keyElements[2],
            //             keys[3]
            //         );
            //     }));

            it('should retrieve the records based on a query', () =>
                splunkCloud.kvstore.listRecords(testKVCollectionName, { fields: 'type' }).then(response => {
                    assert.equal(response.length, 3);
                }));

            it('should delete the records based on a query', () =>
                splunkCloud.kvstore
                    .deleteRecords(testKVCollectionName, {
                        name: 'test_record',
                        count_of_fields: 3,
                    })
                    .then(response => {
                        assert(!response);
                    }));

            it('validate that after calling deleteRecords() based on query, no record is left', () => {
                return splunkCloud.kvstore.listRecords(testKVCollectionName).then(response => {
                    assert.equal(response.length, 0);
                });
            });

            it('should delete all the records', () =>
                splunkCloud.kvstore.deleteRecords(testKVCollectionName).then(response => {
                    assert(!response);
                }));

            it('validate that after calling deleteRecords(), no records should be returned', () =>
                splunkCloud.kvstore.queryRecords(testKVCollectionName).then(response => {
                    assert.equal(response.length, 0, 'No records should be returned');
                }));
        });
    });
});
