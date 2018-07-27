const { assert } = require('chai');
const config = require('../config');
const SplunkSSC = require('../../splunk');

const sscHost = config.playgroundHost;
const token = config.playgroundAuthToken;
const tenantID = config.playgroundTenant;
const testNamespace = config.testNamespace;
const testCollection = config.testCollection;

const ssc = new SplunkSSC(sscHost, token, tenantID);

function createDataset(namespace, collection) {
    // Gets the datasets
    console.log('GETTING DATASETS');
    return (
        ssc.catalog
            .getDatasets()
            // Filters the data set
            .then(datasets => {
                console.log('FILTERING DATASETS');
                return datasets.filter(element => {
                    if (element['module'] == testNamespace && element['name'] == testCollection) {
                        return element;
                    }
                });
            })
            // Deletes the dataset should only be one data set
            .then(datasets => {
                console.log('DELETING DATASETS');
                console.log(datasets);
                return Promise.all(
                    datasets.map(dataset => {
                        return ssc.catalog.deleteDataset(dataset.id);
                    })
                );
            })
            // Creates the data sets
            .then(() => {
                console.log('CREATING DATASETS');
                return ssc.catalog.createDataset({
                    name: testCollection,
                    owner: 'splunk',
                    kind: 'kvcollection',
                    capabilities: '1101-00000:11010',
                    module: testNamespace,
                });
            })
            // Finally set the dataset for testing
            .then(response => {
                console.log('ASSIGNING VARIABLE');
                testDataset = response;
            })
            .catch(error => {
                console.log('An error was encountered while cleaning up datasests');
                console.log(error);
            })
    );
}

describe('Integration tests for KVStore Index Endpoints', () => {
    const testIndex = 'integtestindex';
    const fields = [{ Direction: -1, Field: 'integ_testField1' }];
    let testDataset;

    before(() => {
        return createDataset(testNamespace, testCollection);
    });

    describe('index endpoints', () => {
        describe('Validate creation and deletion of an index', () => {
            it('should create a new index', () =>
                ssc.kvstore
                    .createIndex(
                        {
                            Name: testIndex,
                            Collection: testCollection,
                            Namespace: testNamespace,
                            Fields: fields,
                        },
                        testNamespace,
                        testCollection
                    )
                    .then(response => {
                        assert(response.name === testIndex);
                    }));

            it('should return the newly created index', () =>
                ssc.kvstore.listIndexes(testNamespace, testCollection).then(response => {
                    assert(response.length === 1);
                }));

            it('should delete the specified index', () =>
                ssc.kvstore.deleteIndex(testIndex, testNamespace, testCollection).then(response => {
                    assert(!response);
                }));

            it('should not return any index', () =>
                ssc.kvstore.listIndexes(testNamespace, testCollection).then(response => {
                    assert(response.length === 0);
                }));
        });
    });

    describe('index endpoints - Error scenarios', () => {
        it('should throw 404 Not Found error because the namespace or the collection does not exist', () =>
            ssc.kvstore
                .createIndex(
                    {
                        Name: testIndex,
                        Collection: testCollection,
                        Namespace: testNamespace,
                        Fields: fields,
                    },
                    'testnamespace1',
                    'testcollection1'
                )
                .then(response => assert.fail(response), err => assert.equal(err.code, '404')));

        it('should throw 404 index not found error as index being deleted does not exist', () =>
            ssc.kvstore
                .deleteIndex('testIndex2', testNamespace, testCollection)
                .then(response => assert.fail(response), err => assert.equal(err.code, '404')));
    });

    after(() => {
        if (testDataset != null) {
            ssc.catalog
                .deleteDatasetByName(testDataset.name)
                .catch(err => console.log(`Error cleaning the test dataset: ${err}`));
        }
    });
});

module.exports = {
    createDataset: createDataset,
};
